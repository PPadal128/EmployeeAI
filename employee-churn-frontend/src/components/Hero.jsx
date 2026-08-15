import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingDown, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* background layers */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-mint blur-3xl opacity-60 glow-pulse pointer-events-none" />
      <div className="absolute top-10 right-0 w-[360px] h-[360px] rounded-full bg-emerald/20 blur-3xl opacity-70 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          {/* Left column */}
          <div className="fade-up">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint-soft border border-primary/15 text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles size={12} /> AI-Powered Employee Analytics
            </span>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] tracking-tight text-ink-text mt-5">
              Predict Employee Churn
              <br />
              <span className="bg-gradient-to-r from-primary-dark via-primary to-emerald bg-clip-text text-transparent">
                Before It Happens.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted mt-5 max-w-lg leading-relaxed">
              EmployeeAI uses machine learning to analyze employee profiles
              and estimate the likelihood of employee churn, helping teams
              make better retention decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                to="/predict"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-dark to-primary hover:brightness-110 text-white font-medium text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Predict Employee Churn <ArrowRight size={16} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white border border-border hover:border-primary/40 text-ink-text font-medium text-sm px-6 py-3.5 rounded-xl transition-colors"
              >
                Explore Dashboard
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10">
              <div>
                <p className="font-display font-bold text-xl text-ink-text">
                  Real-time
                </p>
                <p className="text-xs text-muted mt-0.5">Live model inference</p>
              </div>
              <div className="w-px h-9 bg-border" />
              <div>
                <p className="font-display font-bold text-xl text-ink-text">
                  FastAPI
                </p>
                <p className="text-xs text-muted mt-0.5">Python ML backend</p>
              </div>
              <div className="w-px h-9 bg-border" />
              <div>
                <p className="font-display font-bold text-xl text-ink-text">
                  Sklearn
                </p>
                <p className="text-xs text-muted mt-0.5">Trained pipeline</p>
              </div>
            </div>
          </div>

          {/* Right column - floating dashboard preview */}
          <div className="relative fade-up fade-up-delay-2">
            <div className="relative float-slow">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-emerald/10 to-transparent rounded-[32px] blur-2xl" />
              <div className="relative bg-white/90 backdrop-blur-xl border border-border rounded-3xl shadow-[0_30px_80px_-20px_rgba(6,78,59,0.25)] p-6 sm:p-7 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-dark to-emerald flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-display font-semibold text-sm text-ink-text">
                      EmployeeAI
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stay-soft text-stay text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-stay pulse-dot" />
                    Connected
                  </span>
                </div>

                <div className="rounded-2xl bg-surface border border-border-soft p-5 mb-4">
                  <p className="text-xs text-muted mb-1">Employee Profile</p>
                  <p className="text-sm font-medium text-ink-text">
                    32y · Bachelors · Bangalore
                  </p>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-ink-text flex items-center gap-1.5">
                    <TrendingDown size={14} className="text-leave" /> Leave
                    Probability
                  </span>
                  <span className="font-mono text-sm font-bold text-leave">
                    72.4%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full bg-leave grow-bar"
                    style={{ width: "72.4%" }}
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-ink-text flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-stay" /> Stay
                    Probability
                  </span>
                  <span className="font-mono text-sm font-bold text-stay">
                    27.6%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-stay grow-bar"
                    style={{ width: "27.6%" }}
                  />
                </div>

                <div className="flex items-center justify-between mt-5 pt-5 border-t border-border-soft">
                  <span className="text-xs text-muted">Predicted Status</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-leave-soft text-leave text-xs font-semibold">
                    LEAVE
                  </span>
                </div>
              </div>

              {/* floating mini card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-8 bg-white border border-border rounded-2xl shadow-lg p-4 items-center gap-3 float-slow">
                <div className="w-9 h-9 rounded-xl bg-mint-soft flex items-center justify-center">
                  <Sparkles size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted">AI Analysis</p>
                  <p className="text-sm font-semibold text-ink-text">
                    Model scored live
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
