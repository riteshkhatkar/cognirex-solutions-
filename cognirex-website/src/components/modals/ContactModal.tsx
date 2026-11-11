"use client";

import React, { useEffect } from "react";
import { X, MessageSquare, Calendar, ShieldCheck, Sparkles } from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";
import ContactEnquiryForm from "@/components/forms/ContactEnquiryForm";
import MeetingRequestForm from "@/components/forms/MeetingRequestForm";

export default function ContactModal() {
  const { isOpen, activeTab, closeModal, setTab } = useContactModal();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E5E1ED] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E5E1ED] shrink-0 bg-[#F8F7FC]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#EEE8FA] text-[#7C3AED] flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1F1B2E]">
                Let&apos;s Talk About Your Next Project
              </h3>
              <p className="text-xs text-[#6F6A7C]">
                Cognirex Solutions Engineering &amp; Consultation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="w-9 h-9 rounded-xl bg-white border border-[#E5E1ED] hover:bg-[#EEE8FA] text-[#6F6A7C] hover:text-[#7C3AED] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* Tab Selector */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#F8F7FC] border border-[#E5E1ED] mb-6 shadow-xs">
            <button
              type="button"
              onClick={() => setTab("enquiry")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
              onClick={() => setTab("meeting")}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === "meeting"
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "text-[#6F6A7C] hover:text-[#1F1B2E]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Consultation</span>
            </button>
          </div>

          {/* Form Views */}
          {activeTab === "enquiry" && <ContactEnquiryForm />}
          {activeTab === "meeting" && <MeetingRequestForm />}

          {/* Security & Confidentiality Reassurance */}
          <div className="mt-6 p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] flex items-center gap-3 text-xs text-[#6F6A7C]">
            <ShieldCheck className="w-5 h-5 text-[#7C3AED] shrink-0" />
            <span>
              All submissions are strictly confidential and governed under non-disclosure terms. Direct response within 24 hours.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
