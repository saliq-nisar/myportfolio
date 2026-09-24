"use client";

import { useState } from "react";
import { profile, aboutStats } from "@/data/profile";

const pipeline = [
  { label: "Requirement", detail: "Understand the problem behind the feature." },
  { label: "Breakdown", detail: "Split it into components, state and edge cases." },
  { label: "Integrate", detail: "Wire REST APIs and real-time data into the UI." },
  { label: "Optimize", detail: "Measure, then trim renders, payload and load time." },
  { label: "Ship", detail: "Deliver a reliable, production-ready feature." },
];

/** Click-through delivery pipeline — replaces the old WebGL decoration. */
function DeliveryPipeline() {
  const [step, setStep] = useState(0);

  return (
    <div className="card mt-8 rounded-xl p-5">
      <p className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">
        How I ship
      </p>
      <ol className="mt-4 flex items-center" aria-label="Delivery pipeline">
        {pipeline.map((p, i) => (
          <li key={p.label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => setStep(i)}
              aria-current={step === i ? "step" : undefined}
              aria-label={p.label}
              className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-200 ${
                i <= step
                  ? "border-accent text-accent"
                  : "border-border text-muted hover:border-white/40"
              } ${step === i ? "bg-accent/10" : "bg-transparent"}`}
            >
              {i + 1}
            </button>
            {i < pipeline.length - 1 && (
              <span className="relative mx-1 h-px flex-1 bg-border" aria-hidden>
                <span
                  className="absolute inset-0 origin-left bg-accent transition-transform duration-300"
                  style={{ transform: `scaleX(${i < step ? 1 : 0})` }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
      <div key={step} className="panel-in mt-4 min-h-[3.5rem]" aria-live="polite">
        <p className="font-display text-base font-semibold text-foreground">
          {pipeline[step].label}
        </p>
        <p className="mt-1 text-sm text-muted">{pipeline[step].detail}</p>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-label="About"
      className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
            About
          </span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            {profile.aboutHeading}
          </h2>

          <DeliveryPipeline />
        </div>

        <div className="flex flex-col gap-5">
          <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
            {profile.aboutStatement}
          </p>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            {profile.aboutSupporting}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {aboutStats.map((s) => (
              <div key={s.label} className="card card-interactive rounded-lg p-4">
                <p className="font-display text-lg font-semibold text-foreground">
                  {s.value}
                </p>
                <p className="mt-1 text-xs tracking-wide text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
