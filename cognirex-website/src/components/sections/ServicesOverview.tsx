"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Globe, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCmsContent } from "@/context/CmsContentContext";
import { getLucideIcon } from "@/lib/iconMap";

export default function ServicesOverview() {
  const router = useRouter();
  const { content } = useCmsContent();
  const solutions = content.solutions;

  const goToContact = (serviceTitle?: string) => {
    const url = serviceTitle
      ? `/contact?service=${encodeURIComponent(serviceTitle)}`
      : "/contact";
    router.push(url);
  };

  return (
    <section
      id="solutions"
      className="py-20 md:py-28 bg-white border-y border-[#E5E1ED] relative overflow-hidden scroll-mt-20"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          badge={solutions.badge}
          title={solutions.title}
          description={solutions.description}
        />

        {/* Primary Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {solutions.primaryServices.map((card) => {
            const Icon = getLucideIcon(card.icon, Globe);
            return (
              <div
                key={card.id}
                className="group relative bg-[#F8F7FC] border border-[#E5E1ED] hover:border-[#7C3AED]/50 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-subtle hover:shadow-card-hover"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] mb-5 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#7C3AED] group-hover:text-white shadow-xs">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>

                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7C3AED] mb-2 block">
                    {card.shortLine}
                  </span>

                  <h3 className="font-heading font-bold text-lg text-[#1F1B2E] mb-2.5 leading-snug group-hover:text-[#7C3AED] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#6F6A7C] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E5E1ED]">
                  <button
                    type="button"
                    onClick={() => goToContact(card.title)}
                    className="inline-flex items-center text-xs font-semibold text-[#1F1B2E] group-hover:text-[#7C3AED] transition-colors pt-2 cursor-pointer"
                  >
                    {card.ctaLabel}
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Solutions by Business Need */}
        <div className="p-7 sm:p-10 rounded-3xl bg-[#F8F7FC] border border-[#E5E1ED]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EEE8FA] px-3 py-1 rounded-full mb-2 inline-block">
              {solutions.businessNeedsBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1F1B2E]">
              {solutions.businessNeedsTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {solutions.businessNeeds.map((item, idx) => (
              <button
                key={`${item.title}-${idx}`}
                type="button"
                onClick={() => goToContact(item.serviceTitle)}
                className="p-5 rounded-2xl bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/50 hover:-translate-y-1 text-left transition-all duration-300 hover:shadow-card-hover cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[#7C3AED] uppercase">
                    {item.serviceTitle}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-heading font-bold text-base text-[#1F1B2E] mb-1 group-hover:text-[#7C3AED] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#6F6A7C] leading-relaxed">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
