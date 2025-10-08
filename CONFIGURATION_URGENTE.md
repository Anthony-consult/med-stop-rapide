# 🚨 Configuration Urgente - À Faire MAINTENANT

## ❌ Problèmes Actuels

1. ✅ **Redirection Stripe** : Fonctionne
2. ✅ **Sauvegarde Supabase** : Fonctionne (`payment_status: "pending"`)
3. ❌ **Retour après paiement** : Reste sur Stripe
4. ❌ **Mise à jour statut** : `payment_status` ne passe pas à `"done"`

---

## 🔧 Solution : 2 Configurations à Faire

### **1️⃣ Configurer la Success URL du Payment Link Stripe**

**Temps : 2 minutes**

1. **Connecte-toi** à [Stripe Dashboard](https://dashboard.stripe.com)
2. **Active le mode TEST** (toggle en haut à droite)
3. **Va dans** : Payment links
4. **Trouve** ton lien : `https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00`
5. **Clique** sur les 3 points `⋮` → **Edit**
6. **Section "After payment"** :
   - **Success URL** : `https://consult-chrono.fr/payment/success`
   - **Cancel URL** : `https://consult-chrono.fr/`
7. **Save**

**Résultat** : Après paiement, redirection automatique vers ta page de succès ✅

---

### **2️⃣ Créer le Webhook Stripe**

**Temps : 3 minutes**

#### Étape A : Créer le Webhook

1. **Va dans** : Developers → Webhooks
2. **Clique** : "Add endpoint"
3. **Configure** :
   ```
   Endpoint URL : https://consult-chrono.fr/api/stripe/webhook
   Description  : Consult-Chrono Payment Confirmation
   Version      : Latest
   ```

4. **Listen to** : Sélectionne ces événements :
   - ✅ `checkout.session.completed`
   
5. **Add endpoint**

#### Étape B : Récupérer le Signing Secret

1. **Clique** sur le webhook que tu viens de créer
2. **Section "Signing secret"**
3. **Click to reveal** → Copie le secret (commence par `whsec_...`)

#### Étape C : Ajouter dans Vercel

1. **Va sur** : [Vercel Dashboard](https://vercel.com/dashboard)
2. **Ton projet** → Settings → Environment Variables
3. **Add New** :
   ```
   Name  : STRIPE_WEBHOOK_SECRET
   Value : whsec_ton_secret_ici
   ```
4. **Environment** : Sélectionne "Production, Preview, Development"
5. **Save**

#### Étape D : Ajouter les Autres Variables

Tant que tu y es, ajoute aussi :

```
Name  : STRIPE_SECRET_KEY
Value : sk_test_ton_secret_key
(Trouve-le dans Stripe → Developers → API keys)

Name  : VITE_SUPABASE_URL
Value : https://ton-projet.supabase.co

Name  : SUPABASE_SERVICE_ROLE_KEY
Value : ta_service_role_key
(Trouve-le dans Supabase → Settings → API)
```

#### Étape E : Redéployer

```bash
# Déclenche un nouveau déploiement pour charger les variables
git commit --allow-empty -m "trigger: reload env vars"
git push origin main
```

**Résultat** : Le webhook va recevoir les événements et mettre à jour `payment_status` ✅

---

## 🧪 Test Complet

### Une fois configuré :

1. **Remplis** le formulaire jusqu'à Step20
2. **Clique** "Payer 14 €"
3. **Vérifie Supabase** : Nouvelle ligne avec `payment_status: "pending"` ✅
4. **Sur Stripe**, paye avec `4242 4242 4242 4242`
5. **Résultat attendu** :
   - ✅ Redirection vers `/payment/success`
   - ✅ Dans Supabase : `payment_status: "done"`
   - ✅ `payment_id` rempli avec l'ID Stripe

### Vérifier le Webhook

1. **Stripe Dashboard** → Developers → Webhooks
2. **Clique** sur ton webhook
3. **Onglet "Events"** : Tu dois voir l'événement `checkout.session.completed`
4. **Status** : 200 OK ✅

---

## 📊 Checklist Rapide

- [ ] Success URL configurée : `https://consult-chrono.fr/payment/success`
- [ ] Webhook créé : `https://consult-chrono.fr/api/stripe/webhook`
- [ ] `STRIPE_WEBHOOK_SECRET` ajoutée dans Vercel
- [ ] `STRIPE_SECRET_KEY` ajoutée dans Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajoutée dans Vercel
- [ ] Redéployé sur Vercel
- [ ] Test complet effectué
- [ ] `payment_status` passe à `"done"` ✅

---

## 🆘 Dépannage Rapide

### Le webhook ne se déclenche pas

**Vérifier** :
```bash
# Dans Stripe Dashboard → Developers → Webhooks
# Clique sur "Send test webhook"
# Sélectionne "checkout.session.completed"
# Ajoute dans le JSON :
{
  "client_reference_id": "test-uuid-123"
}
# Envoie et vérifie la réponse
```

**Si erreur 401** : `STRIPE_WEBHOOK_SECRET` incorrect
**Si erreur 500** : `SUPABASE_SERVICE_ROLE_KEY` manquante

### Le statut ne se met pas à jour

**Vérifier dans Supabase SQL Editor** :
```sql
-- Test manuel
UPDATE consultations 
SET payment_status = 'done' 
WHERE id = 'ton-uuid-ici';

-- Si ça marche, le problème est dans le webhook
-- Si erreur, c'est un problème de permissions RLS
```

---

## ⏱️ Temps Total Estimé

- **Success URL** : 2 minutes
- **Webhook Stripe** : 3 minutes
- **Variables Vercel** : 2 minutes
- **Redéploiement** : 2 minutes
- **Test** : 3 minutes

**Total** : ~12 minutes pour tout configurer ✅

---

## 📸 Résultat Final Attendu

### Après paiement réussi :

1. **Écran utilisateur** :
   ```
   ✅ Page /payment/success
   ✅ Message "Paiement confirmé !"
   ✅ Email de confirmation reçu
   ```

2. **Supabase** :
   ```
   id                : uuid-123
   email             : test@example.com
   payment_status    : done ← Changé de "pending" à "done"
   payment_id        : pi_xxx ← ID du paiement Stripe
   created_at        : timestamp
   ```

3. **Stripe Events** :
   ```
   checkout.session.completed → 200 OK
   client_reference_id        : uuid-123
   payment_intent             : pi_xxx
   ```

---

🚀 **Suis ces étapes dans l'ordre et tout fonctionnera !**

