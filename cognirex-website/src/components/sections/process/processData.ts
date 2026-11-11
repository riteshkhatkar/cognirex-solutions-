export interface ProcessStage {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Vertical arch offset on desktop so the 5 floating panels match the reference rhythm */
  panelOffsetClass: string;
}

export const BRAND_COLORS = {
  bg: "#F8F7FC",
  navy: "#17142C",
  violet: "#793BEE",
  lavender: "#EEE8FA",
  white: "#FFFFFF",
  yellow: "#FFC914",
} as const;

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: "research",
    number: "01",
    title: "Research & Understand",
    description: "Get to know your vision and goals.",
    panelOffsetClass: "md:translate-y-4 lg:translate-y-5",
  },
  {
    id: "plan-design",
    number: "02",
    title: "Plan & Design",
    description: "Map the strategy and design workflow.",
    panelOffsetClass: "md:translate-y-1 lg:translate-y-1.5",
  },
  {
    id: "prototype",
    number: "03",
    title: "Build a Prototype",
    description: "See your idea come to life.",
    panelOffsetClass: "md:translate-y-0",
  },
  {
    id: "develop-test",
    number: "04",
    title: "Develop & Test",
    description: "Ensure quality and performance.",
    panelOffsetClass: "md:translate-y-1 lg:translate-y-1.5",
  },
  {
    id: "launch-improve",
    number: "05",
    title: "Launch & Improve",
    description: "Go live and grow together.",
    panelOffsetClass: "md:-translate-y-4 lg:-translate-y-6",
  },
];
