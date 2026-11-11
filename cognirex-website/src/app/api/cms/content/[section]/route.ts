import { NextRequest, NextResponse } from "next/server";
import { CMS_SECTIONS } from "@/data/cmsDefaults";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { getWebsiteSection, saveWebsiteSection } from "@/lib/cmsStore";
import type { CmsSectionKey, CognirexContentBundle } from "@/types/cms";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  const { section } = await context.params;
  if (!CMS_SECTIONS.includes(section as CmsSectionKey)) {
    return NextResponse.json(
      { success: false, error: `Invalid CMS section: ${section}` },
      { status: 400 }
    );
  }

  const data = await getWebsiteSection(section as CmsSectionKey);
  return NextResponse.json(data);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ section: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { section } = await context.params;
    if (!CMS_SECTIONS.includes(section as CmsSectionKey)) {
      return NextResponse.json(
        { success: false, error: `Invalid CMS section: ${section}` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const key = section as CmsSectionKey;
    const saved = await saveWebsiteSection(
      key,
      body as CognirexContentBundle[typeof key],
      auth.user.email
    );

    return NextResponse.json({
      success: true,
      section: key,
      data: saved,
    });
  } catch (err) {
    console.error("PUT /api/cms/content/[section] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save section content" },
      { status: 500 }
    );
  }
}
