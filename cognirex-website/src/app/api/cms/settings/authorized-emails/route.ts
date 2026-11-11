import { NextRequest, NextResponse } from "next/server";
import { requireCmsAuth } from "@/lib/cmsAuth";
import {
  addAuthorizedEmail,
  getPrimarySuperAdminEmail,
  removeAuthorizedEmail,
} from "@/lib/cmsStore";

export async function POST(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const updated = await addAuthorizedEmail(email, auth.user.email);
    return NextResponse.json({ success: true, authorizedEmails: updated });
  } catch (err) {
    console.error("POST /api/cms/settings/authorized-emails error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to authorize email" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireCmsAuth(req);
  if (auth.error) return auth.error;

  try {
    const urlEmail = req.nextUrl.searchParams.get("email");
    let bodyEmail = "";
    try {
      const body = await req.json();
      bodyEmail = typeof body?.email === "string" ? body.email : "";
    } catch {
      bodyEmail = "";
    }

    const email = (urlEmail || bodyEmail).trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required" },
        { status: 400 }
      );
    }

    if (email === getPrimarySuperAdminEmail()) {
      return NextResponse.json(
        { success: false, error: "Primary Super Admin email cannot be removed from whitelist." },
        { status: 403 }
      );
    }

    const updated = await removeAuthorizedEmail(email, auth.user.email);
    return NextResponse.json({ success: true, authorizedEmails: updated });
  } catch (err) {
    console.error("DELETE /api/cms/settings/authorized-emails error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to remove authorized email" },
      { status: 500 }
    );
  }
}
