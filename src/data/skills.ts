import type { SkillGroup } from "@/types";

export const skills: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Flutter",
      "Material-UI (MUI)",
    ],
  },
  {
    category: "State & Data",
    items: ["Redux", "Redux Thunk", "RTK Query", "REST APIs"],
  },
  {
    category: "Real-Time",
    items: ["WebSockets", "Socket.io", "Redis"],
  },
  {
    category: "Infrastructure",
    items: ["Node.js", "BullMQ", "Docker", "PM2", "Git", "GitHub"],
  },
  {
    category: "AI Workflow",
    items: ["GitHub Copilot", "ChatGPT", "Claude", "Agile", "Scrum"],
  },
];

export const aiToolsDescription =
  "Extensive daily use of AI development tools for rapid coding, debugging, code review, problem solving, and workflow automation.";
