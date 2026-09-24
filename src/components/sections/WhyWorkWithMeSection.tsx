import SectionHeading from "@/components/ui/SectionHeading";
import { whyWorkWithMe } from "@/data/whyWorkWithMe";

export default function WhyWorkWithMeSection() {
  return (
    <section
      id="why"
      aria-label="Why work with me"
      className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <SectionHeading eyebrow="Why me" title="A Developer Focused on Shipping" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {whyWorkWithMe.map((item) => (
          <div key={item.title} className="card card-interactive rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
