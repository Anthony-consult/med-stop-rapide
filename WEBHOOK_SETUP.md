# 🔗 Configuration du Webhook - Consult-Chrono

## 🏗️ Architecture

Ce projet utilise **Vite + React** avec **Vercel Functions** pour l'endpoint webhook.

**Fichier de l'endpoint :** `api/internal/new-lead.js`

## 📋 Variables d'Environnement Requises

Ajoutez ces variables dans votre fichier `.env.local` et dans Vercel Project Settings → Environment Variables :

### 🔐 Sécurité (Obligatoire)
```bash
SUPABASE_WEBHOOK_TOKEN=your-strong-long-random-token
```

### 📧 SMTP Hostinger (Option A - Par défaut)
```bash
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@consult-chrono.fr
SMTP_PASS=your-smtp-password
```

### 🚀 Resend (Option B - Optionnel)
```bash
RESEND_API_KEY=re_your_api_key_here
```

### 📬 Email (Optionnel)
```bash
ALERT_RECIPIENT=contact@consult-chrono.fr  # Destinataire des notifications (défaut: contact@consult-chrono.fr)
```

## 🎯 Endpoint Webhook

**URL :** `https://consult-chrono.fr/api/internal/new-lead`

**Méthode :** POST

**Headers requis :**
```
x-webhook-token: <SUPABASE_WEBHOOK_TOKEN>
Content-Type: application/json
```

**Payload :**
```json
{
  "record": {
    "id": "uuid",
    "prenom": "John",
    "nom": "Doe",
    "email": "john@example.com",
    "maladie_presumee": "Grippe",
    "created_at": "2025-01-07T10:00:00Z",
    // ... autres champs de la table
  }
}
```

**Réponse de succès :**
```json
{
  "ok": true
}
```

**Réponse d'erreur :**
```json
{
  "ok": false,
  "error": "Error message"
}
```

## 🔧 Configuration Supabase

Dans Supabase, configurez un trigger qui appellera cet endpoint :

```sql
-- Exemple de trigger (à adapter selon votre table)
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://consult-chrono.fr/api/internal/new-lead',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-webhook-token', 'your-webhook-token-here'
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
CREATE TRIGGER new_lead_notification
  AFTER INSERT ON votre_table_demandes
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();
```

## 📧 Template d'Email Professionnel

L'endpoint envoie un email HTML professionnel avec :

### ✨ Fonctionnalités
- **Sujet :** "Nouvelle demande – [Prénom] [Nom]"
- **Format :** HTML + texte brut + CSV en pièce jointe
- **Design :** Template moderne avec branding Consult-Chrono
- **Sécurité :** Masquage des champs sensibles (NIR, sécurité sociale)
- **Responsive :** Compatible Gmail, Apple Mail, Outlook

### 📋 Contenu
- **Section Résumé :** Nom, Email, Date, Statut paiement
- **Section Détails :** Toutes les données de la consultation
- **Badge PAYÉ :** Affiché si `payment_status === "done"`
- **Logo :** Intégré dans l'en-tête
- **Pièce jointe CSV :** Export complet des données

### 🎨 Design
- Couleurs du site (#0A6ABF, gradients)
- Typographie système (compatible email)
- Bordures et espacements optimisés
- Footer avec mentions légales

## 🚀 Déploiement

### Option 1: Vercel (Recommandé)
1. Définissez les variables d'environnement dans Vercel Project Settings
2. Déployez le projet sur Vercel
3. L'endpoint sera automatiquement disponible à : `https://votre-domaine.vercel.app/api/internal/new-lead`

### Option 2: Autre plateforme serverless
- Adaptez le fichier `api/internal/new-lead.js` selon votre plateforme
- Déployez sur AWS Lambda, Netlify Functions, etc.

### Test local (avec Vercel CLI)
```bash
# Installer Vercel CLI
npm i -g vercel

# Tester localement
vercel dev

# Tester l'endpoint
curl -X POST http://localhost:3000/api/internal/new-lead \
  -H "x-webhook-token: your-token" \
  -H "Content-Type: application/json" \
  -d '{"record":{"prenom":"Test","nom":"User"}}'
```

### Configuration finale
4. Configurez le trigger Supabase avec l'URL de production

## 🔒 Sécurité

- L'endpoint vérifie le token `x-webhook-token`
- Retourne 401 si le token est manquant ou incorrect
- Logs les erreurs côté serveur
- Gestion d'erreur robuste avec try/catch
