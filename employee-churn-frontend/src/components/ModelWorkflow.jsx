import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const STAGES = [
  "Employee Input",
  "POST /predict",
  "Pydantic Validation",
  "Feature Engineering",
  "Scikit-learn Pipeline",
  "Probability Prediction",
  "50% Decision Threshold",
  "LEAVE / STAY",
];

export default function ModelWorkflow() {
  return (
    <section className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="fade-up">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-emerald text-xs font-semibold uppercase tracking-wide mb-4">
              Model Transparency
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight mb-4">
              A real, explainable prediction pipeline.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-md">
              Every request flows through validation, feature engineering,
              and a trained scikit-learn classifier before a threshold turns
              a probability into a decision.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald hover:text-white transition-colors"
            >
              See full model details <ArrowRight size={15} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2.5 fade-up fade-up-delay-2">
            {STAGES.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/80">
                  {stage}
                </span>
                {i < STAGES.length - 1 && (
                  <ArrowRight size={13} className="text-white/25 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
