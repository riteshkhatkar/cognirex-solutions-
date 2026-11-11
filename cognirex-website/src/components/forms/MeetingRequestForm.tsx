"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { meetingSchema } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Calendar, Video, Building2 } from "lucide-react";
import { z } from "zod";

type FormData = z.infer<typeof meetingSchema>;

const timeSlots = [
  "10:00 AM - 10:45 AM IST",
  "11:30 AM - 12:15 PM IST",
  "02:00 PM - 02:45 PM IST",
  "03:30 PM - 04:15 PM IST",
  "05:00 PM - 05:45 PM IST",
];

export default function MeetingRequestForm() {
  const [serverStatus, setServerStatus] = useState<{
    type: "idle" | "loading" | "success" | "conflict" | "error";
    message: string;
    meetingId?: string;
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
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      meetingType: "online",
      preferredDate: "",
      preferredTime: timeSlots[0],
      privacyConsent: false,
      honeypot: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setServerStatus({ type: "loading", message: "Verifying slot availability and booking..." });

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (res.status === 409) {
        setServerStatus({
          type: "conflict",
          message: resData.error || "The selected time slot is already reserved. Please select another slot.",
        });
        return;
      }

      if (!res.ok || !resData.success) {
        setServerStatus({
          type: "error",
          message:
            resData.error ||
            "Unable to reserve consultation meeting. Please verify all fields or contact us directly.",
        });
        return;
      }

      setServerStatus({
        type: "success",
        message: resData.message || "Consultation meeting reservation confirmed.",
        meetingId: resData.id,
      });
      reset();
    } catch (err) {
      console.error(err);
      setServerStatus({
        type: "error",
        message: "Network error connecting to scheduling service. Please check your connection.",
      });
    }
  };

  // Min date today formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white border border-[#E5E1ED] rounded-3xl p-6 sm:p-10 shadow-card">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE8FA] text-[#7C3AED] text-xs font-semibold mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Real-time Availability Reservation</span>
        </div>
        <h3 className="font-heading font-bold text-2xl text-[#1F1B2E] mb-2">
          Request a Consultation Meeting
        </h3>
        <p className="text-sm text-[#6F6A7C]">
          Schedule a focused discussion with our engineering and solutions team to review your requirements.
        </p>
      </div>

      {serverStatus.type === "success" && (
        <div className="mb-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Meeting Reserved & Confirmed</h4>
            <p className="text-xs text-emerald-800 mt-1">{serverStatus.message}</p>
            {serverStatus.meetingId && (
              <p className="text-[11px] font-mono text-emerald-700 mt-2 bg-emerald-100/70 px-2.5 py-1 rounded inline-block">
                Booking ID: {serverStatus.meetingId}
              </p>
            )}
          </div>
        </div>
      )}

      {serverStatus.type === "conflict" && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Slot Conflict Detected</h4>
            <p className="text-xs text-amber-800 mt-1">{serverStatus.message}</p>
          </div>
        </div>
      )}

      {serverStatus.type === "error" && (
        <div className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Scheduling Error</h4>
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

          {/* Work Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Work Email <span className="text-[#7C3AED]">*</span>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Preferred Date <span className="text-[#7C3AED]">*</span>
            </label>
            <input
              type="date"
              min={todayStr}
              {...register("preferredDate")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            />
            {errors.preferredDate && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.preferredDate.message}</p>
            )}
          </div>

          {/* Preferred Time Slot */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
              Time Slot (IST) <span className="text-[#7C3AED]">*</span>
            </label>
            <select
              {...register("preferredTime")}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.preferredTime && (
              <p className="text-xs text-rose-600 mt-1.5">{errors.preferredTime.message}</p>
            )}
          </div>
        </div>

        {/* Meeting Type: Online / In-person */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
            Meeting Format <span className="text-[#7C3AED]">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E5E1ED] bg-[#F8F7FC] cursor-pointer hover:bg-white hover:border-[#7C3AED] transition-colors">
              <input
                type="radio"
                value="online"
                {...register("meetingType")}
                className="text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <Video className="w-4 h-4 text-[#7C3AED]" />
              <div className="text-xs">
                <span className="font-bold text-[#1F1B2E] block">Online Video Conference</span>
                <span className="text-[#6F6A7C]">Google Meet / Zoom link provided</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#E5E1ED] bg-[#F8F7FC] cursor-pointer hover:bg-white hover:border-[#7C3AED] transition-colors">
              <input
                type="radio"
                value="in-person"
                {...register("meetingType")}
                className="text-[#7C3AED] focus:ring-[#7C3AED]"
              />
              <Building2 className="w-4 h-4 text-[#7C3AED]" />
              <div className="text-xs">
                <span className="font-bold text-[#1F1B2E] block">In-Person Meeting</span>
                <span className="text-[#6F6A7C]">At scheduled business venue</span>
              </div>
            </label>
          </div>
          {errors.meetingType && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.meetingType.message}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1B2E] mb-2">
            Discussion Topics <span className="text-[#6F6A7C] font-normal">(Optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Share specific questions, requirements, or goals you wish to discuss..."
            {...register("additionalNotes")}
            className="w-full px-4 py-3 rounded-xl bg-[#F8F7FC] border border-[#E5E1ED] text-sm text-[#1F1B2E] focus:bg-white focus:border-[#7C3AED] focus:outline-none transition-colors resize-none"
          />
          {errors.additionalNotes && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.additionalNotes.message}</p>
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
              I agree to the calendar reservation terms and consent to receive calendar invites and meeting notifications.
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="text-xs text-rose-600 mt-1.5">{errors.privacyConsent.message}</p>
          )}
        </div>

        {/* Submit */}
        <div>
          <Button
            type="submit"
            variant="yellow"
            size="lg"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Confirm Consultation Request
          </Button>
        </div>
      </form>
    </div>
  );
}
