"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerSchema } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, X } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof careerSchema>;

export default function CareerApplicationForm({ initialRole = "General Expression of Interest" }: { initialRole?: string }) {
  const [selectedFile, setSelectedFile] = useState<{ name: string; base64: string; sizeKb: number } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
    applicationId?: string;
  }>({
    type: "idle",
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      positionOfInterest: initialRole || "General Expression of Interest",
      experience: "1-3 years",
      privacyConsent: false,
      honeypot: "",
    },
  });

  // Handle file selection and convert to Base64 with size and type checks
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ["pdf", "docx", "doc"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      setFileError("Invalid format. Please upload a PDF, DOC, or DOCX document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File exceeds 5MB limit. Please compress or select a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      setSelectedFile({
        name: file.name,
        base64: base64Str,
        sizeKb: Math.round(file.size / 1024),
      });
      setValue("resumeFileName", file.name, { shouldValidate: true });
      setValue("resumeBase64", base64Str, { shouldValidate: true });
    };
    reader.onerror = () => {
      setFileError("Error reading file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue("resumeFileName", "");
    setValue("resumeBase64", "");
  };

  const onSubmit = async (data: FormData) => {
    setServerStatus({ type: "loading", message: "Transmitting application securely..." });

    try {
      const res = await fetch("/api/careers", {
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
            "Unable to accept application at this time. Please check your form fields and retry.",
        });
        return;
      }

      setServerStatus({
        type: "success",
        message: resData.message || "Your introduction has been received successfully.",
        applicationId: resData.id,
      });
      reset();
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      setServerStatus({
        type: "error",
        message: "Network error communicating with the server. Please check your internet connection.",
      });
    }
  };

  return (
    <div className="bg-white border border-[#E5E1ED] rounded-3xl p-6 sm:p-10 shadow-card">
      {serverStatus.type === "success" ? (
        <div className="py-10 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full mb-3 inline-block">
            Submission Confirmed
          </span>

          <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F1B2E] mb-3">
            Your Form is Submitted Accurately!
          </h3>

          <p className="text-sm text-[#6F6A7C] max-w-lg mx-auto leading-relaxed mb-6">
            Thank you for introducing yourself. Your candidate application has been recorded and safely transmitted to the Cognirex Solutions team. We review every profile and will contact you directly for matching engineering and digital opportunities.
          </p>

          {serverStatus.applicationId && (
            <div className="mb-6">
              <span className="text-xs font-mono font-semibold text-[#7C3AED] bg-[#EEE8FA] px-4 py-2 rounded-xl inline-block border border-[#7C3AED]/20">
                Application Reference: {serverStatus.applicationId}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setServerStatus({ type: "idle", message: "" });
              reset();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:text-[#5B21B6] transition-colors bg-[#EEE8FA] px-5 py-2.5 rounded-xl hover:bg-[#7C3AED] hover:text-white cursor-pointer"
          >
            <span>Submit Another Introduction</span>
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="font-heading font-bold text-2xl text-[#1F1B2E] mb-2">
              General Expression of Interest
            </h3>
            <p className="text-sm text-[#6F6A7C]">
              Share your background and tell us about the digital technologies you enjoy working with. We review every introduction for upcoming projects.
            </p>
          </div>

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
        {/* Anti-spam honeypot */}
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

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Email Address <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Phone Number <span className="text-[#7C3AED]">*</span>
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

          {/* Position of Interest */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Area of Interest <span className="text-[#7C3AED]">*</span>
            </label>
            <select
              {...register("positionOfInterest")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            >
              <option value="General Expression of Interest">General Expression of Interest</option>
              <option value="Digital & Software Engineering">Digital & Software Engineering</option>
              <option value="AI & Intelligent Systems">AI & Intelligent Systems</option>
              <option value="Product Design & UX">Product Design & UX</option>
              <option value="Automation & System Integration">Automation & System Integration</option>
            </select>
            {errors.positionOfInterest && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.positionOfInterest.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Experience Level <span className="text-[#7C3AED]">*</span>
            </label>
            <select
              {...register("experience")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            >
              <option value="0-1 years">0–1 years (Early Career)</option>
              <option value="1-3 years">1–3 years</option>
              <option value="3-5 years">3–5 years</option>
              <option value="5-8 years">5–8 years</option>
              <option value="8+ years">8+ years</option>
            </select>
            {errors.experience && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.experience.message}</p>
            )}
          </div>

          {/* LinkedIn Profile */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Portfolio / GitHub / LinkedIn <span className="text-[#6F6A7C] font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://..."
              {...register("linkedIn")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.linkedIn && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.linkedIn.message}</p>
            )}
          </div>
        </div>

        {/* Resume File Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
            Resume / CV <span className="text-[#7C3AED]">*</span>
            <span className="text-gray-400 font-normal lowercase ml-1.5">(PDF, DOC, DOCX up to 5MB)</span>
          </label>

          {!selectedFile ? (
            <label className="border-2 border-dashed border-[#E5E1ED] hover:border-[#7C3AED] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#F8F7FC] hover:bg-[#EEE8FA]/30 transition-all">
              <UploadCloud className="w-8 h-8 text-[#7C3AED] mb-2 stroke-[1.5]" />
              <span className="text-xs font-semibold text-[#1F1B2E]">
                Click or drag resume file to upload
              </span>
              <span className="text-[11px] text-[#6F6A7C] mt-1">
                Accepted formats: .pdf, .docx, .doc (Max 5MB)
              </span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#EEE8FA] border border-[#E5E1ED]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#7C3AED]" />
                <div>
                  <p className="text-xs font-bold text-[#1F1B2E]">{selectedFile.name}</p>
                  <p className="text-[10px] text-[#6F6A7C]">{selectedFile.sizeKb} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 rounded-md text-gray-400 hover:text-rose-600 cursor-pointer"
                aria-label="Remove attached file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {fileError && <p className="text-xs text-rose-600 mt-1.5">{fileError}</p>}
          {errors.resumeFileName && !fileError && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.resumeFileName.message}</p>
          )}
        </div>

        {/* Short Introduction */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
            Short Introduction <span className="text-[#7C3AED]">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about the problems you enjoy solving, recent projects or technologies you're excited about..."
            {...register("shortIntroduction")}
            className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors resize-none"
          />
          {errors.shortIntroduction && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.shortIntroduction.message}</p>
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
              I consent to Cognirex processing my application details for future opportunities in accordance with the privacy policy.
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
            Submit Expression of Interest
          </Button>
        </div>
      </form>
      </>
      )}
    </div>
  );
}
