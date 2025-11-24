// Test endpoint pour vérifier l'envoi d'email avec Resend
// Utilise la même logique que new-lead.js mais sans authentification webhook

import nodemailer from "nodemailer";
import { Resend } from "resend";

// Import des fonctions de rendu depuis new-lead.js
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

function formatDateSimple(date) {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Europe/Paris'
    }).format(dateObj);
  } catch (error) {
    return '';
  }
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === '') return '';
  
  const dateOnlyFields = ['date_debut', 'date_fin', 'date_naissance'];
  if (dateOnlyFields.includes(key)) {
    return formatDateSimple(value);
  }
  
  return String(value);
}

function renderHTML(record) {
  const paymentStatus = record.payment_status === 'done';
  
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
      <title>🧪 TEST EMAIL - Consult-Chrono</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #0F172A;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #0A6ABF 0%, #3B82F6 100%); padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
            🧪 TEST EMAIL – Consult-Chrono
            ${paymentStatus ? '<span style="background: #10B981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 8px;">PAYÉ</span>' : ''}
          </h1>
        </div>
        <div style="padding: 24px;">
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-weight: 600; color: #92400e;">⚠️ Ceci est un email de TEST</p>
            <p style="margin: 8px 0 0 0; color: #92400e;">Si vous recevez cet email, la configuration Resend fonctionne correctement ! ✅</p>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0F172A;">Résumé</h2>
            <table style="width: 100%; border-collapse: collapse;">
              ${summaryHTML}
            </table>
          </div>
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
        <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            Données de test — © consult-chrono.fr
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function renderText(record) {
  const lines = [];
  lines.push('🧪 TEST EMAIL – CONSULT-CHRONO');
  lines.push('='.repeat(40));
  lines.push('');
  lines.push('⚠️ Ceci est un email de TEST');
  lines.push('Si vous recevez cet email, la configuration Resend fonctionne correctement ! ✅');
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
  lines.push('Données de test — © consult-chrono.fr');
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
  
  const csvContent = '\uFEFF' + header + rows;
  return Buffer.from(csvContent, 'utf8');
}

function renderConsultEmail(record) {
  const html = renderHTML(record);
  const text = renderText(record);
  const csv = renderCSV(record);
  return { html, text, csv };
}

export default async function handler(req, res) {
  // Allow GET and POST for easy testing
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.ALERT_RECIPIENT || "soniwork009@gmail.com";

    if (!RESEND_API_KEY) {
      return res.status(500).json({ 
        ok: false, 
        error: 'RESEND_API_KEY not configured',
        hint: 'Add RESEND_API_KEY to your environment variables'
      });
    }

    if (!TO) {
      return res.status(500).json({ 
        ok: false, 
        error: 'ALERT_RECIPIENT not configured',
        hint: 'Add ALERT_RECIPIENT to your environment variables'
      });
    }

    console.log('📧 Testing email send with Resend...');
    console.log('📧 To:', TO);
    console.log('📧 Resend API Key:', RESEND_API_KEY ? '✅ Set (length: ' + RESEND_API_KEY.length + ')' : '❌ Missing');

    // Créer des données de test
    const testRecord = {
      id: 'test-' + Date.now(),
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@example.com',
      telephone: '06 12 34 56 78',
      date_naissance: '1985-03-15',
      maladie_presumee: 'Grippe',
      created_at: new Date().toISOString(),
      payment_status: 'done',
    };

    const subject = `🧪 TEST EMAIL – ${testRecord.prenom} ${testRecord.nom}`;
    const { html, text, csv } = renderConsultEmail(testRecord);

    // Utiliser le domaine par défaut de Resend pour les tests
    // Si vous avez vérifié votre domaine, utilisez: "Consult-Chrono <notifications@consult-chrono.fr>"
    // Sinon utilisez le domaine de test: "onboarding@resend.dev"
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    
    const resend = new Resend(RESEND_API_KEY);
    
    console.log('📧 Sending email...');
    console.log('📧 From:', fromEmail);
    
    const result = await resend.emails.send({
      from: fromEmail,
      to: [TO],
      subject,
      html,
      text,
      attachments: csv ? [{
        filename: `test_consultation_${testRecord.id}.csv`,
        content: csv.toString('base64'),
        contentType: 'text/csv'
      }] : undefined,
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Result ID:', result?.id);

    return res.status(200).json({ 
      ok: true,
      message: 'Test email sent successfully!',
      to: TO,
      from: fromEmail,
      subject,
      emailId: result?.id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("❌ Email test error:", err);
    return res.status(500).json({ 
      ok: false, 
      error: err?.message ?? "unknown",
      details: err?.response?.data ?? err?.stack
    });
  }
}

