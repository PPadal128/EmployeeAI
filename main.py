import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Literal, Optional
from pathlib import Path
import logging


# ============================================================
# STEP 1: Feature engineering class used INSIDE the saved model
# We do NOT modify this class. It must be present so joblib can
# open (unpickle) final_employee_churn_pipeline.pkl correctly.
# ============================================================
from sklearn.base import BaseEstimator, TransformerMixin


class EmployeeFeatureEngineer(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X_out = X.copy()
        current_year = 2026

        X_out["Tenure"] = current_year - X_out["JoiningYear"]
        X_out["Experience_to_Age_Ratio"] = (
            X_out["ExperienceInCurrentDomain"] / (X_out["Age"] + 1.0)
        )
        X_out["Experience_Gap"] = X_out["Age"] - X_out["ExperienceInCurrentDomain"]
        X_out["Joining_Age"] = X_out["Age"] - X_out["Tenure"]
        X_out["Experience_per_Tenure"] = (
            X_out["ExperienceInCurrentDomain"] / (X_out["Tenure"] + 1.0)
        )
        X_out["Early_Career"] = (X_out["Age"] <= 30).astype(int)

        return X_out


# ============================================================
# STEP 2: Canonical category values (the EXACT case the model
# was trained on). Used to fix user input like "bachelors" or
# "BANGALORE" back to "Bachelors" / "Bangalore" before predicting.
#
# This is required because, unlike a lowercase-trained model,
# this model's OneHotEncoder only recognizes these exact strings.
# ============================================================
CANONICAL_VALUES = {
    "Education": {"bachelors": "Bachelors", "masters": "Masters", "phd": "PHD"},
    "City": {"bangalore": "Bangalore", "new delhi": "New Delhi", "pune": "Pune"},
    "Gender": {"male": "Male", "female": "Female"},
    "EverBenched": {"yes": "Yes", "no": "No"},
}

TEXT_FIELDS = ("Education", "City", "Gender", "EverBenched")


# ============================================================
# STEP 3: Load the trained ML model
# ============================================================
# Model is loaded on startup to provide clearer errors if file is missing/corrupt
model = None


# ============================================================
# STEP 4: Create the FastAPI app
# ============================================================
app = FastAPI(title="Employee Churn Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Setup logging
logger = logging.getLogger("employee-churn-api")
logging.basicConfig(level=logging.INFO)

# Paths (resolved relative to this file) — makes app robust to working directory
BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "final_employee_churn_pipeline1.pkl"

# Optimal decision threshold, taken directly from the training notebook
OPTIMAL_THRESHOLD = 0.50

# Startup state
startup_error: Optional[str] = None


def load_model(path: Path):
    try:
        # This lets Python find EmployeeFeatureEngineer when un-pickling,
        # because the model was originally saved from a notebook (__main__).
        import __main__
        __main__.EmployeeFeatureEngineer = EmployeeFeatureEngineer

        loaded_model = joblib.load(path)

        if not hasattr(loaded_model, "predict_proba"):
            raise RuntimeError("Loaded object has no predict_proba() method.")

        return loaded_model
    except Exception as e:
        raise RuntimeError(f"Failed to load model from {path}: {e}") from e


@app.on_event("startup")
def startup_event():
    """Load the ML model on startup with clear logging/errors."""
    global model, startup_error
    try:
        logger.info("Loading model from %s", MODEL_PATH)
        model = load_model(MODEL_PATH)
        logger.info("Model loaded successfully")
    except Exception as e:
        startup_error = str(e)
        logger.exception("Error loading model: %s", e)


@app.get("/health")
def health():
    if startup_error:
        raise HTTPException(status_code=503, detail=f"Startup error: {startup_error}")
    return {"status": "ok", "model_loaded": model is not None}


# ============================================================
# STEP 5: Pydantic model for the incoming request
# ============================================================
class EmployeeData(BaseModel):
    Education: Literal["Bachelors", "Masters", "PHD"]
    JoiningYear: int = Field(..., ge=2000, le=2035)
    City: Literal["Bangalore", "New Delhi", "Pune"]
    PaymentTier: int = Field(..., ge=1, le=3)
    Age: int = Field(..., ge=18, le=65)
    Gender: Literal["Male", "Female"]
    EverBenched: Literal["Yes", "No"]
    ExperienceInCurrentDomain: int = Field(..., ge=0, le=40)

    # --- Runs FIRST, before any other check ---
    # Converts " bachelors " / "BANGALORE" / "no" -> the exact case
    # the model was trained on: "Bachelors" / "Bangalore" / "No"
    @field_validator(*TEXT_FIELDS, mode="before")
    @classmethod
    def normalize_text_fields(cls, value, info):
        if isinstance(value, str):
            cleaned = value.strip().lower()
            field_name = info.field_name
            return CANONICAL_VALUES.get(field_name, {}).get(cleaned, value.strip())
        return value

    class Config:
        json_schema_extra = {
            "example": {
                "Education": "Bachelors",
                "JoiningYear": 2018,
                "City": "Bangalore",
                "PaymentTier": 2,
                "Age": 32,
                "Gender": "Male",
                "EverBenched": "No",
                "ExperienceInCurrentDomain": 4,
            }
        }


class PredictionResponse(BaseModel):
    leave_probability: float = Field(..., ge=0, le=100)
    stay_probability: float = Field(..., ge=0, le=100)
    decision_threshold: float
    predicted_class: int
    predicted_status: Literal["STAY", "LEAVE"]


# ============================================================
# STEP 6: Routes
# ============================================================
@app.get("/")
def greet():
    return {"message": "Employee Churn Prediction API is running"}


@app.post("/predict", response_model=PredictionResponse)
def predict(data: EmployeeData):
    # Ensure app started up correctly
    if startup_error:
        raise HTTPException(status_code=503, detail=f"Service not ready: {startup_error}")
    if model is None:
        raise HTTPException(status_code=503, detail="ML model not loaded.")

    # At this point, Education/City/Gender/EverBenched are already
    # normalized to the exact case the model expects.
    input_data = pd.DataFrame([{
        "Education": data.Education,
        "JoiningYear": data.JoiningYear,
        "City": data.City,
        "PaymentTier": data.PaymentTier,
        "Age": data.Age,
        "Gender": data.Gender,
        "EverBenched": data.EverBenched,
        "ExperienceInCurrentDomain": data.ExperienceInCurrentDomain,
    }])

    try:
        probabilities = model.predict_proba(input_data)
        prob_leave = float(probabilities[0][1])
        prob_stay = 1.0 - prob_leave
        predicted_class = int(prob_leave >= OPTIMAL_THRESHOLD)
        predicted_status = "LEAVE" if predicted_class == 1 else "STAY"
    except Exception as e:
        logger.exception("Prediction failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

    return PredictionResponse(
        leave_probability=round(prob_leave * 100, 2),
        stay_probability=round(prob_stay * 100, 2),
        decision_threshold=OPTIMAL_THRESHOLD,
        predicted_class=predicted_class,
        predicted_status=predicted_status,
    )