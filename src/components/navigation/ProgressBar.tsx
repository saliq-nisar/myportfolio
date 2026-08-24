"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/hooks/useScrollStore";

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${state.progress})`;
      }
    });
    return unsub;
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 z-40 h-[2px] w-full bg-white/5"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
