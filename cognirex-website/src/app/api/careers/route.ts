import { NextRequest, NextResponse } from "next/server";
import { careerSchema } from "@/lib/validation";
import { checkRateLimit, saveCareerApplication } from "@/lib/database";
import { sendCareerApplicationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 5, 60 * 1000)) {
      return NextResponse.json(
        { success: false, error: "Submission rate limit exceeded. Please try again in a few moments." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Honeypot trap
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json({ success: true, message: "Application submitted successfully." });
    }

    const parsed = careerSchema.safeParse(body);
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

    // Verify allowed file extensions
    const allowedExts = [".pdf", ".docx", ".doc"];
    const ext = "." + (parsed.data.resumeFileName.split(".").pop()?.toLowerCase() || "");
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file format. Only PDF, DOC, and DOCX resumes are accepted.",
        },
        { status: 400 }
      );
    }

    // Approximate size check for base64 (5MB limit: ~6.8M base64 characters)
    if (parsed.data.resumeBase64.length > 7 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume file size exceeds the 5MB maximum limit.",
        },
        { status: 400 }
      );
    }

    const result = await saveCareerApplication(parsed.data);

    // Dispatch email to Cognirex Solutions team via SMTP (non-fatal if unconfigured)
    try {
      await sendCareerApplicationEmail({
        ...parsed.data,
        id: result.id,
        rawResumeBase64: parsed.data.resumeBase64,
      });
    } catch (emailErr) {
      console.warn("Career application email dispatch warning:", emailErr);
    }

    return NextResponse.json(
      {
        ...result,
        message: "Your form has been submitted accurately! Our team has received your application and will review your profile shortly.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("API /careers error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while processing your application." },
      { status: 500 }
    );
  }
}

