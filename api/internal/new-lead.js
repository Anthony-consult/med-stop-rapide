// Vercel Serverless Function for webhook endpoint
// Deploy this to Vercel Functions or similar serverless platform

import nodemailer from "nodemailer";
import { Resend } from "resend";

// Env vars
const WEBHOOK_TOKEN = process.env.SUPABASE_WEBHOOK_TOKEN; // required
const TO = "contact@consult-chrono.fr";                   // recipient

// SMTP Hostinger (Option A)
const SMTP_HOST = process.env.SMTP_HOST;      // e.g. "smtp.hostinger.com"
const SMTP_PORT = Number(process.env.SMTP_PORT || "465");
const SMTP_USER = process.env.SMTP_USER;      // e.g. "contact@consult-chrono.fr"
const SMTP_PASS = process.env.SMTP_PASS;

// Resend (Option B)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    // Security: shared token
    const token = req.headers['x-webhook-token'];
    if (!WEBHOOK_TOKEN || token !== WEBHOOK_TOKEN) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const body = req.body;
    const record = body?.record ?? {};

    const subject = `Nouvelle demande – ${safe(record?.prenom)} ${safe(record?.nom)}`.trim();
    const html = renderEmail(record);

    if (RESEND_API_KEY) {
      // Option B: Resend
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: "Consult-Chrono <notifications@consult-chrono.fr>",
        to: [TO],
        subject,
        html,
      });
    } else {
      // Option A: SMTP Hostinger (default)
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // true for 465, false for 587
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"Consult-Chrono" <${SMTP_USER}>`,
        to: TO,
        subject,
        html,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? "unknown" });
  }
}

function safe(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderEmail(record) {
  const pretty = escapeHtml(JSON.stringify(record, null, 2));
  return `
    <div style="font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#0f172a">
      <h2 style="margin:0 0 12px">Nouvelle demande</h2>
      <p style="margin:0 0 16px">Horodatage : ${new Date().toISOString()}</p>
      <div style="font-size:13px;background:#f6f8fa;border:1px solid #e5e7eb;border-radius:8px;padding:12px;white-space:pre-wrap">
        <pre style="margin:0">${pretty}</pre>
      </div>
    </div>
  `;
}
