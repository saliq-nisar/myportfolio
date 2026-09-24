"use client";

import { useState } from "react";
import { useSequence } from "../hooks";
import {
  ActionButton,
  ControlGroup,
  DemoLayout,
  Metric,
  MetricList,
  Pipeline,
  Segmented,
  Stage,
  type NodeState,
} from "../primitives";

type Mode = "static" | "dynamic" | "client";
type View = "blank" | "shell" | "content" | "interactive";

const STEPS = [
  { id: "browser", label: "Request" },
  { id: "cdn", label: "CDN" },
  { id: "server", label: "Server" },
  { id: "html", label: "HTML" },
  { id: "hydrate", label: "Hydrate" },
];

const MODES: Record<
  Mode,
  {
    label: string;
    path: { id: string; view?: View; note: string; state?: NodeState }[];
    ttfb: number;
    fcp: number;
    freshness: string;
  }
> = {
  static: {
    label: "Static",
    path: [
      { id: "browser", note: "GET /pricing" },
      { id: "cdn", note: "Cache HIT — HTML was prerendered at build time" },
      { id: "html", view: "content", note: "Full HTML arrives instantly" },
      { id: "hydrate", view: "interactive", note: "Only interactive islands hydrate" },
    ],
    ttfb: 40,
    fcp: 0.6,
    freshness: "Build time (revalidate to refresh)",
  },
  dynamic: {
    label: "Dynamic (SSR)",
    path: [
      { id: "browser", note: "GET /dashboard (per-user data)" },
      { id: "cdn", note: "Cache MISS — personalised response", state: "muted" },
      { id: "server", note: "Server Components fetch data next to the DB" },
      { id: "html", view: "content", note: "HTML streams in with real data" },
      { id: "hydrate", view: "interactive", note: "Client Components hydrate" },
    ],
    ttfb: 220,
    fcp: 1.1,
    freshness: "Every request",
  },
  client: {
    label: "Client (CSR)",
    path: [
      { id: "browser", note: "GET /app" },
      { id: "cdn", view: "shell", note: "Empty HTML shell + large JS bundle" },
      { id: "hydrate", note: "Browser downloads and runs JS…" },
      { id: "server", note: "…then fetches data from the API" },
      { id: "html", view: "interactive", note: "UI finally renders in the browser" },
    ],
    ttfb: 40,
    fcp: 2.4,
    freshness: "On client fetch",
  },
};

/* ---------- Server / Client boundary builder ---------- */

type Comp = { id: string; name: string; kb: number; needs: "server" | "client" | "either"; why: string };

const COMPONENTS: Comp[] = [
  { id: "layout", name: "Layout", kb: 18, needs: "either", why: "Static markup — fine either way, free on the server." },
  { id: "list", name: "ProductList", kb: 42, needs: "server", why: "Queries the database with a secret key — must stay on the server." },
  { id: "filters", name: "Filters", kb: 12, needs: "client", why: "Uses useState + onChange — needs the browser." },
  { id: "cart", name: "AddToCart", kb: 6, needs: "client", why: "Handles clicks — needs \"use client\"." },
];

export default function NextDemo() {
  const [mode, setMode] = useState<Mode>("static");
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [view, setView] = useState<View>("blank");
  const [log, setLog] = useState<string[]>([]);
  const { run, cancel, running } = useSequence();

  const [placement, setPlacement] = useState<Record<string, "server" | "client">>({
    layout: "server",
    list: "server",
    filters: "client",
    cart: "client",
  });

  const reset = (m: Mode) => {
    cancel();
    setStates({});
    setView("blank");
    setLog([]);
    setMode(m);
  };

  const send = () => {
    const path = MODES[mode].path;
    setStates({});
    setView("blank");
    setLog([]);
    run(
      path.map((p, i) => ({
        delay: i === 0 ? 0 : mode === "client" && i >= 2 ? 750 : 520,
        run: () => {
          setStates((s) => {
            const next: Record<string, NodeState> = {};
            for (const [k, v] of Object.entries(s)) next[k] = v === "active" ? "done" : v;
            next[p.id] = p.state ?? "active";
            return next;
          });
          if (p.view) setView(p.view);
          setLog((l) => [...l, p.note]);
        },
      }))
    );
  };

  const jsShipped = COMPONENTS.reduce((sum, c) => sum + (placement[c.id] === "client" ? c.kb : 0), 0);
  const violations = COMPONENTS.filter(
    (c) => c.needs !== "either" && placement[c.id] !== c.needs
  );
  const cfg = MODES[mode];

  return (
    <DemoLayout
      visual={
        <div className="flex flex-col gap-3">
          <Stage label="Request lifecycle">
            <Pipeline steps={STEPS} states={states} />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1.1fr]">
              {/* Mini browser preview */}
              <div className="overflow-hidden rounded-md border border-border bg-background" aria-label={`Browser shows: ${view}`}>
                <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-[9px] text-muted">localhost:3000</span>
                </div>
                <div className="flex h-28 flex-col gap-1.5 p-3">
                  {view === "blank" && <span className="m-auto font-mono text-[10px] text-muted">(blank)</span>}
                  {view === "shell" && (
                    <div className="panel-in m-auto flex items-center gap-2 font-mono text-[10px] text-muted">
                      <span className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-accent" />
                      loading bundle…
                    </div>
                  )}
                  {(view === "content" || view === "interactive") && (
                    <div className="panel-in flex flex-col gap-1.5">
                      <span className="h-2.5 w-2/3 rounded-sm bg-white/60" />
                      <span className="h-2 w-full rounded-sm bg-white/20" />
                      <span className="h-2 w-5/6 rounded-sm bg-white/20" />
                      <span
                        className={`mt-2 w-fit rounded-full px-3 py-1 font-mono text-[9px] transition-colors duration-300 ${
                          view === "interactive" ? "bg-accent text-background" : "bg-white/10 text-muted"
                        }`}
                      >
                        {view === "interactive" ? "Buy — interactive" : "Buy — not hydrated"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <ol className="flex min-h-28 flex-col gap-1 font-mono text-[10.5px] leading-snug" aria-live="polite">
                {log.length === 0 && <li className="text-muted">Pick a strategy, then send a request.</li>}
                {log.map((l, i) => (
                  <li key={i} className="panel-in text-foreground/80">
                    <span className="text-accent">{String(i + 1).padStart(2, "0")}</span> {l}
                  </li>
                ))}
              </ol>
            </div>
          </Stage>

          <Stage label="Server / Client boundary — click to move a component">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COMPONENTS.map((c) => {
                const where = placement[c.id];
                const bad = c.needs !== "either" && where !== c.needs;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setPlacement((p) => ({ ...p, [c.id]: p[c.id] === "server" ? "client" : "server" }))
                    }
                    aria-label={`${c.name}: ${where} component. Click to move.`}
                    className={`flex min-h-16 flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors duration-200 ${
                      bad
                        ? "shake-x border-danger bg-danger/10"
                        : where === "client"
                          ? "border-warn/50 bg-warn/5"
                          : "border-accent/40 bg-accent/5"
                    }`}
                  >
                    <span className="font-mono text-xs text-foreground">{`<${c.name} />`}</span>
                    <span className={`font-mono text-[10px] ${where === "client" ? "text-warn" : "text-accent"}`}>
                      {where === "client" ? `"use client" · ${c.kb} KB` : "server · 0 KB JS"}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className={`mt-3 text-xs leading-relaxed ${violations.length ? "text-danger" : "text-muted"}`} aria-live="polite">
              {violations.length
                ? violations.map((v) => v.why).join(" ")
                : "Valid tree: data fetching stays on the server, only interactive pieces ship JavaScript."}
            </p>
          </Stage>
        </div>
      }
      controls={
        <>
          <ControlGroup label="Rendering strategy">
            <Segmented
              label="Rendering strategy"
              value={mode}
              onChange={reset}
              options={(Object.keys(MODES) as Mode[]).map((m) => ({ value: m, label: MODES[m].label }))}
            />
          </ControlGroup>
          <ActionButton onClick={send} disabled={running}>
            {running ? "Rendering…" : "Send request"}
          </ActionButton>
        </>
      }
      metrics={
        <MetricList>
          <Metric label="Time to first byte" value={cfg.ttfb} max={300} unit=" ms" tone={cfg.ttfb < 100 ? "good" : "neutral"} />
          <Metric label="First contentful paint" value={cfg.fcp} max={2.5} unit=" s" tone={cfg.fcp < 1.5 ? "good" : "bad"} format={(n) => n.toFixed(1)} />
          <Metric label="Client JS shipped" value={jsShipped + (mode === "client" ? 120 : 0)} max={200} unit=" KB" tone={jsShipped + (mode === "client" ? 120 : 0) < 60 ? "good" : "bad"} />
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-xs text-muted">Data freshness</dt>
            <dd className="text-right font-mono text-[11px] text-foreground">{cfg.freshness}</dd>
          </div>
        </MetricList>
      }
    />
  );
}
