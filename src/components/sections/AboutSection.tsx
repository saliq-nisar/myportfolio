"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { profile, aboutStats } from "@/data/profile";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useWebglSupport } from "@/hooks/useWebglSupport";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const DeveloperEngineCanvas = dynamic(
  () => import("@/experience/DeveloperEngineCanvas"),
  { ssr: false }
);

export default function AboutSection() {
  const [visualRef, visualInView] = useInViewOnce<HTMLDivElement>();
  const webglSupported = useWebglSupport();
  const reducedMotion = useReducedMotion();
  const showEngine = visualInView && webglSupported !== false && !reducedMotion;

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

          <div
            ref={visualRef}
            aria-hidden
            className="mt-8 hidden h-56 overflow-hidden rounded-xl border border-border bg-surface sm:block"
          >
            {showEngine && <DeveloperEngineCanvas />}
          </div>
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
              <motion.div
                key={s.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="card rounded-lg p-4"
              >
                <p className="font-display text-lg font-semibold text-foreground">
                  {s.value}
                </p>
                <p className="mt-1 text-xs tracking-wide text-muted">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
