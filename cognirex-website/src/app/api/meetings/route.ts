import { NextRequest, NextResponse } from "next/server";
import { meetingSchema } from "@/lib/validation";
import { checkRateLimit, saveMeetingRequest } from "@/lib/database";
import { sendMeetingRequestEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 6, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please wait a few moments before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot trap
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Meeting request received." });
    }

    const parsed = meetingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await saveMeetingRequest(parsed.data);

    if (!result.success && result.isConflict) {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          isConflict: true,
        },
        { status: 409 }
      );
    }

    // Send email notification to company inbox (non-fatal if unconfigured)
    if (result.id) {
      try {
        await sendMeetingRequestEmail({
          ...parsed.data,
          id: result.id,
        });
      } catch (emailErr) {
        console.warn("Meeting request email dispatch warning:", emailErr);
      }
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error("API /meetings error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while scheduling your meeting." },
      { status: 500 }
    );
  }
}

