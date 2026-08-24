"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import RevealFade from "@/components/ui/RevealFade";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="mx-auto max-w-5xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <RevealFade>
        <SectionHeading eyebrow="Projects" title="Selected Work" />
      </RevealFade>

      <div className="flex flex-col gap-4">
        {projects.map((p, i) => {
          const featured = i === 0;
          return (
            <RevealFade key={p.title} delay={Math.min(i * 0.05, 0.2)}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`card flex flex-col gap-4 rounded-xl ${
                  featured ? "p-8 sm:p-10" : "p-6"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`mt-2 font-display font-semibold text-foreground ${
                        featured ? "text-2xl sm:text-3xl" : "text-xl"
                      }`}
                    >
                      {p.title}
                    </h3>
                  </div>
                </div>

                <p
                  className={`max-w-2xl leading-relaxed text-muted ${
                    featured ? "text-base" : "text-sm"
                  }`}
                >
                  {p.bullets.join(" · ")}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-xs text-foreground/60">
                    {p.stack}
                  </span>
                  {p.website && (
                    <a
                      href={`https://${p.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-accent transition-colors hover:text-accent/80"
                    >
                      Visit Project →
                    </a>
                  )}
                </div>
              </motion.div>
            </RevealFade>
          );
        })}
      </div>
    </section>
  );
}
