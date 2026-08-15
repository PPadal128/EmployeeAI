import {
  Gauge,
  PieChart,
  Zap,
  History,
  Layers,
  Activity,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const FEATURES = [
  {
    icon: Gauge,
    title: "Employee Risk Prediction",
    description: "Estimate whether an employee is likely to leave.",
  },
  {
    icon: PieChart,
    title: "Probability Insights",
    description: "View leave and stay probabilities clearly.",
  },
  {
    icon: Zap,
    title: "Fast Predictions",
    description: "Receive model predictions through the FastAPI backend.",
  },
  {
    icon: History,
    title: "Prediction History",
    description: "Review previous predictions stored locally.",
  },
  {
    icon: Layers,
    title: "Model Transparency",
    description: "Understand how the prediction workflow works.",
  },
  {
    icon: Activity,
    title: "API Health Monitoring",
    description: "See whether the prediction backend is available.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center mb-14 fade-up">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-mint-soft text-primary text-xs font-semibold uppercase tracking-wide mb-4">
          Features
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-text">
          Everything you need to understand employee churn.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
