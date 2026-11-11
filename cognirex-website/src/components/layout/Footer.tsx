"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Linkedin,
  Twitter,
  Github,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { useCmsContent } from "@/context/CmsContentContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { content } = useCmsContent();
  const brand = content.site_brand;
  const solutions = content.solutions;
  const nameWords = (brand.name || siteConfig.name).trim().split(/\s+/);
  const brandFirst = nameWords[0] || "Cognirex";
  const brandRest = nameWords.slice(1).join(" ") || "Solutions";

  return (
    <footer className="bg-[#1F1B2E] text-white pt-16 pb-12 border-t border-[#312C45] relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#312C45]">
          {/* Brand & Mission Column (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/#hero" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 relative shrink-0 transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
                <Image
                  src="/images/logo_footer_transparent.png"
                  alt="Cognirex Solutions Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                {brandFirst} <span className="text-[#A78BFA] font-normal text-lg">{brandRest}</span>
              </span>
            </Link>

            <p className="text-sm text-gray-300 font-medium">
              {brand.tagline || siteConfig.tagline}
            </p>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              {brand.footerDescription}
            </p>

            {/* Social Profiles */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={brand.linkedinUrl || siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cognirex on LinkedIn"
                className="w-8 h-8 rounded-lg bg-[#2A253D] hover:bg-[#7C3AED] flex items-center justify-center text-gray-300 hover:text-white transition-colors text-xs"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={brand.twitterUrl || siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cognirex on X / Twitter"
                className="w-8 h-8 rounded-lg bg-[#2A253D] hover:bg-[#7C3AED] flex items-center justify-center text-gray-300 hover:text-white transition-colors text-xs"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={brand.githubUrl || siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cognirex on GitHub"
                className="w-8 h-8 rounded-lg bg-[#2A253D] hover:bg-[#7C3AED] flex items-center justify-center text-gray-300 hover:text-white transition-colors text-xs"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>

            {/* Careers Portal Link Button */}
            <div className="pt-2">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2A253D] hover:bg-[#7C3AED] text-[#C4B5FD] hover:text-white transition-colors text-xs font-semibold border border-[#3D3558]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>Explore Careers Portal &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Headquarters: Office & Communication Column (Col 5-8) - Text Format */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-semibold text-gray-200 tracking-wider uppercase">
              Headquarters &amp; Office
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Operating from India, partnering with organizations across time zones.
            </p>
            <ul className="space-y-2.5 text-sm text-gray-400 pt-1">
              <li className="flex items-start gap-2">
                <span className="text-[#C4B5FD] font-semibold min-w-[145px]">Engineering Hub:</span>
                <span className="text-gray-200">{brand.locationLabel || "India (Nationwide & Global clients)"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C4B5FD] font-semibold min-w-[145px]">Enquiries &amp; Projects:</span>
                <Link
                  href="/contact"
                  className="text-gray-200 hover:text-[#C4B5FD] underline text-left transition-colors"
                >
                  Direct Project Form (Direct inbox monitoring)
                </Link>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C4B5FD] font-semibold min-w-[145px]">Direct Consultation:</span>
                <Link
                  href="/contact?tab=meeting"
                  className="text-gray-200 hover:text-[#C4B5FD] underline text-left transition-colors"
                >
                  By Appointment &amp; Online Scheduling
                </Link>
              </li>
            </ul>
          </div>

          {/* Capabilities Column (Col 9-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-gray-200 tracking-wider uppercase">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {solutions.primaryServices.map((srv) => (
                <li key={srv.id}>
                  <Link href="/#solutions" className="hover:text-white transition-colors">
                    {srv.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {currentYear} {brand.name || siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-200 transition-colors">
              Terms &amp; Conditions
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/#hero"
              className="inline-flex items-center gap-1 text-[#A78BFA] hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
