import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { dispatchCmsEmail } from "@/lib/cmsEmail";
import {
  getRawSmtpSettings,
  listConsultations,
  logActivity,
  updateConsultation,
} from "@/lib/cmsStore";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const items = await listConsultations();
    const booking = items.find((b) => b._id === id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Consultation booking not found" },
        { status: 404 }
      );
    }

    const subject =
      typeof body?.subject === "string" && body.subject.trim()
        ? body.subject.trim()
        : `Cognirex Solutions Consultation Update — ${booking.preferredDate} at ${booking.preferredTime}`;
    const message =
      typeof body?.message === "string" && body.message.trim()
        ? body.message.trim()
        : `Hello ${booking.fullName},\n\nYour ${booking.meetingType} with Cognirex Solutions on ${booking.preferredDate} at ${booking.preferredTime} is confirmed.\n\nBest regards,\nCognirex Solutions Team`;

    const smtpOverride = await getRawSmtpSettings();
    const res = await dispatchCmsEmail({
      to: booking.workEmail,
      subject,
      text: message,
      smtpOverride,
    });

    if (!res.sent) {
      return NextResponse.json(
        { success: false, error: res.error || "Failed to send booking email" },
        { status: 500 }
      );
    }

    if (booking.status === "pending") {
      await updateConsultation(id, { status: "confirmed" }, auth.user.email);
    }
    await logActivity(`Sent consultation email to ${booking.fullName}`, auth.user.email);

    return NextResponse.json({
      success: true,
      simulated: Boolean(res.simulated),
      message: res.simulated
        ? "Confirmation logged cleanly (SMTP in simulation mode)."
        : `Email dispatched to ${booking.workEmail}.`,
    });
  } catch (err) {
    console.error("POST /api/cms/consultations/[id]/email error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send consultation email" },
      { status: 500 }
    );
  }
}
