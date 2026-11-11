import { NextRequest, NextResponse } from "next/server";
import { dispatchCmsEmail } from "@/lib/cmsEmail";
import { getAuthorizedEmails, getRawSmtpSettings, logActivity } from "@/lib/cmsStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required" },
        { status: 400 }
      );
    }

    const authorized = await getAuthorizedEmails();
    if (authorized.includes(email)) {
      const smtpOverride = await getRawSmtpSettings();
      await dispatchCmsEmail({
        to: email,
        subject: "Cognirex Solutions CMS — Password Reset Assistance",
        text: [
          "A password recovery request was initiated for your Cognirex Solutions CMS account.",
          "",
          "To reset or update your CMS administrator password:",
          "1. Sign in via Google OAuth using your whitelisted email or use your configured ADMIN_DEFAULT_PASSWORD.",
          "2. Open My Profile -> Security to set a new password immediately.",
          "3. If locked out, update ADMIN_DEFAULT_PASSWORD or ask a Super Admin in CMS Settings.",
        ].join("\n"),
        smtpOverride,
      });
      await logActivity(`Password reset guidance requested for ${email}`, email);
    }

    return NextResponse.json({
      success: true,
      message:
        "If that email is authorized in Cognirex CMS, recovery instructions have been dispatched.",
    });
  } catch (err) {
    console.error("POST /api/cms/auth/forgot-password error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to process recovery request" },
      { status: 500 }
    );
  }
}
