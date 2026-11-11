import { ServiceItem, PrimaryService } from "@/types";

export const primaryServices: PrimaryService[] = [
  {
    id: "website-presence",
    title: "Website & Digital Presence",
    shortLine: "Make your brand stand out online.",
    description:
      "We create modern, responsive websites that showcase your business, explain what you offer and make it easy for customers to contact you.",
    icon: "Globe",
    href: "#solutions",
    includes: [
      "Business websites",
      "Landing pages",
      "Portfolio websites",
      "Website redesign",
      "Digital catalogs",
    ],
    ctaLabel: "Explore Websites",
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Digital Platforms",
    shortLine: "Take your products beyond your physical store.",
    description:
      "We build online shopping experiences that help customers browse products, discover what they need and place enquiries or orders.",
    icon: "ShoppingCart",
    href: "#solutions",
    includes: [
      "Online stores",
      "Product catalogs",
      "Shopping carts",
      "Payment integrations",
      "Order workflows",
    ],
    ctaLabel: "Explore E-Commerce",
  },
  {
    id: "custom-software",
    title: "Custom Software & Applications",
    shortLine: "Software that fits the way you work.",
    description:
      "We build tailored applications that help organize information, manage workflows and connect the systems your business uses.",
    icon: "Code2",
    href: "#solutions",
    includes: [
      "Business dashboards",
      "Management applications",
      "Customer portals",
      "Databases",
      "API integrations",
    ],
    ctaLabel: "Explore Software",
  },
  {
    id: "ai-automation",
    title: "AI, Automation & Intelligent Systems",
    shortLine: "Make everyday work smarter.",
    description:
      "We create AI-powered assistants and automated workflows that help process information, support customer interactions and reduce repetitive tasks.",
    icon: "Sparkles",
    href: "#solutions",
    includes: [
      "AI chatbots",
      "Generative AI applications",
      "AI agents",
      "Workflow automation",
      "Data intelligence",
    ],
    ctaLabel: "Explore AI Solutions",
  },
];

export const detailedServices: ServiceItem[] = [
  {
    id: "web-app-dev",
    title: "Web & Application Development",
    tagline: "Digital experiences people enjoy using.",
    description:
      "We build responsive websites and web applications that present your brand clearly and make your services easier to use.",
    icon: "Layout",
    capabilities: [
      "Business websites & landing pages",
      "Web applications & customer portals",
      "Responsive design across desktop & mobile",
      "API-connected digital experiences",
      "Fast page load & search-engine-ready structure",
      "Clean content management & updates",
    ],
    businessApplications: [
      "Launch a professional website that clearly communicates your value to visitors",
      "Create an interactive service catalog that helps customers explore options",
      "Build a client portal for bookings, project updates, or account management",
      "Modernize an outdated website into a fast, mobile-friendly digital experience",
    ],
  },
  {
    id: "ecommerce",
    title: "E-Commerce & Digital Commerce",
    tagline: "Make it easier to explore and buy.",
    description:
      "We create online stores and digital catalogs that help customers browse products and interact with your business.",
    icon: "ShoppingCart",
    capabilities: [
      "Product catalogs with clear search & filters",
      "Smooth cart and checkout flows",
      "Secure payment gateway integrations",
      "Inventory and order management workflows",
      "Mobile-optimized shopping experiences",
      "Enquiry-based and direct purchase channels",
    ],
    businessApplications: [
      "Expand beyond a physical storefront to reach customers online 24/7",
      "Showcase extensive product catalogs with structured specifications",
      "Enable instant digital payments and order tracking for customers",
      "Connect online orders directly with fulfillment and inventory systems",
    ],
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    tagline: "Software shaped around your workflow.",
    description:
      "We build applications that organize information, simplify tasks and connect the systems you use.",
    icon: "Code2",
    capabilities: [
      "Centralized business dashboards",
      "Operational management tools",
      "Customer & vendor portals",
      "Structured databases & data storage",
      "Custom API integrations between tools",
      "Role-based access & permissions",
    ],
    businessApplications: [
      "Replace tangled spreadsheets with a reliable, structured database application",
      "Unify fragmented business information into an executive dashboard",
      "Give customers or partners dedicated portals for self-service requests",
      "Connect multiple software platforms so information updates automatically",
    ],
  },
  {
    id: "ai-ml",
    title: "Artificial Intelligence & Machine Learning",
    tagline: "Find useful patterns in data.",
    description:
      "We build AI and machine learning applications that analyze information, identify patterns and support better decisions.",
    icon: "Cpu",
    capabilities: [
      "Predictive models & trend forecasting",
      "Automated information classification",
      "Smart recommendation systems",
      "Anomaly detection & quality alerts",
      "Decision-support algorithms",
      "Continuous model monitoring & evaluation",
    ],
    businessApplications: [
      "Forecast inventory needs based on historical customer demand",
      "Identify patterns in customer behaviour to provide relevant recommendations",
      "Detect operational bottlenecks and system discrepancies early",
      "Prioritize high-impact business tasks using data-backed scoring",
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI Solutions",
    tagline: "Make information easier to use.",
    description:
      "We create AI assistants and applications that help people ask questions, find information and work with business knowledge.",
    icon: "Sparkles",
    capabilities: [
      "Custom AI assistants & conversational interfaces",
      "Knowledge assistants with document search (RAG)",
      "Document summarization & content drafting",
      "Context-aware enquiry triage",
      "Secure LLM API integrations",
      "Clear human-in-the-loop oversight safeguards",
    ],
    businessApplications: [
      "Provide an on-site AI assistant to answer customer questions around the clock",
      "Help team members query company documentation, policies, and manuals instantly",
      "Summarize long documents, customer feedback, and enquiry notes in seconds",
      "Draft customized email responses and reports for team review",
    ],
  },
  {
    id: "intelligent-automation",
    title: "Intelligent Automation & Agentic AI",
    tagline: "Let connected tools handle repetitive work.",
    description:
      "We connect applications and automate structured tasks, using AI agents where they add practical value and appropriate human oversight.",
    icon: "Workflow",
    capabilities: [
      "Multi-step automated workflows",
      "AI agents for structured task routing",
      "Webhook & API event triggers",
      "Automated notifications & follow-ups",
      "Data synchronization across tools",
      "Human review checkpoints for critical steps",
    ],
    businessApplications: [
      "Capture website enquiries, notify your sales team, and update your CRM instantly",
      "Automate invoice generation and payment status updates between systems",
      "Send automatic onboarding emails and document requests when a client signs up",
      "Trigger automated alerts when inventory runs low or tasks need attention",
    ],
  },
  {
    id: "data-analytics",
    title: "Data Science & Analytics",
    tagline: "Turn business data into clearer decisions.",
    description:
      "We organize and visualize information so teams can understand performance and spot useful trends.",
    icon: "BarChart3",
    capabilities: [
      "Clean data pipelines & ingestion",
      "Interactive KPI & performance dashboards",
      "Visual reporting & exportable insights",
      "Customer activity & channel analytics",
      "Operational performance tracking",
      "Data hygiene & structured modeling",
    ],
    businessApplications: [
      "See sales, enquiries, and operational metrics in one clear real-time view",
      "Understand which products, services, or campaigns drive the most customer interest",
      "Automate weekly and monthly management reports for stakeholders",
      "Identify areas where operational steps are slowing down progress",
    ],
  },
  {
    id: "computer-vision-nlp",
    title: "Computer Vision & Language Technology",
    tagline: "Help applications understand images and words.",
    description:
      "We build applications that process visual and language-based information for specific business needs.",
    icon: "Eye",
    capabilities: [
      "Document extraction & OCR text reading",
      "Image categorization & visual inspection",
      "Text classification & sentiment parsing",
      "Semantic search across unstructured text",
      "Object recognition & tracking",
      "Multi-language text translation & normalization",
    ],
    businessApplications: [
      "Extract structured data from scanned invoices, receipts, and forms automatically",
      "Enable visual product search across catalog photo libraries",
      "Classify customer feedback and support messages by topic and urgency",
      "Inspect digital imagery for consistency and format guidelines",
    ],
  },
];
