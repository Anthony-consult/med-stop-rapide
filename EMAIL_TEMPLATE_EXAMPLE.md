# 📧 Exemple de Template Email - Consult-Chrono

## 🎯 Fonctionnalités Implémentées

### ✅ Template HTML Professionnel
- **Design moderne** avec branding Consult-Chrono
- **Header avec gradient** (#0A6ABF → #3B82F6)
- **Logo intégré** (logo-big.png)
- **Badge "PAYÉ"** si `payment_status === "done"`
- **Responsive** compatible Gmail, Apple Mail, Outlook

### ✅ Sections Structurées
- **Résumé** : Nom, Prénom, Email, Date, Statut paiement
- **Détails complets** : Tableau avec tous les champs
- **Footer** avec mentions légales

### ✅ Sécurité
- **Masquage automatique** des champs sensibles :
  - NIR : `1850312345678` → `185********78`
  - Sécurité sociale : `1234567890123` → `123********23`
- **Détection par mots-clés** : `nir`, `securite_sociale`

### ✅ Formats Multiples
- **HTML** : Version complète avec design
- **Texte brut** : Version lisible sans HTML
- **CSV** : Export Excel avec délimiteur `;` et UTF-8 BOM

## 📋 Exemple de Rendu

### Données d'entrée
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "telephone": "06 12 34 56 78",
  "date_naissance": "1985-03-15",
  "nir": "1850312345678",
  "maladie_presumee": "Grippe",
  "created_at": "2025-01-07T18:51:00Z",
  "payment_status": "done"
}
```

### Email généré
- **Sujet** : "Nouvelle demande – Jean Dupont"
- **HTML** : Template complet avec design
- **Texte** : Version simplifiée
- **CSV** : `consultation_123e4567-e89b-12d3-a456-426614174000.csv`

## 🔧 Configuration

### Variables d'environnement
```bash
# Obligatoire
SUPABASE_WEBHOOK_TOKEN=your-secret-token

# SMTP (Option A)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@consult-chrono.fr
SMTP_PASS=your-password

# Ou Resend (Option B)
RESEND_API_KEY=re_your_api_key

# Optionnel
ALERT_RECIPIENT=contact@consult-chrono.fr
```

### Test de l'endpoint
```bash
curl -X POST https://consult-chrono.fr/api/internal/new-lead \
  -H "x-webhook-token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "record": {
      "prenom": "Test",
      "nom": "User",
      "email": "test@example.com",
      "payment_status": "done"
    }
  }'
```

## 🎨 Design Details

### Couleurs
- **Primary** : #0A6ABF (Consult-Chrono blue)
- **Gradient** : #0A6ABF → #3B82F6
- **Success** : #10B981 (Badge PAYÉ)
- **Text** : #0F172A (Dark mode safe)
- **Background** : #F8FAFC

### Typographie
- **Font** : System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headers** : 20px, 600 weight
- **Body** : 14-16px, normal weight
- **Small** : 12px (footer)

### Structure
- **Max-width** : 600px
- **Padding** : 24px (content), 20px (header)
- **Borders** : #E5E7EB, 1px
- **Border-radius** : 8px

## 🔒 Sécurité et Conformité

- ✅ **RGPD** : Données stockées en UE (Supabase)
- ✅ **Masquage** : Champs sensibles automatiquement masqués
- ✅ **Authentification** : Token webhook requis
- ✅ **HTTPS** : Communication sécurisée
- ✅ **Logs** : Erreurs trackées côté serveur

## 📱 Compatibilité

### Clients Email Testés
- ✅ **Gmail** (Web + Mobile)
- ✅ **Apple Mail** (macOS + iOS)
- ✅ **Outlook** (Web + Desktop)
- ✅ **Thunderbird**
- ✅ **Yahoo Mail**

### Fonctionnalités
- ✅ **Dark mode** : Couleurs optimisées
- ✅ **Images** : Logo avec fallback
- ✅ **Tables** : Compatible tous clients
- ✅ **Attachments** : CSV avec UTF-8 BOM
- ✅ **Responsive** : Mobile-friendly

## 🚀 Déploiement

1. **Variables d'environnement** dans Vercel Project Settings
2. **Déploiement** automatique via Vercel
3. **Test** de l'endpoint en production
4. **Configuration** du trigger Supabase

L'endpoint est prêt à recevoir les nouvelles demandes et à envoyer des emails professionnels ! 🎉
