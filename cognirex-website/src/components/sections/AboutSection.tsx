"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import WebOfConnections from "@/components/ui/WebOfConnections";
import { useCmsContent } from "@/context/CmsContentContext";
import { getLucideIcon } from "@/lib/iconMap";
import {
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AboutSection() {
  const { content } = useCmsContent();
  const about = content.about;

  return (
    <section id="about" className="py-20 md:py-28 bg-white border-t border-[#E5E1ED] relative overflow-hidden scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Top Two-Column Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">
          {/* Left Column: Visual Collaboration with Geometric Purple & Yellow Accents */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-[480px]">
              {/* Purple rounded accent backdrop */}
              <div
                className="absolute -top-4 -left-4 w-40 h-40 rounded-2xl bg-[#EEE8FA] -z-10"
                aria-hidden="true"
              />

              {/* Bold purple corner accent */}
              <div
                className="absolute -bottom-6 -right-6 w-36 h-36 rounded-2xl bg-[#7C3AED] -z-10 opacity-90 shadow-sm"
                aria-hidden="true"
              />

              {/* Yellow semicircle geometric element */}
              <div
                className="absolute -top-3 right-10 w-12 h-6 rounded-t-full bg-[#FACC15] z-20"
                aria-hidden="true"
              />

              {/* Thin decorative circular line */}
              <div
                className="absolute bottom-10 -left-8 w-24 h-24 rounded-full border border-[#7C3AED]/30 -z-10"
                aria-hidden="true"
              />

              {/* Image Frame with Authentic Collaborative Strategy Photo with padding & double border */}
              <div className="relative rounded-2xl border-2 border-[#E5E1ED] shadow-card bg-white z-10 aspect-[4/3.2] p-2.5">
                <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#E5E1ED]">
                  <Image
                    src={about.aboutImage || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"}
                    alt={about.aboutImageAlt || "Cognirex Solutions - Professional Collaborative Strategy Session"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                  />
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-4 left-6 z-20 bg-white border border-[#E5E1ED] rounded-xl px-4 py-3 shadow-card flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#EEE8FA] flex items-center justify-center text-[#7C3AED]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F1B2E]">{about.floatingBadgeTitle}</p>
                  <p className="text-[11px] text-[#6F6A7C]">{about.floatingBadgeSubtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Information */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="mb-3">
              <Badge variant="lavender">{about.badge}</Badge>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1B2E] tracking-tight leading-[1.15] mb-5 font-heading">
              {about.headingLine1} <br />
              <span className="text-[#7C3AED]">{about.headingHighlight}</span>
            </h2>

            <p className="text-base text-[#6F6A7C] leading-relaxed mb-6">
              {about.storyText}
            </p>

            {/* Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {about.highlights.map((item, idx) => {
                const HighlightIcon = getLucideIcon(item.icon, Sparkles);
                return (
                  <div
                    key={`${item.title}-${idx}`}
                    className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] flex flex-col items-start shadow-xs hover:border-[#7C3AED]/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#EEE8FA] flex items-center justify-center text-[#7C3AED] mb-2.5">
                      <HighlightIcon className="w-4 h-4" />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-[#1F1B2E] mb-1">{item.title}</h3>
                    <p className="text-xs text-[#6F6A7C] leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <div className="bg-[#F8F7FC] border border-[#E5E1ED] rounded-3xl p-8 sm:p-10 shadow-subtle relative overflow-hidden flex flex-col justify-between">
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-[#EEE8FA] rounded-bl-full -z-0 opacity-60"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EEE8FA] px-3 py-1 rounded-full mb-4 inline-block">
                {about.missionBadge}
              </span>
              <h3 className="text-2xl font-bold text-[#1F1B2E] mb-3 leading-snug font-heading">
                {about.missionTitle}
              </h3>
              <p className="text-sm sm:text-base text-[#6F6A7C] leading-relaxed italic border-l-2 border-[#7C3AED] pl-4 my-4">
                {about.missionQuote}
              </p>
              <p className="text-xs sm:text-sm text-[#6F6A7C] leading-relaxed">
                {about.missionSubtext}
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-[#F8F7FC] border border-[#E5E1ED] rounded-3xl p-8 sm:p-10 shadow-subtle relative overflow-hidden flex flex-col justify-between">
            <div
              className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/20 rounded-bl-full -z-0"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1F1B2E] bg-[#FACC15]/30 px-3 py-1 rounded-full mb-4 inline-block">
                {about.visionBadge}
              </span>
              <h3 className="text-2xl font-bold text-[#1F1B2E] mb-3 leading-snug font-heading">
                {about.visionTitle}
              </h3>
              <p className="text-sm sm:text-base text-[#6F6A7C] leading-relaxed italic border-l-2 border-[#FACC15] pl-4 my-4">
                {about.visionQuote}
              </p>
              <p className="text-xs sm:text-sm text-[#6F6A7C] leading-relaxed">
                {about.visionSubtext}
              </p>
            </div>
          </div>
        </div>

        {/* Client-Centric Innovation Callout with Dual Animated Web of Connections */}
        <div className="rounded-3xl bg-[#1F1B2E] text-white p-8 sm:p-14 text-center shadow-subtle border border-[#37314A] relative overflow-hidden">
          <WebOfConnections side="left" className="w-1/2 md:w-5/12 z-0" />
          <WebOfConnections side="right" className="w-1/2 md:w-5/12 z-0" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4B5FD] mb-3 block">
              {about.calloutEyebrow}
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug font-heading text-white !text-white mb-4">
              {about.calloutQuote}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-[#E2DCF0] leading-relaxed font-normal max-w-2xl mx-auto">
              {about.calloutDescription}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}