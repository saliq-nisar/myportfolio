"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Makes every framer-motion transition honour prefers-reduced-motion. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
