import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { updateContactSettings } from "@/lib/cmsStore";

export async function PUT(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const updated = await updateContactSettings(body, auth.user.email);
    return NextResponse.json({ success: true, contactInfo: updated });
  } catch (err) {
    console.error("PUT /api/cms/settings/contact error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update contact settings" },
      { status: 500 }
    );
  }
}
