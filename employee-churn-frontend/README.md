# EmployeeAI — Employee Churn Prediction Platform

A React + Vite + Tailwind CSS frontend for your existing FastAPI employee
churn prediction backend. The model never runs in the browser — every
prediction is a live `POST /predict` call to your Python API.

## Architecture

```
React (Vite, :5173)  --HTTP-->  FastAPI (:8080)  -->  Pydantic  -->  Pandas  -->  final_employee_churn_pipeline1.pkl
```

The frontend form fields map exactly to the `EmployeeData` Pydantic model in
your `main.py`:

| Field | Type | Constraint |
|---|---|---|
| `Age` | int | 18–65 |
| `Gender` | enum | Male / Female |
| `Education` | enum | Bachelors / Masters / PHD |
| `JoiningYear` | int | 2000–2035 |
| `PaymentTier` | int | 1–3 |
| `ExperienceInCurrentDomain` | int | 0–40 |
| `City` | enum | Bangalore / New Delhi / Pune |
| `EverBenched` | enum | Yes / No |

The `/predict` response (`leave_probability`, `stay_probability`,
`decision_threshold`, `predicted_class`, `predicted_status`) is rendered
directly, unmodified.

## 1. Start the backend

From your backend project folder (the one with `main.py`,
`final_employee_churn_pipeline1.pkl`, and `requirements.txt`):

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8080
```

Verify it's running:

```bash
curl http://127.0.0.1:8080/health
# {"status":"ok","model_loaded":true}
```

## 2. Start the frontend

From this project folder:

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. The sidebar's connection indicator calls
`GET /health` on load and every 15 seconds — it will only ever say
"Connected" if your FastAPI server actually responds.

## 3. Configuration

The backend URL lives in one place, `.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8080
```

Change the port here if you ever run FastAPI elsewhere — no component
hardcodes the URL. Restart `npm run dev` after editing `.env`.

## 4. Test the connection end-to-end

1. Go to **Predict Churn**.
2. Fill in a profile (e.g. Age 32, Bachelors, joined 2018, Payment Tier 2,
   4 years experience, Bangalore, never benched).
3. Submit — the button shows "Analyzing Employee…" while the request is in
   flight, then the result card animates in with the leave/stay
   probabilities straight from your model.
4. Check **Prediction History** — it's stored in this browser's
   `localStorage` only, and is never sent to the backend.

If the backend isn't running, the UI shows *"Unable to connect to
prediction server. Please make sure FastAPI is running."* instead of a raw
JS error. A 422 from FastAPI is parsed into field-specific messages; 500/503
show plain-language fallbacks.

## Project structure

```
src/
  components/   Navbar, Footer, ApiStatus, StatCard, PageHeader,
                Hero, TrustStrip, FeatureCard, FeaturesSection,
                DashboardPreview, HowItWorks, ModelWorkflow, FAQ,
                PredictionForm, PredictionResult, ProbabilityCard,
                LoadingSpinner
  pages/        Landing (/), Dashboard (/dashboard), Predict (/predict),
                History (/history), About (/about)
  services/     api.js — the only place fetch() is called
  utils/        validation.js (mirrors backend constraints),
                history.js (localStorage helper)
```

`/` is now a marketing landing page (hero, features, live dashboard
preview, how-it-works, model workflow, FAQ). The original dashboard moved
to `/dashboard`. Predict, History, and About keep their original routes
and behavior — only the visual layer changed.

## Production notes (not required for local dev)

To later serve both under one domain:

- Build the frontend: `npm run build` → static files in `dist/`.
- Serve `dist/` from any static host or from FastAPI itself
  (`app.mount("/", StaticFiles(directory="dist", html=True))`).
- Mount your API under `/api` (e.g. `app.include_router(..., prefix="/api")`)
  and set `VITE_API_BASE_URL=/api` at build time, or put the whole thing
  behind a reverse proxy (nginx/Caddy) that routes `/api/*` to Uvicorn and
  everything else to the static files.
