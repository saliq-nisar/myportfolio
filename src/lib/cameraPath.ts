import * as THREE from "three";
import { easeInOutCubic, remap } from "./easing";

export interface CameraKeyframe {
  p: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
}

export interface CameraSample {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  fov: number;
}

/** Piecewise-eased interpolation across an ordered list of camera keyframes. */
export function sampleCameraPath(keyframes: CameraKeyframe[], t: number): CameraSample {
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (t >= a.p && t <= b.p) {
      const local = easeInOutCubic(remap(t, a.p, b.p));
      return {
        pos: a.pos.clone().lerp(b.pos, local),
        look: a.look.clone().lerp(b.look, local),
        fov: THREE.MathUtils.lerp(a.fov, b.fov, local),
      };
    }
  }
  const last = keyframes[keyframes.length - 1];
  return { pos: last.pos.clone(), look: last.look.clone(), fov: last.fov };
}
