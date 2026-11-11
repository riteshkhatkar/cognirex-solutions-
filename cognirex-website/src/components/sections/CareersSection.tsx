"use client";

import React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import CareerApplicationForm from "@/components/forms/CareerApplicationForm";
import { Sparkles, MessageCircle, ArrowRight, Briefcase, MapPin } from "lucide-react";
import { useCmsContent } from "@/context/CmsContentContext";

export default function CareersSection() {
  const { content } = useCmsContent();
  const careers = content.careers;

  return (
    <section id="careers" className="py-16 md:py-24 bg-[#F8F7FC] relative overflow-hidden scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeading
          badge={careers.badge}
          title={careers.title}
          description={careers.description}
        />

        {/* Open Positions Grid or Talent Network Invitation */}
        <div className="mb-14">
          {careers.openings && careers.openings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[960px] mx-auto">
              {careers.openings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#E5E1ED] hover:border-[#7C3AED]/40 rounded-2xl p-6 shadow-subtle flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EEE8FA] px-2.5 py-1 rounded-full">
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </span>
                      <span className="text-xs font-semibold text-[#6F6A7C] bg-[#F8F7FC] border border-[#E5E1ED] px-2.5 py-1 rounded-lg">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#1F1B2E] mb-1.5">
                      {job.title}
                    </h3>
                    <p className="text-xs text-[#6F6A7C] flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                      {job.location}
                    </p>
                    <p className="text-sm text-[#6F6A7C] leading-relaxed mb-4">
                      {job.description}
                    </p>
                    {job.requirements?.length > 0 && (
                      <ul className="space-y-1 mb-5 text-xs text-[#1F1B2E]">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <a
                    href="#career-form"
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <span>Apply for This Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E5E1ED] rounded-3xl p-8 sm:p-10 shadow-subtle text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#EEE8FA] flex items-center justify-center text-[#7C3AED] mx-auto mb-4">
                <Sparkles className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] bg-[#EEE8FA] px-3 py-1 rounded-full mb-3 inline-block">
                {careers.emptyBadge}
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1F1B2E] mb-3">
                {careers.emptyTitle}
              </h3>
              <p className="text-sm text-[#6F6A7C] leading-relaxed mb-6">
                {careers.emptyDescription}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C3AED] bg-[#EEE8FA]/60 px-4 py-2 rounded-xl">
                <MessageCircle className="w-4 h-4" />
                <span>{careers.formPrompt}</span>
              </div>
            </div>
          )}
        </div>

        {/* Embedded General Application Form */}
        <div id="career-form" className="max-w-[900px] mx-auto scroll-mt-24 mb-16">
          <CareerApplicationForm />
        </div>

        {/* Quick Transition to Other Sections */}
        <div className="max-w-2xl mx-auto bg-white border border-[#E5E1ED] rounded-2xl p-6 sm:p-8 text-center shadow-subtle">
          <h4 className="font-heading font-bold text-lg text-[#1F1B2E] mb-2">
            {careers.footerCtaTitle}
          </h4>
          <p className="text-sm text-[#6F6A7C] mb-5">
            {careers.footerCtaDescription}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#solutions"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C3AED] bg-[#EEE8FA] hover:bg-[#7C3AED] hover:text-white px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>Explore Solutions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F1B2E] hover:text-[#7C3AED] px-4 py-2.5 rounded-xl transition-colors border border-[#E5E1ED]"
            >
              <span>Talk to Our Team</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
