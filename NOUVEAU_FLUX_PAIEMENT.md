# ✅ Nouveau Flux de Paiement - Stripe → Supabase

## 📋 Résumé des Modifications

### ✅ Ce qui a été fait

1. **Supprimé** : Insertion Supabase à l'étape 19 (Step20.tsx)
2. **Créé** : API `/api/checkout.js` pour créer la session Stripe
3. **Modifié** : Webhook Stripe fait un **INSERT** (au lieu d'UPDATE)
4. **Résultat** : `payment_status = 'done'` directement (pas de `pending`)

---

## 🔄 Nouveau Flux

```
┌─────────────────┐
│  Étape 19       │
│  (Step20.tsx)   │
│                 │
│  - Utilisateur  │
│    clique sur   │
│    "Payer 14 €" │
└────────┬────────┘
         │
         │ POST /api/checkout
         │ { formData: {...} }
         ▼
┌─────────────────┐
│  /api/checkout  │
│                 │
│  - Crée session │
│    Stripe       │
│  - metadata =   │
│    formData     │
│  - Retourne URL │
└────────┬────────┘
         │
         │ Redirection
         ▼
┌─────────────────┐
│  Stripe         │
│  Checkout       │
│                 │
│  - Paiement     │
│    14 € (CB)    │
└────────┬────────┘
         │
         │ checkout.session.completed
         ▼
┌─────────────────┐
│  Webhook        │
│  /api/stripe/   │
│   webhook       │
│                 │
│  - Parse        │
│    metadata     │
│  - INSERT dans  │
│    Supabase     │
│  - payment_     │
│    status='done'│
└────────┬────────┘
         │
         │ Trigger DB
         ▼
┌─────────────────┐
│  Email auto     │
│  (trigger DB)   │
│                 │
│  - Envoi email  │
│    confirmation │
└─────────────────┘
```

---

## 📁 Fichiers Modifiés

### 1. `/api/checkout.js` (CRÉÉ)
- Crée une session Stripe Checkout
- Stocke `formData` dans `metadata` (JSON stringifié)
- Montant : 14 € (1400 cents)
- Retourne l'URL Stripe au front

### 2. `src/components/form/steps/Step20.tsx` (MODIFIÉ)
- ❌ Plus d'insertion Supabase
- ✅ Appel `POST /api/checkout`
- ✅ Redirection vers Stripe avec l'URL reçue

### 3. `api/stripe/webhook.js` (MODIFIÉ)
- ❌ Plus d'UPDATE
- ✅ **INSERT** directement
- ✅ `payment_status = 'done'`
- ✅ Parse `session.metadata.formData`

---

## 🚀 Déploiement

### Étape 1 : Commit & Push

```bash
git add .
git commit -m "feat: Nouveau flux paiement - Stripe puis Supabase via webhook"
git push origin main
```

### Étape 2 : Attendre le Déploiement Vercel

- Va sur **Vercel Dashboard**
- Attends que le statut soit **"Ready"** (2-3 minutes)
- Vérifie que les **Functions** sont déployées :
  - `api/checkout.js`
  - `api/stripe/webhook.js`

---

## 🧪 Test du Flux Complet

### 1. Tester le Formulaire

```bash
# Sur ton site
https://consult-chrono.fr/consultation
```

1. **Remplis** le formulaire (ou utilise le bouton de remplissage auto si disponible)
2. **Arrive** à l'étape 19 (Paiement)
3. **Accepte** les CGU
4. **Clique** sur "Payer 14 €"

### 2. Vérifier la Console Navigateur

Tu devrais voir :

```
💳 Création de la session Stripe...
✅ Session Stripe créée
🔗 Stripe URL: https://checkout.stripe.com/c/pay/...
🚀 Redirecting to Stripe Checkout...
```

### 3. Paiement Stripe

- **Carte test** : `4242 4242 4242 4242`
- **Date** : N'importe quelle date future
- **CVC** : N'importe quel 3 chiffres
- **Nom** : N'importe quoi

### 4. Vérifier les Logs Vercel (IMPORTANT)

Après le paiement, va sur **Vercel Dashboard** → **Logs**

Tu devrais voir dans l'ordre :

```
💳 /api/checkout called - Method: POST
📝 Form data received: { email: "...", nom_prenom: "..." }
✅ Stripe session created: cs_test_...
🔗 Checkout URL: https://checkout.stripe.com/...

---

🔔 Webhook called - Method: POST
🔐 Verifying signature...
✅ Signature verified successfully
📥 Stripe webhook event: checkout.session.completed
💰 CHECKOUT SESSION COMPLETED
📦 Form data JSON exists: true
✅ Form data parsed successfully
📝 Attempting to insert into Supabase...
💾 Inserting consultation with payment_status = done
✅ CONSULTATION INSERTED SUCCESSFULLY!
✅ Consultation ID: xxx-xxx-xxx
✅ Payment status: done
```

### 5. Vérifier Supabase

Va sur **Supabase** → **Table Editor** → `consultations`

Tu devrais voir :
- **1 nouvelle ligne** créée
- `payment_status` = `'done'`
- `payment_id` = `pi_xxx...` (Payment Intent Stripe)
- Tous les champs remplis

### 6. Vérifier l'Email

- L'email automatique devrait être envoyé (si trigger DB configuré)
- Vérifie la boîte mail du client

---

## 🐛 Debugging

### Problème : Pas de redirection vers Stripe

**Console navigateur** :
```
❌ Erreur lors de la création de la session
```

**Causes possibles** :
- Variable `STRIPE_SECRET_KEY` manquante dans Vercel
- API `/api/checkout.js` non déployée

**Solution** :
```bash
# Vérifie les variables Vercel
Vercel Dashboard → Settings → Environment Variables

# Redéploie si nécessaire
git commit --allow-empty -m "redeploy"
git push origin main
```

### Problème : Webhook ne s'exécute pas

**Logs Vercel** :
```
(rien)
```

**Causes possibles** :
- URL webhook incorrecte dans Stripe
- Événement `checkout.session.completed` non coché

**Solution** :
1. Stripe Dashboard → Webhooks
2. Vérifie URL : `https://consult-chrono.fr/api/stripe/webhook`
3. Vérifie Events : ✅ `checkout.session.completed`

### Problème : "Signature verification failed"

**Logs Vercel** :
```
❌ Webhook signature verification failed
```

**Cause** :
- `STRIPE_WEBHOOK_SECRET` incorrect ou manquant

**Solution** :
1. Stripe Dashboard → Webhooks → Ton webhook → **Signing secret**
2. Copie la valeur (`whsec_...`)
3. Vercel → Environment Variables → `STRIPE_WEBHOOK_SECRET`
4. Sauvegarde et redéploie

### Problème : "No formData found in session metadata"

**Logs Vercel** :
```
❌ No formData found in session metadata
```

**Cause** :
- API `/api/checkout` ne passe pas les données

**Solution** :
1. Vérifie que `/api/checkout.js` est bien déployé
2. Regarde les logs `💳 /api/checkout called`
3. Vérifie que `formData` est bien dans le body

### Problème : Erreur Supabase (RLS)

**Logs Vercel** :
```
❌ SUPABASE ERROR: { code: "42501", message: "new row violates row-level security policy" }
```

**Cause** :
- `SUPABASE_SERVICE_ROLE_KEY` manquant ou incorrect

**Solution** :
1. Supabase → Settings → API → **service_role key**
2. Copie la clé (commence par `eyJhbGci...`)
3. Vercel → Environment Variables → `SUPABASE_SERVICE_ROLE_KEY`
4. Sauvegarde et redéploie

---

## ✅ Checklist Finale

Avant de tester :

- [ ] Variables d'environnement dans Vercel :
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Webhook Stripe configuré :
  - [ ] URL : `https://consult-chrono.fr/api/stripe/webhook`
  - [ ] Event : `checkout.session.completed` ✅
- [ ] Code déployé sur Vercel (Status: Ready)
- [ ] Functions déployées (`/api/checkout`, `/api/stripe/webhook`)

Après le test :

- [ ] Redirection vers Stripe fonctionne
- [ ] Paiement test réussi (4242...)
- [ ] Logs Vercel montrent `✅ CONSULTATION INSERTED`
- [ ] Ligne créée dans Supabase avec `payment_status = 'done'`
- [ ] Email automatique reçu

---

## 🎉 Résultat Attendu

1. **Utilisateur** clique sur "Payer 14 €"
2. **Redirection** vers Stripe Checkout
3. **Paiement** avec carte bancaire
4. **Webhook** reçoit `checkout.session.completed`
5. **Insertion** dans Supabase avec `payment_status = 'done'`
6. **Email** envoyé automatiquement (via trigger DB)
7. **Aucun doublon**, **aucun pending**

---

## 📞 Support

Si problème :
1. **Copie** tous les logs Vercel
2. **Vérifie** Supabase Table Editor
3. **Consulte** ce document pour le debugging

---

**Tout est prêt ! 🚀**

