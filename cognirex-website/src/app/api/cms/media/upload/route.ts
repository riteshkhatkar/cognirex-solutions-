import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { saveUploadedMedia } from "@/lib/cmsStore";

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const base64Url = typeof body?.image === "string" ? body.image : "";
    if (!base64Url.startsWith("data:image/")) {
      return NextResponse.json(
        { success: false, error: "A valid base64 image data URI is required" },
        { status: 400 }
      );
    }

    const asset = await saveUploadedMedia({
      base64Url,
      name: typeof body?.name === "string" ? body.name : "uploaded-image.jpg",
      size: typeof body?.size === "number" ? body.size : base64Url.length,
      type: typeof body?.type === "string" ? body.type : "image/jpeg",
      usedIn: Array.isArray(body?.usedIn) ? body.usedIn : [],
      actorEmail: auth.user.email,
    });

    return NextResponse.json({ success: true, asset }, { status: 201 });
  } catch (err) {
    console.error("POST /api/cms/media/upload error:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Image upload failed" },
      { status: 500 }
    );
  }
}
