"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Cpu, ShieldCheck } from "lucide-react";
import { useCmsContent } from "@/context/CmsContentContext";
import { getLucideIcon } from "@/lib/iconMap";

export default function InnovationSection() {
  const { content } = useCmsContent();
  const data = content.innovation;

  return (
    <section id="innovation" className="py-20 md:py-28 bg-[#F8F7FC] relative overflow-hidden scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          badge={data.exploreBadge}
          title={data.exploreTitle}
          description={data.exploreDescription}
        />

        {/* Emerging Technologies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {data.emergingTechs.map((tech, idx) => {
            const Icon = getLucideIcon(tech.icon, Cpu);
            return (
              <div
                key={`${tech.name}-${idx}`}
                className="p-6 rounded-2xl bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/40 hover:-translate-y-1 transition-all duration-200 shadow-subtle group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EEE8FA] flex items-center justify-center text-[#7C3AED] mb-4 group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <h4 className="font-heading font-bold text-lg text-[#1F1B2E] mb-2 group-hover:text-[#7C3AED] transition-colors">
                  {tech.name}
                </h4>
                <p className="text-xs sm:text-sm text-[#6F6A7C] leading-relaxed">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Responsible Technology Pillars */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EEE8FA] px-3 py-1 rounded-full mb-3 inline-block">
              {data.integrityBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1F1B2E]">
              {data.integrityTitle}
            </h3>
            <p className="text-sm text-[#6F6A7C] mt-2">
              {data.integrityDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.responsiblePillars.map((pillar, idx) => {
              const Icon = getLucideIcon(pillar.icon, ShieldCheck);
              return (
                <div
                  key={`${pillar.title}-${idx}`}
                  className="p-7 rounded-2xl bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/30 transition-all shadow-subtle flex flex-col items-start"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#EEE8FA] flex items-center justify-center text-[#7C3AED] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-[#1F1B2E] mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-sm text-[#6F6A7C] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
