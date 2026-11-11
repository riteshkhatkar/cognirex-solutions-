export const siteConfig = {
  name: "Cognirex Solutions",
  shortName: "Cognirex",
  tagline: "Intelligence Engineered. Innovation Delivered.",
  mainPositioning: "We turn your business into a digital experience.",
  description:
    "Build a stronger online presence, connect with more customers and work smarter with modern websites, software, AI and automation.",
  url: "https://cognirex-solutions-eta.vercel.app",
  ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",

  // Demo flags removed for production readiness
  isDemoData: false,

  // Contact Information — unverified placeholder details removed; communication handled via enquiry form
  contact: {
    email: "",
    phone: "",
    location: "India",
    addressLine: "",
    officeHours: "Monday–Friday, 9:30 AM–6:30 PM IST",
  },

  // Social Links
  social: {
    linkedin: "https://www.linkedin.com/company/cognirex-solutions",
    twitter: "https://x.com/cognirex",
    github: "https://github.com/cognirex-solutions",
  },

  // Single-page navigation items & integrated portal pages
  navItems: [
    { title: "Home", href: "/#hero" },
    { title: "About", href: "/#about" },
    { title: "Solutions", href: "/#solutions" },
    { title: "Projects", href: "/#projects" },
    { title: "Careers", href: "/careers" },
    { title: "Get in Touch", href: "/contact", isCta: true },
  ],

  // Footer links
  footerLinks: {
    company: [
      { title: "About Us", href: "/#about" },
      { title: "Our Process", href: "/#approach" },
      { title: "Featured Projects", href: "/#projects" },
      { title: "Industries", href: "/#industries" },
      { title: "Careers", href: "/careers", isExternal: true },
    ],
    solutions: [
      { title: "Digital Presence", href: "#solutions" },
      { title: "E-Commerce", href: "#solutions" },
      { title: "Custom Software", href: "#solutions" },
      { title: "AI & Machine Learning", href: "#solutions" },
      { title: "Generative AI", href: "#solutions" },
      { title: "Intelligent Automation", href: "#solutions" },
      { title: "Data & Analytics", href: "#solutions" },
    ],
    legal: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms and Conditions", href: "/terms" },
    ],
  },

  copyright: `© ${new Date().getFullYear()} Cognirex Solutions. All rights reserved.`,
};
