export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "What kind of Frontend Developer are you?",
    answer:
      "I'm a product-focused Frontend Developer who enjoys building scalable, responsive, and production-ready applications. My core stack is React.js, Next.js, and TypeScript, with experience in APIs, real-time systems, performance optimization, and modern frontend architecture.",
  },
  {
    question: "Can you work on large SaaS products?",
    answer:
      "Yes. I've worked on enterprise SaaS dashboards with nearly 300 modules, where reusable architecture, maintainability, performance, and consistent UI patterns are important for keeping the product scalable.",
  },
  {
    question: "Do you work with APIs and real-time systems?",
    answer:
      "Yes. I have experience integrating REST APIs, WebSockets, Socket.io, and Redis-backed real-time systems across multiple production applications.",
  },
  {
    question: "Can you take a feature from requirement to implementation?",
    answer:
      "Yes. I enjoy understanding requirements, breaking down problems, planning the frontend approach, integrating APIs, handling edge cases, and delivering a working feature.",
  },
  {
    question: "How do you approach performance?",
    answer:
      "Performance is an important part of my process. I've worked with lazy loading, rendering optimization, reusable component architecture, and Core Web Vitals improvements at scale.",
  },
  {
    question: "Can you work with existing and complex codebases?",
    answer:
      "Yes. I'm comfortable understanding existing architectures, working within established patterns, improving components incrementally, and making changes without unnecessarily disrupting existing functionality.",
  },
  {
    question: "How do you use AI in your development workflow?",
    answer:
      "I use tools such as ChatGPT, Claude, and GitHub Copilot to accelerate development, debugging, research, and code review — while still reviewing, understanding, and owning the final implementation.",
  },
  {
    question: "Are you open to new opportunities and collaborations?",
    answer:
      "Yes. I'm open to full-time roles, contract work, and collaborations with startups, product companies, and teams building things worth shipping.",
  },
];
