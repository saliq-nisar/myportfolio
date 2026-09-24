import { create } from "zustand";

interface ScrollState {
  /** 0-1 normalized progress through the page (used by the progress bar only). */
  progress: number;
  /** id of the section currently under the viewport's reading line. */
  activeId: string;
  setScroll: (progress: number, activeId: string) => void;
}

export const useScrollStore = create<ScrollState>((set, get) => ({
  progress: 0,
  activeId: "home",
  setScroll: (progress, activeId) => {
    const s = get();
    if (s.progress === progress && s.activeId === activeId) return;
    set({ progress, activeId });
  },
}));
