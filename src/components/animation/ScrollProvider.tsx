"use client";

import { useEffect } from "react";
import { sections } from "@/lib/sections";
import { useScrollStore } from "@/hooks/useScrollStore";

/** Tracks native scroll position for navigation UI (progress bar + active
 * nav item). It never moves or animates page content. */
export default function ScrollProvider() {
  useEffect(() => {
    const setScroll = useScrollStore.getState().setScroll;
    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // Active section = last one whose top has passed 40% of the viewport.
      const line = window.innerHeight * 0.4;
      let activeId = sections[0].id;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) activeId = s.id;
      }
      if (progress > 0.995) activeId = sections[sections.length - 1].id;

      setScroll(progress, activeId);
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
