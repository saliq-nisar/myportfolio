"use client";

import { useState } from "react";
import { useSequence, type SequenceStep } from "../hooks";
import {
  ActionButton,
  CodeView,
  ControlGroup,
  DemoLayout,
  FlowNode,
  Pipeline,
  Stage,
  type NodeState,
} from "../primitives";

interface Store {
  cart: { count: number };
  ui: { theme: "dark" | "light" };
  products: { status: "idle" | "loading" | "ready"; items: number };
}

type Slice = keyof Store;

interface Action {
  type: string;
  payload?: string;
  slice: Slice;
  reduce: (s: Store) => Store;
}

const INITIAL: Store = {
  cart: { count: 0 },
  ui: { theme: "dark" },
  products: { status: "idle", items: 0 },
};

const STEPS = [
  { id: "action", label: "Action" },
  { id: "reducer", label: "Reducer" },
  { id: "store", label: "Store" },
  { id: "selector", label: "useSelector" },
  { id: "ui", label: "UI" },
];

const SUBSCRIBERS: { id: Slice; name: string; view: (s: Store) => string }[] = [
  { id: "cart", name: "<CartBadge />", view: (s) => `🛒 ${s.cart.count}` },
  { id: "ui", name: "<ThemeSwitch />", view: (s) => (s.ui.theme === "dark" ? "☾ dark" : "☀ light") },
  { id: "products", name: "<ProductGrid />", view: (s) => (s.products.status === "loading" ? "loading…" : `${s.products.items} items`) },
];

const addToCart: Action = {
  type: "cart/itemAdded",
  payload: "{ id: 42 }",
  slice: "cart",
  reduce: (s) => ({ ...s, cart: { count: s.cart.count + 1 } }),
};
const toggleTheme: Action = {
  type: "ui/themeToggled",
  slice: "ui",
  reduce: (s) => ({ ...s, ui: { theme: s.ui.theme === "dark" ? "light" : "dark" } }),
};
const fetchPending: Action = {
  type: "products/fetch/pending",
  slice: "products",
  reduce: (s) => ({ ...s, products: { ...s.products, status: "loading" } }),
};
const fetchFulfilled: Action = {
  type: "products/fetch/fulfilled",
  payload: "[…12 items]",
  slice: "products",
  reduce: (s) => ({ ...s, products: { status: "ready", items: 12 } }),
};

function storeLines(s: Store) {
  return [
    "{",
    `  cart: { count: ${s.cart.count} },`,
    `  ui: { theme: "${s.ui.theme}" },`,
    `  products: { status: "${s.products.status}", items: ${s.products.items} },`,
    "}",
  ];
}
const SLICE_LINE: Record<Slice, number> = { cart: 1, ui: 2, products: 3 };

export default function StateDemo() {
  const [log, setLog] = useState<{ history: { type: string; state: Store }[]; cursor: number }>({
    history: [{ type: "@@INIT", state: INITIAL }],
    cursor: 0,
  });
  const { history, cursor } = log;
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [changed, setChanged] = useState<Slice | null>(null);
  const [flash, setFlash] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState<string>("—");
  const { run, running } = useSequence();

  const store = history[cursor].state;

  const flow = (a: Action, base: number): SequenceStep[] => [
    { delay: base, run: () => { setStates({ action: "active" }); setCurrent(`{ type: "${a.type}"${a.payload ? `, payload: ${a.payload}` : ""} }`); } },
    { delay: 380, run: () => setStates({ action: "done", reducer: "active" }) },
    {
      delay: 380,
      run: () => {
        setStates({ action: "done", reducer: "done", store: "active" });
        setChanged(a.slice);
        // Dispatching after time-travel discards the "future", like undo.
        setLog((l) => {
          const next = [...l.history.slice(0, l.cursor + 1), { type: a.type, state: a.reduce(l.history[l.cursor].state) }];
          return { history: next, cursor: next.length - 1 };
        });
      },
    },
    { delay: 380, run: () => setStates({ action: "done", reducer: "done", store: "done", selector: "active" }) },
    {
      delay: 320,
      run: () => {
        setStates({ action: "done", reducer: "done", store: "done", selector: "done", ui: "active" });
        setFlash((f) => ({ ...f, [a.slice]: (f[a.slice] ?? 0) + 1 }));
      },
    },
  ];

  const dispatch = (a: Action) => run(flow(a, 0));
  const dispatchThunk = () => run([...flow(fetchPending, 0), ...flow(fetchFulfilled, 900)]);

  return (
    <DemoLayout
      simulated={false}
      visual={
        <div className="flex flex-col gap-3">
          <Stage label="One-way data flow">
            <Pipeline steps={STEPS} states={states} />
            <p className="mt-3 truncate font-mono text-[11px] text-muted" aria-live="polite">
              dispatch(<span className="text-accent">{current}</span>)
            </p>
          </Stage>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.3fr_1fr]">
            <CodeView lines={storeLines(store)} active={changed ? [SLICE_LINE[changed]] : []} label="Store state" />
            <Stage label="Subscribed components">
              <div className="flex flex-col gap-2">
                {SUBSCRIBERS.map((c) => (
                  <FlowNode
                    key={c.id}
                    label={c.name}
                    sub={`selects state.${c.id}`}
                    flashKey={flash[c.id] ?? 0}
                    state={changed === c.id ? "done" : "idle"}
                  >
                    <span className="absolute top-2 right-3 font-mono text-[11px] text-foreground">{c.view(store)}</span>
                  </FlowNode>
                ))}
              </div>
            </Stage>
          </div>
        </div>
      }
      controls={
        <>
          <ControlGroup label="Dispatch">
            <ActionButton onClick={() => dispatch(addToCart)} disabled={running}>Add to cart</ActionButton>
            <ActionButton variant="ghost" onClick={() => dispatch(toggleTheme)} disabled={running}>Toggle theme</ActionButton>
            <ActionButton variant="ghost" onClick={dispatchThunk} disabled={running}>Fetch products (thunk)</ActionButton>
          </ControlGroup>
          <ControlGroup label="Action log — click to time-travel">
            <ol className="scroll-thin flex max-h-40 flex-col gap-1 overflow-y-auto">
              {history.map((h, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => { setLog((l) => ({ ...l, cursor: i })); setChanged(null); }}
                    aria-current={i === cursor ? "true" : undefined}
                    disabled={running}
                    className={`w-full truncate rounded px-2 py-1 text-left font-mono text-[10.5px] transition-colors ${
                      i === cursor ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {i}. {h.type}
                  </button>
                </li>
              ))}
            </ol>
          </ControlGroup>
        </>
      }
    />
  );
}
