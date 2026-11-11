import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { dispatchCmsEmail } from "@/lib/cmsEmail";
import {
  getRawSmtpSettings,
  listInquiries,
  logActivity,
  updateInquiryStatus,
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
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject and reply message are required" },
        { status: 400 }
      );
    }

    const items = await listInquiries();
    const inquiry = items.find((i) => i._id === id);
    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found" },
        { status: 404 }
      );
    }

    const smtpOverride = await getRawSmtpSettings();
    const emailRes = await dispatchCmsEmail({
      to: inquiry.workEmail,
      subject,
      text: message,
      smtpOverride,
    });

    if (!emailRes.sent) {
      return NextResponse.json(
        { success: false, error: emailRes.error || "Failed to send email" },
        { status: 500 }
      );
    }

    await updateInquiryStatus(id, "responded", auth.user.email);
    await logActivity(`Responded to enquiry from ${inquiry.fullName} (${inquiry.workEmail})`, auth.user.email);

    return NextResponse.json({
      success: true,
      simulated: Boolean(emailRes.simulated),
      message: emailRes.simulated
        ? "Reply logged & enquiry marked as Responded (SMTP in simulation mode)."
        : `Email reply sent to ${inquiry.workEmail}.`,
    });
  } catch (err) {
    console.error("POST /api/cms/inquiries/[id]/reply error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch reply" },
      { status: 500 }
    );
  }
}
