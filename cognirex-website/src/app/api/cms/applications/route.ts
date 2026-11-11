import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { listCareerApplications } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const items = await listCareerApplications();
    return NextResponse.json(items);
  } catch (err) {
    console.error("GET /api/cms/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load career applications" },
      { status: 500 }
    );
  }
}
