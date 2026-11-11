import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { deleteInquiry } from "@/lib/cmsStore";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const deleted = await deleteInquiry(id, auth.user.email);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Enquiry not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cms/inquiries/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
