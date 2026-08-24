import { experience } from "@/data/experience";
import RevealFade from "@/components/ui/RevealFade";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ExperienceSection() {
  const timeline = [...experience].reverse();

  return (
    <section
      id="experience"
      aria-label="Experience"
      className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <RevealFade>
        <SectionHeading eyebrow="Experience" title="Where I've Worked" />
      </RevealFade>

      <ol className="relative flex flex-col gap-8 border-l border-border pl-8">
        {timeline.map((item, i) => {
          const isCurrent = i === timeline.length - 1;
          return (
            <RevealFade key={item.company} delay={Math.min(i * 0.05, 0.2)}>
              <li className="relative">
                <span
                  className={`absolute -left-[calc(2rem+4.5px)] top-2 h-[9px] w-[9px] rounded-full ${
                    isCurrent ? "bg-accent" : "bg-white/25"
                  }`}
                />
                <div className="card rounded-xl p-6 sm:p-7">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {item.company}
                    </h3>
                    <span className="font-mono text-xs text-muted">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {item.role} · {item.mode}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {item.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-2.5 text-sm leading-relaxed text-foreground/75"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </RevealFade>
          );
        })}
      </ol>
    </section>
  );
}
