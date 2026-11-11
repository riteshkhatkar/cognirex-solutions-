import { NextRequest, NextResponse } from "next/server";
import { CMS_SECTIONS } from "@/data/cmsDefaults";
import { getWebsiteSection } from "@/lib/cmsStore";
import type { CmsSectionKey } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await context.params;
    if (!CMS_SECTIONS.includes(section as CmsSectionKey)) {
      return NextResponse.json(
        { success: false, error: `Unknown section: ${section}` },
        { status: 404 }
      );
    }
    const data = await getWebsiteSection(section as CmsSectionKey);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /api/public/content/[section] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load section content" },
      { status: 500 }
    );
  }
}
