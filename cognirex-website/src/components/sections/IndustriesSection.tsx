"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Check } from "lucide-react";
import { useCmsContent } from "@/context/CmsContentContext";

export default function IndustriesSection() {
  const { content } = useCmsContent();
  const industries = content.industries;

  return (
    <section id="industries" className="py-20 md:py-24 bg-white border-y border-[#E5E1ED] relative scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          badge={industries.badge}
          title={industries.title}
          description={industries.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {industries.items.map((ind) => (
            <div
              key={ind.id}
              className="bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/40 rounded-2xl overflow-hidden shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Card Photo Preview with padding & rounded inner border */}
              <div className="p-2.5 bg-white">
                <div className="relative h-40 w-full bg-[#EEE8FA] overflow-hidden rounded-xl border border-[#E5E1ED]">
                  <Image
                    src={ind.image || "/images/product-design-ux.jpg"}
                    alt={`${ind.title} digital solutions`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="absolute inset-0 bg-[#1F1B2E]/20 transition-opacity group-hover:bg-[#1F1B2E]/10" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-xl text-[#1F1B2E] mb-2 group-hover:text-[#7C3AED] transition-colors">
                    {ind.title}
                  </h3>
                  <p className="text-sm text-[#6F6A7C] leading-relaxed mb-4">
                    {ind.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EDF7] space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED] block mb-2">
                    Key Solutions
                  </span>
                  {ind.keyOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#1F1B2E]">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#EEE8FA] text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
