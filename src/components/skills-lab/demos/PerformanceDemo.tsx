"use client";

import { useState } from "react";
import {
  ActionButton,
  ControlGroup,
  DemoLayout,
  Metric,
  MetricList,
  Stage,
  Toggle,
} from "../primitives";

type OptKey = "split" | "lazy" | "images" | "memo" | "debounce" | "cache";

const OPTS: { key: OptKey; label: string; hint: string }[] = [
  { key: "split", label: "Code splitting", hint: "dynamic import() per route" },
  { key: "lazy", label: "Lazy loading", hint: "defer below-the-fold work" },
  { key: "images", label: "Image optimization", hint: "AVIF + responsive sizes" },
  { key: "memo", label: "Memoization", hint: "skip unchanged subtrees" },
  { key: "debounce", label: "Debounced search", hint: "1 request, not 12" },
  { key: "cache", label: "Response caching", hint: "reuse fetched data" },
];

type Opts = Record<OptKey, boolean>;
const NONE: Opts = { split: false, lazy: false, images: false, memo: false, debounce: false, cache: false };
const ALL: Opts = { split: true, lazy: true, images: true, memo: true, debounce: true, cache: true };

/** Network waterfall rows: [start, duration] in simulated ms. */
function waterfall(o: Opts) {
  return [
    { name: "main.js", start: 0, dur: o.split ? 120 : 420, kind: "js" },
    { name: "vendor.js", start: 0, dur: o.split ? 90 : 300, kind: "js" },
    { name: "dashboard.js", start: o.split ? 140 : 420, dur: o.split ? 80 : 0, kind: "js", deferred: o.split },
    { name: "hero.jpg", start: 60, dur: o.images ? 110 : 520, kind: "img" },
    { name: "gallery ×8", start: o.lazy ? 700 : 80, dur: o.lazy ? 160 : 640, kind: "img", deferred: o.lazy },
    { name: "GET /api/leads", start: o.cache ? 40 : 200, dur: o.cache ? 12 : 260, kind: "api" },
    { name: "search ×" + (o.debounce ? 1 : 12), start: 300, dur: o.debounce ? 60 : 380, kind: "api" },
  ].filter((r) => r.dur > 0);
}

const SCALE = 1000; // ms represented by full width

export default function PerformanceDemo() {
  const [opts, setOpts] = useState<Opts>(NONE);
  const on = Object.values(opts).filter(Boolean).length;

  const payload = 420 - (opts.split ? 200 : 0) - (opts.lazy ? 80 : 0);
  const imageKb = opts.images ? 180 : 1240;
  const rerenders = 24 - (opts.memo ? 16 : 0) - (opts.debounce ? 2 : 0);
  const renderWork = 100 - (opts.memo ? 45 : 0) - (opts.lazy ? 20 : 0) - (opts.debounce ? 10 : 0);
  const lcp = 4.2 - (opts.images ? 1.6 : 0) - (opts.split ? 0.8 : 0) - (opts.lazy ? 0.4 : 0) - (opts.cache ? 0.2 : 0);

  const rows = waterfall(opts);

  return (
    <DemoLayout
      visual={
        <div className="flex flex-col gap-3">
          <Stage label={on === 0 ? "Before — unoptimized" : on === OPTS.length ? "After — optimized" : `Optimizing… ${on}/${OPTS.length}`}>
            <ul className="flex flex-col gap-1.5" aria-label="Simulated network waterfall">
              {rows.map((r) => (
                <li key={r.name.split(" ")[0]} className="grid grid-cols-[88px_1fr] items-center gap-2 sm:grid-cols-[112px_1fr]">
                  <span className="truncate font-mono text-[10.5px] text-muted">{r.name}</span>
                  <span className="relative h-3 rounded-sm bg-white/[0.03]">
                    <span
                      className={`absolute inset-y-0 left-0 w-full origin-left rounded-sm transition-transform duration-500 ease-[var(--ease-out)] ${
                        r.kind === "js" ? "bg-[#c49bff]/70" : r.kind === "img" ? "bg-warn/70" : "bg-accent/70"
                      } ${r.deferred ? "opacity-40" : ""}`}
                      style={{
                        transform: `translateX(${(r.start / SCALE) * 100}%) scaleX(${Math.min(1 - r.start / SCALE, r.dur / SCALE)})`,
                      }}
                    />
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-muted">
              <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-[#c49bff]/70" />JS</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-warn/70" />Images</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-accent/70" />Data</span>
              <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-white/30" />Faded = deferred</span>
            </div>
          </Stage>
          <Stage label="Largest Contentful Paint">
            <div className="flex items-end gap-3">
              <span className={`font-display text-3xl font-semibold tabular-nums transition-colors ${lcp <= 2.5 ? "text-accent" : lcp <= 3.5 ? "text-warn" : "text-danger"}`}>
                {lcp.toFixed(1)}s
              </span>
              <span className="pb-1 font-mono text-[11px] text-muted">
                {lcp <= 2.5 ? "Good" : lcp <= 3.5 ? "Needs improvement" : "Poor"} · target ≤ 2.5s
              </span>
            </div>
          </Stage>
        </div>
      }
      controls={
        <>
          <div className="flex gap-2">
            <ActionButton onClick={() => setOpts(ALL)} disabled={on === OPTS.length} className="flex-1">
              Optimize
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => setOpts(NONE)} disabled={on === 0}>
              Reset
            </ActionButton>
          </div>
          <ControlGroup label="Techniques">
            <div className="flex flex-col">
              {OPTS.map((o) => (
                <Toggle
                  key={o.key}
                  label={o.label}
                  hint={o.hint}
                  checked={opts[o.key]}
                  onChange={(v) => setOpts((p) => ({ ...p, [o.key]: v }))}
                />
              ))}
            </div>
          </ControlGroup>
        </>
      }
      metrics={
        <MetricList>
          <Metric label="JS payload" value={payload} max={420} unit=" KB" tone={payload < 250 ? "good" : "bad"} />
          <Metric label="Image weight" value={imageKb} max={1240} unit=" KB" tone={imageKb < 500 ? "good" : "bad"} />
          <Metric label="Re-renders / action" value={rerenders} max={24} tone={rerenders < 10 ? "good" : "bad"} />
          <Metric label="Render work" value={renderWork} max={100} unit="%" tone={renderWork < 50 ? "good" : "bad"} />
        </MetricList>
      }
    />
  );
}
