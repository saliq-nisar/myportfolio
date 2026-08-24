import { create } from "zustand";

interface ScrollState {
  /** 0-1 normalized progress through the entire journey */
  progress: number;
  setProgress: (p: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  setProgress: (p) => set({ progress: p }),
}));

/** Non-reactive read for use inside r3f useFrame loops (avoids re-render churn). */
export const getScrollProgress = () => useScrollStore.getState().progress;
