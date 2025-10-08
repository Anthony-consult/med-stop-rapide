# 🔐 Variables d'Environnement Vercel - Guide Complet

## 📋 Variables OBLIGATOIRES

Va sur : **https://vercel.com/dashboard** → Ton projet → **Settings** → **Environment Variables**

---

### 1️⃣ VITE_SUPABASE_URL

**Où la trouver** :
1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. Settings → API
4. **Project URL** (copie l'URL complète)

**Format** : `https://xxxxxxxxxxxxx.supabase.co`

**Dans Vercel** :
- Name : `VITE_SUPABASE_URL`
- Value : `https://ton-projet.supabase.co`
- Environment : ✅ Production, ✅ Preview, ✅ Development

---

### 2️⃣ VITE_SUPABASE_ANON_KEY

**Où la trouver** :
1. Supabase Dashboard → Settings → API
2. **Project API keys** → **anon public**
3. Copie la clé (commence par `eyJhbGci...`)

**Format** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (très long)

**Dans Vercel** :
- Name : `VITE_SUPABASE_ANON_KEY`
- Value : `eyJhbGci...` (la clé publique)
- Environment : ✅ Production, ✅ Preview, ✅ Development

---

### 3️⃣ SUPABASE_SERVICE_ROLE_KEY ⚠️ SENSIBLE

**Où la trouver** :
1. Supabase Dashboard → Settings → API
2. **Project API keys** → **service_role**
3. Click "Reveal" → Copie la clé

**Format** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (différent de anon!)

**Dans Vercel** :
- Name : `SUPABASE_SERVICE_ROLE_KEY`
- Value : `eyJhbGci...` (la clé service_role - PAS la même que anon!)
- Environment : ✅ Production, ✅ Preview, ✅ Development

⚠️ **ATTENTION** : Cette clé bypass la sécurité RLS ! Ne JAMAIS l'exposer côté client !

---

### 4️⃣ STRIPE_SECRET_KEY

**Où la trouver** :
1. Va sur https://dashboard.stripe.com
2. **Active le mode TEST** (toggle en haut à droite)
3. Developers → API keys
4. **Secret key** → Reveal → Copie

**Format** : `sk_test_51...` (commence par sk_test_ en mode test)

**Dans Vercel** :
- Name : `STRIPE_SECRET_KEY`
- Value : `sk_test_51...`
- Environment : ✅ Production, ✅ Preview, ✅ Development

---

### 5️⃣ STRIPE_WEBHOOK_SECRET

**Où la trouver** :
1. Stripe Dashboard (mode TEST) → Developers → Webhooks
2. **Si tu n'as PAS encore créé le webhook** :
   - Click "Add endpoint"
   - URL : `https://consult-chrono.fr/api/stripe/webhook`
   - Events : ✅ `checkout.session.completed`
   - Add endpoint
3. Click sur ton webhook
4. **Signing secret** → Click to reveal → Copie

**Format** : `whsec_...` (commence par whsec_)

**Dans Vercel** :
- Name : `STRIPE_WEBHOOK_SECRET`
- Value : `whsec_...`
- Environment : ✅ Production, ✅ Preview, ✅ Development

---

## 🎯 Récapitulatif

Tu dois avoir **exactement 5 variables** dans Vercel :

```bash
✅ VITE_SUPABASE_URL          = https://xxxxx.supabase.co
✅ VITE_SUPABASE_ANON_KEY     = eyJhbGci... (clé publique)
✅ SUPABASE_SERVICE_ROLE_KEY  = eyJhbGci... (clé privée - DIFFÉRENTE)
✅ STRIPE_SECRET_KEY          = sk_test_51...
✅ STRIPE_WEBHOOK_SECRET      = whsec_...
```

**Pour CHAQUE variable** :
- Environment : **Production + Preview + Development** (les 3 cochés)

---

## ⚠️ Erreurs Fréquentes

### ❌ "anon key" au lieu de "service_role key"

**Problème** : Tu as mis la même clé pour `VITE_SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY`

**Solution** : Ce sont 2 clés DIFFÉRENTES !
- `VITE_SUPABASE_ANON_KEY` = clé **publique** (anon public)
- `SUPABASE_SERVICE_ROLE_KEY` = clé **privée** (service_role)

### ❌ Mode LIVE au lieu de TEST

**Problème** : Tu utilises `sk_live_...` au lieu de `sk_test_...`

**Solution** : 
- Active le **mode TEST** dans Stripe (toggle en haut)
- Utilise `sk_test_...` pour les tests
- Utilise `whsec_...` du webhook en mode TEST

### ❌ Variables non cochées pour tous les environnements

**Problème** : Tu as coché seulement "Production"

**Solution** : Coche **Production + Preview + Development** pour chaque variable

---

## 🔄 Après Avoir Ajouté les Variables

**1. Redéploie le projet** :
- Vercel Dashboard → Deployments
- Dernier déploiement → `⋮` → Redeploy
- **Décoche** "Use existing Build Cache"
- Redeploy

**2. Attends 2-3 minutes**

**3. Teste** :
```bash
# Page de succès
https://consult-chrono.fr/payment/success

# Webhook
curl -X POST https://consult-chrono.fr/api/stripe/webhook
```

---

## ✅ Vérification Finale

Une fois toutes les variables ajoutées et le projet redéployé :

**Logs Vercel** (Dashboard → Logs) :
- ✅ Aucune erreur "Cannot find module"
- ✅ Aucune erreur "Variable is not defined"
- ✅ Les fonctions API démarrent correctement

**Test complet** :
1. Formulaire → Payer 14 €
2. Supabase : `payment_status = "pending"`
3. Paiement Stripe (4242...)
4. **Redirection** : `/payment/success` ✅
5. **Supabase** : `payment_status = "done"` ✅

---

**C'est tout ! Si tu as les 5 variables correctement configurées, tout fonctionnera.** 🎉

