"use client";

import { useRef, type KeyboardEvent } from "react";
import { demos } from "./registry";

export default function SkillsLab({
  activeId,
  onChange,
}: {
  activeId: string;
  onChange: (id: string) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(0, demos.findIndex((d) => d.id === activeId));
  const demo = demos[activeIndex];
  const Demo = demo.Component;

  const select = (i: number) => {
    const d = demos[(i + demos.length) % demos.length];
    onChange(d.id);
    tabRefs.current[demos.indexOf(d)]?.focus();
  };

  // WAI-ARIA tabs pattern: arrows move + activate, Home/End jump.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => select(activeIndex + 1),
      ArrowRight: () => select(activeIndex + 1),
      ArrowUp: () => select(activeIndex - 1),
      ArrowLeft: () => select(activeIndex - 1),
      Home: () => select(0),
      End: () => select(demos.length - 1),
    };
    const fn = keys[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div id="skills-lab" className="flex scroll-mt-8 flex-col gap-4">
      <div
        role="tablist"
        aria-label="Interactive skill demos"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-6"
      >
        {demos.map((d, i) => {
          const selected = d.id === demo.id;
          return (
            <button
              key={d.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`skill-tab-${d.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="skill-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(d.id)}
              onPointerEnter={() => void d.preload()}
              onFocus={() => void d.preload()}
              className={`group relative flex min-h-11 flex-col items-start justify-center rounded-lg border px-3 py-1.5 text-left transition-[border-color,background-color] duration-200 ${
                selected
                  ? "border-accent/50 bg-accent/[0.07]"
                  : "border-border bg-transparent hover:border-white/25 hover:bg-white/[0.02]"
              }`}
            >
              <span
                aria-hidden
                className={`absolute right-3 bottom-0 left-3 h-0.5 origin-center rounded-full bg-accent transition-transform duration-200 ${
                  selected ? "scale-x-100" : "scale-x-0"
                }`}
              />
              <span className={`font-display text-sm font-medium ${selected ? "text-accent" : "text-foreground"}`}>
                {d.label}
              </span>
              <span className="font-mono text-[10px] text-muted">{d.tagline}</span>
            </button>
          );
        })}
      </div>

      <div
        id="skill-panel"
        role="tabpanel"
        aria-labelledby={`skill-tab-${demo.id}`}
        className="card min-w-0 rounded-xl p-4 sm:p-6"
      >
        <div key={demo.id} className="panel-in">
          <div className="mb-5 flex flex-col gap-2 border-b border-border pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-foreground">{demo.label}</h3>
              <span className="rounded-full border border-accent/30 px-2 py-0.5 font-mono text-[10px] text-accent">
                live demo
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">{demo.concept}</p>
          </div>
          <Demo />
        </div>
      </div>
    </div>
  );
}
