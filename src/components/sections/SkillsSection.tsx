"use client";

import { motion } from "framer-motion";
import { skills } from "@/data/skills";
import RevealFade from "@/components/ui/RevealFade";
import SectionHeading from "@/components/ui/SectionHeading";

export default function SkillsSection() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <RevealFade>
        <SectionHeading eyebrow="Skills" title="Technology I Work With" />
      </RevealFade>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {skills.map((group) => (
          <motion.div
            key={group.category}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="card rounded-xl p-6"
          >
            <h3 className="font-display text-base font-semibold text-foreground">
              {group.category}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-border bg-white/[0.03] px-3 py-1.5 text-sm text-foreground/85"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
