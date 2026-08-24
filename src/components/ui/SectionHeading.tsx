export default function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
        {eyebrow}
      </span>
      <h2 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}
