import type { CognirexContentBundle, CmsSectionKey } from "@/types/cms";

export const CMS_SECTIONS: CmsSectionKey[] = [
  "site_brand",
  "hero",
  "about",
  "solutions",
  "why_choose_us",
  "process",
  "industries",
  "innovation",
  "contact_section",
  "careers",
];

export const DEFAULT_COGNIR_CONTENT: CognirexContentBundle = {
  site_brand: {
    name: "Cognirex Solutions",
    shortName: "Cognirex",
    tagline: "Intelligence Engineered. Innovation Delivered.",
    headerSubtitle: "Intelligence Engineered",
    footerDescription:
      "We build websites, software and intelligent digital solutions that help businesses connect, work smarter and grow.",
    locationLabel: "India (Nationwide & Global clients)",
    officeHours: "Monday–Friday, 9:30 AM–6:30 PM IST",
    linkedinUrl: "https://www.linkedin.com/company/cognirex-solutions",
    twitterUrl: "https://x.com/cognirex",
    githubUrl: "https://github.com/cognirex-solutions",
    navItems: [
      { title: "Home", href: "/#hero" },
      { title: "About", href: "/#about" },
      { title: "Solutions", href: "/#solutions" },
      { title: "Projects", href: "/#projects" },
      { title: "Careers", href: "/careers" },
      { title: "Get in Touch", href: "/contact", isCta: true },
    ],
  },

  hero: {
    headlineLine1: "We Turn Your Business",
    headlineHighlight: "into a Digital Experience.",
    description:
      "Build a stronger online presence, connect with more customers and work smarter with modern websites, software, AI and automation.",
    primaryCtaLabel: "Explore Our Services",
    primaryCtaHref: "#solutions",
    secondaryCtaLabel: "Let's Talk",
    secondaryCtaHref: "/contact",
    heroImage:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
    heroImageAlt: "Cognirex Solutions - Digital Experience",
    imageBadge: "Digital Experience",
    imageCaption: "Websites, software, AI and automation built for your business.",
    capabilityStrip: [
      { icon: "Globe", title: "Digital Presence", desc: "Get discovered online." },
      { icon: "ShoppingCart", title: "E-Commerce", desc: "Bring your products online." },
      { icon: "Code2", title: "Smart Software", desc: "Simplify your operations." },
      { icon: "Sparkles", title: "AI & Automation", desc: "Make everyday work smarter." },
    ],
  },

  about: {
    badge: "About Cognirex Solutions",
    headingLine1: "Building a Smarter,",
    headingHighlight: "More Connected Future.",
    storyText:
      "Cognirex Solutions brings together digital design, software development and intelligent technology to help businesses build a stronger online presence, connect with customers and simplify the way they work. We focus on practical solutions shaped around real needs.",
    aboutImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    aboutImageAlt: "Cognirex Solutions - Professional Collaborative Strategy Session",
    floatingBadgeTitle: "Human-Centric Approach",
    floatingBadgeSubtitle: "Engineering with deliberate care",
    highlights: [
      { icon: "Sparkles", title: "Innovation First", desc: "Always exploring what's next." },
      { icon: "Users", title: "Client-Centric", desc: "Your goals, our priority." },
      { icon: "TrendingUp", title: "Built for Growth", desc: "Solutions that scale." },
    ],
    missionBadge: "Our Mission",
    missionTitle: "Purposeful Problem Solving",
    missionQuote:
      "To create meaningful, practical and intelligent technology solutions that help solve real-world challenges.",
    missionSubtext:
      "We believe technology is at its best when it removes friction, accelerates human decision-making, and creates dependable business longevity.",
    visionBadge: "Our Vision",
    visionTitle: "Enduring Technology Partnership",
    visionQuote:
      "To grow as a trusted technology partner through continuous innovation, engineering excellence and valuable digital experiences.",
    visionSubtext:
      "We strive to be recognized for the clarity of our advice, the elegance of our software architectures, and our reliability under complex constraints.",
    calloutEyebrow: "What We Build For You",
    calloutQuote:
      "We Don’t Just Write Code — We Engineer Extraordinary AI & Digital Solutions That Accelerate Your Growth.",
    calloutDescription:
      "From enterprise-grade web applications to autonomous AI workflows, we empower your business with intelligent technology built to scale your operations, delight your customers, and turn ambitious ideas into extraordinary digital realities.",
    valuesBadge: "Core Principles",
    valuesTitle: "Values That Anchor Our Engineering",
    valuesDescription:
      "The foundational convictions that guide our architecture choices, client interactions, and company culture every single day.",
    values: [
      {
        name: "Innovation",
        desc: "Constantly interrogating assumptions to discover simpler, more resilient technical solutions.",
        icon: "Lightbulb",
      },
      {
        name: "Trust",
        desc: "Operating with absolute transparency in architectural recommendations and delivery timelines.",
        icon: "ShieldCheck",
      },
      {
        name: "Quality",
        desc: "Uncompromising standards in code maintainability, test coverage, and systems reliability.",
        icon: "Award",
      },
      {
        name: "Collaboration",
        desc: "Partnering as an integrated extension of client teams rather than an aloof vendor.",
        icon: "Users2",
      },
      {
        name: "Continuous Learning",
        desc: "Investing persistently in our craft, staying ahead of computational paradigms.",
        icon: "BookOpen",
      },
      {
        name: "Client Success",
        desc: "Measuring our outcomes by the operational efficiency and commercial value we unlock.",
        icon: "Target",
      },
    ],
    capabilitiesBadge: "Engineering Disciplines",
    capabilitiesTitle: "Multidisciplinary Engineering Capabilities",
    capabilitiesDescription:
      "Our core competency areas spanning modern web architectures, machine learning, systems automation, and human-centred design.",
    capabilities: [
      {
        id: "digital-software",
        title: "Digital & Software Engineering",
        description:
          "Building responsive websites, robust web applications and custom software that work reliably and present your brand clearly.",
        icon: "Code2",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: "ai-intelligent",
        title: "AI & Intelligent Systems",
        description:
          "Creating AI assistants, workflow automation and practical machine learning applications that add tangible value to everyday operations.",
        icon: "Sparkles",
        image:
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
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
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },

  solutions: {
    badge: "WHAT WE DO",
    title: "Everything You Need to Move Your Business Forward.",
    description:
      "From your first website to intelligent business applications, we bring the right digital tools together to help you connect, operate and grow.",
    primaryServices: [
      {
        id: "website-presence",
        title: "Website & Digital Presence",
        shortLine: "Make your brand stand out online.",
        description:
          "We create modern, responsive websites that showcase your business, explain what you offer and make it easy for customers to contact you.",
        icon: "Globe",
        ctaLabel: "Explore Websites",
        includes: [
          "Business websites",
          "Landing pages",
          "Portfolio websites",
          "Website redesign",
          "Digital catalogs",
        ],
      },
      {
        id: "ecommerce",
        title: "E-Commerce & Digital Platforms",
        shortLine: "Take your products beyond your physical store.",
        description:
          "We build online shopping experiences that help customers browse products, discover what they need and place enquiries or orders.",
        icon: "ShoppingCart",
        ctaLabel: "Explore E-Commerce",
        includes: [
          "Online stores",
          "Product catalogs",
          "Shopping carts",
          "Payment integrations",
          "Order workflows",
        ],
      },
      {
        id: "custom-software",
        title: "Custom Software & Applications",
        shortLine: "Software that fits the way you work.",
        description:
          "We build tailored applications that help organize information, manage workflows and connect the systems your business uses.",
        icon: "Code2",
        ctaLabel: "Explore Software",
        includes: [
          "Business dashboards",
          "Management applications",
          "Customer portals",
          "Databases",
          "API integrations",
        ],
      },
      {
        id: "ai-automation",
        title: "AI, Automation & Intelligent Systems",
        shortLine: "Make everyday work smarter.",
        description:
          "We create AI-powered assistants and automated workflows that help process information, support customer interactions and reduce repetitive tasks.",
        icon: "Sparkles",
        ctaLabel: "Explore AI Solutions",
        includes: [
          "AI chatbots",
          "Generative AI applications",
          "AI agents",
          "Workflow automation",
          "Data intelligence",
        ],
      },
    ],
    businessNeedsBadge: "START WITH WHAT YOU NEED",
    businessNeedsTitle: "What Would You Like to Make Easier?",
    businessNeeds: [
      {
        title: "Get my business online",
        serviceTitle: "Website & Digital Presence",
        desc: "Build a modern website so customers can find and explore your business.",
      },
      {
        title: "Showcase or sell products",
        serviceTitle: "E-Commerce",
        desc: "Launch an online store or interactive product catalog for customers.",
      },
      {
        title: "Organize business operations",
        serviceTitle: "Custom Software",
        desc: "Build tailored management dashboards and systems that simplify workflow.",
      },
      {
        title: "Reduce repetitive tasks",
        serviceTitle: "Business Automation",
        desc: "Connect your applications and automate routine data entries and notifications.",
      },
      {
        title: "Add AI to my business",
        serviceTitle: "AI & Generative AI",
        desc: "Deploy smart customer assistants, document tools, and intelligent search.",
      },
      {
        title: "Understand business performance",
        serviceTitle: "Data Analytics",
        desc: "Turn business figures into clear, visual dashboards that support better decisions.",
      },
    ],
  },

  why_choose_us: {
    badge: "Why Cognirex Solutions",
    title: "Technology with Purpose. Solutions with Impact.",
    description:
      "We combine digital craftsmanship with pragmatic problem-solving to engineer solutions that help your business connect, operate and grow.",
    reasons: [
      {
        title: "Practical Innovation",
        description:
          "We apply modern web and AI technologies where they deliver tangible value, avoiding vanity complexity in favor of reliable business outcomes.",
        icon: "Lightbulb",
      },
      {
        title: "Engineering Excellence",
        description:
          "Our solutions are built upon clean architectures, responsive design, modular services, and dependable engineering standards.",
        icon: "Wrench",
      },
      {
        title: "Collaborative Approach",
        description:
          "We operate as clear, communicative partners, working directly with you to understand your goals and deliver the right digital experience.",
        icon: "Handshake",
      },
      {
        title: "Scalable Solutions",
        description:
          "Every website, application and workflow is engineered to scale with your customers, operations and future digital ambitions.",
        icon: "Layers",
      },
    ],
  },

  process: {
    badge: "OUR PROCESS",
    title: "A Clear Process. A Better Outcome.",
    description:
      "From understanding your vision to delivering a reliable digital solution, every stage is carefully planned, developed and validated to achieve meaningful results.",
    stages: [
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
    ],
  },

  industries: {
    badge: "BUILT AROUND THE WAY YOU WORK",
    title: "Digital Solutions for Different Industries.",
    description:
      "Every industry works differently. We adapt the experience and tools to the products, services and customers behind each business.",
    items: [
      {
        id: "retail",
        title: "Retail & E-Commerce",
        description:
          "Help customers discover your products, browse your catalog and connect with your brand online.",
        icon: "ShoppingBag",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
        keyOutcomes: [
          "Digital storefronts & product catalogs",
          "Online ordering & secure checkout",
          "Product management & customer enquiries",
        ],
      },
      {
        id: "manufacturing",
        title: "Manufacturing & Distribution",
        description:
          "Present your products, connect with buyers and organize business information in one connected experience.",
        icon: "Factory",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
        keyOutcomes: [
          "Product portals & quotation enquiries",
          "Distributor portals & inventory tools",
          "Operational dashboards & order tracking",
        ],
      },
      {
        id: "education",
        title: "Education & Training",
        description:
          "Make learning resources and educational services easier to access and manage.",
        icon: "GraduationCap",
        image:
          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
        keyOutcomes: [
          "Education websites & course catalogs",
          "Student learning portals & resource hubs",
          "Enrollment enquiries & administration tools",
        ],
      },
      {
        id: "healthcare",
        title: "Healthcare & Wellness",
        description:
          "Improve online access to services and simplify suitable non-clinical customer and administrative workflows.",
        icon: "Heart",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
        keyOutcomes: [
          "Clinic & wellness service websites",
          "Appointment enquiries & intake workflows",
          "Clear service information & patient portals",
        ],
      },
      {
        id: "hospitality",
        title: "Hospitality & Food Services",
        description:
          "Help customers discover your venue, explore your offering and connect with your team.",
        icon: "UtensilsCrossed",
        image:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        keyOutcomes: [
          "Interactive digital menus & item details",
          "Online ordering & pickup/delivery flows",
          "Table reservation enquiries & feedback tools",
        ],
      },
      {
        id: "professional-services",
        title: "Professional & Local Services",
        description:
          "Present your services clearly, receive enquiries and manage customer interactions.",
        icon: "Briefcase",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
        keyOutcomes: [
          "Modern service websites & case studies",
          "Client booking enquiries & contact workflows",
          "Secure client documentation portals",
        ],
      },
    ],
  },

  innovation: {
    exploreBadge: "EXPLORE WHAT’S POSSIBLE",
    exploreTitle: "Better Technology Starts with Better Questions.",
    exploreDescription:
      "We explore emerging tools and find practical ways to use them to improve digital experiences, business workflows and everyday work.",
    emergingTechs: [
      {
        name: "Artificial Intelligence",
        description:
          "Build AI applications that analyze information, identify patterns and support better business decisions.",
        icon: "Cpu",
      },
      {
        name: "Generative AI",
        description:
          "Create AI assistants and tools that help people ask questions, search documentation and draft information.",
        icon: "Sparkles",
      },
      {
        name: "Agentic AI",
        description:
          "Deploy multi-step AI agents that execute structured tasks with connected software and human oversight.",
        icon: "Bot",
      },
      {
        name: "Machine Learning",
        description:
          "Develop algorithmic models that learn from historical trends to forecast demand and classify information.",
        icon: "BrainCircuit",
      },
      {
        name: "Computer Vision",
        description:
          "Process and inspect images, visual documents, and video feeds with high consistency.",
        icon: "Eye",
      },
      {
        name: "Natural Language Processing",
        description:
          "Help systems understand customer intent, categorize feedback, and extract key details from documents.",
        icon: "MessageSquare",
      },
      {
        name: "Data Intelligence",
        description:
          "Organize fragmented company data into unified dashboards that give teams clear operational visibility.",
        icon: "Database",
      },
      {
        name: "Intelligent Automation",
        description:
          "Connect disconnected tools and automate repetitive tasks so everyday work moves forward faster.",
        icon: "Workflow",
      },
    ],
    integrityBadge: "INNOVATION WITH INTEGRITY",
    integrityTitle: "Build Smart. Build Responsibly.",
    integrityDescription:
      "Useful technology should respect people, information and the systems they depend on.",
    responsiblePillars: [
      {
        title: "Responsible AI",
        description:
          "Consider fairness, transparency and human oversight in every system we build.",
        icon: "ShieldCheck",
      },
      {
        title: "Privacy-Aware Development",
        description:
          "Handle information carefully and use appropriate safeguards to protect customer data.",
        icon: "Lock",
      },
      {
        title: "Security-Minded Engineering",
        description:
          "Consider security throughout design and development, never as an afterthought.",
        icon: "ShieldCheck",
      },
      {
        title: "Human-Centred Design",
        description:
          "Make technology clear, useful and accessible for the people who actually use it.",
        icon: "HeartHandshake",
      },
      {
        title: "Reliable Engineering",
        description:
          "Test, improve and maintain solutions with care so businesses can depend on them.",
        icon: "Wrench",
      },
    ],
  },

  contact_section: {
    homeBadge: "Let's Make Your Next Step Digital",
    homeTitle: "Let's Talk About Your Next Project.",
    homeDescription:
      "Tell us about your business goals, idea, or technology requirements. Our engineering team is ready to shape the right digital experience and intelligent solutions with you.",
    homeCtaLabel: "Let's Talk",
    trustBadge1: "Confidential & NDA Enforced",
    trustBadge2: "Direct Technical Response in 24h",
    portalBadge: "Let's Make Your Next Step Digital",
    portalTitle: "Let's Talk About Your Next Project.",
    portalDescription:
      "Whether you want to send your project requirements or schedule a one-on-one consultation call, connect directly with our engineering and solutions team.",
    portalCards: [
      {
        icon: "Globe",
        title: "Engineering Hub",
        description:
          "Operating from India, partnering with organizations nationwide and across global time zones.",
      },
      {
        icon: "Clock",
        title: "Consultation Hours",
        description:
          "Monday–Friday, 9:30 AM–6:30 PM IST. Online video meetings & scheduled appointments available.",
      },
      {
        icon: "Video",
        title: "Direct Technical Review",
        description:
          "Every enquiry and consultation request is reviewed directly by our engineering team with a reply within 24 hours.",
      },
    ],
    confidentialityTitle: "Confidentiality & Privacy Enforced",
    confidentialityText:
      "All project enquiries, architectures, and consultation notes shared through this page are kept strictly confidential under non-disclosure terms.",
  },

  careers: {
    badge: "CAREERS AT COGNIREX SOLUTIONS",
    title: "Bring Your Curiosity. Build What’s Next.",
    description:
      "We value people who enjoy learning, solving problems and creating useful technology. Explore opportunities to grow your skills and contribute to thoughtful digital experiences.",
    emptyBadge: "Open Positions & Talent Network",
    emptyTitle: "No open roles listed right now.",
    emptyDescription:
      "You can still introduce yourself and share your interests for future opportunities. We welcome passionate engineers, designers, and problem solvers.",
    formPrompt: "Submit your introduction using the form below",
    openings: [],
    footerCtaTitle: "Looking for Digital Solutions for Your Business Instead?",
    footerCtaDescription:
      "Discover how Cognirex helps businesses build modern websites, applications, and intelligent AI automation.",
  },
};
