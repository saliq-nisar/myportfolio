export interface SectionDef {
  id: string;
  label: string;
  order: string;
  /** normalized [start, end] range of total scroll progress (0-1) this section owns */
  range: [number, number];
}

// Ranges measured from actual rendered section offsets (see scratch
// measure script) — the hero's 320vh scroll-driven canvas dominates total
// page height, so it owns a disproportionate share of the range.
export const sections: SectionDef[] = [
  { id: "home", label: "Home", order: "01", range: [0, 0.326] },
  { id: "about", label: "About", order: "02", range: [0.326, 0.402] },
  { id: "skills", label: "Skills", order: "03", range: [0.402, 0.502] },
  { id: "experience", label: "Experience", order: "04", range: [0.502, 0.676] },
  { id: "projects", label: "Projects", order: "05", range: [0.676, 0.801] },
  { id: "why", label: "Why Me", order: "06", range: [0.801, 0.881] },
  { id: "faq", label: "FAQ", order: "07", range: [0.881, 0.95] },
  { id: "contact", label: "Contact", order: "08", range: [0.95, 1] },
];
