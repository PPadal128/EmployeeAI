import { Link } from "react-router-dom";
import { BrainCircuit, ServerCog, Activity, Gauge, ArrowUpRight } from "lucide-react";
import StatCard from "../components/StatCard";
import PageHeader from "../components/PageHeader";

export default function Dashboard({ apiStatus, health }) {
  const modelStatus = health?.model_loaded ? "Loaded" : "Unavailable";

  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Dashboard"
        title="Your employee intelligence dashboard."
        subtitle="A live view of your prediction engine, sourced directly from the FastAPI backend."
      />

      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-7 lg:p-8">
            <h2 className="font-display font-semibold text-xl text-ink-text mb-2">
              Predict who's at risk of leaving
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-lg">
              Enter an employee's profile — education, tenure, payment tier, and
              more — and the model returns a calibrated leave probability,
              straight from your trained pipeline. Nothing here is simulated;
              every prediction is a live call to your FastAPI backend.
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-dark to-primary hover:brightness-110 text-white
                text-sm font-medium px-5 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Run a Prediction <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="bg-ink text-white rounded-2xl p-7 lg:p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald/25 blur-3xl" />
            <p className="text-xs uppercase tracking-wider text-white/50 mb-3 relative">
              Decision Threshold
            </p>
            <p className="font-mono text-4xl font-semibold relative">50%</p>
            <p className="text-sm text-white/55 mt-3 relative leading-relaxed">
              Employees with a leave probability at or above this threshold are
              classified as <span className="text-leave font-medium">LEAVE</span>.
              Below it, they're classified as{" "}
              <span className="text-emerald font-medium">STAY</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
