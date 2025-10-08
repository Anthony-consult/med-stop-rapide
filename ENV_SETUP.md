# 🔐 Configuration des Variables d'Environnement

## 📋 Variables Requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```bash
# =====================================
# 🗄️ SUPABASE CONFIGURATION
# =====================================

# URL de votre projet Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co

# Clé publique Supabase (safe pour le client)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Clé de service Supabase (SERVEUR UNIQUEMENT - jamais exposée au client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here


# =====================================
# 💳 STRIPE CONFIGURATION
# =====================================

# Clé secrète Stripe (depuis https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...  # ou sk_test_... pour le mode test

# Secret du webhook Stripe (généré lors de la création du webhook)
STRIPE_WEBHOOK_SECRET=whsec_...


# =====================================
# 📧 EMAIL & NOTIFICATIONS
# =====================================

# Token partagé pour sécuriser le webhook Supabase → Backend
SUPABASE_WEBHOOK_TOKEN=your-strong-random-token

# OPTION A: SMTP Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@consult-chrono.fr
SMTP_PASS=your-smtp-password

# OPTION B: Resend (Alternative à SMTP)
RESEND_API_KEY=re_...

# Destinataire des notifications (optionnel, défaut: contact@consult-chrono.fr)
ALERT_RECIPIENT=contact@consult-chrono.fr
```

---

## 🔍 Où Trouver Ces Valeurs ?

### Supabase

1. **Connectez-vous** à [Supabase Dashboard](https://supabase.com/dashboard)
2. **Sélectionnez** votre projet
3. **Allez dans** : Settings → API
4. **Copiez** :
   - `URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **SECRET**

### Stripe

1. **Connectez-vous** à [Stripe Dashboard](https://dashboard.stripe.com)
2. **Allez dans** : Developers → API keys
3. **Copiez** :
   - `Secret key` → `STRIPE_SECRET_KEY`
4. **Pour le webhook** :
   - Allez dans : Developers → Webhooks
   - Créez un endpoint : `https://consult-chrono.fr/api/stripe/webhook`
   - Copiez le `Signing secret` → `STRIPE_WEBHOOK_SECRET`

### SMTP Hostinger

1. **Connectez-vous** à votre panneau Hostinger
2. **Allez dans** : Email Accounts
3. **Créez ou gérez** : `contact@consult-chrono.fr`
4. **Utilisez** :
   - Host: `smtp.hostinger.com`
   - Port: `465` (SSL) ou `587` (TLS)
   - User: `contact@consult-chrono.fr`
   - Pass: Le mot de passe de votre compte email

### Resend (Alternative)

1. **Créez un compte** sur [resend.com](https://resend.com)
2. **Vérifiez** votre domaine `consult-chrono.fr`
3. **Créez une API key**
4. **Copiez** : `re_...` → `RESEND_API_KEY`

---

## ⚙️ Configuration Vercel

### En Production (Vercel Dashboard)

1. **Allez dans** : Vercel Dashboard → Votre projet → Settings → Environment Variables
2. **Ajoutez** toutes les variables ci-dessus
3. **Sélectionnez** : Production, Preview, Development
4. **Redéployez** pour appliquer les changements

### Via Vercel CLI

```bash
# Ajouter une variable
vercel env add STRIPE_SECRET_KEY

# Lister les variables
vercel env ls

# Retirer une variable
vercel env rm VARIABLE_NAME
```

---

## 🔒 Sécurité

### ⚠️ Variables SENSIBLES (ne jamais exposer au client)

- `SUPABASE_SERVICE_ROLE_KEY` - Contourne les RLS policies
- `STRIPE_SECRET_KEY` - Accès complet à votre compte Stripe
- `STRIPE_WEBHOOK_SECRET` - Vérification des webhooks
- `SMTP_PASS` - Mot de passe email
- `RESEND_API_KEY` - Clé API Resend
- `SUPABASE_WEBHOOK_TOKEN` - Token de sécurité webhook

### ✅ Variables PUBLIQUES (safe pour le client)

- `VITE_SUPABASE_URL` - URL publique
- `VITE_SUPABASE_ANON_KEY` - Clé publique avec RLS

---

## 🧪 Test en Local

```bash
# 1. Copier l'exemple
cp .env.local.example .env.local

# 2. Remplir les valeurs
nano .env.local

# 3. Tester avec Vercel CLI
vercel dev

# 4. Tester le webhook Stripe en local
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

---

## 📝 Checklist Pré-Déploiement

- [ ] Toutes les variables d'environnement configurées dans Vercel
- [ ] Clés Stripe en mode `live` (pas `test`)
- [ ] Webhook Stripe configuré avec l'URL de production
- [ ] SMTP ou Resend configuré et testé
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée (serveur uniquement)
- [ ] `SUPABASE_WEBHOOK_TOKEN` généré (token fort)
- [ ] URLs de succès/annulation configurées dans Stripe Payment Link
- [ ] Test de bout en bout effectué

---

## 🆘 Dépannage

### Erreur "Missing environment variable"

1. Vérifiez que la variable est bien définie dans `.env.local` (local) ou Vercel (production)
2. Redémarrez `vercel dev` après modification
3. Vérifiez l'orthographe exacte de la variable

### Webhook ne fonctionne pas

1. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
2. Testez avec "Send test webhook" dans Stripe Dashboard
3. Consultez les logs Vercel pour voir les erreurs

### Emails ne partent pas

1. Vérifiez les credentials SMTP ou la clé Resend
2. Testez avec `curl` l'endpoint `/api/internal/new-lead`
3. Vérifiez les logs Vercel pour les erreurs SMTP

---

## 📚 Documentation Complète

- [STRIPE_SETUP.md](./STRIPE_SETUP.md) - Configuration Stripe détaillée
- [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) - Configuration webhooks emails
- [EMAIL_TEMPLATE_EXAMPLE.md](./EMAIL_TEMPLATE_EXAMPLE.md) - Template emails

---

✅ Une fois toutes les variables configurées, le système est prêt pour la production !

