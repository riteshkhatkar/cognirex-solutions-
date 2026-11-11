"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useCmsContent } from "@/context/CmsContentContext";
import { getLucideIcon } from "@/lib/iconMap";

export default function CapabilityStrip() {
  const { content } = useCmsContent();
  const capabilities = content.hero.capabilityStrip || [];
  const marqueeItems =
    capabilities.length > 0
      ? [...capabilities, ...capabilities, ...capabilities, ...capabilities]
      : [];

  if (marqueeItems.length === 0) return null;

  return (
    <div id="capability-strip" className="bg-white border-b border-[#E5E1ED] py-5 sm:py-6 overflow-hidden relative group scroll-mt-24">
      {/* Subtle edge fades for modern aesthetic */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex animate-marquee hover:[animation-play-state:paused] items-center gap-6">
        {marqueeItems.map((item, idx) => {
          const Icon = getLucideIcon(item.icon, Globe);
          return (
            <div
              key={`${item.title}-${idx}`}
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] hover:border-[#7C3AED]/40 hover:bg-white transition-all shrink-0 cursor-default shadow-xs"
            >
              <div className="w-10 h-10 rounded-lg bg-[#EEE8FA] border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Icon className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#1F1B2E] whitespace-nowrap">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#6F6A7C] whitespace-nowrap">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
