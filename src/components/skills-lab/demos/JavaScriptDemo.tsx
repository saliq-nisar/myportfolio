"use client";

import { useState } from "react";
import { useSequence } from "../hooks";
import { ActionButton, CodeView, ControlGroup, DemoLayout, Stage } from "../primitives";

const CODE = [
  'console.log("A");',
  'setTimeout(() => console.log("B"), 0);',
  'Promise.resolve().then(() => console.log("C"));',
  'console.log("D");',
];

interface Frame {
  line?: number;
  stack: string[];
  micro: string[];
  macro: string[];
  out: string[];
  note: string;
}

const FRAMES: Frame[] = [
  { stack: [], micro: [], macro: [], out: [], note: "Guess the output order, then step through." },
  { line: 0, stack: ['log("A")'], micro: [], macro: [], out: ["A"], note: "Synchronous code runs immediately on the call stack." },
  { line: 1, stack: ["setTimeout(cb, 0)"], micro: [], macro: ["cb → B"], out: ["A"], note: "The timer callback is queued as a task — even with 0 ms." },
  { line: 2, stack: ["promise.then(cb)"], micro: ["cb → C"], macro: ["cb → B"], out: ["A"], note: "Promise callbacks go to the microtask queue." },
  { line: 3, stack: ['log("D")'], micro: ["cb → C"], macro: ["cb → B"], out: ["A", "D"], note: "Still synchronous — D prints before any callback." },
  { stack: [], micro: ["cb → C"], macro: ["cb → B"], out: ["A", "D"], note: "Stack empty. The event loop drains microtasks first." },
  { stack: ['log("C")'], micro: [], macro: ["cb → B"], out: ["A", "D", "C"], note: "Microtask runs: C." },
  { stack: ['log("B")'], micro: [], macro: [], out: ["A", "D", "C", "B"], note: "Only then does the next task run: B." },
  { stack: [], micro: [], macro: [], out: ["A", "D", "C", "B"], note: "Done. Output: A → D → C → B." },
];

const ANSWER = FRAMES[FRAMES.length - 1].out;

function Lane({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className="flex min-h-24 flex-col gap-1.5 rounded-md border border-border bg-background/60 p-2">
      <span className="font-mono text-[9.5px] tracking-[0.15em] text-muted uppercase">{title}</span>
      {items.length === 0 && <span className="font-mono text-[10px] text-white/20">empty</span>}
      {items.map((it) => (
        <span key={it} className={`panel-in rounded border px-2 py-1 font-mono text-[10.5px] ${tone}`}>
          {it}
        </span>
      ))}
    </div>
  );
}

export default function JavaScriptDemo() {
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState<string[]>([]);
  const { run, cancel, running } = useSequence();
  const f = FRAMES[i];
  const done = i === FRAMES.length - 1;

  const play = () => {
    const start = done ? 0 : i;
    setI(start);
    run(
      FRAMES.slice(start + 1).map((_, k) => ({
        delay: 800,
        run: () => setI(start + k + 1),
      }))
    );
  };

  const reset = () => {
    cancel();
    setI(0);
    setGuess([]);
  };

  const correct = guess.length === 4 && guess.every((g, k) => g === ANSWER[k]);

  return (
    <DemoLayout
      simulated={false}
      visual={
        <div className="flex flex-col gap-3">
          <CodeView lines={CODE} active={f.line !== undefined ? [f.line] : []} label="Event loop example" />
          <Stage>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Lane title="Call stack" items={f.stack} tone="border-accent/50 text-accent" />
              <Lane title="Microtasks" items={f.micro} tone="border-[#c49bff]/50 text-[#c49bff]" />
              <Lane title="Task queue" items={f.macro} tone="border-warn/50 text-warn" />
              <Lane title="Console" items={f.out.map((o) => `> ${o}`)} tone="border-border text-foreground" />
            </div>
            <p key={i} className="panel-in mt-3 text-xs leading-relaxed text-foreground/80" aria-live="polite">
              <span className="font-mono text-accent">{String(i).padStart(2, "0")}/{FRAMES.length - 1}</span> {f.note}
            </p>
          </Stage>
        </div>
      }
      controls={
        <>
          <ControlGroup label="Predict the output">
            <div className="flex gap-1.5">
              {["A", "B", "C", "D"].map((l) => (
                <button
                  key={l}
                  type="button"
                  disabled={guess.includes(l)}
                  onClick={() => setGuess((g) => [...g, l])}
                  className="min-h-10 flex-1 rounded-md border border-border font-mono text-sm text-foreground transition-colors hover:border-accent/60 disabled:opacity-30"
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex min-h-9 items-center justify-between gap-2 rounded-md bg-white/[0.03] px-2.5 font-mono text-xs">
              <span className="text-foreground">{guess.length ? guess.join(" → ") : <span className="text-muted">your guess…</span>}</span>
              {guess.length > 0 && (
                <button type="button" onClick={() => setGuess([])} className="text-[10px] text-muted hover:text-foreground">
                  clear
                </button>
              )}
            </div>
            {done && guess.length === 4 && (
              <p className={`panel-in font-mono text-[11px] ${correct ? "text-accent" : "text-warn"}`}>
                {correct ? "✓ Nailed it — microtasks before tasks." : `✗ Actual: ${ANSWER.join(" → ")}`}
              </p>
            )}
          </ControlGroup>
          <div className="flex flex-wrap gap-2">
            <ActionButton onClick={() => setI((n) => Math.min(n + 1, FRAMES.length - 1))} disabled={running || done} className="flex-1">
              Step
            </ActionButton>
            <ActionButton variant="ghost" onClick={play} disabled={running}>
              {done ? "Replay" : "Play"}
            </ActionButton>
            <ActionButton variant="ghost" onClick={reset}>
              Reset
            </ActionButton>
          </div>
        </>
      }
    />
  );
}
