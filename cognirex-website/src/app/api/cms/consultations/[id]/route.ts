import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { deleteConsultation } from "@/lib/cmsStore";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const deleted = await deleteConsultation(id, auth.user.email);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Consultation booking not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cms/consultations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
