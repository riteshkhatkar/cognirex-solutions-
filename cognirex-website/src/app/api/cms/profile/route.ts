import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import { updateUserProfile } from "@/lib/cmsStore";

export async function PUT(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const res = await updateUserProfile(auth.user.email, {
      name: typeof body?.name === "string" ? body.name.trim() : undefined,
      avatar: typeof body?.avatar === "string" ? body.avatar.trim() : undefined,
      currentPassword: typeof body?.currentPassword === "string" ? body.currentPassword : undefined,
      newPassword: typeof body?.newPassword === "string" ? body.newPassword : undefined,
    });

    if (!res.success || !res.user) {
      return NextResponse.json(
        { success: false, error: res.error || "Failed to update profile" },
        { status: 400 }
      );
    }

    const { passwordHash: _ignored, ...safeUser } = res.user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("PUT /api/cms/profile error:", err);
    return NextResponse.json(
      { success: false, error: "Profile update failed" },
      { status: 500 }
    );
  }
}
