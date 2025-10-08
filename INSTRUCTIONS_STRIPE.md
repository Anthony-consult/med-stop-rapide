# 🚀 Instructions Complètes - Intégration Stripe

## ✅ Ce qui a été fait

L'intégration Stripe est **complètement implémentée** et prête à être déployée. Voici ce qui fonctionne :

### 1. **Flux de paiement complet** 💳
- ✅ Formulaire sauvegardé dans Supabase avec `payment_status: "pending"`
- ✅ ID de consultation stocké dans localStorage
- ✅ Redirection vers Stripe avec `client_reference_id`
- ✅ Page de succès après paiement
- ✅ Mise à jour automatique du statut à `"done"` via webhook

### 2. **Fichiers créés/modifiés** 📁
- ✅ `src/components/form/steps/Step20.tsx` - Redirection vers Stripe
- ✅ `src/pages/ConsultationNew.tsx` - Sauvegarde ID consultation
- ✅ `src/pages/PaymentSuccess.tsx` - Page de confirmation
- ✅ `api/stripe/webhook.js` - Endpoint webhook Stripe
- ✅ `vercel.json` - Configuration Vercel
- ✅ `src/App.tsx` - Route `/payment/success`
- ✅ Documentation complète (STRIPE_SETUP.md, ENV_SETUP.md)

---

## 📋 Ce que VOUS devez faire

### **Étape 1 : Configurer Stripe Dashboard** 🔵

#### A. Créer le webhook Stripe

1. **Connectez-vous** à [Stripe Dashboard](https://dashboard.stripe.com)
2. **Allez dans** : Developers → Webhooks
3. **Cliquez** : "Add endpoint"
4. **Configurez** :
   - **URL** : `https://consult-chrono.fr/api/stripe/webhook`
   - **Description** : "Consult-Chrono - Payment Confirmation"
   - **Événements** : Sélectionnez `checkout.session.completed`
5. **Cliquez** : "Add endpoint"
6. **Copiez** le **Signing secret** (commence par `whsec_...`)

#### B. Configurer le Payment Link (Mode TEST)

1. **Allez dans** : Stripe Dashboard (Mode TEST) → Payment Links
2. **Trouvez** : https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00
3. **Modifiez** (Edit) :
   - **Success URL** : `http://localhost:3000/payment/success` (pour test local)
   - **Success URL (prod)** : `https://consult-chrono.fr/payment/success`
   - **Cancel URL** : `http://localhost:3000/` ou `https://consult-chrono.fr/`
4. **Sauvegardez**

> 💡 **Note** : Actuellement configuré avec le lien de test Stripe. Pour la production, remplacez par le lien live.

---

### **Étape 2 : Configurer les Variables d'Environnement** ⚙️

#### Dans Vercel Dashboard

1. **Allez dans** : [Vercel Dashboard](https://vercel.com/dashboard) → Votre projet → Settings → Environment Variables

2. **Ajoutez ces variables** :

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...  # Depuis Stripe Dashboard → Developers → API keys
STRIPE_WEBHOOK_SECRET=whsec_...  # Le secret que vous avez copié à l'étape 1

# Supabase (déjà configurées probablement)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Webhook Email (déjà configuré)
SUPABASE_WEBHOOK_TOKEN=your-webhook-token

# SMTP ou Resend (déjà configuré)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=contact@consult-chrono.fr
SMTP_PASS=your-password
```

3. **Sélectionnez** : Production, Preview, Development
4. **Sauvegardez**

---

### **Étape 3 : Déployer sur Vercel** 🚀

```bash
# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: Complete Stripe payment integration"

# Push
git push origin main
```

Vercel déploiera automatiquement. Attendez quelques minutes.

---

### **Étape 4 : Tester en Production** 🧪

#### A. Test complet du flux

1. **Allez sur** : https://consult-chrono.fr
2. **Cliquez** : "Commencer maintenant"
3. **Remplissez** le formulaire (toutes les étapes)
4. **Arrivez** à la page de paiement (Step 20)
5. **Vérifiez** :
   - ✅ Le récapitulatif affiche 14,00 €
   - ✅ Les CGU sont cochables
   - ✅ Le bouton "Payer 14,00 €" est actif

6. **Cliquez** : "Payer 14,00 €"
7. **Vérifiez** : Redirection vers Stripe
8. **Testez avec carte de test** :
   - **Numéro** : `4242 4242 4242 4242`
   - **Expiration** : N'importe quelle date future (ex: 12/25)
   - **CVC** : N'importe quel 3 chiffres (ex: 123)
   - **Nom** : Votre nom
   - **Email** : Votre email de test

9. **Payez**
10. **Vérifiez** : Redirection vers `/payment/success`
11. **Vérifiez** : Email de confirmation reçu

#### B. Vérifier dans Supabase

1. **Allez dans** : Supabase Dashboard → Table Editor → consultations
2. **Trouvez** : Votre consultation de test
3. **Vérifiez** :
   - ✅ `payment_status` = `"done"`
   - ✅ `payment_id` = ID du paiement Stripe

#### C. Vérifier dans Stripe

1. **Allez dans** : Stripe Dashboard → Payments
2. **Trouvez** : Votre paiement de test
3. **Vérifiez** :
   - ✅ Montant : 14,00 €
   - ✅ Statut : Succeeded
   - ✅ Metadata : `client_reference_id` = ID de consultation

---

### **Étape 5 : Vérifier les Webhooks** 🔔

#### Dans Stripe Dashboard

1. **Allez dans** : Developers → Webhooks → Votre webhook
2. **Cliquez** : "Send test webhook"
3. **Sélectionnez** : `checkout.session.completed`
4. **Envoyez**
5. **Vérifiez** : Response `200 OK`

#### Dans Vercel Logs

1. **Allez dans** : Vercel Dashboard → Votre projet → Logs
2. **Recherchez** : "Payment successful for consultation"
3. **Vérifiez** : Pas d'erreurs

---

## 🎯 Résumé des URLs Importantes

| Type | URL |
|------|-----|
| **Site principal** | https://consult-chrono.fr |
| **Formulaire** | https://consult-chrono.fr/consultation |
| **Paiement Stripe (TEST)** | https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00 |
| **Webhook Stripe** | https://consult-chrono.fr/api/stripe/webhook |
| **Page de succès** | https://consult-chrono.fr/payment/success |
| **Webhook Email** | https://consult-chrono.fr/api/internal/new-lead |

---

## 📊 Monitoring Quotidien

### Vérifier les paiements

```sql
-- Dans Supabase SQL Editor
SELECT 
  id,
  nom_prenom,
  email,
  payment_status,
  created_at
FROM consultations
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

### Logs à surveiller

- **Vercel** : Erreurs webhook Stripe
- **Stripe** : Événements non livrés
- **Supabase** : RLS errors ou échecs d'insertion

---

## 🆘 En cas de problème

### Le webhook ne se déclenche pas

1. Vérifiez l'URL du webhook dans Stripe Dashboard
2. Testez avec "Send test webhook"
3. Vérifiez `STRIPE_WEBHOOK_SECRET` dans Vercel
4. Consultez les logs Vercel

### Le statut ne se met pas à jour

1. Vérifiez que `client_reference_id` est bien dans l'événement Stripe
2. Vérifiez `SUPABASE_SERVICE_ROLE_KEY` dans Vercel
3. Testez manuellement la requête UPDATE dans Supabase
4. Consultez les logs du webhook

### Erreur de signature webhook

1. Régénérez le webhook secret dans Stripe
2. Mettez à jour `STRIPE_WEBHOOK_SECRET` dans Vercel
3. Redéployez

---

## ✅ Checklist Finale

- [ ] Webhook Stripe créé et configuré
- [ ] Success/Cancel URLs configurées dans Payment Link
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Code déployé sur Vercel
- [ ] Test complet effectué (formulaire → paiement → confirmation)
- [ ] Vérification Supabase (payment_status = "done")
- [ ] Vérification Stripe (paiement reçu)
- [ ] Webhook testé et fonctionnel
- [ ] Email de confirmation reçu
- [ ] Monitoring configuré

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Configuration détaillée
- **[ENV_SETUP.md](./ENV_SETUP.md)** - Variables d'environnement
- **[WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)** - Webhooks emails

---

🎉 **Une fois toutes les étapes complétées, votre système de paiement Stripe est 100% opérationnel !**

