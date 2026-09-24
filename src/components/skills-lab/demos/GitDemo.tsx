"use client";

import { useState, type CSSProperties } from "react";
import { ActionButton, ControlGroup, DemoLayout, Segmented, Stage } from "../primitives";

type Branch = "main" | "feature";

interface Commit {
  id: string;
  branch: Branch;
  parents: string[];
  msg: string;
}

const MESSAGES = [
  "feat: lead filters",
  "fix: socket reconnect",
  "perf: memoize table rows",
  "refactor: api client",
  "feat: realtime badge",
  "test: cover reducers",
  "style: tidy spacing",
];

const LANE_Y: Record<Branch, number> = { main: 28, feature: 72 };
const STEP = 44;
const MAX = 14;

interface Repo {
  commits: Commit[];
  heads: Partial<Record<Branch, string>>;
  current: Branch;
  log: string[];
}

const INITIAL: Repo = {
  commits: [
    { id: "c0", branch: "main", parents: [], msg: "init" },
    { id: "c1", branch: "main", parents: ["c0"], msg: "feat: dashboard shell" },
  ],
  heads: { main: "c1" },
  current: "main",
  log: ["$ git log --oneline", "c1 feat: dashboard shell"],
};

function ancestors(commits: Commit[], index: Record<string, number>, id: string) {
  const seen = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const x = stack.pop()!;
    if (seen.has(x)) continue;
    seen.add(x);
    stack.push(...commits[index[x]].parents);
  }
  return seen;
}

const shortHash = (n: number) => ((n * 2654435761) >>> 0).toString(16).slice(0, 7);

export default function GitDemo() {
  const [repo, setRepo] = useState<Repo>(INITIAL);
  const { commits, heads, current, log } = repo;
  const index = Object.fromEntries(commits.map((c, i) => [c.id, i]));
  const full = commits.length >= MAX;

  const commit = () =>
    setRepo((r): Repo => {
      const n = r.commits.length;
      const c: Commit = {
        id: `c${n}`,
        branch: r.current,
        parents: [r.heads[r.current]!],
        msg: MESSAGES[n % MESSAGES.length],
      };
      return {
        ...r,
        commits: [...r.commits, c],
        heads: { ...r.heads, [r.current]: c.id },
        log: [...r.log, `$ git commit -m "${c.msg}"`, `[${r.current} ${shortHash(n)}] ${c.msg}`].slice(-8),
      };
    });

  const switchTo = (b: Branch) =>
    setRepo((r): Repo => {
      if (b === r.current) return r;
      const creating = !r.heads[b];
      return {
        ...r,
        current: b,
        heads: creating ? { ...r.heads, [b]: r.heads[r.current] } : r.heads,
        log: [...r.log, creating ? `$ git switch -c ${b}` : `$ git switch ${b}`, `Switched to ${creating ? "a new " : ""}branch '${b}'`].slice(-8),
      };
    });

  const merge = () =>
    setRepo((r): Repo => {
      const n = r.commits.length;
      const c: Commit = {
        id: `c${n}`,
        branch: "main",
        parents: [r.heads.main!, r.heads.feature!],
        msg: "Merge branch 'feature'",
      };
      return {
        ...r,
        current: "main",
        commits: [...r.commits, c],
        heads: { main: c.id, feature: r.heads.feature },
        log: [...r.log, "$ git switch main", "$ git merge --no-ff feature", "Merge made by the 'ort' strategy."].slice(-8),
      };
    });

  // Mergeable when feature has commits main doesn't contain yet.
  const featureAhead =
    heads.feature !== undefined && !ancestors(commits, index, heads.main!).has(heads.feature);

  // Fixed canvas so node size stays constant as history grows.
  const width = MAX * STEP + 20;

  return (
    <DemoLayout
      simulated={false}
      visual={
        <div className="flex flex-col gap-3">
          <Stage label={`Commit graph — on ${current}`}>
            <svg viewBox={`0 0 ${width} 100`} className="h-auto w-full" role="img" aria-label={`Commit graph with ${commits.length} commits`}>
              {(["main", "feature"] as Branch[]).map((b) => (
                <text key={b} x={4} y={LANE_Y[b] - 12} fontSize="9" className="font-mono" fill={b === current ? "var(--accent)" : "var(--muted)"}>
                  {heads[b] ? b : ""}
                </text>
              ))}
              {commits.flatMap((c) =>
                c.parents.map((pid) => {
                  const p = commits[index[pid]];
                  const x1 = 20 + index[pid] * STEP;
                  const x2 = 20 + index[c.id] * STEP;
                  const y1 = LANE_Y[p.branch];
                  const y2 = LANE_Y[c.branch];
                  const d = y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} C${x1 + 24} ${y1}, ${x2 - 24} ${y2}, ${x2} ${y2}`;
                  return (
                    <path
                      key={`${pid}-${c.id}`}
                      d={d}
                      fill="none"
                      stroke={c.branch === "feature" || p.branch === "feature" ? "var(--warn)" : "var(--accent)"}
                      strokeOpacity={0.7}
                      strokeWidth={1.5}
                      className="draw-in"
                      style={{ "--len": 120 } as CSSProperties}
                    />
                  );
                })
              )}
              {commits.map((c, i) => {
                const isHead = heads[current] === c.id;
                return (
                  <g key={c.id}>
                    <circle
                      cx={20 + i * STEP}
                      cy={LANE_Y[c.branch]}
                      r={c.parents.length > 1 ? 6 : 5}
                      fill={isHead ? "var(--foreground)" : "var(--surface-2)"}
                      stroke={c.branch === "feature" ? "var(--warn)" : "var(--accent)"}
                      strokeWidth={2}
                      className="panel-in"
                    >
                      <title>{c.msg}</title>
                    </circle>
                    {isHead && (
                      <text x={20 + i * STEP} y={LANE_Y[c.branch] + 20} textAnchor="middle" fontSize="8" className="font-mono" fill="var(--foreground)">
                        HEAD
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </Stage>
          <div className="rounded-lg border border-border bg-[#07080c] p-3 font-mono text-[11px] leading-5" aria-live="polite">
            {log.map((l, i) => (
              <div key={`${log.length}-${i}`} className={l.startsWith("$") ? "text-foreground" : "text-muted"}>
                {l}
              </div>
            ))}
          </div>
        </div>
      }
      controls={
        <>
          <ControlGroup label="Branch">
            <Segmented
              label="Current branch"
              value={current}
              onChange={switchTo}
              options={[
                { value: "main", label: "main" },
                { value: "feature", label: heads.feature ? "feature" : "+ feature" },
              ]}
            />
          </ControlGroup>
          <ActionButton onClick={commit} disabled={full}>git commit</ActionButton>
          <ActionButton variant="ghost" onClick={merge} disabled={full || !featureAhead}>
            Merge feature → main
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => setRepo(INITIAL)}>Reset repo</ActionButton>
          <p className="text-xs leading-relaxed text-muted">
            Branch off, commit on both lines, then merge — the history keeps both parents.
          </p>
        </>
      }
    />
  );
}
