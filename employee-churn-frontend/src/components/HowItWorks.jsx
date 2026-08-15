import { ClipboardEdit, BrainCircuit, Target } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: ClipboardEdit,
    title: "Enter Employee Data",
    desc: "Provide employee information through the prediction form.",
  },
  {
    n: "02",
    icon: BrainCircuit,
    title: "AI Analyzes the Profile",
    desc: "The data is sent to the FastAPI prediction backend and processed through the trained ML pipeline.",
  },
  {
    n: "03",
    icon: Target,
    title: "Get Churn Prediction",
    desc: "Receive leave/stay prediction with probability scores.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
      <div className="max-w-2xl mx-auto text-center mb-14 fade-up">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-mint-soft text-primary text-xs font-semibold uppercase tracking-wide mb-4">
          How It Works
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-text">
          From employee data to prediction in three steps.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-4 relative">
        <div className="hidden md:block absolute top-11 left-[16.5%] right-[16.5%] h-px bg-border-soft" />
        {STEPS.map(({ n, icon: Icon, title, desc }) => (
          <div key={n} className="relative bg-white md:bg-transparent">
            <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
              <div className="relative z-10 w-[72px] h-[72px] shrink-0 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center md:mb-5">
                <Icon size={26} className="text-primary" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-mono text-xs text-primary font-semibold mb-1">
                  {n}
                </p>
                <h3 className="font-display font-semibold text-base text-ink-text mb-1">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs">
                  {desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
