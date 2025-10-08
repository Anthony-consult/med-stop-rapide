# 🧪 Cartes de Test Stripe

## 🔵 Mode TEST Activé

Le site est actuellement configuré avec le lien de paiement Stripe en **mode TEST** :
- URL : https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00

Utilisez les cartes de test ci-dessous pour effectuer des paiements fictifs.

---

## 💳 Cartes de Test Principales

### ✅ Paiement Réussi (Recommandé)

**Numéro de carte** : `4242 4242 4242 4242`
- **Expiration** : N'importe quelle date future (ex: 12/25)
- **CVC** : N'importe quel 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code (ex: 75001)
- **Nom** : N'importe quel nom

**Résultat** : ✅ Paiement réussi
**Comportement** : Le webhook sera déclenché et `payment_status` sera mis à jour à `"done"`

---

### ❌ Paiement Refusé (Carte déclinée)

**Numéro de carte** : `4000 0000 0000 0002`
- **Expiration** : N'importe quelle date future
- **CVC** : N'importe quel 3 chiffres
- **Résultat** : ❌ Carte déclinée

---

### ⚠️ Paiement Nécessitant une Authentification 3D Secure

**Numéro de carte** : `4000 0027 6000 3184`
- **Expiration** : N'importe quelle date future
- **CVC** : N'importe quel 3 chiffres
- **Résultat** : Requiert authentification 3DS
- **Action** : Cliquez sur "Authentifier" dans la popup

---

### 🔄 Paiement en Attente (Processing)

**Numéro de carte** : `4000 0000 0000 0341`
- **Expiration** : N'importe quelle date future
- **CVC** : N'importe quel 3 chiffres
- **Résultat** : Paiement en attente

---

## 🧪 Scénarios de Test Recommandés

### Test 1 : Paiement Réussi Complet ✅

1. **Remplir** le formulaire (toutes les étapes)
2. **Arriver** à la page de paiement (Step 20)
3. **Cliquer** : "Payer 14,00 €"
4. **Utiliser** : `4242 4242 4242 4242`
5. **Vérifier** :
   - ✅ Redirection vers `/payment/success`
   - ✅ Dans Supabase : `payment_status = "done"`
   - ✅ Email de confirmation reçu

### Test 2 : Paiement Refusé ❌

1. **Remplir** le formulaire
2. **Arriver** à la page de paiement
3. **Cliquer** : "Payer 14,00 €"
4. **Utiliser** : `4000 0000 0000 0002`
5. **Vérifier** :
   - ❌ Message d'erreur Stripe
   - ⏸️ Rester sur la page de paiement
   - 📊 Dans Supabase : `payment_status = "pending"` (inchangé)

### Test 3 : Abandon du Paiement 🚪

1. **Remplir** le formulaire
2. **Arriver** à la page de paiement
3. **Cliquer** : "Payer 14,00 €"
4. **Sur Stripe** : Cliquer le bouton "Retour" ou fermer l'onglet
5. **Vérifier** :
   - 🔙 Redirection vers Cancel URL
   - 📊 Dans Supabase : `payment_status = "pending"` (inchangé)

---

## 📊 Vérification dans Stripe Dashboard

### Accéder au Dashboard de Test

1. **Allez sur** : https://dashboard.stripe.com/test/payments
2. **Basculez** en mode TEST (toggle en haut à droite)
3. **Vérifiez** :
   - Paiements récents
   - Événements webhook
   - Logs des webhooks

### Vérifier un Paiement

Pour chaque paiement, vérifiez :
- ✅ **Montant** : 14,00 €
- ✅ **Statut** : Succeeded
- ✅ **Metadata** : `client_reference_id` = UUID de la consultation
- ✅ **Customer Email** : Email saisi dans le formulaire

---

## 🔔 Vérifier les Webhooks

### Dans Stripe Dashboard

1. **Allez dans** : Developers → Webhooks
2. **Cliquez** sur votre webhook de test
3. **Vérifiez** les événements :
   - `checkout.session.completed` → ✅ 200 OK
   - Timestamp récent
   - Response body : `{"received":true}`

### Test Manuel du Webhook

```bash
# Dans Stripe Dashboard → Developers → Webhooks
# Cliquez sur "Send test webhook"
# Sélectionnez : checkout.session.completed
# Ajoutez dans le JSON : "client_reference_id": "test-uuid"
# Envoyez
```

---

## 📋 Checklist de Test

- [ ] Paiement réussi avec `4242 4242 4242 4242`
- [ ] Redirection vers `/payment/success`
- [ ] Consultation sauvegardée dans Supabase (`payment_status: "pending"`)
- [ ] Webhook Stripe reçu et traité
- [ ] Statut mis à jour dans Supabase (`payment_status: "done"`)
- [ ] Email de confirmation reçu
- [ ] Paiement refusé avec `4000 0000 0000 0002`
- [ ] Abandon de paiement (Cancel URL)
- [ ] Logs Vercel sans erreurs
- [ ] Events Stripe visibles dans Dashboard

---

## 🚀 Passage en Production

### Quand Passer en Mode Live

Une fois tous les tests réussis :

1. **Créer** un nouveau Payment Link en mode LIVE dans Stripe
2. **Mettre à jour** `Step20.tsx` :
   ```javascript
   const stripeUrl = `https://buy.stripe.com/VOTRE_LIEN_LIVE?client_reference_id=${consultationId}`;
   ```
3. **Configurer** le webhook en mode LIVE
4. **Mettre à jour** les variables d'environnement :
   - `STRIPE_SECRET_KEY` → Clé LIVE (commence par `sk_live_...`)
   - `STRIPE_WEBHOOK_SECRET` → Secret du webhook LIVE
5. **Déployer** sur Vercel

---

## 🆘 Problèmes Courants

### Le webhook ne se déclenche pas

- **Vérifier** : Mode TEST activé dans Stripe Dashboard
- **Vérifier** : `STRIPE_WEBHOOK_SECRET` correspond au webhook de TEST
- **Tester** : "Send test webhook" dans Stripe Dashboard

### Le statut ne se met pas à jour

- **Vérifier** : `client_reference_id` présent dans l'événement Stripe
- **Vérifier** : UUID valide dans Supabase
- **Consulter** : Logs Vercel pour voir les erreurs

### Erreur de signature

- **Régénérer** le webhook secret
- **Mettre à jour** `STRIPE_WEBHOOK_SECRET` dans Vercel
- **Redéployer**

---

## 📚 Documentation Officielle

- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Payment Links](https://stripe.com/docs/payment-links)

---

✅ **Bon test !** Utilisez `4242 4242 4242 4242` pour vos tests quotidiens.

