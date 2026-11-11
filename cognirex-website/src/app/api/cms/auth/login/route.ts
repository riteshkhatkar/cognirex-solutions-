import { NextRequest, NextResponse } from "next/server";
import { authenticateWithCredentials } from "@/lib/cmsAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";

    const result = await authenticateWithCredentials(email, password);
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
    console.error("POST /api/cms/auth/login error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication error" },
      { status: 500 }
    );
  }
}
