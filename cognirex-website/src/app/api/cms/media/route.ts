import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { listMedia } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const assets = await listMedia();
    return NextResponse.json(assets);
  } catch (err) {
    console.error("GET /api/cms/media error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load media library" },
      { status: 500 }
    );
  }
}
