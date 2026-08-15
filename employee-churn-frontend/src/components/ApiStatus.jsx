export default function ApiStatus({ status, dark = false }) {
  const config = {
    connected: {
      label: "API Connected",
      dot: "bg-stay",
      text: dark ? "text-emerald" : "text-stay",
      bg: dark ? "bg-white/10" : "bg-stay-soft",
    },
    checking: {
      label: "Checking connection…",
      dot: "bg-gold",
      text: dark ? "text-gold" : "text-gold",
      bg: dark ? "bg-white/10" : "bg-gold-soft",
    },
    offline: {
      label: "API Offline",
      dot: "bg-leave",
      text: dark ? "text-red-400" : "text-leave",
      bg: dark ? "bg-white/10" : "bg-leave-soft",
    },
  }[status || "checking"];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      role="status"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === "checking" ? "pulse-dot" : ""}`} />
      {config.label}
    </div>
  );
}
