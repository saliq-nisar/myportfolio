export interface SectionDef {
  id: string;
  label: string;
  order: string;
}

export const sections: SectionDef[] = [
  { id: "home", label: "Home", order: "01" },
  { id: "about", label: "About", order: "02" },
  { id: "skills", label: "Skills", order: "03" },
  { id: "experience", label: "Experience", order: "04" },
  { id: "projects", label: "Projects", order: "05" },
  { id: "why", label: "Why Me", order: "06" },
  { id: "faq", label: "FAQ", order: "07" },
  { id: "contact", label: "Contact", order: "08" },
];
