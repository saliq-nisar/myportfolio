"use client";

import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { remap } from "@/lib/easing";
import { sampleCameraPath, type CameraKeyframe } from "@/lib/cameraPath";
import { getSpacerProgress } from "@/lib/scrollProgress";

interface WorkspaceSceneProps {
  spacerRef: RefObject<HTMLDivElement | null>;
  reducedParticles: boolean;
}

const cameraPath: CameraKeyframe[] = [
  { p: 0, pos: new THREE.Vector3(1.6, 1.9, 6.5), look: new THREE.Vector3(0, 1.3, 0), fov: 45 },
  { p: 0.4, pos: new THREE.Vector3(0.6, 1.6, 3.6), look: new THREE.Vector3(0, 1.32, 0), fov: 45 },
  { p: 0.72, pos: new THREE.Vector3(0.1, 1.35, 1.1), look: new THREE.Vector3(0, 1.32, 0), fov: 52 },
  { p: 0.92, pos: new THREE.Vector3(0, 1.31, 0.22), look: new THREE.Vector3(0, 1.3, -2), fov: 68 },
  { p: 1, pos: new THREE.Vector3(0, 1.3, -0.6), look: new THREE.Vector3(0, 1.3, -3), fov: 85 },
];

function CameraRig({ spacerRef }: { spacerRef: RefObject<HTMLDivElement | null> }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 1.3, 0));

  /* eslint-disable react-hooks/immutability -- r3f convention: camera is a mutable imperative handle updated per-frame */
  useFrame(() => {
    const t = getSpacerProgress(spacerRef.current);
    const { pos, look, fov } = sampleCameraPath(cameraPath, t);

    camera.position.lerp(pos, 0.14);
    lookTarget.current.lerp(look, 0.14);
    camera.lookAt(lookTarget.current);

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(cam.fov, fov, 0.1);
    cam.updateProjectionMatrix();
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

function Screen({ spacerRef }: { spacerRef: RefObject<HTMLDivElement | null> }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const htmlWrapRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const t = getSpacerProgress(spacerRef.current);
    const glow = 0.7 + Math.sin(Date.now() * 0.002) * 0.05 + t * 2.2;
    if (matRef.current) matRef.current.emissiveIntensity = glow;

    const fadeOut = 1 - remap(t, 0.78, 0.94);
    if (htmlWrapRef.current) htmlWrapRef.current.style.opacity = String(fadeOut);
  });

  return (
    <group position={[0, 1.32, -0.02]}>
      <mesh>
        <planeGeometry args={[1.7, 1.02]} />
        <meshStandardMaterial
          ref={matRef}
          color="#0a0d1f"
          emissive="#4bf5ff"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>
      <Html
        transform
        occlude={false}
        position={[0, 0, 0.01]}
        distanceFactor={1.15}
        style={{ pointerEvents: "none", width: "620px" }}
      >
        <div ref={htmlWrapRef} className="flex flex-col items-start gap-2 select-none">
          <span className="font-mono text-xs tracking-[0.3em] text-cyan-300/70 uppercase">
            System online
          </span>
          <p className="font-mono text-sm text-cyan-300/80">
            React.js • Next.js • TypeScript
          </p>
        </div>
      </Html>
    </group>
  );
}

function Desk() {
  return (
    <group>
      <mesh position={[0, 0.74, 0.2]} receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.5]} />
        <meshStandardMaterial color="#14162a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-1.4, 0.35, 0.7]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#0a0b16" />
      </mesh>
      <mesh position={[1.4, 0.35, 0.7]}>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color="#0a0b16" />
      </mesh>

      <mesh position={[0, 1.32, -0.05]}>
        <boxGeometry args={[1.86, 1.18, 0.05]} />
        <meshStandardMaterial color="#0d0f1e" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.9, -0.05]}>
        <boxGeometry args={[0.1, 0.35, 0.08]} />
        <meshStandardMaterial color="#0d0f1e" />
      </mesh>
      <mesh position={[0, 0.76, -0.05]}>
        <boxGeometry args={[0.5, 0.05, 0.3]} />
        <meshStandardMaterial color="#0d0f1e" />
      </mesh>

      <mesh position={[0, 0.79, 0.55]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.3]} />
        <meshStandardMaterial color="#111327" roughness={0.6} />
      </mesh>
      <mesh position={[0.65, 0.775, 0.6]}>
        <boxGeometry args={[0.12, 0.03, 0.2]} />
        <meshStandardMaterial color="#111327" roughness={0.6} />
      </mesh>
    </group>
  );
}

export default function WorkspaceScene({ spacerRef, reducedParticles }: WorkspaceSceneProps) {
  return (
    <>
      <CameraRig spacerRef={spacerRef} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 1.6, 1.5]} intensity={1.2} color="#4bf5ff" distance={6} />
      <pointLight position={[-2, 2, 2]} intensity={0.6} color="#9d7bff" distance={8} />
      <directionalLight position={[2, 3, 2]} intensity={0.3} />

      <Desk />
      <Screen spacerRef={spacerRef} />

      <Sparkles
        count={reducedParticles ? 20 : 60}
        scale={[4, 2.5, 4]}
        position={[0, 1.4, 1]}
        size={2}
        speed={0.3}
        color="#4bf5ff"
        opacity={0.5}
      />
    </>
  );
}
