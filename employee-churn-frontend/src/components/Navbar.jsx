import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import ApiStatus from "./ApiStatus";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/predict", label: "Predict" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-dark via-primary to-emerald flex items-center justify-center ring-1 ring-primary-dark/10">
        <Sparkles className="w-4 h-4 text-white" strokeWidth={2.25} />
      </div>
      <span className="font-display font-bold text-[17px] leading-none tracking-tight text-ink-text">
        Employee<span className="text-primary">AI</span>
      </span>
    </Link>
  );
}

export default function Navbar({ apiStatus }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-mint-soft"
                      : "text-muted hover:text-ink-text hover:bg-surface"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <ApiStatus status={apiStatus} />
            <Link
              to="/predict"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-dark to-primary hover:brightness-110 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              Predict Now
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2 text-ink-text/70 hover:text-ink-text rounded-lg hover:bg-black/5"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-white px-5 py-4 space-y-1">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `block px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-mint-soft"
                    : "text-muted hover:text-ink-text hover:bg-surface"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-3 mt-2 border-t border-border-soft flex items-center justify-between">
            <ApiStatus status={apiStatus} />
          </div>
          <Link
            to="/predict"
            className="mt-2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-dark to-primary text-white text-sm font-medium px-4 py-3 rounded-lg"
          >
            Predict Now
          </Link>
        </div>
      )}
    </header>
  );
}
