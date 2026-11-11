"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Globe,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import ContactEnquiryForm from "@/components/forms/ContactEnquiryForm";
import MeetingRequestForm from "@/components/forms/MeetingRequestForm";
import { useCmsContent } from "@/context/CmsContentContext";
import { getLucideIcon } from "@/lib/iconMap";

export default function ContactPortal() {
  const searchParams = useSearchParams();
  const { content } = useCmsContent();
  const c = content.contact_section;
  const initialTabParam = searchParams.get("tab") === "meeting" ? "meeting" : "enquiry";
  const initialService = searchParams.get("service") || "";

  const [activeTab, setActiveTab] = useState<"enquiry" | "meeting">(initialTabParam);

  useEffect(() => {
    setActiveTab(searchParams.get("tab") === "meeting" ? "meeting" : "enquiry");
  }, [searchParams]);

  return (
    <section className="py-14 sm:py-20 bg-[#F8F7FC] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EEE8FA] text-[#7C3AED] border border-[#7C3AED]/20 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{c.portalBadge}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B2E] tracking-tight leading-[1.15] mb-4 font-heading">
            {c.portalTitle}
          </h1>

          <p className="text-base sm:text-lg text-[#6F6A7C] leading-relaxed">
            {c.portalDescription}
          </p>
        </div>

        {/* How to Contact & Consultation Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {c.portalCards.map((card, idx) => {
            const Icon = getLucideIcon(card.icon, Globe);
            return (
              <div
                key={`${card.title}-${idx}`}
                className="bg-white border border-[#E5E1ED] rounded-2xl p-6 shadow-subtle flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EEE8FA] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-sm text-[#1F1B2E] mb-1">
                    {card.title}
                  </h2>
                  <p className="text-xs text-[#6F6A7C] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-Page Interactive Enquiry / Consultation Switcher */}
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center p-1.5 rounded-2xl bg-white border border-[#E5E1ED] mb-6 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("enquiry")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "enquiry"
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "text-[#6F6A7C] hover:text-[#1F1B2E]"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Project Enquiry</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("meeting")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "meeting"
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "text-[#6F6A7C] hover:text-[#1F1B2E]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Consultation</span>
            </button>
          </div>

          {/* Active Form Panel */}
          {activeTab === "enquiry" ? (
            <ContactEnquiryForm key={initialService} initialService={initialService} />
          ) : (
            <MeetingRequestForm />
          )}

          {/* Confidentiality & Privacy Assurance */}
          <div className="mt-8 p-5 rounded-2xl bg-white border border-[#E5E1ED] shadow-subtle flex items-start sm:items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#EEE8FA] flex items-center justify-center text-[#7C3AED] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1F1B2E] uppercase tracking-wide">
                {c.confidentialityTitle}
              </h3>
              <p className="text-xs text-[#6F6A7C] leading-relaxed mt-0.5">
                {c.confidentialityText}
              </p>
            </div>
          </div>

          {/* Quick Return Navigation Card */}
          <div className="mt-10 bg-white border border-[#E5E1ED] rounded-2xl p-6 sm:p-8 text-center shadow-subtle">
            <h3 className="font-heading font-bold text-lg text-[#1F1B2E] mb-2">
              Want to Explore Our Capabilities &amp; Process First?
            </h3>
            <p className="text-sm text-[#6F6A7C] mb-5">
              Review how Cognirex designs, builds, tests, and launches digital solutions for growing businesses.
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
                href="/#approach"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#1F1B2E] hover:text-[#7C3AED] px-4 py-2.5 rounded-xl transition-colors border border-[#E5E1ED]"
              >
                <span>See Our Process</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
