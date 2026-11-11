import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import ContactPortal from "@/components/sections/ContactPortal";

export const metadata: Metadata = {
  title: "Let's Talk — Cognirex Solutions",
  description:
    "Start a conversation with Cognirex Solutions. Submit a project enquiry or schedule a consultation with our engineering team.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Let's Talk — Schedule a Consultation with Cognirex Solutions",
    description:
      "Start a conversation with Cognirex Solutions. Submit a project enquiry or schedule a consultation with our engineering team.",
    url: "https://cognirexsolutions.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#E5E1ED]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-[#6F6A7C]">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 hover:text-[#7C3AED] transition-colors font-medium"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="w-3.5 h-3.5 text-[#A78BFA]" />
              </li>
              <li className="text-[#7C3AED] font-semibold" aria-current="page">
                Let&apos;s Talk
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contact & Consultation Portal */}
      <Suspense fallback={<div className="py-24 text-center text-sm text-[#6F6A7C]">Loading contact portal...</div>}>
        <ContactPortal />
      </Suspense>
    </div>
  );
}
