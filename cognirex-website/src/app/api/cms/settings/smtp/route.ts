import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { updateSmtpSettings } from "@/lib/cmsStore";

export async function PUT(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const updated = await updateSmtpSettings(body, auth.user.email);
    return NextResponse.json({ success: true, smtp: updated });
  } catch (err) {
    console.error("PUT /api/cms/settings/smtp error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update SMTP settings" },
      { status: 500 }
    );
  }
}
