"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { profile } from "@/data/profile";

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView();
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
      <button
        type="button"
        onClick={() => jumpTo("skills")}
        className="mt-4 font-mono text-xs tracking-wide text-muted transition-colors hover:text-accent"
      >
        ↳ Try the interactive skills lab
      </button>
    </div>
  );
}

/* ---------- 2D system map ---------- */

type NodeId = "ui" | "state" | "api" | "realtime" | "server";

const nodes: { id: NodeId; label: string; x: number; y: number }[] = [
  { id: "ui", label: "UI", x: 60, y: 150 },
  { id: "state", label: "State", x: 190, y: 70 },
  { id: "api", label: "REST API", x: 190, y: 230 },
  { id: "realtime", label: "WebSocket", x: 330, y: 70 },
  { id: "server", label: "Server", x: 330, y: 230 },
];

const edges: [NodeId, NodeId][] = [
  ["ui", "state"],
  ["ui", "api"],
  ["state", "realtime"],
  ["api", "server"],
  ["realtime", "server"],
  ["state", "api"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<
  NodeId,
  (typeof nodes)[number]
>;

function SystemMap() {
  const [focus, setFocus] = useState<NodeId | null>(null);

  return (
    <figure className="w-full">
      <svg
        viewBox="30 40 360 220"
        className="h-auto w-full"
        role="group"
        aria-label="Interactive system map: hover or focus a node to highlight its connections"
      >
        {edges.map(([a, b], i) => {
          const na = byId[a];
          const nb = byId[b];
          const active = focus === a || focus === b;
          return (
            <g key={`${a}-${b}`}>
              <line
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="rgba(255,255,255,0.14)"
                className="draw-in"
                style={{ "--len": 200, animationDelay: `${i * 80}ms` } as CSSProperties}
              />
              {active && (
                <line
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  className="dash-flow"
                />
              )}
            </g>
          );
        })}
        {nodes.map((n) => {
          const active = focus === n.id;
          const w = n.label.length * 8 + 24;
          return (
            <g
              key={n.id}
              tabIndex={0}
              role="button"
              aria-label={`${n.label} node`}
              aria-pressed={active}
              onPointerEnter={() => setFocus(n.id)}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus(n.id)}
              onBlur={() => setFocus(null)}
              onClick={() => setFocus(n.id)}
              className="cursor-pointer outline-none"
            >
              <rect
                x={n.x - w / 2}
                y={n.y - 16}
                width={w}
                height={32}
                rx={8}
                fill="var(--surface)"
                stroke={active ? "var(--accent)" : "rgba(255,255,255,0.18)"}
                style={{ transition: "stroke var(--dur-fast) var(--ease-out)" }}
              />
              <text
                x={n.x}
                y={n.y + 4}
                textAnchor="middle"
                className="font-mono"
                fontSize="11"
                fill={active ? "var(--accent)" : "var(--foreground)"}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center font-mono text-[11px] tracking-wide text-muted">
        {focus
          ? `${byId[focus].label}: ${edges.filter((e) => e.includes(focus)).length} connections`
          : "Hover or tap a node to trace the data flow"}
      </figcaption>
    </figure>
  );
}

export default function PortalHero() {
  const glowRef = useRef<HTMLDivElement>(null);

  // Cursor-follow glow: writes CSS vars directly, no React re-render.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = glowRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="home"
      aria-label="Introduction"
      onPointerMove={onPointerMove}
      className="relative overflow-hidden"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(420px circle at var(--gx, 70%) var(--gy, 40%), color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="relative mx-auto grid min-h-svh max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-24 pb-16 sm:px-12 lg:grid-cols-[1fr_1fr] lg:px-20">
        <HeroCopy />
        <div className="card mx-auto w-full max-w-md rounded-2xl p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="ml-2 font-mono text-[11px] text-muted">system.map</span>
          </div>
          <SystemMap />
        </div>
      </div>
    </section>
  );
}
