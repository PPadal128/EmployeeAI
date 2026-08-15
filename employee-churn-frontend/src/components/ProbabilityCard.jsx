function Bar({ label, value, tone }) {
  const toneClasses = {
    leave: { bar: "bg-leave", text: "text-leave" },
    stay: { bar: "bg-stay", text: "text-stay" },
  }[tone];

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-ink-text">{label}</span>
        <span className={`font-mono text-sm font-semibold ${toneClasses.text}`}>
          {value.toFixed(2)}%
        </span>
      </div>
      <div
        className="h-2.5 rounded-full bg-surface overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} probability`}
      >
        <div
          className={`h-full rounded-full ${toneClasses.bar} grow-bar`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ProbabilityCard({ leaveProbability, stayProbability }) {
  return (
    <div className="space-y-4">
      <Bar label="Leave" value={leaveProbability} tone="leave" />
      <Bar label="Stay" value={stayProbability} tone="stay" />
    </div>
  );
}
