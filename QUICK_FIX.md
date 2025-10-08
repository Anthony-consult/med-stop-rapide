# ⚡ Fix Rapide - 5 Minutes

## 🎯 Ce qu'il faut faire MAINTENANT

### ✅ Problème 1 : Pas de redirection après paiement

**Solution** : Configure la Success URL dans Stripe

1. Va sur https://dashboard.stripe.com (mode TEST)
2. Payment links → Trouve ton lien `test_aFa6oH...`
3. Clique `⋮` → Edit
4. **Success URL** : `https://consult-chrono.fr/payment/success`
5. Save

**Temps : 1 minute**

---

### ✅ Problème 2 : payment_status ne se met pas à jour

**Solution** : Configure le webhook Stripe + Variables Vercel

#### A. Créer le Webhook (2 min)

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint
3. URL : `https://consult-chrono.fr/api/stripe/webhook`
4. Events : ✅ `checkout.session.completed`
5. Add endpoint
6. **COPIER LE SECRET** (commence par `whsec_...`)

#### B. Ajouter dans Vercel (2 min)

1. Va sur https://vercel.com/dashboard
2. Ton projet → Settings → Environment Variables
3. Ajoute ces 3 variables :

```bash
STRIPE_WEBHOOK_SECRET=whsec_ton_secret_copié
STRIPE_SECRET_KEY=sk_test_... (depuis Stripe → API keys)
SUPABASE_SERVICE_ROLE_KEY=... (depuis Supabase → Settings → API)
```

4. Sélectionne "Production, Preview, Development"
5. Save

#### C. Redéployer (1 min)

```bash
git commit --allow-empty -m "reload env vars"
git push
```

---

## 🧪 Test Final

1. **Remplis** le formulaire complet
2. **Paye** avec `4242 4242 4242 4242`
3. **Vérifications** :
   - ✅ Redirection vers `/payment/success`
   - ✅ Supabase : `payment_status = "done"`

---

## 📋 Checklist

- [ ] Success URL = `https://consult-chrono.fr/payment/success`
- [ ] Webhook créé sur `https://consult-chrono.fr/api/stripe/webhook`
- [ ] `STRIPE_WEBHOOK_SECRET` dans Vercel
- [ ] `STRIPE_SECRET_KEY` dans Vercel  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` dans Vercel
- [ ] Git push pour redéployer
- [ ] Test complet réussi

**C'est tout ! ✅**

