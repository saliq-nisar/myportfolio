"use client";

import { sections } from "@/lib/sections";
import { useScrollStore } from "@/hooks/useScrollStore";

export default function NavRail() {
  // Selector subscription: re-renders only when the active section changes.
  const active = useScrollStore((s) => s.activeId);

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
  };

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex lg:right-8"
    >
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => jumpTo(s.id)}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-3 rounded"
          >
            <span
              className={`font-mono text-[11px] tracking-[0.2em] transition-colors ${
                isActive ? "text-accent" : "text-white/35 group-hover:text-white/70"
              }`}
            >
              {s.order} — {s.label.toUpperCase()}
            </span>
            <span
              className={`h-[6px] w-[6px] rounded-full transition-colors ${
                isActive ? "bg-accent" : "bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
