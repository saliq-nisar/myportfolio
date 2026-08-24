"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useWebglSupport } from "@/hooks/useWebglSupport";
import { remap } from "@/lib/easing";
import { getSpacerProgress } from "@/lib/scrollProgress";
import { profile } from "@/data/profile";

const SceneCanvas = dynamic(() => import("@/experience/SceneCanvas"), {
  ssr: false,
});

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function HeroCopy() {
  return (
    <div className="flex flex-col items-start gap-4">
      <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
        {profile.title}
      </span>
      <h1 className="font-display text-5xl font-semibold text-foreground sm:text-6xl">
        {profile.name}
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted">
        {profile.heroDescription}
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => jumpTo("projects")}
          className="rounded-full bg-accent px-6 py-2.5 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          View My Work
        </button>
        <button
          type="button"
          onClick={() => jumpTo("contact")}
          className="rounded-full border border-border px-6 py-2.5 font-mono text-sm font-medium text-foreground transition-colors hover:border-accent/60"
        >
          Get In Touch
        </button>
      </div>
    </div>
  );
}

export default function PortalHero() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const webglSupported = useWebglSupport();

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const t = getSpacerProgress(spacerRef.current);
      if (flashRef.current) {
        flashRef.current.style.opacity = String(remap(t, 0.88, 1));
      }
      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - remap(t, 0, 0.08));
      }
      if (copyRef.current) {
        const fade = 1 - remap(t, 0, 0.07);
        copyRef.current.style.opacity = String(fade);
        copyRef.current.style.visibility = fade > 0.02 ? "visible" : "hidden";
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="home" aria-label="Introduction" className="relative">
      <div ref={spacerRef} className="relative h-[320vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          {webglSupported === false ? (
            <StaticFallback />
          ) : (
            <SceneCanvas spacerRef={spacerRef} />
          )}

          <div
            ref={copyRef}
            className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-full items-start justify-center px-6 pt-14 sm:justify-start sm:px-12 sm:pt-0 sm:items-center lg:px-20"
          >
            <div className="pointer-events-auto max-w-sm text-center sm:max-w-md sm:text-left">
              <HeroCopy />
            </div>
          </div>

          <div
            ref={flashRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-cyan-200 via-white to-white"
            style={{ opacity: 0 }}
          />

          <div
            ref={cueRef}
            className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-2 text-center"
          >
            <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
              Scroll to enter
            </span>
            <motion.span
              aria-hidden
              className="h-8 w-px bg-gradient-to-b from-accent to-transparent"
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StaticFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <HeroCopy />
    </div>
  );
}
