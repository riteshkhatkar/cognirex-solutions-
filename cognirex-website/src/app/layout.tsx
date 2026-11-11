import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { jsonLdOrganization } from "@/config/structuredData";
import { CmsContentProvider } from "@/context/CmsContentContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Cognirex Solutions",
    "Cognirex",
    "AI Consulting India",
    "Enterprise AI Solutions",
    "Digital Experience Agency",
    "Web Application Development",
    "Custom Software Engineering",
    "Intelligent Automation",
    "Generative AI Solutions",
    "Machine Learning Engineers",
    "Cloud Software Architecture",
    "E-Commerce Solutions",
    "Full-Stack Development",
    "Autonomous Agents",
    "Next.js Development Agency",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/logo_main.png",
        width: 735,
        height: 660,
        alt: `${siteConfig.name} — Intelligence Engineered`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: "@cognirex",
    images: ["/images/logo_main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "55aG1ui2FhHrXCuPinwuWp2BT-xoHUTi_VoQAw4LSRI",
  },
  other: {
    "google-site-verification": "55aG1ui2FhHrXCuPinwuWp2BT-xoHUTi_VoQAw4LSRI",
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "28.6139;77.2090",
    "ICBM": "28.6139, 77.2090",
    "theme-color": "#7C3AED",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#F8F7FC] text-[#1F1B2E] antialiased"
        suppressHydrationWarning
      >
        <CmsContentProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CmsContentProvider>
      </body>
    </html>
  );
}

