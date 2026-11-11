import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { getGlobalSettings, getPrimarySuperAdminEmail } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const settings = await getGlobalSettings();
    return NextResponse.json({
      ...settings,
      superAdminEmail: getPrimarySuperAdminEmail(),
    });
  } catch (err) {
    console.error("GET /api/cms/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load CMS settings" },
      { status: 500 }
    );
  }
}
