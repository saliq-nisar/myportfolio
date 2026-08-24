"use client";

import { useEffect, useState } from "react";

export function useWebglSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser capability read, no SSR equivalent
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
