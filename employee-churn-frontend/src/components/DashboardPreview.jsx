import { ServerCog, Activity, Gauge, BrainCircuit } from "lucide-react";
import StatCard from "./StatCard";

export default function DashboardPreview({ apiStatus, health }) {
  const modelStatus = health?.model_loaded ? "Loaded" : "Unavailable";

  return (
    <section className="bg-surface border-y border-border-soft">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center mb-12 fade-up">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-mint-soft text-primary text-xs font-semibold uppercase tracking-wide mb-4">
            Dashboard
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-text">
            Your employee intelligence dashboard.
          </h2>
          <p className="text-sm text-muted mt-3 leading-relaxed">
            A live view of your prediction engine, sourced directly from the
            FastAPI backend.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Model Status"
            value={modelStatus}
            icon={ServerCog}
            accent={health?.model_loaded ? "stay" : "leave"}
            hint="Reported by /health"
          />
          <StatCard
            label="API Status"
            value={apiStatus === "connected" ? "Online" : "Offline"}
            icon={Activity}
            accent={apiStatus === "connected" ? "stay" : "leave"}
            hint="FastAPI backend"
          />
          <StatCard
            label="Decision Threshold"
            value="50%"
            icon={Gauge}
            accent="primary"
            hint="Leave / Stay cutoff"
          />
          <StatCard
            label="Prediction Engine"
            value="Sklearn Pipeline"
            icon={BrainCircuit}
            accent="gold"
            hint="Feature-engineered classifier"
          />
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 lg:p-8 text-center">
          <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Open the full dashboard to see live API and model status, or head
            straight to{" "}
            <span className="font-medium text-ink-text">Predict Churn</span>{" "}
            to score an individual employee profile.
          </p>
        </div>
      </div>
    </section>
  );
}
