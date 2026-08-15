import { BrainCircuit, Zap, Database, Workflow } from "lucide-react";

const ITEMS = [
  {
    icon: BrainCircuit,
    title: "AI-Powered",
    desc: "Machine-learning based churn prediction.",
  },
  {
    icon: Zap,
    title: "Instant Prediction",
    desc: "Get employee risk results immediately.",
  },
  {
    icon: Database,
    title: "Data-Driven",
    desc: "Use employee profile data for informed decisions.",
  },
  {
    icon: Workflow,
    title: "Simple Workflow",
    desc: "Enter → Analyze → Predict.",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-surface border-y border-border-soft">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted mb-8">
          Built for data-driven employee decisions
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`fade-up fade-up-delay-${(i % 3) + 1} bg-white border border-border rounded-2xl p-5 flex items-start gap-3.5`}
            >
              <span className="w-10 h-10 shrink-0 rounded-xl bg-mint-soft text-primary flex items-center justify-center">
                <Icon size={18} strokeWidth={2} />
              </span>
              <div>
                <p className="font-display font-semibold text-sm text-ink-text">
                  {title}
                </p>
                <p className="text-xs text-muted mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
