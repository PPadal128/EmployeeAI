export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-6xl mx-auto px-5 lg:px-8 pt-10 lg:pt-14 pb-8 fade-up">
      {eyebrow && (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-mint-soft text-primary text-xs font-semibold uppercase tracking-wide mb-3">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink-text">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-muted mt-2 max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
