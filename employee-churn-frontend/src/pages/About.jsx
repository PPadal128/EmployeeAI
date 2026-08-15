import { Workflow, GitBranch, Sigma, Layers } from "lucide-react";
import PageHeader from "../components/PageHeader";

const ENGINEERED_FEATURES = [
  { name: "Tenure", formula: "current year − Joining Year" },
  { name: "Experience_to_Age_Ratio", formula: "Experience ÷ (Age + 1)" },
  { name: "Experience_Gap", formula: "Age − Experience" },
  { name: "Joining_Age", formula: "Age − Tenure" },
  { name: "Experience_per_Tenure", formula: "Experience ÷ (Tenure + 1)" },
  { name: "Early_Career", formula: "1 if Age ≤ 30, else 0" },
];

const PIPELINE_STAGES = [
  { label: "React Form", detail: "Employee profile entered and validated" },
  { label: "POST /predict", detail: "JSON body sent to FastAPI" },
  { label: "Pydantic", detail: "Schema + range validation, category normalization" },
  { label: "Feature Engineering", detail: "Six derived features computed" },
  { label: "Sklearn Pipeline", detail: "Trained classifier scores the profile" },
  { label: "Threshold @ 50%", detail: "Probability converted to STAY / LEAVE" },
];

export default function About() {
  return (
    <div className="pb-20">
    <PageHeader
      eyebrow="About Model"
      title="How the prediction pipeline works."
      subtitle="A transparent look at the ML workflow behind every prediction."
    />
    <div className="max-w-4xl mx-auto px-5 lg:px-8 fade-up space-y-8">
      <section className="bg-card border border-border rounded-2xl p-7 lg:p-8">
        <h2 className="font-display font-semibold text-xl text-ink-text mb-3">
          What this model predicts
        </h2>
        <p className="text-sm text-muted leading-relaxed">
          This is a binary classification model trained on historical
          employee records. Given a profile — education, joining year, city,
          payment tier, age, gender, bench history, and domain experience —
          it estimates the probability that the employee will leave the
          company (<span className="text-leave font-medium">LEAVE</span>) versus
          stay (<span className="text-stay font-medium">STAY</span>). A
          prediction of <code className="text-xs bg-surface px-1.5 py-0.5 rounded">1</code>{" "}
          means the model classifies the employee as likely to leave;{" "}
          <code className="text-xs bg-surface px-1.5 py-0.5 rounded">0</code>{" "}
          means likely to stay.
        </p>
      </section>

      <section className="bg-card border border-border rounded-2xl p-7 lg:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Workflow size={18} className="text-primary" />
          <h2 className="font-display font-semibold text-xl text-ink-text">
            Prediction workflow
          </h2>
        </div>
        <div className="space-y-0">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="w-7 h-7 rounded-full bg-mint-soft text-primary text-xs font-mono font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {i < PIPELINE_STAGES.length - 1 && (
                  <span className="w-px flex-1 bg-border-soft my-1" />
                )}
              </div>
              <div className="pb-5">
                <p className="text-sm font-medium text-ink-text">{stage.label}</p>
                <p className="text-xs text-muted mt-0.5">{stage.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-7 lg:p-8">
        <div className="flex items-center gap-2 mb-5">
          <GitBranch size={18} className="text-primary" />
          <h2 className="font-display font-semibold text-xl text-ink-text">
            Engineered features
          </h2>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-5">
          Before scoring, the pipeline derives six additional features from
          your raw inputs — this is done automatically on the backend, not in
          the browser.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {ENGINEERED_FEATURES.map((f) => (
            <div
              key={f.name}
              className="bg-surface rounded-xl px-4 py-3 border border-border-soft"
            >
              <p className="font-mono text-xs font-semibold text-primary">{f.name}</p>
              <p className="text-xs text-muted mt-1">{f.formula}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-2xl p-7 lg:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Sigma size={18} className="text-primary" />
          <h2 className="font-display font-semibold text-xl text-ink-text">
            Probability &amp; threshold
          </h2>
        </div>
        <p className="text-sm text-muted leading-relaxed">
          The model outputs a raw leave probability between 0 and 1. That
          value is compared against a fixed decision threshold of{" "}
          <span className="font-mono text-ink-text font-medium">0.50</span>{" "}
          — at or above it, the employee is classified as{" "}
          <span className="text-leave font-medium">LEAVE</span>; below it,{" "}
          <span className="text-stay font-medium">STAY</span>. Leave and stay
          probabilities always sum to 100%.
        </p>
      </section>

      <section className="bg-ink text-white rounded-2xl p-7 lg:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Layers size={18} className="text-white/70" />
          <h2 className="font-display font-semibold text-xl">Technology stack</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div>
            <p className="text-white/45 text-xs uppercase tracking-wide mb-2">Backend</p>
            <ul className="space-y-1 text-white/80">
              <li>FastAPI + Pydantic</li>
              <li>Pandas &amp; NumPy</li>
              <li>Scikit-learn pipeline</li>
              <li>Joblib model serialization</li>
              <li>Uvicorn ASGI server</li>
            </ul>
          </div>
          <div>
            <p className="text-white/45 text-xs uppercase tracking-wide mb-2">Frontend</p>
            <ul className="space-y-1 text-white/80">
              <li>React + Vite</li>
              <li>Tailwind CSS</li>
              <li>React Router</li>
              <li>Lucide icons</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
