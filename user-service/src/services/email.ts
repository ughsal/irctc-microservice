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

  await sendEmail({
    to: email,
    subject: "Your IRCTC OTP",
    text: `Your OTP for IRCTC is ${otp}. It expires in ${ttlMinutes} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Your IRCTC OTP</h2>
        <p>Hello ${safeEmail},</p>
        <p>Your one-time password is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${safeOtp}</p>
        <p>This OTP expires in ${ttlMinutes} minutes.</p>
      </div>
    `,
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
    text: `Welcome to IRCTC, ${firstName}. Your account is now active.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Welcome to IRCTC</h2>
        <p>Hello ${safeFirstName},</p>
        <p>Your account for ${safeEmail} is now active.</p>
      </div>
    `,
  });
}
