import { TeamMember, CapabilityArea } from "@/types";

// Fictional employee roster removed per brand & verification rules.
export const sampleTeamMembers: TeamMember[] = [];

// 4 distinct company capability areas with professional domain photo posters matching AI/ML themes
export const companyCapabilities: CapabilityArea[] = [
  {
    id: "digital-software",
    title: "Digital & Software Engineering",
    description:
      "Building responsive websites, robust web applications and custom software that work reliably and present your brand clearly.",
    icon: "Code2",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "ai-intelligent",
    title: "AI & Intelligent Systems",
    description:
      "Creating AI assistants, workflow automation and practical machine learning applications that add tangible value to everyday operations.",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "product-design",
    title: "Product Design & User Experience",
    description:
      "Designing clean, accessible, modern interfaces that customers enjoy navigating and teams find intuitive to use.",
    icon: "Palette",
    image: "/images/product-design-ux.jpg",
  },
  {
    id: "automation-integration",
    title: "Automation & System Integration",
    description:
      "Connecting disconnected tools, automating repetitive tasks and streamlining workflows to keep work moving smoothly.",
    icon: "Workflow",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
  },
];
