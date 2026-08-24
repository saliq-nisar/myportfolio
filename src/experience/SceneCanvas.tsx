"use client";

import { Suspense, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import WorkspaceScene from "./scenes/WorkspaceScene";
import { useDevicePerf } from "@/hooks/useDevicePerf";

interface SceneCanvasProps {
  spacerRef: RefObject<HTMLDivElement | null>;
}

export default function SceneCanvas({ spacerRef }: SceneCanvasProps) {
  const { dpr, isLowPerf } = useDevicePerf();

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: !isLowPerf, powerPreference: "high-performance" }}
      camera={{ position: [1.6, 1.9, 6.5], fov: 45, near: 0.05, far: 30 }}
    >
      <color attach="background" args={["#05050a"]} />
      <fog attach="fog" args={["#05050a", 4, 14]} />
      <Suspense fallback={null}>
        <WorkspaceScene spacerRef={spacerRef} reducedParticles={isLowPerf} />
      </Suspense>
    </Canvas>
  );
}
