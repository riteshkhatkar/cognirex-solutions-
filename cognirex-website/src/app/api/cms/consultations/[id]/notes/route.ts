import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { updateConsultation } from "@/lib/cmsStore";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const adminNotes = typeof body?.adminNotes === "string" ? body.adminNotes : "";

    const updated = await updateConsultation(id, { adminNotes }, auth.user.email);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Consultation booking not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/cms/consultations/[id]/notes error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save admin notes" },
      { status: 500 }
    );
  }
}
