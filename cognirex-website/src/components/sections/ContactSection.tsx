"use client";

import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCmsContent } from "@/context/CmsContentContext";

export default function ContactSection() {
  const { content } = useCmsContent();
  const c = content.contact_section;

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#F8F7FC] border-t border-[#E5E1ED] relative overflow-hidden scroll-mt-20">
      {/* Decorative ambient background */}
      <div
        className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-[#EEE8FA]/70 -z-0 pointer-events-none blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 w-72 h-72 rounded-full border border-[#7C3AED]/15 -z-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Eyebrow badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEE8FA] text-[#7C3AED] border border-[#7C3AED]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{c.homeBadge}</span>
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B2E] tracking-tight leading-[1.15] mb-4 font-heading max-w-3xl mx-auto">
          {c.homeTitle}
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#6F6A7C] leading-relaxed max-w-2xl mx-auto mb-10">
          {c.homeDescription}
        </p>

        {/* Single Primary Action Button */}
        <div className="flex justify-center mb-10">
          <Button
            href="/contact"
            variant="yellow"
            size="lg"
            icon
            className="shadow-md hover:shadow-lg transition-all cursor-pointer text-base px-8 py-3.5"
          >
            {c.homeCtaLabel}
          </Button>
        </div>

        {/* Trust & Reassurance Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#6F6A7C] pt-4 border-t border-[#E5E1ED] max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
            <span>{c.trustBadge1}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span>{c.trustBadge2}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
