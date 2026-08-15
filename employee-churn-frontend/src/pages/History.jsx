import { useEffect, useState } from "react";
import { Trash2, Inbox, TrendingDown, ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { getHistory, clearHistory } from "../utils/history";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function History() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  function handleClear() {
    clearHistory();
    setEntries([]);
  }

  if (entries.length === 0) {
    return (
      <div className="pb-20">
        <PageHeader
          eyebrow="History"
          title="Prediction history."
          subtitle="Recent predictions, stored locally in this browser."
        />
        <div className="max-w-3xl mx-auto px-5 lg:px-8 fade-up">
          <div className="flex flex-col items-center justify-center bg-card border border-dashed border-border rounded-2xl p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-mint-soft flex items-center justify-center mb-4">
              <Inbox size={22} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-ink-text mb-1">
              No predictions yet
            </p>
            <p className="text-sm text-muted max-w-xs">
              Predictions you run are stored locally in this browser. Head to{" "}
              <span className="font-medium text-ink-text">Predict Churn</span> to
              get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
    <PageHeader
      eyebrow="History"
      title="Prediction history."
      subtitle="Recent predictions, stored locally in this browser."
    />
    <div className="max-w-5xl mx-auto px-5 lg:px-8 fade-up">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted">
          {entries.length} prediction{entries.length !== 1 && "s"}, stored
          locally in this browser
        </p>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 text-sm text-leave font-medium hover:text-leave/80 transition-colors"
        >
          <Trash2 size={15} /> Clear history
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Result</th>
              <th className="px-5 py-3 font-medium">Leave Prob.</th>
              <th className="px-5 py-3 font-medium">Profile</th>
              <th className="px-5 py-3 font-medium text-right">When</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isLeave = entry.result.predicted_status === "LEAVE";
              return (
                <tr key={entry.id} className="border-b border-border-soft last:border-0">
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isLeave ? "bg-leave-soft text-leave" : "bg-stay-soft text-stay"
                      }`}
                    >
                      {isLeave ? <TrendingDown size={12} /> : <ShieldCheck size={12} />}
                      {entry.result.predicted_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-medium text-ink-text">
                    {entry.result.leave_probability.toFixed(2)}%
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {entry.input.Age}y · {entry.input.Education} · {entry.input.City}
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted whitespace-nowrap">
                    {formatDate(entry.timestamp)}, {formatTime(entry.timestamp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => {
          const isLeave = entry.result.predicted_status === "LEAVE";
          return (
            <div key={entry.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isLeave ? "bg-leave-soft text-leave" : "bg-stay-soft text-stay"
                  }`}
                >
                  {isLeave ? <TrendingDown size={12} /> : <ShieldCheck size={12} />}
                  {entry.result.predicted_status}
                </span>
                <span className="font-mono text-sm font-semibold text-ink-text">
                  {entry.result.leave_probability.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm text-muted">
                {entry.input.Age}y · {entry.input.Education} · {entry.input.City}
              </p>
              <p className="text-xs text-muted-soft mt-1">
                {formatDate(entry.timestamp)}, {formatTime(entry.timestamp)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
