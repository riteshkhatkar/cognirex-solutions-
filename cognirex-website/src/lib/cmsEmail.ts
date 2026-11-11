import nodemailer from "nodemailer";

export interface SmtpRuntimeConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from?: string;
}

export function createSmtpTransporter(override?: Partial<SmtpRuntimeConfig>) {
  const host = override?.host || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(override?.port || process.env.SMTP_PORT || 587);
  const user = override?.user || process.env.SMTP_USER || "";
  const pass = override?.pass && !override.pass.includes("••") ? override.pass : process.env.SMTP_PASS || "";

  if (!user || !pass || pass === "your-smtp-app-password") {
    return null;
  }

  return {
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465 || process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    }),
    fromAddress: override?.from || process.env.SMTP_FROM || process.env.EMAIL_FROM || user,
  };
}

export async function dispatchCmsEmail(params: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  smtpOverride?: Partial<SmtpRuntimeConfig>;
}): Promise<{ sent: boolean; simulated?: boolean; error?: string }> {
  const ctx = createSmtpTransporter(params.smtpOverride);
  if (!ctx) {
    return { sent: true, simulated: true };
  }

  try {
    await ctx.transporter.sendMail({
      from: ctx.fromAddress,
      to: params.to,
      subject: params.subject,
      text: params.text,
      html: params.html || `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#1F1B2E">${params.text.replace(/\n/g, "<br/>")}</div>`,
    });
    return { sent: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to dispatch email";
    return { sent: false, error: msg };
  }
}

export async function verifySmtpConnection(
  override?: Partial<SmtpRuntimeConfig>
): Promise<{ ok: boolean; simulated?: boolean; message: string }> {
  const ctx = createSmtpTransporter(override);
  if (!ctx) {
    return {
      ok: true,
      simulated: true,
      message: "SMTP credentials not configured in environment/settings; email running in safe simulation mode.",
    };
  }
  try {
    await ctx.transporter.verify();
    return { ok: true, message: "SMTP transport verified successfully." };
  } catch (err: unknown) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "SMTP verification failed",
    };
  }
}
