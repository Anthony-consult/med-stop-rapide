import { formatKey, formatValue, formatDateISO } from './format';

export interface EmailResult {
  html: string;
  text: string;
  csv?: Buffer;
}

/**
 * Renders a consultation email with HTML, text, and CSV formats
 */
export function renderConsultEmail(record: Record<string, any>): EmailResult {
  const html = renderHTML(record);
  const text = renderText(record);
  const csv = renderCSV(record);
  
  return { html, text, csv };
}

/**
 * Renders HTML email template
 */
function renderHTML(record: Record<string, any>): string {
  const paymentStatus = record.payment_status === 'done';
  const hasLogo = true; // Assume logo exists in public folder
  
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
      // Put summary fields first
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

/**
 * Renders plain text version
 */
function renderText(record: Record<string, any>): string {
  const lines: string[] = [];
  
  lines.push('NOUVELLE DEMANDE – CONSULT-CHRONO');
  lines.push('='.repeat(40));
  lines.push('');
  
  // Summary fields first
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
  
  // All other fields
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

/**
 * Renders CSV attachment
 */
function renderCSV(record: Record<string, any>): Buffer {
  const entries = Object.entries(record)
    .filter(([key, value]) => value !== null && value !== undefined && value !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  
  // CSV with semicolon delimiter and UTF-8 BOM for Excel compatibility
  const header = 'Champ;Valeur\n';
  const rows = entries.map(([key, value]) => {
    const label = formatKey(key);
    const formattedValue = formatValue(key, value);
    // Escape semicolons and quotes in CSV
    const escapedLabel = `"${label.replace(/"/g, '""')}"`;
    const escapedValue = `"${formattedValue.replace(/"/g, '""')}"`;
    return `${escapedLabel};${escapedValue}`;
  }).join('\n');
  
  const csvContent = '\uFEFF' + header + rows; // UTF-8 BOM for Excel
  return Buffer.from(csvContent, 'utf8');
}
