# ⚙️ Configuration Cloudflare Pages Functions

## 🚨 PROBLÈME : Erreur 405 Method Not Allowed

L'erreur `405 (Method Not Allowed)` sur `/api/checkout` indique que Cloudflare Pages ne trouve pas la fonction.

## ✅ SOLUTION : Structure Cloudflare Pages Functions

Cloudflare Pages utilise un système de fonctions différent de Vercel :

- **Vercel** : Fonctions dans `/api/` avec format `export default async function handler(req, res)`
- **Cloudflare Pages** : Fonctions dans `/functions/` avec format `export async function onRequestPost(context)`

## 📁 Structure des Fichiers

Les fonctions ont été créées dans :
```
functions/
  api/
    checkout.js          → /api/checkout
    stripe/
      webhook.js         → /api/stripe/webhook
    internal/
      new-lead.js        → /api/internal/new-lead
```

## 🔧 Variables d'Environnement Requises

Ajoutez ces variables dans **Cloudflare Pages → Settings → Environment Variables** :

### Obligatoires pour Checkout
- `STRIPE_SECRET_KEY` = `sk_test_...` ou `sk_live_...`
- `STRIPE_PRICE_ID` = `price_...` (optionnel, valeur par défaut utilisée)
- `STRIPE_SUCCESS_URL` = `https://med-stop-rapide.pages.dev/payment/success?session_id={CHECKOUT_SESSION_ID}` (optionnel)
- `STRIPE_CANCEL_URL` = `https://med-stop-rapide.pages.dev/` (optionnel)

### Obligatoires pour Webhook
- `STRIPE_SECRET_KEY` = `sk_test_...` ou `sk_live_...`
- `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- `VITE_SUPABASE_URL` = `https://mfzqyjjxhyytpgobllkz.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGci...` (clé service_role)

### Obligatoires pour Email
- `RESEND_API_KEY` = `re_...`
- `ALERT_RECIPIENT` = `soniwork009@gmail.com`
- `SUPABASE_WEBHOOK_TOKEN` = (token aléatoire pour sécurité)

## 🚀 Déploiement

1. **Poussez les changements** sur GitHub
2. **Cloudflare Pages** redéploiera automatiquement
3. **Attendez 2-3 minutes** que le déploiement se termine
4. **Testez** le formulaire

## 🧪 Test

Après le déploiement, testez :

1. Remplissez le formulaire
2. Cliquez sur "Payer"
3. Vérifiez la console (F12) - **Plus d'erreur 405** ✅
4. Vous devriez être redirigé vers Stripe

## 📚 Documentation

- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)

