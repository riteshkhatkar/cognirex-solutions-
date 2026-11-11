"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import { useCmsContent } from "@/context/CmsContentContext";
import { getLucideIcon } from "@/lib/iconMap";

export default function WhyChooseUs() {
  const { content } = useCmsContent();
  const data = content.why_choose_us;

  return (
    <section id="why-us" className="py-20 bg-white border-b border-[#E5E1ED] relative scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col mb-12 sm:mb-16 items-center text-center max-w-3xl mx-auto">
          <div className="mb-3.5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs tracking-wide bg-[#EEE8FA] text-[#7C3AED] font-medium border border-[#E5E1ED]">
              {data.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15] text-[#1F1B2E]">
            {data.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#6F6A7C]">
            {data.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.reasons.map((item, idx) => {
            const Icon = getLucideIcon(item.icon, Lightbulb);
            return (
              <div
                key={`${item.title}-${idx}`}
                className="p-7 rounded-2xl bg-[#F8F7FC] border border-[#E5E1ED] hover:border-[#7C3AED]/50 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E1ED] flex items-center justify-center text-[#7C3AED] mb-5 shadow-xs group-hover:scale-105 group-hover:border-[#7C3AED]/30 transition-transform">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1F1B2E] mb-2.5 leading-snug group-hover:text-[#7C3AED] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6F6A7C] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
