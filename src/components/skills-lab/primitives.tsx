"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/* ---------- Layout ---------- */

/** Standard demo layout: visual on the left, controls + metrics on the right
 * (stacked on small screens). */
export function DemoLayout({
  visual,
  controls,
  metrics,
  simulated = true,
}: {
  visual: ReactNode;
  controls?: ReactNode;
  metrics?: ReactNode;
  simulated?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">{visual}</div>
        {(controls || metrics) && (
          <div className="flex min-w-0 flex-col gap-5">
            {controls && <div className="flex flex-col gap-4">{controls}</div>}
            {metrics}
          </div>
        )}
      </div>
      {simulated && (
        <p className="font-mono text-[10px] tracking-wide text-muted/80">
          * Simulated values for illustration — not real measurements.
        </p>
      )}
    </div>
  );
}

/** Inner surface used for visualizations. */
export function Stage({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`relative rounded-lg border border-border bg-surface-2 p-4 ${className}`}
    >
      {label && (
        <span className="mb-3 block font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

/* ---------- Controls ---------- */

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "min-h-10 rounded-full px-4 py-2 font-mono text-xs font-semibold transition-[opacity,background-color,border-color,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-accent text-background hover:opacity-90"
      : "border border-border text-foreground hover:border-accent/60";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-1 text-left"
    >
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-foreground/90">{label}</span>
        {hint && <span className="font-mono text-[10px] text-muted">{hint}</span>}
      </span>
      <span
        aria-hidden
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-200 ${
          checked ? "border-accent bg-accent/25" : "border-border bg-white/5"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full transition-transform duration-200 ease-[var(--ease-out)] ${
            checked ? "translate-x-4 bg-accent" : "translate-x-0 bg-white/50"
          }`}
        />
      </span>
    </button>
  );
}

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-wrap gap-1 rounded-lg border border-border bg-white/[0.02] p-1"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-h-8 flex-1 rounded-md px-2.5 py-1 font-mono text-[11px] whitespace-nowrap transition-colors duration-150 ${
              active ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center justify-between text-xs text-foreground/85">
        <span>{label}</span>
        <span className="font-mono text-[11px] text-accent">
          {value}
          {unit}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-6 w-full cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
}

/* ---------- Metrics ---------- */

/** Tweens between values by writing textContent directly — no re-renders. */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toString(),
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = from.current;
    from.current = value;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || start === value) {
      el.textContent = format(value);
      return;
    }
    const t0 = performance.now();
    const dur = 450;
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = format(start + (value - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [value, format]);

  return <span ref={ref}>{format(value)}</span>;
}

export function MetricList({ children }: { children: ReactNode }) {
  return (
    <dl className="flex flex-col gap-3 rounded-lg border border-border bg-white/[0.02] p-3">
      {children}
    </dl>
  );
}

/** A labelled value with a proportional bar. `tone` colors the bar. */
export function Metric({
  label,
  value,
  max,
  unit = "",
  tone = "neutral",
  format,
}: {
  label: string;
  value: number;
  max: number;
  unit?: string;
  tone?: "good" | "bad" | "neutral";
  format?: (n: number) => string;
}) {
  const color =
    tone === "good" ? "bg-accent" : tone === "bad" ? "bg-danger" : "bg-white/40";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="font-mono text-xs text-foreground tabular-nums">
          <AnimatedNumber value={value} format={format} />
          {unit}
        </dd>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5" aria-hidden>
        <div
          className={`h-full w-full origin-left rounded-full ${color} transition-[transform,background-color] duration-500 ease-[var(--ease-out)]`}
          style={{ transform: `scaleX(${Math.max(0.02, Math.min(1, value / max))})` }}
        />
      </div>
    </div>
  );
}

/* ---------- Diagram nodes ---------- */

export type NodeState = "idle" | "active" | "done" | "error" | "muted";

const nodeStyles: Record<NodeState, string> = {
  idle: "border-border text-foreground/80",
  active: "border-accent text-accent bg-accent/10",
  done: "border-accent/40 text-foreground",
  error: "border-danger text-danger bg-danger/10",
  muted: "border-border/60 text-muted/60",
};

/** Box used in flow diagrams. Changing `flashKey` replays a one-shot
 * highlight ring (used for "this re-rendered / received data"). */
export function FlowNode({
  label,
  sub,
  state = "idle",
  flashKey = 0,
  className = "",
  children,
}: {
  label: ReactNode;
  sub?: ReactNode;
  state?: NodeState;
  flashKey?: number;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`relative rounded-lg border px-3 py-2 transition-[border-color,background-color,color] duration-200 ${nodeStyles[state]} ${className}`}
    >
      {flashKey > 0 && (
        <span
          key={flashKey}
          aria-hidden
          className="ping-flash pointer-events-none absolute -inset-px rounded-[inherit] border border-transparent"
        />
      )}
      <div className="font-mono text-xs">{label}</div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-muted">{sub}</div>}
      {children}
    </div>
  );
}

/** Linear pipeline: vertical on phones, horizontal from `sm` up. */
export function Pipeline({
  steps,
  states,
}: {
  steps: { id: string; label: string; sub?: string }[];
  states: Record<string, NodeState>;
}) {
  return (
    <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:items-center">
      {steps.map((s, i) => {
        const state = states[s.id] ?? "idle";
        const next = steps[i + 1] && states[steps[i + 1].id];
        const lit = next && next !== "idle" && next !== "muted";
        return (
          <li key={s.id} className="flex flex-col items-stretch gap-1 sm:flex-1 sm:flex-row sm:items-center">
            <FlowNode label={s.label} sub={s.sub} state={state} className="text-center sm:flex-1" />
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={`self-center font-mono text-xs transition-colors duration-200 ${
                  lit ? "text-accent" : "text-white/20"
                }`}
              >
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Code ---------- */

const TOKEN =
  /(\/\/.*$|"[^"]*"|'[^']*'|`[^`]*`|\b(?:const|let|function|return|interface|type|export|import|from|new|await|async|if|else|extends|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;

function highlight(line: string) {
  const parts = line.split(TOKEN);
  return parts.map((part, i) => {
    if (!part) return null;
    let cls = "";
    if (part.startsWith("//")) cls = "text-muted/70 italic";
    else if (/^["'`]/.test(part)) cls = "text-[#a5e887]";
    else if (/^\d/.test(part)) cls = "text-warn";
    else if (i % 2 === 1) cls = "text-[#c49bff]";
    return (
      <span key={i} className={cls}>
        {part}
      </span>
    );
  });
}

/** Minimal code view with per-line highlight + error markers. */
export function CodeView({
  lines,
  active = [],
  errors = [],
  label,
}: {
  lines: string[];
  active?: number[];
  errors?: number[];
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label ?? "Code"}
      className="scroll-thin overflow-x-auto rounded-lg border border-border bg-[#07080c] py-3 font-mono text-[11.5px] leading-6"
    >
      <pre className="min-w-max">
        {lines.map((l, i) => {
          const isErr = errors.includes(i);
          const isActive = active.includes(i);
          return (
            <div
              key={i}
              className={`flex border-l-2 pr-4 transition-colors duration-200 ${
                isErr
                  ? "border-danger bg-danger/10"
                  : isActive
                    ? "border-accent bg-accent/10"
                    : "border-transparent"
              }`}
            >
              <span className="w-8 shrink-0 pr-3 text-right text-white/20 select-none">
                {i + 1}
              </span>
              <code className="text-foreground/90">{highlight(l) ?? " "}</code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
