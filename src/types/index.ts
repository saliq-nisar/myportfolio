export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  mode: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  stack: string;
  website?: string;
  bullets: string[];
  visualConcept: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface StatItem {
  value: string;
  label: string;
}
