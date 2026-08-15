export default function StatCard({ label, value, icon: Icon, accent = "primary", hint }) {
  const accentClasses = {
    primary: "bg-mint-soft text-primary",
    cobalt: "bg-mint-soft text-primary",
    gold: "bg-gold-soft text-gold",
    stay: "bg-stay-soft text-stay",
    leave: "bg-leave-soft text-leave",
  }[accent];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-[0_8px_30px_-12px_rgba(16,19,28,0.12)] transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClasses}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="font-mono text-2xl font-semibold text-ink-text tracking-tight">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
      {hint && <p className="text-xs text-muted-soft mt-2">{hint}</p>}
    </div>
  );
}
