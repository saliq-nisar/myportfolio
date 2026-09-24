"use client";

import { useState } from "react";
import { useSequence, type SequenceStep } from "../hooks";
import {
  ActionButton,
  ControlGroup,
  DemoLayout,
  Metric,
  MetricList,
  Pipeline,
  Stage,
  Toggle,
  type NodeState,
} from "../primitives";

const STEPS = [
  { id: "ui", label: "UI" },
  { id: "request", label: "Request" },
  { id: "loading", label: "Loading" },
  { id: "response", label: "Response" },
  { id: "data", label: "Data" },
];

const LEADS = [
  { name: "Acme Corp", stage: "Qualified" },
  { name: "Globex", stage: "Contacted" },
  { name: "Initech", stage: "New" },
];

type Status = "idle" | "loading" | "error" | "success";

export default function ApiDemo() {
  const [flaky, setFlaky] = useState(false);
  const [retry, setRetry] = useState(true);
  const [cacheOn, setCacheOn] = useState(true);
  const [cached, setCached] = useState(false);
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [log, setLog] = useState<string[]>([]);
  const [stats, setStats] = useState({ requests: 0, hits: 0, latency: 0 });
  const { run, running } = useSequence();

  const push = (l: string) => setLog((prev) => [...prev.slice(-5), l]);

  const attempt = (n: number, willFail: boolean): SequenceStep[] => [
    { delay: n === 1 ? 0 : 200 * 2 ** (n - 1), run: () => { setStates({ ui: "done", request: "active" }); setStatus("loading"); push(`→ GET /api/leads (attempt ${n})`); setStats((s) => ({ ...s, requests: s.requests + 1 })); } },
    { delay: 300, run: () => setStates({ ui: "done", request: "done", loading: "active" }) },
    {
      delay: 650,
      run: () => {
        if (willFail) {
          setStates({ ui: "done", request: "done", loading: "done", response: "error" });
          push("✗ 503 Service Unavailable");
        } else {
          setStates({ ui: "done", request: "done", loading: "done", response: "active" });
          push("← 200 OK · 3 rows");
        }
      },
    },
  ];

  const fetchLeads = () => {
    setLog([]);
    if (cacheOn && cached) {
      run([
        { delay: 0, run: () => { setStates({ ui: "active", request: "muted", loading: "muted", response: "muted", data: "active" }); setStatus("success"); push("⚡ Cache hit — no network request"); setStats((s) => ({ ...s, hits: s.hits + 1, latency: 0 })); } },
      ]);
      return;
    }
    const failures = flaky ? 2 : 0;
    const maxAttempts = retry ? 3 : 1;
    const steps: SequenceStep[] = [
      { delay: 0, run: () => { setStates({ ui: "active" }); setStatus("idle"); } },
    ];
    let n = 1;
    for (; n <= maxAttempts; n++) {
      const willFail = n <= failures;
      steps.push(...attempt(n, willFail));
      if (!willFail) break;
      if (n < maxAttempts) steps.push({ delay: 0, run: () => push(`↻ retrying in ${200 * 2 ** n} ms (exponential backoff)`) });
    }
    const ok = n <= maxAttempts;
    steps.push({
      delay: 350,
      run: () => {
        if (ok) {
          setStates({ ui: "done", request: "done", loading: "done", response: "done", data: "active" });
          setStatus("success");
          if (cacheOn) { setCached(true); push("✓ Stored in cache"); }
          setStats((s) => ({ ...s, latency: 950 + (n - 1) * 1100 }));
        } else {
          setStatus("error");
          push("Request failed — showing error state");
        }
      },
    });
    run(steps);
  };

  return (
    <DemoLayout
      visual={
        <div className="flex flex-col gap-3">
          <Stage label="Request lifecycle">
            <Pipeline steps={STEPS} states={states} />
          </Stage>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stage label="Component">
              <div className="min-h-28" aria-live="polite" aria-busy={status === "loading"}>
                {status === "idle" && <p className="font-mono text-[11px] text-muted">No data yet.</p>}
                {status === "loading" && (
                  <ul className="flex flex-col gap-2" aria-label="Loading">
                    {[0, 1, 2].map((i) => (
                      <li key={i} className="h-6 animate-pulse rounded bg-white/[0.06]" />
                    ))}
                  </ul>
                )}
                {status === "error" && (
                  <div className="panel-in flex flex-col items-start gap-2">
                    <p className="font-mono text-xs text-danger">Couldn&apos;t load leads.</p>
                    <ActionButton variant="ghost" onClick={fetchLeads} disabled={running}>
                      Retry
                    </ActionButton>
                  </div>
                )}
                {status === "success" && (
                  <ul className="panel-in flex flex-col gap-1.5">
                    {LEADS.map((l) => (
                      <li key={l.name} className="flex justify-between rounded border border-border px-2 py-1 font-mono text-[11px]">
                        <span className="text-foreground">{l.name}</span>
                        <span className="text-accent">{l.stage}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Stage>
            <Stage label="Network log">
              <ol className="flex min-h-28 flex-col gap-1 font-mono text-[10.5px] leading-snug">
                {log.length === 0 && <li className="text-muted">Idle.</li>}
                {log.map((l, i) => (
                  <li key={`${i}-${l}`} className={`panel-in ${l.startsWith("✗") ? "text-danger" : l.startsWith("⚡") || l.startsWith("✓") ? "text-accent" : "text-foreground/80"}`}>
                    {l}
                  </li>
                ))}
              </ol>
            </Stage>
          </div>
        </div>
      }
      controls={
        <>
          <ActionButton onClick={fetchLeads} disabled={running}>
            {running ? "Fetching…" : "useGetLeadsQuery()"}
          </ActionButton>
          <ControlGroup label="Conditions">
            <Toggle label="Flaky network" hint="first 2 attempts fail" checked={flaky} onChange={setFlaky} />
            <Toggle label="Auto-retry" hint="3 attempts, exponential backoff" checked={retry} onChange={setRetry} />
            <Toggle label="Cache (RTK Query)" hint="dedupe repeated requests" checked={cacheOn} onChange={(v) => { setCacheOn(v); if (!v) setCached(false); }} />
          </ControlGroup>
          <ActionButton variant="ghost" onClick={() => setCached(false)} disabled={!cached || running}>
            Invalidate cache
          </ActionButton>
        </>
      }
      metrics={
        <MetricList>
          <Metric label="Network requests" value={stats.requests} max={Math.max(10, stats.requests)} />
          <Metric label="Cache hits" value={stats.hits} max={Math.max(10, stats.hits)} tone="good" />
          <Metric label="Last latency" value={stats.latency} max={3500} unit=" ms" tone={stats.latency < 1000 ? "good" : "bad"} />
        </MetricList>
      }
    />
  );
}
