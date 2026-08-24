"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

/**
 * One subtle abstract object — not a multi-part animated machine. Slow
 * rotation, gentle drift, a handful of ambient particles. Decorative only;
 * all real content lives in the DOM beside it.
 */
export default function DeveloperEngineScene({ reducedParticles }: { reducedParticles: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    meshRef.current.position.y = Math.sin(t * 0.3) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 1.5, 3]} intensity={0.7} color="#4bf5ff" distance={8} />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          color="#0e1016"
          emissive="#4bf5ff"
          emissiveIntensity={0.35}
          wireframe
          toneMapped={false}
        />
      </mesh>

      <Sparkles
        count={reducedParticles ? 10 : 24}
        scale={[4, 3, 3]}
        size={1.2}
        speed={0.1}
        color="#4bf5ff"
        opacity={0.25}
      />
    </>
  );
}
