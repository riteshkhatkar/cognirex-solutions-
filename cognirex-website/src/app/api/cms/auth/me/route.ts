import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  const { passwordHash: _ignored, ...safeUser } = auth.user;
  return NextResponse.json({ success: true, user: safeUser });
}
