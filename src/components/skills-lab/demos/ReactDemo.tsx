"use client";

import { useState } from "react";
import {
  ActionButton,
  CodeView,
  ControlGroup,
  DemoLayout,
  FlowNode,
  Metric,
  MetricList,
  Stage,
  Toggle,
} from "../primitives";

type Child = "A" | "B" | "C";

const CHILDREN: { id: Child; name: string; props: string }[] = [
  { id: "A", name: "<Counter />", props: "count={count}" },
  { id: "B", name: "<Sidebar />", props: "title=\"Menu\"" },
  { id: "C", name: "<Toolbar />", props: "onSave={handleSave}" },
];

/** Which children re-render when Parent's `count` changes. */
function rerendered(memo: boolean, stableCallback: boolean): Set<Child> {
  const s = new Set<Child>(["A"]); // A's props really changed
  if (!memo) {
    s.add("B");
    s.add("C");
  } else if (!stableCallback) {
    s.add("C"); // new function identity every render defeats memo
  }
  return s;
}

export default function ReactDemo() {
  const [memo, setMemo] = useState(false);
  const [stable, setStable] = useState(false);
  const [count, setCount] = useState(0);
  const [flash, setFlash] = useState<Record<string, number>>({});
  const [renders, setRenders] = useState({ last: 0, total: 0, skipped: 0 });

  const update = () => {
    const hit = rerendered(memo, stable);
    setCount((c) => c + 1);
    setFlash((f) => {
      const next: Record<string, number> = { ...f, P: (f.P ?? 0) + 1 };
      hit.forEach((id) => (next[id] = (next[id] ?? 0) + 1));
      return next;
    });
    setRenders((r) => ({
      last: hit.size + 1,
      total: r.total + hit.size + 1,
      skipped: r.skipped + (3 - hit.size),
    }));
  };

  const hit = rerendered(memo, stable);
  const code = [
    "function Parent() {",
    "  const [count, setCount] = useState(0);",
    stable
      ? "  const handleSave = useCallback(save, []);"
      : "  const handleSave = () => save();",
    "  return (<>",
    "    <Counter count={count} />",
    "    <Sidebar title=\"Menu\" />",
    "    <Toolbar onSave={handleSave} />",
    "  </>);",
    "}",
    ...(memo
      ? ["const Sidebar = memo(SidebarImpl);", "const Toolbar = memo(ToolbarImpl);"]
      : ["// Sidebar and Toolbar are not memoized"]),
  ];

  return (
    <DemoLayout
      visual={
        <div className="flex flex-col gap-3">
          <Stage label="Component tree — flashes on re-render">
            <div className="flex flex-col items-center gap-3">
              <FlowNode
                label="<Parent />"
                sub={`state: count = ${count}`}
                state="active"
                flashKey={flash.P ?? 0}
                className="min-w-40 text-center"
              />
              <svg viewBox="0 0 300 24" className="h-6 w-full max-w-sm" aria-hidden>
                {[50, 150, 250].map((x, i) => (
                  <path
                    key={x}
                    d={`M150 0 V10 H${x} V24`}
                    fill="none"
                    stroke={hit.has(CHILDREN[i].id) ? "var(--accent)" : "rgba(255,255,255,0.15)"}
                    strokeWidth="1"
                    style={{ transition: "stroke var(--dur-base)" }}
                  />
                ))}
              </svg>
              <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
                {CHILDREN.map((c) => (
                  <FlowNode
                    key={c.id}
                    label={c.name}
                    sub={c.props}
                    state={hit.has(c.id) ? "done" : "muted"}
                    flashKey={flash[c.id] ?? 0}
                    className="text-center"
                  >
                    <div className={`mt-1 font-mono text-[10px] ${hit.has(c.id) ? "text-warn" : "text-accent"}`}>
                      {hit.has(c.id) ? "re-renders" : "skipped ✓"}
                    </div>
                  </FlowNode>
                ))}
              </div>
            </div>
          </Stage>
          <CodeView
            lines={code}
            active={[2, ...(memo ? [9, 10] : [])]}
            label="Parent component source"
          />
        </div>
      }
      controls={
        <>
          <ActionButton onClick={update}>setCount(count + 1)</ActionButton>
          <ControlGroup label="Optimizations">
            <Toggle label="React.memo" hint="Sidebar, Toolbar" checked={memo} onChange={setMemo} />
            <Toggle label="useCallback" hint="stable onSave prop" checked={stable} onChange={setStable} />
          </ControlGroup>
          <p className="text-xs leading-relaxed text-muted">
            {!memo
              ? "Every child re-renders when Parent's state changes — even ones whose props didn't."
              : !stable
                ? "memo helps Sidebar, but Toolbar still re-renders: a new handleSave function is created every render."
                : "Only <Counter /> re-renders — the one component whose props actually changed."}
          </p>
        </>
      }
      metrics={
        <MetricList>
          <Metric label="Renders last update" value={renders.last} max={4} tone={renders.last > 2 ? "bad" : "good"} />
          <Metric label="Total renders" value={renders.total} max={Math.max(renders.total, 20)} />
          <Metric label="Renders skipped" value={renders.skipped} max={Math.max(renders.skipped, 10)} tone="good" />
        </MetricList>
      }
      simulated={false}
    />
  );
}
