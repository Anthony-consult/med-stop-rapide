# 🔍 Debug - 404 Payment Success & Webhook

## ❌ Problème 1 : 404 sur `/payment/success`

### Cause Identifiée

Tu vas sur `https://www.consult-chrono.fr/payment/success` (avec `www.`)  
Mais la route existe sur `https://consult-chrono.fr/payment/success` (sans `www.`)

### ✅ Solutions

#### Solution 1 : Corriger l'URL Stripe (RECOMMANDÉ)

1. **Va sur** : Stripe Dashboard (mode TEST) → Payment Links
2. **Trouve** : `https://buy.stripe.com/test_aFa6oH...`
3. **Edit** → Section "After payment"
4. **Change** :
   - Success URL : `https://consult-chrono.fr/payment/success` (SANS www)
   - Cancel URL : `https://consult-chrono.fr/`
5. **Save**

#### Solution 2 : Rediriger www vers non-www dans Vercel

1. **Vercel Dashboard** → Ton projet → Settings → Domains
2. **Vérifie** les domaines configurés
3. **Si les deux existent** (www et non-www), configure une redirection :
   - De : `www.consult-chrono.fr`
   - Vers : `consult-chrono.fr`
   - Type : 301 (permanent)

---

## ❌ Problème 2 : `payment_status` Reste "pending"

### Logs Ultra-Détaillés Ajoutés

J'ai ajouté des logs TRÈS détaillés au webhook. Voici comment les consulter :

### Étape 1 : Déployer les Nouveaux Logs

```bash
git add api/stripe/webhook.js
git commit -m "debug: Add detailed logging to Stripe webhook"
git push origin main
```

**Attends 2-3 minutes** que Vercel redéploie.

### Étape 2 : Consulter les Logs Vercel

1. **Va sur** : https://vercel.com/dashboard
2. **Ton projet** → **Logs**
3. **Filtre** : Functions
4. **Recherche** : "🔔 Webhook called" ou "💰 CHECKOUT"

### Étape 3 : Tester un Paiement

1. **Formulaire** → Payer 14 €
2. **Carte test** : 4242 4242 4242 4242
3. **Après paiement** → Aller immédiatement dans Vercel Logs
4. **Chercher** les émojis : 🔔 💰 ✅ ❌

---

## 📊 Logs à Vérifier

### Log 1 : Webhook Appelé ?

```
🔔 Webhook called - Method: POST
🔔 Headers: { ... }
```

**Si tu ne vois PAS ce log** : Le webhook n'est pas appelé
→ Vérifie que le webhook Stripe pointe vers la bonne URL

### Log 2 : Signature Vérifiée ?

```
🔑 Webhook secret exists: true
🔑 Signature exists: true
🔐 Verifying signature...
✅ Signature verified successfully
```

**Si erreur** : `STRIPE_WEBHOOK_SECRET` incorrect ou manquant

### Log 3 : Event Reçu ?

```
📥 Stripe webhook event: checkout.session.completed
📥 Event ID: evt_xxx
📥 Event data: { ... }
```

**Vérifie** que l'event type est bien `checkout.session.completed`

### Log 4 : Consultation ID Trouvé ?

```
💰 CHECKOUT SESSION COMPLETED
💰 Client reference ID: uuid-de-ta-consultation
🔍 Extracted consultation ID: uuid-de-ta-consultation
```

**Si `null` ou `undefined`** : L'ID n'est pas passé à Stripe
→ Problème dans Step20 lors de la redirection

### Log 5 : Supabase Configuré ?

```
📝 Attempting to update Supabase...
📝 Supabase URL: https://xxx.supabase.co
📝 Service role key exists: true
```

**Si `false` ou `undefined`** : Variables d'environnement manquantes

### Log 6 : Mise à Jour Réussie ?

```
✅ PAYMENT STATUS UPDATED SUCCESSFULLY!
✅ Updated data: { "payment_status": "done", ... }
```

**Si erreur Supabase** :
```
❌ SUPABASE ERROR: { ... }
❌ Error code: xxx
❌ Error message: xxx
```

---

## 🧪 Test Complet avec Logs

### 1. Prépare les Logs

1. **Ouvre** : Vercel Dashboard → Logs (dans un onglet séparé)
2. **Filtre** : Functions
3. **Auto-refresh** : ON

### 2. Lance un Paiement Test

1. **Formulaire** → Step 20
2. **Payer 14 €**
3. **ATTENTION** : Note l'ID de consultation (dans les logs navigateur console)
4. **Carte** : 4242 4242 4242 4242

### 3. Analyse les Logs en Temps Réel

**Immédiatement après le paiement**, tu devrais voir dans Vercel Logs :

```
🔔 Webhook called - Method: POST
🔐 Verifying signature...
✅ Signature verified successfully
📥 Stripe webhook event: checkout.session.completed
💰 CHECKOUT SESSION COMPLETED
💰 Client reference ID: [TON-UUID-ICI]
🔍 Extracted consultation ID: [TON-UUID-ICI]
📝 Attempting to update Supabase...
✅ PAYMENT STATUS UPDATED SUCCESSFULLY!
```

### 4. Vérifie Supabase

```sql
SELECT id, email, payment_status, payment_id, created_at 
FROM consultations 
WHERE id = '[TON-UUID-ICI]';
```

**Résultat attendu** : `payment_status = 'done'`

---

## 🔧 Checklist de Debug

### Variables d'Environnement Vercel

- [ ] `STRIPE_SECRET_KEY` = `sk_test_...`
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- [ ] `VITE_SUPABASE_URL` = `https://xxx.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGci...`
- [ ] Toutes cochées : Production + Preview + Development

### Webhook Stripe

- [ ] URL : `https://consult-chrono.fr/api/stripe/webhook` (SANS www)
- [ ] Events : ✅ `checkout.session.completed`
- [ ] Status : Active
- [ ] Mode : TEST

### Payment Link Stripe

- [ ] Success URL : `https://consult-chrono.fr/payment/success` (SANS www)
- [ ] Cancel URL : `https://consult-chrono.fr/`
- [ ] Mode : TEST

### Déploiement

- [ ] Code avec logs poussé sur GitHub
- [ ] Vercel déployé (Status: Ready)
- [ ] Pas d'erreurs dans Build Logs
- [ ] Functions déployées correctement

---

## 🆘 Scénarios d'Erreur Courants

### Erreur 1 : "Webhook secret not configured"

**Cause** : `STRIPE_WEBHOOK_SECRET` manquant dans Vercel  
**Solution** : Ajoute la variable dans Vercel Settings

### Erreur 2 : "Signature verification failed"

**Cause** : Le secret ne correspond pas au webhook  
**Solution** : Copie le bon secret depuis Stripe → Webhook → Signing secret

### Erreur 3 : "No consultation ID"

**Cause** : `client_reference_id` n'est pas passé à Stripe  
**Solution** : Vérifie que Step20 inclut bien l'ID dans l'URL Stripe

### Erreur 4 : "Row not found"

**Cause** : L'UUID n'existe pas dans Supabase  
**Solution** : Vérifie que la consultation a été créée avant le paiement

### Erreur 5 : "Permission denied" (RLS)

**Cause** : `SUPABASE_SERVICE_ROLE_KEY` manquant ou incorrect  
**Solution** : Vérifie la clé dans Supabase Settings → API → service_role

---

## 📝 Prochaines Étapes

1. **Déploie** les nouveaux logs :
   ```bash
   git push origin main
   ```

2. **Attends** 2-3 minutes (déploiement Vercel)

3. **Ouvre** Vercel Logs dans un onglet

4. **Teste** un paiement complet

5. **Copie** TOUS les logs et envoie-les moi

6. **Je t'aiderai** à identifier exactement où ça bloque

---

**Les logs ultra-détaillés vont nous dire EXACTEMENT où est le problème ! 🔍**

