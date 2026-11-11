import React from "react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data handling guidelines for Cognirex Solutions.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F8F7FC] py-16 md:py-24">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        <Badge variant="lavender" className="mb-4">
          Corporate Governance
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B2E] mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#6F6A7C] font-mono mb-8">
          Effective Date: January 1, 2026 | Cognirex Solutions
        </p>

        <div className="bg-white border border-[#E5E1ED] rounded-3xl p-8 sm:p-12 shadow-subtle space-y-8 text-sm sm:text-base text-[#1F1B2E] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              1. Information Collection & Purpose
            </h2>
            <p className="text-[#6F6A7C]">
              Cognirex Solutions collects information that you provide directly through our contact enquiries, career application submissions, and technology consultation requests. This data may include full names, business affiliations, email addresses, phone numbers, project descriptions, and uploaded resume files.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              2. Data Protection & Security Controls
            </h2>
            <p className="text-[#6F6A7C]">
              All communication records and uploaded documents are encrypted in transit using industry-standard protocols. We do not sell, rent, or lease personal identifiers or project disclosures to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              3. Data Retention & Usage
            </h2>
            <p className="text-[#6F6A7C]">
              Information submitted via our project enquiry forms is retained strictly to communicate about project scope, deliverables, and service requirements. Career applications are maintained securely for evaluation against upcoming opportunities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              4. Contact for Privacy Inquiries
            </h2>
            <p className="text-[#6F6A7C]">
              If you have inquiries regarding how your data is handled or wish to request data updates or deletion, reach out through our{" "}
              <Link href="/#contact" className="text-[#7C3AED] underline hover:text-[#5B21B6]">
                project enquiry form
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
