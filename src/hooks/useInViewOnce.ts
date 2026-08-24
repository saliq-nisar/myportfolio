"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** True once the element has intersected the viewport; stays true after
 * (avoids repeatedly mounting/unmounting a WebGL canvas while scrolling
 * back and forth across the section boundary). */
export function useInViewOnce<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return [ref, inView];
}
