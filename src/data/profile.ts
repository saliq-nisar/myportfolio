import type { StatItem } from "@/types";

export const profile = {
  name: "Saliq Nisar",
  title: "Frontend Developer",
  location: "Srinagar, Jammu & Kashmir, India",
  phone: "6006388260",
  email: "msalik909@gmail.com",
  linkedin: "https://www.linkedin.com/in/saliq-nisar",
  yearsExperience: "3+",
  heroDescription:
    "Building scalable SaaS products and production-ready web experiences with React, Next.js, and TypeScript.",
  aboutHeading: "More than just UI.",
  aboutStatement:
    "I'm Saliq Nisar, a Frontend Developer with 3+ years of experience building scalable SaaS products and production-ready web applications using React.js, Next.js, and TypeScript.",
  aboutSupporting:
    "My work goes beyond creating interfaces. I focus on understanding requirements, breaking down complex problems, integrating APIs and real-time systems, improving performance, and shipping reliable features.",
} as const;

export const aboutStats: StatItem[] = [
  { value: "3+ Years", label: "Experience" },
  { value: "SaaS", label: "Products" },
  { value: "Real-Time", label: "Systems" },
  { value: "Performance", label: "Focused" },
];
