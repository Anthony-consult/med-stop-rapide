#!/usr/bin/env node

// Script de test pour envoyer un email via Resend
import { Resend } from "resend";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement depuis .env
function loadEnv() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          env[key.trim()] = value.trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('⚠️  Impossible de charger .env, utilisation des variables système');
    return {};
  }
}

const env = loadEnv();

// Récupérer les variables d'environnement
const RESEND_API_KEY = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
const ALERT_RECIPIENT = process.env.ALERT_RECIPIENT || env.ALERT_RECIPIENT || "soniwork009@gmail.com";

console.log('📧 Test d\'envoi d\'email avec Resend\n');
console.log('Configuration:');
console.log('  - Destinataire:', ALERT_RECIPIENT);
console.log('  - Clé API Resend:', RESEND_API_KEY ? `✅ Configurée (${RESEND_API_KEY.substring(0, 10)}...)` : '❌ Manquante');
console.log('');

if (!RESEND_API_KEY) {
  console.error('❌ ERREUR: RESEND_API_KEY n\'est pas configurée');
  console.error('   Ajoutez RESEND_API_KEY dans votre fichier .env');
  process.exit(1);
}

if (!ALERT_RECIPIENT) {
  console.error('❌ ERREUR: ALERT_RECIPIENT n\'est pas configurée');
  console.error('   Ajoutez ALERT_RECIPIENT dans votre fichier .env');
  process.exit(1);
}

// Créer l'instance Resend
const resend = new Resend(RESEND_API_KEY);

// Email de test
const testEmail = {
  from: "onboarding@resend.dev",
  to: [ALERT_RECIPIENT],
  subject: "🧪 TEST EMAIL - Consult-Chrono",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0A6ABF 0%, #3B82F6 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { background: #f8fafc; padding: 24px; border: 1px solid #e5e7eb; }
        .alert { background: #fef3c7; border: 2px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
        .success { background: #d1fae5; border: 2px solid #10b981; padding: 16px; border-radius: 8px; margin-top: 20px; }
        .footer { text-align: center; padding: 16px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧪 TEST EMAIL – Consult-Chrono</h1>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ Ceci est un email de TEST</strong><br>
            Si vous recevez cet email, la configuration Resend fonctionne correctement ! ✅
          </div>
          
          <h2>Détails du test</h2>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
          <p><strong>Destinataire:</strong> ${ALERT_RECIPIENT}</p>
          <p><strong>Expéditeur:</strong> onboarding@resend.dev</p>
          <p><strong>Service:</strong> Resend API</p>
          
          <div class="success">
            <strong>✅ Email envoyé avec succès !</strong><br>
            Vérifiez votre boîte de réception (et les spams si nécessaire).
          </div>
        </div>
        <div class="footer">
          Données de test — © consult-chrono.fr
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
🧪 TEST EMAIL – CONSULT-CHRONO
================================

⚠️ Ceci est un email de TEST
Si vous recevez cet email, la configuration Resend fonctionne correctement ! ✅

Détails du test:
- Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
- Destinataire: ${ALERT_RECIPIENT}
- Expéditeur: onboarding@resend.dev
- Service: Resend API

✅ Email envoyé avec succès !
Vérifiez votre boîte de réception (et les spams si nécessaire).

Données de test — © consult-chrono.fr
  `
};

// Envoyer l'email
console.log('📤 Envoi de l\'email en cours...\n');

try {
  const result = await resend.emails.send(testEmail);
  
  console.log('✅ Email envoyé avec succès !\n');
  console.log('Détails:');
  console.log('  - ID Email:', result.id || 'N/A');
  console.log('  - Destinataire:', ALERT_RECIPIENT);
  console.log('  - Expéditeur: onboarding@resend.dev');
  console.log('  - Sujet: 🧪 TEST EMAIL - Consult-Chrono');
  console.log('\n📬 Vérifiez votre boîte Gmail dans quelques secondes !');
  console.log('   (Pensez à vérifier les spams si vous ne le voyez pas)');
  console.log('\n💡 Vous pouvez aussi vérifier dans Resend Dashboard:');
  console.log('   https://resend.com/emails');
  
  process.exit(0);
} catch (error) {
  console.error('\n❌ ERREUR lors de l\'envoi de l\'email:\n');
  console.error('Message:', error.message);
  if (error.response) {
    console.error('Détails:', JSON.stringify(error.response, null, 2));
  }
  console.error('\n💡 Vérifiez:');
  console.error('   - Que RESEND_API_KEY est correcte');
  console.error('   - Que ALERT_RECIPIENT est une adresse email valide');
  console.error('   - Les logs Resend Dashboard pour plus de détails');
  
  process.exit(1);
}

