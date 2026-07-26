import config from "../config";

const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapEmail(params: {
  title: string;
  headline: string;
  body: string;
  ctaLabel?: string;
  ctaText?: string;
  footer?: string;
}): string {
  const cta =
    params.ctaLabel && params.ctaText
      ? `
        <tr>
          <td align="center" style="padding: 8px 0 24px;">
            <div
              style="
                display: inline-block;
                background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 14px 22px;
                border-radius: 999px;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.3px;
              "
            >${escapeHtml(params.ctaText)}</div>
          </td>
        </tr>
      `
      : "";

  return `
    <div style="margin:0;padding:0;background:#f4f7fb;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
              <tr>
                <td style="padding:0;">
                  <div style="background:linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%);padding:24px 28px;color:#fff;">
                    <div style="font-size:13px;letter-spacing:1px;text-transform:uppercase;opacity:0.85;">IRCTC Microservice</div>
                    <div style="font-size:24px;font-weight:700;line-height:1.2;margin-top:8px;">${escapeHtml(params.title)}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 28px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
                  <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#0f172a;">${escapeHtml(params.headline)}</h1>
                  <div style="font-size:15px;line-height:1.7;color:#334155;">
                    ${params.body}
                  </div>
                </td>
              </tr>
              ${cta}
              <tr>
                <td style="padding:0 28px 28px;font-family:Arial,Helvetica,sans-serif;">
                  <div style="border-top:1px solid #e2e8f0;padding-top:18px;font-size:12px;line-height:1.6;color:#64748b;">
                    ${params.footer ?? "If you did not request this email, you can safely ignore it."}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  if (!config.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is required");
  }

  if (!config.MAIL_SEND) {
    throw new Error("MAIL_SEND environment variable is required");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.MAIL_SEND,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} ${errorText}`);
  }
}

export async function sendOtpEmail(
  email: string,
  otp: string,
  ttlMinutes: number,
): Promise<void> {
  const safeOtp = escapeHtml(otp);
  const safeEmail = escapeHtml(email);
  const ttlLabel = ttlMinutes === 1 ? "1 minute" : `${ttlMinutes} minutes`;

  await sendEmail({
    to: email,
    subject: "Your IRCTC verification code",
    text: `Hello ${email}, your IRCTC OTP is ${otp}. It expires in ${ttlLabel}.`,
    html: wrapEmail({
      title: "Verification Code",
      headline: "Use this code to finish sign up",
      body: `
        <p style="margin:0 0 18px;">Hello ${safeEmail},</p>
        <p style="margin:0 0 18px;">Use the code below to verify your account. It expires in <strong>${escapeHtml(ttlLabel)}</strong>.</p>
        <div style="margin:24px 0 22px;text-align:center;">
          <div style="display:inline-block;background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:18px 24px;">
            <div style="font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#1d4ed8;margin-bottom:10px;">One-Time Password</div>
            <div style="font-size:34px;line-height:1;font-weight:800;letter-spacing:10px;color:#0f172a;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;">${safeOtp}</div>
          </div>
        </div>
        <p style="margin:0;color:#64748b;">If you did not request this code, you can ignore this email.</p>
      `,
      footer: `This code expires automatically after ${escapeHtml(ttlLabel)}.`,
    }),
  });
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string,
): Promise<void> {
  const safeFirstName = escapeHtml(firstName);
  const safeEmail = escapeHtml(email);

  await sendEmail({
    to: email,
    subject: "Welcome to IRCTC",
    text: `Welcome to IRCTC, ${firstName}. Your account for ${email} is now active.`,
    html: wrapEmail({
      title: "Welcome",
      headline: "Your account is ready",
      body: `
        <p style="margin:0 0 18px;">Hello ${safeFirstName},</p>
        <p style="margin:0 0 18px;">Your account for <strong>${safeEmail}</strong> has been created successfully.</p>
        <p style="margin:0;">You can now sign in and continue with your travel setup.</p>
      `,
      ctaLabel: "Sign in",
      ctaText: "Open your account",
      footer: "If this account was not created by you, please contact support.",
    }),
  });
}
