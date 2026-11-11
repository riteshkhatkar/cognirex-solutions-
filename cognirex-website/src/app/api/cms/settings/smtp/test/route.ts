import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { dispatchCmsEmail, verifySmtpConnection } from "@/lib/cmsEmail";
import { getRawSmtpSettings, logActivity } from "@/lib/cmsStore";

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json().catch(() => ({}));
    const saved = await getRawSmtpSettings();
    const override = {
      ...saved,
      ...(body?.host ? { host: String(body.host) } : {}),
      ...(body?.port ? { port: Number(body.port) } : {}),
      ...(body?.user ? { user: String(body.user) } : {}),
      ...(body?.pass && !String(body.pass).includes("••") ? { pass: String(body.pass) } : {}),
      ...(body?.from ? { from: String(body.from) } : {}),
    };

    const verification = await verifySmtpConnection(override);
    if (!verification.ok) {
      return NextResponse.json(
        { success: false, error: verification.message },
        { status: 400 }
      );
    }

    if (!verification.simulated && body?.sendTestEmail) {
      await dispatchCmsEmail({
        to: String(body?.testTo || auth.user.email),
        subject: "Cognirex Solutions CMS — SMTP Test Email",
        text: "Your Cognirex Solutions CMS SMTP transport verified and delivered this test email.",
        smtpOverride: override,
      });
    }

    await logActivity("Tested SMTP email configuration", auth.user.email);
    return NextResponse.json({
      success: true,
      simulated: Boolean(verification.simulated),
      message: verification.message,
    });
  } catch (err) {
    console.error("POST /api/cms/settings/smtp/test error:", err);
    return NextResponse.json(
      { success: false, error: "SMTP connection test failed" },
      { status: 500 }
    );
  }
}
