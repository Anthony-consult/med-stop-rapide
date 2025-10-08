# ⚡ ACTION IMMÉDIATE - Fais Ça Maintenant

## 📋 Résumé des Problèmes

1. ❌ **404 sur `/payment/success`** → URL avec `www.` au lieu de sans `www.`
2. ❌ **`payment_status` reste "pending"** → Webhook ne se déclenche pas ou erreur

---

## ✅ Solution 1 : Corriger l'URL Success (1 min)

### Dans Stripe Dashboard

1. **Va sur** : https://dashboard.stripe.com
2. **Mode TEST** (toggle en haut)
3. **Payment Links** → Ton lien `test_aFa6oH...`
4. **Edit** (bouton en haut ou `⋮`)
5. **Section "After payment"** :
   
   **CHANGE** :
   ```
   ❌ https://www.consult-chrono.fr/payment/success
   ✅ https://consult-chrono.fr/payment/success
   ```
   (ENLÈVE le `www.`)

6. **Save**

**Résultat** : Tu seras redirigé vers la bonne URL après paiement ✅

---

## ✅ Solution 2 : Débugger le Webhook (5 min)

J'ai ajouté des **logs ultra-détaillés**. Voici comment les voir :

### Étape A : Attendre le Déploiement

Je viens de pusher les logs. **Attends 2-3 minutes**.

Vérifie : https://vercel.com/dashboard → Deployments → Le dernier doit être "Ready"

### Étape B : Préparer les Logs

1. **Ouvre** : https://vercel.com/dashboard → Ton projet → **Logs**
2. **Filtre** : Sélectionne "Functions"
3. **Garde** cet onglet ouvert

### Étape C : Faire un Test de Paiement

1. **Formulaire** → Clique "⚡ Test rapide" (nouveau bouton !)
2. **Step 19** → Clique "Suivant"
3. **Step 20** → Accepte CGU → Clique "Payer 14 €"
4. **Note l'UUID** dans la console navigateur (F12)
5. **Paye** avec `4242 4242 4242 4242`

### Étape D : Analyser les Logs

**Immédiatement après le paiement**, regarde les logs Vercel.

**Tu dois voir** (avec les émojis) :
```
🔔 Webhook called - Method: POST
🔐 Verifying signature...
✅ Signature verified successfully
📥 Stripe webhook event: checkout.session.completed
💰 CHECKOUT SESSION COMPLETED
💰 Client reference ID: [UUID]
🔍 Extracted consultation ID: [UUID]
📝 Attempting to update Supabase...
📝 Supabase URL: https://xxx.supabase.co
📝 Service role key exists: true
✅ PAYMENT STATUS UPDATED SUCCESSFULLY!
```

### Étape E : Identifier le Problème

#### Cas 1 : Aucun Log

**Problème** : Le webhook n'est pas appelé  
**Vérifications** :
- [ ] Webhook existe dans Stripe (Developers → Webhooks)
- [ ] URL = `https://consult-chrono.fr/api/stripe/webhook` (sans www!)
- [ ] Events = `checkout.session.completed`
- [ ] Status = Active

**Solution** : Crée ou reconfigure le webhook

#### Cas 2 : "Webhook secret not configured"

**Problème** : `STRIPE_WEBHOOK_SECRET` manquant  
**Solution** : 
1. Stripe → Webhook → Signing secret → Copie
2. Vercel → Environment Variables → Add `STRIPE_WEBHOOK_SECRET`
3. Redéploie

#### Cas 3 : "Signature verification failed"

**Problème** : Le secret est incorrect  
**Solution** :
1. Vérifie que tu as copié le secret du BON webhook (mode TEST)
2. Supprime et recrée la variable dans Vercel
3. Redéploie

#### Cas 4 : "No consultation ID"

**Problème** : `client_reference_id` n'est pas dans l'événement Stripe  
**Solution** :
1. Vérifie dans les logs : `💰 Client reference ID: null` ou `undefined`
2. Le problème vient de Step20 qui ne passe pas l'ID
3. Vérifie que la redirection Stripe inclut `?client_reference_id=...`

#### Cas 5 : "SUPABASE ERROR"

**Problème** : Erreur lors de la mise à jour  
**Vérifications** :
- [ ] `VITE_SUPABASE_URL` correct
- [ ] `SUPABASE_SERVICE_ROLE_KEY` correct
- [ ] L'UUID existe dans la table `consultations`
- [ ] RLS policies permettent l'UPDATE avec service_role

**Dans les logs, cherche** :
```
❌ Error code: xxx
❌ Error message: xxx
```

---

## 🧪 Test Simplifié

### Test 1 : Vérifier que le Webhook Existe

```bash
curl https://consult-chrono.fr/api/stripe/webhook
```

**Résultat attendu** : `{"error":"Method not allowed"}` ✅  
**Si autre chose** : La fonction n'est pas déployée

### Test 2 : Vérifier les Variables

Dans Vercel → Settings → Environment Variables, tu DOIS avoir :

```
✅ STRIPE_SECRET_KEY         (sk_test_...)
✅ STRIPE_WEBHOOK_SECRET     (whsec_...)
✅ VITE_SUPABASE_URL         (https://xxx.supabase.co)
✅ SUPABASE_SERVICE_ROLE_KEY (eyJhbGci...)
```

**Pour CHAQUE variable** : Production + Preview + Development

### Test 3 : Vérifier Stripe Events

1. **Stripe Dashboard** → Developers → Events
2. **Filtre** : `checkout.session.completed`
3. **Trouve** ton paiement test récent
4. **Clique** dessus → Onglet "Webhook deliveries"
5. **Vérifie** :
   - ✅ Webhook appelé
   - ✅ Response : 200
   - ✅ `client_reference_id` présent dans les données

**Si Response ≠ 200** : Clique dessus pour voir l'erreur détaillée

---

## 🎯 Plan d'Action Prioritaire

### Fais Maintenant (10 minutes)

1. **Stripe** :
   - [ ] Success URL → enlève le `www.`
   - [ ] Vérifie que le webhook existe et est actif

2. **Vercel** :
   - [ ] Vérifie que les 4 variables sont présentes
   - [ ] Attends que le dernier déploiement soit "Ready"

3. **Test** :
   - [ ] Ouvre Vercel Logs
   - [ ] Lance un paiement test
   - [ ] Copie TOUS les logs
   - [ ] Envoie-les moi

4. **Je t'aide** :
   - [ ] Avec les logs je saurai exactement où ça bloque
   - [ ] On fixe le problème ensemble

---

**Commence par corriger l'URL Stripe (sans www.), puis fais un test complet avec les logs ouverts !** 🔍

