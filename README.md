# Employee Churn Prediction API

A FastAPI backend that serves a trained machine learning model to predict
whether an employee is likely to **leave** or **stay**, based on details
like their education, tenure, city, and payment tier.

The model itself was trained separately (in a notebook) and saved as a
`.pkl` file using `joblib`. This API's only job is to load that model once
at startup, validate incoming requests, run them through the same feature
engineering the model was trained on, and return a probability-based
prediction as clean JSON.

---

## Tech Stack

- **FastAPI** — the web framework, handles routing and request validation
- **Pydantic** — defines and validates the shape of incoming requests
- **Pandas / NumPy** — used to build the DataFrame the model expects
- **Scikit-learn** — the trained pipeline itself (preprocessing + classifier)
- **Joblib** — used to load the saved `.pkl` model
- **Uvicorn** — ASGI server that actually runs the app

---

## Project Structure

```
.
├── main.py                              # the entire API lives here
├── final_employee_churn_pipeline1.pkl   # trained sklearn pipeline
├── requirements.txt                     # Python dependencies
└── venv/                                # local virtual environment (not committed)
```

Everything — the model loading, validation, and the prediction logic — is
kept in a single `main.py` file since the project is small enough that
splitting it into multiple modules didn't add much value.

---

## How It Actually Works

### 1. The feature engineering class

Before the model was trained, the raw employee data was passed through a
custom transformer called `EmployeeFeatureEngineer`. This class computes
six extra features from the raw inputs:

| Feature | How it's calculated |
|---|---|
| `Tenure` | `2026 - JoiningYear` |
| `Experience_to_Age_Ratio` | `ExperienceInCurrentDomain / (Age + 1)` |
| `Experience_Gap` | `Age - ExperienceInCurrentDomain` |
| `Joining_Age` | `Age - Tenure` |
| `Experience_per_Tenure` | `ExperienceInCurrentDomain / (Tenure + 1)` |
| `Early_Career` | `1` if `Age <= 30`, else `0` |

Because the `.pkl` file was saved with this class embedded as part of the
pipeline, `main.py` has to **redefine the exact same class** before
`joblib.load()` is called — otherwise Python has no idea how to
unpickle it. This is also why the code does:

```python
import __main__
__main__.EmployeeFeatureEngineer = EmployeeFeatureEngineer
```

This is a small workaround needed because the model was originally saved
from inside a Jupyter notebook (where the class lived in `__main__`), so
when loading it from a different script, we register the class under
`__main__` again to keep joblib happy.

### 2. Cleaning up user input before prediction

The model was trained on exact string values like `"Bachelors"`,
`"Bangalore"`, `"Male"`. If someone sends `"bachelors"` or `"  BANGALORE "`,
the one-hot encoder inside the pipeline won't recognize it and the
prediction would silently break.

To avoid that, there's a `CANONICAL_VALUES` dictionary and a Pydantic
`field_validator` that runs **before** any other validation. It lowercases
and trims whatever text comes in, then maps it back to the exact casing the
model expects:

```python
"bachelors" → "Bachelors"
"new delhi" → "New Delhi"
"YES"       → "Yes"
```

So the API is a bit forgiving about casing/whitespace on text fields, but
strict about numeric ranges and about which categories are allowed at all.

### 3. Loading the model on startup

The model is **not** loaded every time someone calls `/predict` — that
would be slow and pointless. Instead, it's loaded once, when the server
starts:

```python
@app.on_event("startup")
def startup_event():
    ...
    model = load_model(MODEL_PATH)
```

If loading fails (missing file, corrupted pickle, wrong sklearn version,
etc.), the error is captured in `startup_error` instead of crashing the
whole app. That way `/health` can still respond and tell you *exactly* what
went wrong, instead of the server just refusing to boot.

### 4. Making a prediction

When a request hits `/predict`:

1. Pydantic validates and normalizes the input (`EmployeeData` model).
2. The validated fields are put into a single-row `pandas.DataFrame` — the
   exact format the sklearn pipeline expects.
3. `model.predict_proba(input_data)` returns two probabilities: probability
   of staying, and probability of leaving.
4. The leave probability is compared against a fixed threshold (currently
   `0.50`). At or above it → `LEAVE`. Below it → `STAY`.
5. Everything is packaged into a `PredictionResponse` and returned as JSON.

---

## API Endpoints

### `GET /`
Just a simple check that the API is up.
```json
{ "message": "Employee Churn Prediction API is running" }
```

### `GET /health`
Reports whether the model actually loaded successfully. Use this to check
if the API is ready to serve real predictions — not just "is the server
alive."

```json
{ "status": "ok", "model_loaded": true }
```

If the model failed to load at startup, this returns a `503` with the
actual error message instead of a fake "ok".

### `POST /predict`

**Request body:**

```json
{
  "Education": "Bachelors",
  "JoiningYear": 2018,
  "City": "Bangalore",
  "PaymentTier": 2,
  "Age": 32,
  "Gender": "Male",
  "EverBenched": "No",
  "ExperienceInCurrentDomain": 4
}
```

| Field | Type | Allowed values / range |
|---|---|---|
| `Education` | string | `Bachelors`, `Masters`, `PHD` |
| `JoiningYear` | int | 2000–2035 |
| `City` | string | `Bangalore`, `New Delhi`, `Pune` |
| `PaymentTier` | int | 1–3 |
| `Age` | int | 18–65 |
| `Gender` | string | `Male`, `Female` |
| `EverBenched` | string | `Yes`, `No` |
| `ExperienceInCurrentDomain` | int | 0–40 |

**Response:**

```json
{
  "leave_probability": 80.5,
  "stay_probability": 19.5,
  "decision_threshold": 0.5,
  "predicted_class": 1,
  "predicted_status": "LEAVE"
}
```

- `leave_probability` / `stay_probability` — percentages, always add up to 100
- `decision_threshold` — the cutoff used to turn a probability into a class (currently 0.50)
- `predicted_class` — `1` means leave, `0` means stay
- `predicted_status` — the same thing, just human-readable (`"LEAVE"` / `"STAY"`)

If you send something invalid (wrong type, out-of-range number, an
unrecognized category), FastAPI returns a `422` with details on exactly
which field failed and why — no need to guess.

---

## Running It Locally

```bash
# create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # on Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# start the server
uvicorn main:app --reload --port 8080
```

The API will be live at `http://127.0.0.1:8080`, and interactive docs
(Swagger UI) are auto-generated at `http://127.0.0.1:8080/docs` — useful
for testing `/predict` directly in the browser without writing any curl
commands.

### Quick test with curl

```bash
curl -X POST http://127.0.0.1:8080/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Education": "Bachelors",
    "JoiningYear": 2018,
    "City": "Bangalore",
    "PaymentTier": 2,
    "Age": 32,
    "Gender": "Male",
    "EverBenched": "No",
    "ExperienceInCurrentDomain": 4
  }'
```

---

## CORS

CORS is currently wide open (`allow_origins=["*"]`) so the API can be
called from any frontend during development. Before deploying this
publicly, this should be locked down to the actual frontend domain instead
of `*`.

---

## A Few Notes / Gotchas

- The `EmployeeFeatureEngineer` class **must stay identical** to how it was
  when the model was trained. If you ever retrain the model with a
  different version of this class, the old `.pkl` file won't match anymore
  and predictions will be wrong (or it may not load at all).
- The decision threshold (`0.50`) is hardcoded based on what came out of
  the training notebook. If the model gets retrained and a different
  threshold turns out to be better, update `OPTIMAL_THRESHOLD` in
  `main.py`.
- The model file path is resolved relative to `main.py` itself
  (`Path(__file__).parent`), so the app works no matter which directory you
  run `uvicorn` from.

---

## License

Add your preferred license here (MIT, Apache 2.0, etc.) before publishing
the repo publicly.
# Employee_Churn
# EmployeeAI
