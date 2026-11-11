"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Can you bring my existing business online?",
    answer:
      "Yes. We can create a professional website, showcase your services or products and add ways for customers to contact you.",
  },
  {
    question: "Can you build a website around my brand?",
    answer:
      "Yes. We shape the design, content and features around your business and requirements.",
  },
  {
    question: "Can customers enquire or order through my website?",
    answer:
      "We can add enquiry forms, product catalogs, ordering features and suitable integrations based on project scope.",
  },
  {
    question: "Can you build an e-commerce website?",
    answer:
      "Yes. Online stores can include product listings, cart features, payment integrations and order workflows.",
  },
  {
    question: "Can you add AI to an existing website or application?",
    answer:
      "We can assess the application and recommend suitable AI features such as assistants, search or workflow support.",
  },
  {
    question: "How much will my project cost?",
    answer:
      "Cost depends on the features, integrations and complexity. Share your requirements for a project-specific discussion.",
  },
  {
    question: "Can I start with a basic solution and expand later?",
    answer:
      "Yes. We can plan the first stage around current needs and consider future expansion.",
  },
  {
    question: "Do you provide post-launch support?",
    answer:
      "Support, maintenance and improvements can be agreed as part of the project scope.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-26 bg-white border-b border-[#E5E1ED]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEE8FA] text-xs font-semibold text-[#7C3AED] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F1B2E] tracking-tight leading-[1.15] mb-4 font-heading">
            Clear Answers to Common Questions.
          </h2>

          <p className="text-sm sm:text-base text-[#6F6A7C] leading-relaxed">
            Everything you need to know about starting a project with Cognirex Solutions.
          </p>
        </div>

        {/* Compact Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#F8F7FC] border-[#7C3AED]/40 shadow-xs"
                    : "bg-white border-[#E5E1ED] hover:border-[#7C3AED]/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-[#1F1B2E]">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-[#7C3AED] text-white rotate-180"
                        : "bg-[#EEE8FA] text-[#7C3AED]"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#6F6A7C] leading-relaxed border-t border-[#E5E1ED]/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
