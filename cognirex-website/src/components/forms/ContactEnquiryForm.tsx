"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof contactSchema>;

export default function ContactEnquiryForm({ initialService = "" }: { initialService?: string }) {
  const [serverStatus, setServerStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
    enquiryId?: string;
  }>({
    type: "idle",
    message: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      serviceInterestedIn: initialService || "",
      preferredContactMethod: "email",
      privacyConsent: false,
      honeypot: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerStatus({ type: "loading", message: "Sending your enquiry..." });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        setServerStatus({
          type: "error",
          message:
            resData.error ||
            "Unable to submit enquiry at this time. Please verify the form or contact us directly.",
        });
        return;
      }

      setServerStatus({
        type: "success",
        message: resData.message || "Your enquiry has been received and logged.",
        enquiryId: resData.id,
      });
      reset();
    } catch (err) {
      console.error(err);
      setServerStatus({
        type: "error",
        message: "Network error communicating with the server. Please check your connection and retry.",
      });
    }
  };

  return (
    <div className="bg-white border border-[#E5E1ED] rounded-3xl p-6 sm:p-10 shadow-card">
      <div className="mb-8">
        <h3 className="font-heading font-bold text-2xl text-[#1F1B2E] mb-2">
          Project Enquiry Form
        </h3>
        <p className="text-sm text-[#6F6A7C]">
          Share your project requirements, scope, or timeline. Submissions are processed by our backend API.
        </p>
      </div>

      {serverStatus.type === "success" && (
        <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Enquiry Received</h4>
            <p className="text-xs text-emerald-800 mt-1">{serverStatus.message}</p>
            {serverStatus.enquiryId && (
              <p className="text-[11px] font-mono text-emerald-700 mt-2 bg-emerald-100/70 px-2.5 py-1 rounded inline-block">
                Reference ID: {serverStatus.enquiryId}
              </p>
            )}
          </div>
        </div>
      )}

      {serverStatus.type === "error" && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Submission Error</h4>
            <p className="text-xs text-rose-800 mt-1">{serverStatus.message}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Full Name <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              {...register("fullName")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.fullName && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.fullName.message}</p>
            )}
          </div>

          {/* Business / Company Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Business / Company Name <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              type="text"
              placeholder="Your business or company name"
              {...register("companyName")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.companyName && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.companyName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Email Address <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("workEmail")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.workEmail && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.workEmail.message}</p>
            )}
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Phone / WhatsApp <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              type="tel"
              placeholder="Your contact number"
              {...register("phone")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.phone && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Solution Required */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Solution Required <span className="text-[#7C3AED]">*</span>
            </label>
            <select
              {...register("serviceInterestedIn")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            >
              <option value="">Select a solution...</option>
              <option value="Website & Digital Presence">Website & Digital Presence</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="E-Commerce & Digital Platforms">E-Commerce & Digital Platforms</option>
              <option value="Custom Software">Custom Software</option>
              <option value="Custom Software & Applications">Custom Software & Applications</option>
              <option value="Web/Application Development">Web/Application Development</option>
              <option value="AI & Generative AI">AI & Generative AI</option>
              <option value="AI, Automation & Intelligent Systems">AI, Automation & Intelligent Systems</option>
              <option value="Chatbot/AI Assistant">Chatbot/AI Assistant</option>
              <option value="Business Automation">Business Automation</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Other">Other</option>
            </select>
            {errors.serviceInterestedIn && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.serviceInterestedIn.message}</p>
            )}
          </div>

          {/* Estimated Budget (optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Estimated Budget <span className="text-[#6F6A7C] font-normal">(Optional)</span>
            </label>
            <select
              {...register("projectBudget")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            >
              <option value="">Select estimated range (optional)...</option>
              <option value="Under $5k">Starting stage / Focused scope</option>
              <option value="$5k - $15k">$5,000 – $15,000</option>
              <option value="$15k - $30k">$15,000 – $30,000</option>
              <option value="$30k+">$30,000+</option>
              <option value="Flexible">To be decided during discussion</option>
            </select>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
            Project Description <span className="text-[#7C3AED]">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Tell us what you want to build, improve or make easier."
            {...register("projectDescription")}
            className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors resize-none"
          />
          {errors.projectDescription && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.projectDescription.message}</p>
          )}
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
            Preferred Contact Method <span className="text-[#7C3AED]">*</span>
          </label>
          <div className="flex items-center gap-6 text-sm text-[#1F1B2E]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="email"
                {...register("preferredContactMethod")}
                className="text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <span>Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="phone"
                {...register("preferredContactMethod")}
                className="text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <span>Phone</span>
            </label>
          </div>
          {errors.preferredContactMethod && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.preferredContactMethod.message}</p>
          )}
        </div>

        {/* Privacy Consent */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("privacyConsent")}
              className="mt-1 w-4 h-4 rounded text-[#7C3AED] focus:ring-[#7C3AED] border-[#E5E1ED]"
            />
            <span className="text-xs text-[#6F6A7C] leading-relaxed">
              I consent to Cognirex storing and processing my details to reply to this project enquiry.
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.privacyConsent.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="yellow"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Send Enquiry
          </Button>
        </div>
      </form>
    </div>
  );
}
