# ⚡ FIX IMMÉDIAT - Fais Ça MAINTENANT

## 🎯 Le Problème

1. ❌ `/payment/success` affiche blanc
2. ❌ `payment_status` reste "pending"

## ✅ La Solution (5 minutes)

### 1. Attends le Redéploiement (2 min)

Je viens de pousser un fix. **Attends 2-3 minutes** que Vercel redéploie.

Vérifie ici : https://vercel.com/dashboard → Deployments
→ Le dernier doit être "Ready" ✅

---

### 2. Ajoute les Variables d'Environnement (3 min)

**VA SUR** : https://vercel.com/dashboard → Ton projet → **Settings** → **Environment Variables**

**AJOUTE CES 5 VARIABLES** (si elles n'existent pas) :

#### A. VITE_SUPABASE_URL
1. Va sur https://supabase.com/dashboard
2. Ton projet → Settings → API → **Project URL**
3. Copie l'URL (ex: `https://abcdefg.supabase.co`)
4. Dans Vercel :
   - Name : `VITE_SUPABASE_URL`
   - Value : (colle l'URL)
   - Coche : **Production + Preview + Development**

#### B. VITE_SUPABASE_ANON_KEY
1. Supabase → Settings → API → **anon public**
2. Copie la clé
3. Dans Vercel :
   - Name : `VITE_SUPABASE_ANON_KEY`
   - Value : (colle la clé)
   - Coche : **Production + Preview + Development**

#### C. SUPABASE_SERVICE_ROLE_KEY ⚠️
1. Supabase → Settings → API → **service_role** → Reveal
2. Copie la clé (DIFFÉRENTE de anon!)
3. Dans Vercel :
   - Name : `SUPABASE_SERVICE_ROLE_KEY`
   - Value : (colle la clé)
   - Coche : **Production + Preview + Development**

#### D. STRIPE_SECRET_KEY
1. https://dashboard.stripe.com (mode **TEST**)
2. Developers → API keys → **Secret key** → Reveal
3. Copie (commence par `sk_test_...`)
4. Dans Vercel :
   - Name : `STRIPE_SECRET_KEY`
   - Value : (colle la clé)
   - Coche : **Production + Preview + Development**

#### E. STRIPE_WEBHOOK_SECRET
1. Stripe (TEST) → Developers → Webhooks
2. Si pas de webhook : Add endpoint → URL = `https://consult-chrono.fr/api/stripe/webhook`
3. Click sur le webhook → **Signing secret** → Reveal
4. Copie (commence par `whsec_...`)
5. Dans Vercel :
   - Name : `STRIPE_WEBHOOK_SECRET`
   - Value : (colle le secret)
   - Coche : **Production + Preview + Development**

---

### 3. Redéploie SANS Cache (1 min)

1. Vercel → Deployments
2. Dernier déploiement → `⋮` (3 points)
3. **Redeploy**
4. **DÉCOCHE** "Use existing Build Cache"
5. **Redeploy**

**Attends 2-3 minutes** ⏱️

---

### 4. Configure Stripe Success URL (1 min)

1. Stripe Dashboard (TEST) → Payment links
2. Ton lien `test_aFa6oH...` → `⋮` → **Edit**
3. **Success URL** : `https://consult-chrono.fr/payment/success`
4. **Cancel URL** : `https://consult-chrono.fr/`
5. **Save**

---

## 🧪 Test Final

1. **Ouvre** : https://consult-chrono.fr/payment/success
   - ✅ Doit afficher "Paiement confirmé !"
   - ❌ Si blanc : Variables manquantes → Recommence étape 2

2. **Test complet** :
   - Formulaire → Payer 14 €
   - Paiement avec `4242 4242 4242 4242`
   - ✅ Redirection vers `/payment/success`
   - ✅ Supabase : `payment_status = "done"`

---

## 📋 Checklist

- [ ] Redéploiement terminé (Status: Ready)
- [ ] 5 variables ajoutées dans Vercel
- [ ] Chaque variable cochée pour Production + Preview + Development
- [ ] Redéploiement sans cache effectué
- [ ] Success URL configurée dans Stripe
- [ ] Test `/payment/success` : ✅ Affiche contenu
- [ ] Test paiement complet : ✅ Tout fonctionne

---

**Si tu suis ces étapes, ça fonctionnera ! 🎉**

**Temps total : ~5-10 minutes**

