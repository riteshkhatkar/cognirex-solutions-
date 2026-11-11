import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { dispatchCmsEmail } from "@/lib/cmsEmail";
import {
  getRawSmtpSettings,
  listCareerApplications,
  logActivity,
  updateCareerApplication,
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
        { success: false, error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const list = await listCareerApplications();
    const app = list.find((item) => item._id === id);
    if (!app) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    const smtpOverride = await getRawSmtpSettings();
    const res = await dispatchCmsEmail({
      to: app.email,
      subject,
      text: message,
      smtpOverride,
    });

    if (!res.sent) {
      return NextResponse.json(
        { success: false, error: res.error || "Failed to send email" },
        { status: 500 }
      );
    }

    if (app.status === "new") {
      await updateCareerApplication(id, { status: "shortlisted" }, auth.user.email);
    }
    await logActivity(`Emailed applicant ${app.fullName} (${app.email})`, auth.user.email);

    return NextResponse.json({
      success: true,
      simulated: Boolean(res.simulated),
      message: res.simulated
        ? "Applicant message logged cleanly (SMTP in simulation mode)."
        : `Email dispatched to ${app.email}.`,
    });
  } catch (err) {
    console.error("POST /api/cms/applications/[id]/reply error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch email" },
      { status: 500 }
    );
  }
}
