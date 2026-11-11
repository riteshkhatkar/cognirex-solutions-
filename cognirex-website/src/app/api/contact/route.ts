import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit, saveContactEnquiry } from "@/lib/database";
import { sendContactEnquiryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 6, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Too many enquiries submitted from this IP. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Spam honeypot check
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Enquiry submitted successfully." });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await saveContactEnquiry(parsed.data);

    // Send email notification via SMTP (non-fatal if SMTP server is unreachable or unconfigured)
    try {
      await sendContactEnquiryEmail({
        ...parsed.data,
        id: result.id,
      });
    } catch (emailErr) {
      console.warn("SMTP email dispatch warning:", emailErr);
    }

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    console.error("API /contact error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred while processing your enquiry." },
      { status: 500 }
    );
  }
}

