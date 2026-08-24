"use client";

import { useEffect, useState } from "react";

export interface DevicePerf {
  isMobile: boolean;
  isLowPerf: boolean;
  dpr: number;
}

export function useDevicePerf(): DevicePerf {
  const [perf, setPerf] = useState<DevicePerf>({
    isMobile: false,
    isLowPerf: false,
    dpr: 1,
  });

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const isLowPerf = isMobile || cores <= 4;
    const dpr = isLowPerf ? 1 : Math.min(window.devicePixelRatio, 2);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time browser capability read, no SSR equivalent
    setPerf({ isMobile, isLowPerf, dpr });
  }, []);

  return perf;
}
