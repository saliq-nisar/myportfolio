"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import DeveloperEngineScene from "./scenes/DeveloperEngineScene";
import { useDevicePerf } from "@/hooks/useDevicePerf";

export default function DeveloperEngineCanvas() {
  const { dpr, isLowPerf } = useDevicePerf();

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: !isLowPerf, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0.2, 4.2], fov: 45, near: 0.1, far: 20 }}
    >
      <Suspense fallback={null}>
        <DeveloperEngineScene reducedParticles={isLowPerf} />
      </Suspense>
    </Canvas>
  );
}
