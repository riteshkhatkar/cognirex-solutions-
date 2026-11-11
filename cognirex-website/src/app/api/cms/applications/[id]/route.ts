import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { deleteCareerApplication, updateCareerApplication } from "@/lib/cmsStore";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const updates: {
      status?: "new" | "shortlisted" | "interviewing" | "rejected" | "hired";
      adminNotes?: string;
    } = {};

    if (body?.status) {
      if (!["new", "shortlisted", "interviewing", "rejected", "hired"].includes(body.status)) {
        return NextResponse.json(
          { success: false, error: "Invalid application status" },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }
    if (typeof body?.adminNotes === "string") {
      updates.adminNotes = body.adminNotes;
    }

    const updated = await updateCareerApplication(id, updates, auth.user.email);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/cms/applications/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const { id } = await context.params;
    const deleted = await deleteCareerApplication(id, auth.user.email);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/cms/applications/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
