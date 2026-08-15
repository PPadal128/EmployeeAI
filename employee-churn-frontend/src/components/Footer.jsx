import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import ApiStatus from "./ApiStatus";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/predict", label: "Predict" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About Model" },
];

export default function Footer({ apiStatus }) {
  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-dark via-primary to-emerald flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.25} />
              </div>
              <span className="font-display font-bold text-[17px] tracking-tight">
                EmployeeAI
              </span>
            </Link>
            <p className="text-sm text-white/55 mt-3 leading-relaxed">
              AI-powered employee churn prediction for data-driven decisions.
            </p>
            <div className="mt-4">
              <ApiStatus status={apiStatus} dark />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-white/40 mb-3">
              Navigate
            </p>
            <ul className="space-y-2">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-white/65 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-white/40 mb-3">
              Technology
            </p>
            <ul className="space-y-2 text-sm text-white/65">
              <li>React + Vite + Tailwind CSS</li>
              <li>FastAPI + Pydantic</li>
              <li>Scikit-learn pipeline</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            EmployeeAI — predictive employee analytics.
          </p>
          <p className="text-xs text-white/40">
            Every prediction is a live call to your FastAPI backend.
          </p>
        </div>
      </div>
    </footer>
  );
}
