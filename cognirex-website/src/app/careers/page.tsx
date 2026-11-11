import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import CareersSection from "@/components/sections/CareersSection";

export const metadata: Metadata = {
  title: "Careers & Culture — Cognirex Solutions",
  description:
    "Explore career opportunities, engineering culture, and expressions of interest at Cognirex Solutions. Join our multidisciplinary team building modern websites, applications, and intelligent systems.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at Cognirex Solutions — Build What’s Next in AI & Software",
    description:
      "Join our multidisciplinary team building modern websites, applications, and intelligent systems. Explore open opportunities.",
    url: "https://cognirexsolutions.com/careers",
  },
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      {/* Subpage Breadcrumb Navigation */}
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
                Careers Portal
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Careers Portal Content */}
      <CareersSection />
    </div>
  );
}
