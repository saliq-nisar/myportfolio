"use client";

import { useState } from "react";
import { skills } from "@/data/skills";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillsLab from "@/components/skills-lab/SkillsLab";
import { demoForSkill, demos } from "@/components/skills-lab/registry";

export default function SkillsSection() {
  const [activeId, setActiveId] = useState(demos[0].id);

  const openDemo = (id: string) => {
    setActiveId(id);
    document.getElementById("skills-lab")?.scrollIntoView({ block: "start" });
  };

  return (
    <section
      id="skills"
      aria-label="Skills"
      className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <SectionHeading eyebrow="Skills" title="Technology I Work With" />
      <p className="-mt-6 mb-10 max-w-2xl text-base leading-relaxed text-muted">
        Not a list of logos — a set of small engineering experiments. Pick a
        skill and poke at it: each demo shows what the concept actually does.
      </p>

      <SkillsLab activeId={activeId} onChange={setActiveId} />

      <div className="mt-16">
        <h3 className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
          Full toolkit
        </h3>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group) => (
            <div key={group.category} className="card rounded-xl p-5">
              <h4 className="font-display text-base font-semibold text-foreground">
                {group.category}
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const demoId = demoForSkill[item];
                  return demoId ? (
                    <button
                      key={item}
                      type="button"
                      onClick={() => openDemo(demoId)}
                      title="Open live demo"
                      className="group inline-flex items-center gap-1.5 rounded-md border border-accent/25 bg-accent/[0.04] px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-accent/60"
                    >
                      {item}
                      <span
                        aria-hidden
                        className="font-mono text-[10px] text-accent transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        ▸
                      </span>
                    </button>
                  ) : (
                    <span
                      key={item}
                      className="rounded-md border border-border bg-white/[0.03] px-3 py-1.5 text-sm text-foreground/85"
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-muted">
          <span className="text-accent">▸</span> has a live demo above
        </p>
      </div>
    </section>
  );
}
