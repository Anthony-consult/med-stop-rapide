// Vercel Serverless Function for webhook endpoint
// Deploy this to Vercel Functions or similar serverless platform

import nodemailer from "nodemailer";
import { Resend } from "resend";

// Env vars
const WEBHOOK_TOKEN = process.env.SUPABASE_WEBHOOK_TOKEN; // required
const TO = process.env.ALERT_RECIPIENT || "contact@consult-chrono.fr"; // recipient

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
    const { html, text, csv } = renderConsultEmail(record);

    if (RESEND_API_KEY) {
      // Option B: Resend
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: "Consult-Chrono <notifications@consult-chrono.fr>",
        to: [TO],
        subject,
        html,
        text,
        attachments: csv ? [{
          filename: `consultation_${record.id ?? 'data'}.csv`,
          content: csv,
          contentType: 'text/csv'
        }] : undefined,
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
        from: `Consult-Chrono <${SMTP_USER}>`,
        to: TO,
        subject,
        html,
        text,
        attachments: csv ? [{
          filename: `consultation_${record.id ?? 'data'}.csv`,
          content: csv,
          contentType: 'text/csv'
        }] : undefined,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ ok: false, error: err?.message ?? "unknown" });
  }
}

// Email rendering functions
function safe(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function formatKey(key) {
  if (!key || typeof key !== 'string') return '';
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateISO(date) {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris'
    }).format(dateObj);
  } catch (error) {
    return '';
  }
}

function shouldMaskField(key) {
  // Ne plus masquer le numéro de sécurité sociale
  // Le numéro complet est nécessaire pour le médecin
  return false;
}

function maskSensitive(value) {
  if (!value || typeof value !== 'string') return '';
  if (value.length <= 5) return value;
  
  const start = value.slice(0, 3);
  const end = value.slice(-2);
  const middle = '*'.repeat(Math.max(0, value.length - 5));
  return `${start}${middle}${end}`;
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === '') return '';
  const stringValue = String(value);
  
  if (shouldMaskField(key)) {
    return maskSensitive(stringValue);
  }
  return stringValue;
}

function renderConsultEmail(record) {
  const html = renderHTML(record);
  const text = renderText(record);
  const csv = renderCSV(record);
  
  return { html, text, csv };
}

function renderHTML(record) {
  const paymentStatus = record.payment_status === 'done';
  const hasLogo = true;
  
  const summaryFields = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'created_at', label: 'Date de création' },
    { key: 'payment_status', label: 'Statut paiement' }
  ];
  
  const allFields = Object.entries(record)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .sort(([a], [b]) => {
      const aIndex = summaryFields.findIndex(f => f.key === a);
      const bIndex = summaryFields.findIndex(f => f.key === b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  
  const summaryHTML = summaryFields
    .filter(field => record[field.key])
    .map(field => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #334155; border-bottom: 1px solid #e5e7eb;">${field.label}</td>
        <td style="padding: 8px 12px; color: #0F172A; border-bottom: 1px solid #e5e7eb;">
          ${field.key === 'payment_status' ? 
            (record[field.key] === 'done' ? 
              '<span style="background: #10B981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">PAYÉ</span>' :
              record[field.key]) :
            field.key === 'created_at' ? formatDateISO(record[field.key]) :
            formatValue(field.key, record[field.key])
          }
        </td>
      </tr>
    `).join('');
  
  const detailsHTML = allFields
    .filter(([key]) => !summaryFields.find(f => f.key === key))
    .map(([key, value]) => `
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #334155; border-bottom: 1px solid #e5e7eb;">${formatKey(key)}</td>
        <td style="padding: 8px 12px; color: #0F172A; border-bottom: 1px solid #e5e7eb;">${formatValue(key, value)}</td>
      </tr>
    `).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle demande - Consult-Chrono</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0F172A;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0A6ABF 0%, #3B82F6 100%); padding: 20px; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
            ${hasLogo ? `
              <img src="https://consult-chrono.fr/logo-big.png" alt="Consult-Chrono" style="height: 28px; width: auto;">
            ` : ''}
            <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
              Nouvelle demande – Consult-Chrono
              ${paymentStatus ? '<span style="background: #10B981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px;">PAYÉ</span>' : ''}
            </h1>
          </div>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          
          <!-- Summary Section -->
          <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0F172A;">Résumé</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${summaryHTML}
            </table>
          </div>
          
          <!-- Details Section -->
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <div style="background: #f8fafc; padding: 16px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #0F172A;">Détails complets</h2>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8fafc;">
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #334155; border-bottom: 2px solid #e5e7eb;">Champ</th>
                  <th style="padding: 12px; text-align: left; font-weight: 600; color: #334155; border-bottom: 2px solid #e5e7eb;">Valeur</th>
                </tr>
              </thead>
              <tbody>
                ${detailsHTML}
              </tbody>
            </table>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            Données stockées dans Supabase (UE) — © 
            <a href="https://consult-chrono.fr" style="color: #0A6ABF; text-decoration: underline;">consult-chrono.fr</a>
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}

function renderText(record) {
  const lines = [];
  
  lines.push('NOUVELLE DEMANDE – CONSULT-CHRONO');
  lines.push('='.repeat(40));
  lines.push('');
  
  const summaryFields = ['nom', 'prenom', 'email', 'created_at', 'payment_status'];
  
  summaryFields.forEach(key => {
    if (record[key]) {
      const label = formatKey(key);
      const value = key === 'created_at' ? formatDateISO(record[key]) : formatValue(key, record[key]);
      lines.push(`${label}: ${value}`);
    }
  });
  
  lines.push('');
  lines.push('DÉTAILS COMPLETS:');
  lines.push('-'.repeat(20));
  
  Object.entries(record)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .filter(([key]) => !summaryFields.includes(key))
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => {
      const label = formatKey(key);
      const formattedValue = formatValue(key, value);
      lines.push(`${label}: ${formattedValue}`);
    });
  
  lines.push('');
  lines.push('Données stockées dans Supabase (UE) — © consult-chrono.fr');
  
  return lines.join('\n');
}

function renderCSV(record) {
  const entries = Object.entries(record)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  
  const header = 'Champ;Valeur\n';
  const rows = entries.map(([key, value]) => {
    const label = formatKey(key);
    const formattedValue = formatValue(key, value);
    const escapedLabel = `"${label.replace(/"/g, '""')}"`;
    const escapedValue = `"${formattedValue.replace(/"/g, '""')}"`;
    return `${escapedLabel};${escapedValue}`;
  }).join('\n');
  
  const csvContent = '\uFEFF' + header + rows; // UTF-8 BOM for Excel
  return Buffer.from(csvContent, 'utf8');
}
