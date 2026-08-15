export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group bg-white border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_20px_50px_-25px_rgba(6,78,59,0.35)] hover:-translate-y-1">
      <span className="w-11 h-11 rounded-xl bg-mint-soft text-primary flex items-center justify-center mb-4 transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon size={20} strokeWidth={2} />
      </span>
      <h3 className="font-display font-semibold text-[15px] text-ink-text mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
