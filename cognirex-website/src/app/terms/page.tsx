import React from "react";
import { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions of service for Cognirex Solutions.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#F8F7FC] py-16 md:py-24">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6">
        <Badge variant="lavender" className="mb-4">
          Corporate Governance
        </Badge>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1B2E] mb-6">
          Terms and Conditions
        </h1>
        <p className="text-xs text-[#6F6A7C] font-mono mb-8">
          Effective Date: January 1, 2026 | Cognirex Solutions
        </p>

        <div className="bg-white border border-[#E5E1ED] rounded-3xl p-8 sm:p-12 shadow-subtle space-y-8 text-sm sm:text-base text-[#1F1B2E] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              1. Acceptance of Terms
            </h2>
            <p className="text-[#6F6A7C]">
              By accessing and using the Cognirex Solutions digital web portal, you agree to comply with and be bound by these Terms and Conditions and our corporate privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              2. Intellectual Property Rights
            </h2>
            <p className="text-[#6F6A7C]">
              All text, graphic layouts, distinctive brand marks, code samples, and architecture diagrams contained within this website are the intellectual property of Cognirex Solutions and protected under international copyright legislation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              3. Consultation Booking & Double-Booking Policies
            </h2>
            <p className="text-[#6F6A7C]">
              Meeting reservations submitted through this platform are validated against real-time slot availability. A reservation is held tentatively pending mutual technical agenda alignment. Cognirex Solutions reserves the right to reschedule or reassign consulting sessions upon mutual notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-xl text-[#1F1B2E]">
              4. Governing Law
            </h2>
            <p className="text-[#6F6A7C]">
              These terms shall be governed by and construed in accordance with the laws of Karnataka, India, without regard to conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

