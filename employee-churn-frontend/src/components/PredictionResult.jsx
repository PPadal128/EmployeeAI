import { TrendingDown, ShieldCheck, Gauge } from "lucide-react";
import ProbabilityCard from "./ProbabilityCard";

function PulseGauge({ percentage, isLeave }) {
  const radius = 74;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  const tone = isLeave ? "var(--color-leave)" : "var(--color-stay)";

  return (
    <div className="relative w-[190px] h-[190px] mx-auto">
      <svg viewBox="0 0 190 190" className="w-full h-full -rotate-90">
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke="var(--color-surface)"
          strokeWidth="14"
        />
        <circle
          cx="95"
          cy="95"
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          className="pulse-arc"
          style={{ "--arc-len": circumference, "--arc-offset": offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold text-ink-text tracking-tight">
          {percentage.toFixed(1)}%
        </span>
        <span className="text-xs text-muted mt-1">
          {isLeave ? "leave probability" : "leave probability"}
        </span>
      </div>
    </div>
  );
}

export default function PredictionResult({ result }) {
  const {
    leave_probability,
    stay_probability,
    decision_threshold,
    predicted_class,
    predicted_status,
  } = result;

  const isLeave = predicted_status === "LEAVE";

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 fade-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg text-ink-text">
          Prediction Result
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isLeave ? "bg-leave-soft text-leave" : "bg-stay-soft text-stay"
          }`}
        >
          {isLeave ? <TrendingDown size={13} /> : <ShieldCheck size={13} />}
          {predicted_status}
        </span>
      </div>

      <PulseGauge percentage={leave_probability} isLeave={isLeave} />

      <p className="text-center text-sm text-muted mt-4 mb-8">
        Model predicts this employee is{" "}
        <span className={`font-semibold ${isLeave ? "text-leave" : "text-stay"}`}>
          {isLeave ? "likely to leave" : "likely to stay"}
        </span>
        , based on the inputs provided.
      </p>

      <div className="border-t border-border-soft pt-6">
        <ProbabilityCard
          leaveProbability={leave_probability}
          stayProbability={stay_probability}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-border-soft">
        <div>
          <p className="text-xs text-muted flex items-center gap-1 mb-1">
            <Gauge size={12} /> Threshold
          </p>
          <p className="font-mono text-sm font-semibold text-ink-text">
            {(decision_threshold * 100).toFixed(0)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Predicted Class</p>
          <p className="font-mono text-sm font-semibold text-ink-text">
            {predicted_class}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Predicted Status</p>
          <p
            className={`font-mono text-sm font-semibold ${
              isLeave ? "text-leave" : "text-stay"
            }`}
          >
            {predicted_status}
          </p>
        </div>
      </div>
    </div>
  );
}
