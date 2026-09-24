"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export interface DemoDef {
  id: string;
  label: string;
  tagline: string;
  concept: string;
  /** Items from src/data/skills.ts this demo represents. */
  skills: string[];
  Component: ComponentType;
  /** Warms the chunk on hover/focus so switching tabs feels instant. */
  preload: () => Promise<unknown>;
}

function DemoSkeleton() {
  return (
    <div className="grid min-h-[420px] grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_240px]" aria-busy="true">
      <div className="animate-pulse rounded-lg bg-white/[0.03]" />
      <div className="hidden animate-pulse rounded-lg bg-white/[0.03] lg:block" />
    </div>
  );
}

// Each demo is its own chunk: only the selected one is downloaded and mounted.
// (next/dynamic needs inline literals, so paths repeat below.)
const loaders = {
  react: () => import("./demos/ReactDemo"),
  next: () => import("./demos/NextDemo"),
  typescript: () => import("./demos/TypeScriptDemo"),
  javascript: () => import("./demos/JavaScriptDemo"),
  performance: () => import("./demos/PerformanceDemo"),
  state: () => import("./demos/StateDemo"),
  api: () => import("./demos/ApiDemo"),
  realtime: () => import("./demos/RealtimeDemo"),
  css: () => import("./demos/CssDemo"),
  a11y: () => import("./demos/AccessibilityDemo"),
  git: () => import("./demos/GitDemo"),
};

export const demos: DemoDef[] = [
  {
    id: "react",
    label: "React",
    tagline: "rendering",
    concept: "Trigger a state update and watch which components re-render — then fix the waste with memo and stable props.",
    skills: ["React.js"],
    Component: dynamic(() => import("./demos/ReactDemo"), { loading: DemoSkeleton }),
    preload: loaders.react,
  },
  {
    id: "next",
    label: "Next.js",
    tagline: "architecture",
    concept: "Follow a request through static, server and client rendering, and draw the Server / Client component boundary yourself.",
    skills: ["Next.js"],
    Component: dynamic(() => import("./demos/NextDemo"), { loading: DemoSkeleton }),
    preload: loaders.next,
  },
  {
    id: "typescript",
    label: "TypeScript",
    tagline: "type safety",
    concept: "Edit the data. The compiler catches the bug before it ships — and you can see what plain JavaScript would have done instead.",
    skills: ["TypeScript"],
    Component: dynamic(() => import("./demos/TypeScriptDemo"), { loading: DemoSkeleton }),
    preload: loaders.typescript,
  },
  {
    id: "javascript",
    label: "JavaScript",
    tagline: "event loop",
    concept: "Predict the output, then step through the call stack, microtasks and task queue to see why.",
    skills: ["JavaScript"],
    Component: dynamic(() => import("./demos/JavaScriptDemo"), { loading: DemoSkeleton }),
    preload: loaders.javascript,
  },
  {
    id: "performance",
    label: "Performance",
    tagline: "optimization",
    concept: "An intentionally slow app. Apply real techniques one by one and watch the waterfall, payload and LCP respond.",
    skills: [],
    Component: dynamic(() => import("./demos/PerformanceDemo"), { loading: DemoSkeleton }),
    preload: loaders.performance,
  },
  {
    id: "state",
    label: "Redux",
    tagline: "state flow",
    concept: "Dispatch actions and follow one-way data flow: only components subscribed to the changed slice update. Then time-travel.",
    skills: ["Redux", "Redux Thunk"],
    Component: dynamic(() => import("./demos/StateDemo"), { loading: DemoSkeleton }),
    preload: loaders.state,
  },
  {
    id: "api",
    label: "REST APIs",
    tagline: "data fetching",
    concept: "Fire a request through loading, error, retry-with-backoff and caching — the states every real data layer must handle.",
    skills: ["REST APIs", "RTK Query"],
    Component: dynamic(() => import("./demos/ApiDemo"), { loading: DemoSkeleton }),
    preload: loaders.api,
  },
  {
    id: "realtime",
    label: "Real-Time",
    tagline: "websockets",
    concept: "The same server events delivered two ways: polling on a timer versus a persistent socket that pushes instantly.",
    skills: ["WebSockets", "Socket.io", "Redis"],
    Component: dynamic(() => import("./demos/RealtimeDemo"), { loading: DemoSkeleton }),
    preload: loaders.realtime,
  },
  {
    id: "css",
    label: "CSS",
    tagline: "live styling",
    concept: "Tweak layout and design tokens and see the UI and the generated CSS update instantly — including at mobile width.",
    skills: ["CSS3", "Material-UI (MUI)"],
    Component: dynamic(() => import("./demos/CssDemo"), { loading: DemoSkeleton }),
    preload: loaders.css,
  },
  {
    id: "a11y",
    label: "Accessibility",
    tagline: "semantic HTML",
    concept: "A UI that looks fine but fails keyboard and screen-reader users. Flip on each fix and try it with Tab yourself.",
    skills: ["HTML5"],
    Component: dynamic(() => import("./demos/AccessibilityDemo"), { loading: DemoSkeleton }),
    preload: loaders.a11y,
  },
  {
    id: "git",
    label: "Git",
    tagline: "branching",
    concept: "Branch, commit on parallel lines of work, and merge — the everyday workflow behind shipping safely in a team.",
    skills: ["Git", "GitHub"],
    Component: dynamic(() => import("./demos/GitDemo"), { loading: DemoSkeleton }),
    preload: loaders.git,
  },
];

/** skill name → demo id, for linking the toolkit list to a live demo. */
export const demoForSkill: Record<string, string> = Object.fromEntries(
  demos.flatMap((d) => d.skills.map((s) => [s, d.id]))
);
