import { NextResponse } from "next/server";
import { getAllWebsiteSections } from "@/lib/cmsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bundle = await getAllWebsiteSections();
    return NextResponse.json(bundle, { status: 200 });
  } catch (err) {
    console.error("GET /api/public/content/all error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load website content" },
      { status: 500 }
    );
  }
}
