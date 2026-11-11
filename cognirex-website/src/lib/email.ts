import nodemailer from "nodemailer";
import { CareerApplicationSubmission, ContactEnquirySubmission, MeetingRequestSubmission } from "@/types";

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

const DEFAULT_COMPANY_EMAIL = process.env.SMTP_TO_EMAIL || "careers@cognirexsolutions.com";
const DEFAULT_FROM_EMAIL = process.env.SMTP_FROM || `"Cognirex Solutions" <noreply@cognirexsolutions.com>`;

/**
 * Send Career Application details via SMTP to Cognirex Solutions email
 */
export async function sendCareerApplicationEmail(
  application: CareerApplicationSubmission & { id: string; rawResumeBase64?: string }
): Promise<{ sent: boolean; message: string }> {
  const transporter = getTransporter();

  const recipient = process.env.SMTP_TO_CAREERS_EMAIL || process.env.SMTP_TO_EMAIL || "careers@cognirexsolutions.com";

  const attachments: Array<{ filename: string; content: Buffer }> = [];

  // Parse attached resume if available
  if (application.rawResumeBase64 && application.resumeFileName) {
    try {
      const base64Data = application.rawResumeBase64.includes(";base64,")
        ? application.rawResumeBase64.split(";base64,").pop()!
        : application.rawResumeBase64;
      attachments.push({
        filename: application.resumeFileName,
        content: Buffer.from(base64Data, "base64"),
      });
    } catch (e) {
      console.error("Failed to parse resume attachment buffer:", e);
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1B2E; line-height: 1.6; }
          .container { max-width: 600px; margin: 20px auto; border: 1px solid #E5E1ED; border-radius: 12px; overflow: hidden; background: #ffffff; }
          .header { background: #1F1B2E; color: #ffffff; padding: 24px; text-align: center; }
          .badge { display: inline-block; background: #7C3AED; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-bottom: 8px; }
          .title { font-size: 20px; font-weight: bold; margin: 0; }
          .content { padding: 24px; }
          .row { margin-bottom: 16px; border-bottom: 1px solid #F0EDF7; padding-bottom: 12px; }
          .label { font-size: 11px; font-weight: bold; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.5px; }
          .value { font-size: 15px; color: #1F1B2E; font-weight: 500; margin-top: 2px; }
          .note-box { background: #F8F7FC; border-left: 4px solid #7C3AED; padding: 14px; border-radius: 6px; font-size: 14px; color: #4B4658; }
          .footer { background: #F8F7FC; padding: 16px; text-align: center; font-size: 12px; color: #8F8A9C; border-top: 1px solid #E5E1ED; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">New Candidate Submission</span>
            <h1 class="title">Cognirex Solutions Career Portal</h1>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">Candidate Name</div>
              <div class="value">${application.fullName}</div>
            </div>
            <div class="row">
              <div class="label">Email Address</div>
              <div class="value"><a href="mailto:${application.email}" style="color: #7C3AED;">${application.email}</a></div>
            </div>
            ${application.phone ? `
            <div class="row">
              <div class="label">Phone Number</div>
              <div class="value">${application.phone}</div>
            </div>` : ""}
            <div class="row">
              <div class="label">Position of Interest</div>
              <div class="value" style="color: #7C3AED; font-weight: bold;">${application.positionOfInterest}</div>
            </div>
            <div class="row">
              <div class="label">Experience Level</div>
              <div class="value">${application.experience}</div>
            </div>
            ${application.linkedIn ? `
            <div class="row">
              <div class="label">LinkedIn / Portfolio URL</div>
              <div class="value"><a href="${application.linkedIn}" target="_blank" style="color: #7C3AED;">${application.linkedIn}</a></div>
            </div>` : ""}
            ${application.resumeFileName ? `
            <div class="row">
              <div class="label">Attached Resume</div>
              <div class="value">📎 ${application.resumeFileName} ${attachments.length > 0 ? "(Attached to this email)" : ""}</div>
            </div>` : ""}
            <div class="row" style="border-bottom: none;">
              <div class="label" style="margin-bottom: 6px;">Introduction &amp; Cover Note</div>
              <div class="note-box">${(application.shortIntroduction || "No introduction provided.").replace(/\n/g, "<br/>")}</div>
            </div>
          </div>
          <div class="footer">
            Application Reference ID: <strong>${application.id}</strong><br>
            Submitted via Cognirex Solutions Career Portal • ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transporter) {
    console.log(`[SMTP INFO] SMTP credentials not configured. Application logged for ${recipient}:`, {
      id: application.id,
      candidate: application.fullName,
      email: application.email,
      position: application.positionOfInterest,
    });
    return {
      sent: false,
      message: "Application recorded securely. (SMTP credentials pending configuration).",
    };
  }

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM_EMAIL,
      to: recipient,
      subject: `[Career Portal] New Candidate Application: ${application.fullName} (${application.positionOfInterest})`,
      html: htmlContent,
      attachments,
    });

    console.log(`[SMTP SUCCESS] Dispatched career application email to ${recipient}`);
    return { sent: true, message: `Application dispatched to ${recipient}` };
  } catch (error) {
    console.error("[SMTP ERROR] Error sending career application email:", error);
    return { sent: false, message: "Error sending SMTP email." };
  }
}

/**
 * Send Meeting Request details via SMTP to Cognirex Solutions email
 */
export async function sendMeetingRequestEmail(
  meeting: Omit<MeetingRequestSubmission, "status"> & {
    id: string;
    status?: string;
    companyName?: string;
    agendaTopics?: string;
  }
): Promise<{ sent: boolean; message: string }> {
  const transporter = getTransporter();
  const recipient = process.env.SMTP_TO_EMAIL || "contact@cognirexsolutions.com";

  if (!transporter) {
    console.log(`[SMTP INFO] SMTP credentials pending. Meeting request recorded for ${recipient}:`, {
      id: meeting.id,
      name: meeting.fullName,
      email: meeting.workEmail,
      date: meeting.preferredDate,
      time: meeting.preferredTime,
      type: meeting.meetingType,
    });
    return { sent: false, message: "Meeting request stored securely." };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; color: #1F1B2E; line-height: 1.6;">
        <div style="max-width: 600px; margin: 20px auto; border: 1px solid #E5E1ED; border-radius: 12px; padding: 24px;">
          <h2 style="color: #7C3AED; margin-top: 0;">📅 New Meeting Request Booked</h2>
          <p><strong>Name:</strong> ${meeting.fullName}</p>
          <p><strong>Work Email:</strong> <a href="mailto:${meeting.workEmail}">${meeting.workEmail}</a></p>
          ${meeting.phone ? `<p><strong>Phone:</strong> ${meeting.phone}</p>` : ""}
          ${meeting.companyName ? `<p><strong>Company:</strong> ${meeting.companyName}</p>` : ""}
          <p><strong>Meeting Type:</strong> ${meeting.meetingType === "online" ? "Virtual Video Call" : "In-Person Meeting"}</p>
          <p><strong>Scheduled Date:</strong> ${meeting.preferredDate}</p>
          <p><strong>Preferred Time:</strong> ${meeting.preferredTime}</p>
          ${meeting.agendaTopics ? `
          <p><strong>Agenda / Topics:</strong></p>
          <div style="background: #F8F7FC; padding: 12px; border-radius: 6px; border-left: 3px solid #7C3AED;">
            ${meeting.agendaTopics.replace(/\n/g, "<br/>")}
          </div>` : ""}
          <p style="font-size: 12px; color: #6F6A7C; margin-top: 24px;">
            Booking Reference ID: ${meeting.id} • Cognirex Solutions
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM_EMAIL,
      to: recipient,
      subject: `[Meeting Request] ${meeting.fullName} — ${meeting.preferredDate} (${meeting.preferredTime})`,
      html: htmlContent,
    });
    return { sent: true, message: `Dispatched to ${recipient}` };
  } catch (err) {
    console.error("[SMTP ERROR] Failed to send meeting request email:", err);
    return { sent: false, message: "SMTP transmission failed" };
  }
}

export async function sendContactEnquiryEmail(
  enquiry: ContactEnquirySubmission & { id: string }
): Promise<{ sent: boolean; message: string }> {
  const transporter = getTransporter();
  const recipient = process.env.SMTP_TO_EMAIL || "contact@cognirexsolutions.com";

  if (!transporter) {
    console.log(`[SMTP INFO] SMTP credentials pending. Contact enquiry recorded for ${recipient}:`, {
      id: enquiry.id,
      name: enquiry.fullName,
      email: enquiry.workEmail,
      service: enquiry.serviceInterestedIn,
    });
    return { sent: false, message: "Enquiry stored securely." };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: sans-serif; color: #1F1B2E; line-height: 1.6;">
        <div style="max-width: 600px; margin: 20px auto; border: 1px solid #E5E1ED; border-radius: 12px; padding: 24px;">
          <h2 style="color: #7C3AED; margin-top: 0;">New Project Enquiry Received</h2>
          <p><strong>Name:</strong> ${enquiry.fullName}</p>
          <p><strong>Work Email:</strong> <a href="mailto:${enquiry.workEmail}">${enquiry.workEmail}</a></p>
          ${enquiry.phone ? `<p><strong>Phone:</strong> ${enquiry.phone}</p>` : ""}
          ${enquiry.companyName ? `<p><strong>Company:</strong> ${enquiry.companyName}</p>` : ""}
          <p><strong>Service of Interest:</strong> ${enquiry.serviceInterestedIn}</p>
          ${enquiry.projectBudget ? `<p><strong>Budget:</strong> ${enquiry.projectBudget}</p>` : ""}
          <p><strong>Project Description:</strong></p>
          <div style="background: #F8F7FC; padding: 12px; border-radius: 6px; border-left: 3px solid #7C3AED;">
            ${(enquiry.projectDescription || "").replace(/\n/g, "<br/>")}
          </div>
          <p style="font-size: 12px; color: #6F6A7C; margin-top: 24px;">
            Reference ID: ${enquiry.id} • Cognirex Solutions
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: DEFAULT_FROM_EMAIL,
      to: recipient,
      subject: `[Project Enquiry] ${enquiry.fullName} — ${enquiry.serviceInterestedIn}`,
      html: htmlContent,
    });
    return { sent: true, message: `Dispatched to ${recipient}` };
  } catch (err) {
    console.error("[SMTP ERROR] Failed to send contact enquiry email:", err);
    return { sent: false, message: "SMTP transmission failed" };
  }
}
