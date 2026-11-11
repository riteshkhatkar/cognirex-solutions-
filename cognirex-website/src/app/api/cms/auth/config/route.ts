import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const raw = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const isPlaceholder = !raw || raw.includes("your-google-oauth-client-id");
  return NextResponse.json({
    googleClientId: isPlaceholder ? "" : raw,
  });
}
