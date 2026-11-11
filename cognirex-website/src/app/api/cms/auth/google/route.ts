import { NextRequest, NextResponse } from "next/server";
import { authenticateWithGoogle } from "@/lib/cmsAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const credential = typeof body?.credential === "string" ? body.credential : "";

    const result = await authenticateWithGoogle(credential);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    const { passwordHash: _ignored, ...safeUser } = result.user;
    return NextResponse.json({
      success: true,
      token: result.token,
      user: safeUser,
    });
  } catch (err) {
    console.error("POST /api/cms/auth/google error:", err);
    return NextResponse.json(
      { success: false, error: "Google OAuth authentication error" },
      { status: 500 }
    );
  }
}
