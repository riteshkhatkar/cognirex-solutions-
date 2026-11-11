import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { deleteMediaAsset } from "@/lib/cmsStore";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ publicId: string[] }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { publicId } = await context.params;
    const decoded = decodeURIComponent(publicId.join("/"));
    const deleted = await deleteMediaAsset(decoded, auth.user.email);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Media asset not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cms/media/[...publicId] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
