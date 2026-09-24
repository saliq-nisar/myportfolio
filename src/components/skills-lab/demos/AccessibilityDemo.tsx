"use client";

import { useState, type ReactNode } from "react";
import { ControlGroup, DemoLayout, Metric, MetricList, Stage, Toggle } from "../primitives";

interface Opts {
  semantic: boolean;
  labels: boolean;
  focus: boolean;
  motion: boolean;
}

type ItemId = "search" | "subscribe" | "docs";

const ITEMS: { id: ItemId; text: string; icon?: boolean; role: "button" | "link"; label: string }[] = [
  { id: "search", text: "⌕", icon: true, role: "button", label: "Search" },
  { id: "subscribe", text: "Subscribe", role: "button", label: "Subscribe to updates" },
  { id: "docs", text: "Read docs", role: "link", label: "Read the documentation" },
];

function announce(item: (typeof ITEMS)[number], o: Opts) {
  if (!o.semantic) return `"${item.icon ? "" : item.text}" — plain text, not an interactive control`;
  const name = o.labels ? item.label : item.icon ? "" : item.text;
  return name ? `"${name}", ${item.role}` : `${item.role} (unlabelled — what does it do?)`;
}

export default function AccessibilityDemo() {
  const [o, setO] = useState<Opts>({ semantic: false, labels: false, focus: false, motion: false });
  const [heard, setHeard] = useState<string>("Press Tab inside the preview, or click an item.");
  const [toast, setToast] = useState(0);
  const set = (k: keyof Opts) => (v: boolean) => setO((p) => ({ ...p, [k]: v }));

  const focusCls = o.focus
    ? "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    : "focus-visible:outline-none";

  const activate = (item: (typeof ITEMS)[number]) => {
    setHeard(announce(item, o));
    setToast((t) => t + 1);
  };

  const renderItem = (item: (typeof ITEMS)[number]): ReactNode => {
    const base = `inline-flex min-h-10 items-center justify-center rounded-md border border-border px-3 font-mono text-xs text-foreground transition-colors hover:border-white/40 ${focusCls} ${
      item.icon ? "w-10 px-0 text-base" : ""
    }`;
    const common = {
      className: base,
      onFocus: () => setHeard(announce(item, o)),
    };
    if (!o.semantic) {
      // Div soup: looks the same, works with a mouse, invisible to keyboard + AT.
      return (
        <div key={item.id} {...common} onClick={() => activate(item)} role="presentation">
          {item.text}
        </div>
      );
    }
    const aria = o.labels ? { "aria-label": item.label } : {};
    return item.role === "link" ? (
      <a key={item.id} href="#skills" {...common} {...aria} onClick={(e) => { e.preventDefault(); activate(item); }}>
        {item.text}
      </a>
    ) : (
      <button key={item.id} type="button" {...common} {...aria} onClick={() => activate(item)}>
        <span aria-hidden={item.icon && o.labels ? true : undefined}>{item.text}</span>
      </button>
    );
  };

  const score = 40 + (o.semantic ? 25 : 0) + (o.labels ? 15 : 0) + (o.focus ? 12 : 0) + (o.motion ? 8 : 0);
  const reachable = o.semantic ? 3 : 0;

  return (
    <DemoLayout
      visual={
        <div className="flex flex-col gap-3">
          <Stage label="Preview — try it with your keyboard (Tab / Enter)">
            <div className="flex flex-col gap-4 rounded-md border border-border bg-background p-4">
              <div className="flex flex-wrap items-center gap-2">{ITEMS.map(renderItem)}</div>
              <div className="relative h-10 overflow-hidden" aria-live="polite">
                {toast > 0 && (
                  <div
                    key={toast}
                    className={`absolute inset-x-0 bottom-0 rounded-md border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-[11px] text-accent ${
                      o.motion ? "a11y-fade" : "a11y-slide"
                    }`}
                  >
                    ✓ Action performed {o.motion ? "(fade only)" : "(slide + bounce)"}
                  </div>
                )}
              </div>
            </div>
          </Stage>
          <Stage label="Screen reader hears">
            <p key={heard} className="panel-in font-mono text-xs text-foreground" aria-live="off">
              🔊 {heard}
            </p>
          </Stage>
        </div>
      }
      controls={
        <ControlGroup label="Fix it">
          <Toggle label="Semantic HTML" hint="<button>/<a> instead of <div>" checked={o.semantic} onChange={set("semantic")} />
          <Toggle label="Accessible labels" hint="aria-label on icon buttons" checked={o.labels} onChange={set("labels")} />
          <Toggle label="Visible focus" hint=":focus-visible outline" checked={o.focus} onChange={set("focus")} />
          <Toggle label="Reduced motion" hint="respect user preference" checked={o.motion} onChange={set("motion")} />
        </ControlGroup>
      }
      metrics={
        <MetricList>
          <Metric label="Keyboard reachable" value={reachable} max={3} unit=" / 3" tone={reachable === 3 ? "good" : "bad"} />
          <Metric label="Accessibility score" value={score} max={100} tone={score >= 90 ? "good" : "bad"} />
        </MetricList>
      }
    />
  );
}
