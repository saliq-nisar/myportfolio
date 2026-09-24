"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export interface SequenceStep {
  /** ms to wait after the previous step before running this one */
  delay: number;
  run: () => void;
}

/** Runs a timed list of steps (a "simulation"). Starting a new sequence
 * cancels the previous one; everything is cleared on unmount. */
export function useSequence() {
  const timers = useRef<number[]>([]);
  const [running, setRunning] = useState(false);

  const cancel = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRunning(false);
  }, []);

  const run = useCallback(
    (steps: SequenceStep[]) => {
      cancel();
      setRunning(true);
      let at = 0;
      steps.forEach((step, i) => {
        at += step.delay;
        const id = window.setTimeout(() => {
          step.run();
          if (i === steps.length - 1) setRunning(false);
        }, at);
        timers.current.push(id);
      });
      if (steps.length === 0) setRunning(false);
    },
    [cancel]
  );

  useEffect(() => {
    const t = timers;
    return () => t.current.forEach((id) => window.clearTimeout(id));
  }, []);

  return { run, cancel, running };
}

/** True while the element is on screen AND the tab is visible. Used only to
 * pause demo timers — never to trigger entrance animations. */
export function useActiveWhileVisible<T extends Element>(ref: RefObject<T | null>) {
  const [onScreen, setOnScreen] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);

  return onScreen && pageVisible;
}

/** Fire-and-forget timeouts that are all cleared on unmount. */
export function useTimeouts() {
  const ids = useRef(new Set<number>());

  useEffect(() => {
    const set = ids.current;
    return () => set.forEach((id) => window.clearTimeout(id));
  }, []);

  return useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      ids.current.delete(id);
      fn();
    }, ms);
    ids.current.add(id);
  }, []);
}
