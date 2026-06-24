import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const TO = process.env.CONTACT_TO || "haythamchhilif@gmail.com";
// Until bidbogs.com is verified in Resend, the onboarding sender only
// delivers to the Resend account owner's email. Override via CONTACT_FROM
// (e.g. "Haytham Chhilif <contact@bidbogs.com>") once the domain is verified.
const FROM = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.RESEND_API_KEY) {
    return res
      .status(500)
      .json({ error: "Email service isn't configured yet." });
  }

  const { name, email, message } = (req.body ?? {}) as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({ error: "Please fill in all fields." });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ error: "Please enter a valid email." });
  }
  if (name.length > 100 || message.length > 5000) {
    return res.status(400).json({ error: "That message is a bit too long." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New message from ${name} — bidbogs.com`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;line-height:1.6">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return res
        .status(502)
        .json({ error: "Couldn't send your message. Please email me directly." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res
      .status(502)
      .json({ error: "Couldn't send your message. Please email me directly." });
  }
}
