export const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://cognirex-solutions-eta.vercel.app/#organization",
      "name": "Cognirex Solutions",
      "alternateName": ["Cognirex", "Cognirex Solutions Pvt Ltd"],
      "url": "https://cognirex-solutions-eta.vercel.app",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://cognirex-solutions-eta.vercel.app/#logo",
        "url": "https://cognirex-solutions-eta.vercel.app/images/logo_main.png",
        "contentUrl": "https://cognirex-solutions-eta.vercel.app/images/logo_main.png",
        "caption": "Cognirex Solutions Logo",
        "width": 735,
        "height": 660,
      },
      "image": "https://cognirex-solutions-eta.vercel.app/images/logo_main.png",
      "description": "Cognirex Solutions is a premium technology consultancy engineering modern web applications, scalable cloud software, AI workflows, and intelligent business automation.",
      "email": "contact@cognirexsolutions.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.6139,
        "longitude": 77.209,
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "India",
        },
        {
          "@type": "Country",
          "name": "Global",
        },
      ],
      "sameAs": [
        "https://www.linkedin.com/company/cognirex-solutions",
        "https://x.com/cognirex",
        "https://github.com/cognirex-solutions",
      ],
      "knowsAbout": [
        "Web Application Development",
        "Artificial Intelligence Solutions",
        "Agentic AI & LLMs",
        "Machine Learning",
        "Intelligent Process Automation",
        "Cloud Architecture",
        "E-Commerce Engineering",
        "Enterprise Software Solutions",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Technology Consulting Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Digital Presence & Web Platforms",
              "description": "High-performance websites, portals, and e-commerce platforms engineered with modern frameworks.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Custom Software & Enterprise Architecture",
              "description": "Robust backend systems, microservices, cloud applications, and API platforms built to scale.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "AI & Autonomous Automation",
              "description": "Production-grade AI assistants, workflow automation, and custom machine learning pipelines.",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://cognirex-solutions-eta.vercel.app/#website",
      "url": "https://cognirex-solutions-eta.vercel.app",
      "name": "Cognirex Solutions",
      "description": "Intelligence Engineered. Innovation Delivered.",
      "publisher": {
        "@id": "https://cognirex-solutions-eta.vercel.app/#organization",
      },
      "inLanguage": "en-US",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://cognirex-solutions-eta.vercel.app/#localbusiness",
      "name": "Cognirex Solutions",
      "url": "https://cognirex-solutions-eta.vercel.app",
      "logo": "https://cognirex-solutions-eta.vercel.app/images/logo_main.png",
      "image": "https://cognirex-solutions-eta.vercel.app/images/logo_main.png",
      "priceRange": "$$",
      "currenciesAccepted": "INR, USD, EUR",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.6139,
        "longitude": 77.209,
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:30",
          "closes": "18:30",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://cognirex-solutions-eta.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What services does Cognirex Solutions offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cognirex Solutions specializes in custom web application development, cloud software engineering, enterprise AI integration, intelligent workflow automation, and digital presence transformation.",
          },
        },
        {
          "@type": "Question",
          "name": "Can Cognirex Solutions integrate AI into existing business software?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we engineer custom AI solutions, automated customer workflows, intelligent search pipelines, and agentic LLM assistants that integrate into existing software architectures.",
          },
        },
        {
          "@type": "Question",
          "name": "Where is Cognirex Solutions based and do you serve international clients?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cognirex Solutions is based in India and serves businesses globally across North America, Europe, the Middle East, and Asia.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Cognirex Solutions approach software engineering projects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We follow a 5-stage engineering lifecycle: Discovery & Requirements, Architectural Design, Agile Development & Testing, Production Deployment, and Continuous Maintenance & Evolution.",
          },
        },
      ],
    },
  ],
};

