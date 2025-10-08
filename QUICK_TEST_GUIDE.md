# ⚡ Guide de Test Rapide - Stripe

## 🎯 Test Complet en 5 Minutes

### Prérequis
- ✅ Code déployé sur Vercel
- ✅ Variables d'environnement configurées (mode TEST)
- ✅ Webhook Stripe configuré

---

## 🚀 Étape 1 : Lancer le Test (2 min)

1. **Ouvrir** : https://consult-chrono.fr (ou localhost:3000)
2. **Cliquer** : "Commencer maintenant"
3. **Remplir** le formulaire avec des données fictives :

**Données rapides de test** :
```
Maladie : Grippe
Symptômes : Fièvre, toux
Nom : Test User
Date naissance : 01/01/1990
Email : test@example.com
Adresse : 123 rue Test
Code postal : 75001
Ville : Paris
Date début : Aujourd'hui
Date fin : Dans 3 jours
```

4. **Valider** jusqu'à la page de paiement (Step 20)

---

## 💳 Étape 2 : Payer avec Stripe (1 min)

1. **Vérifier** l'affichage :
   - ✅ Montant : 14,00 €
   - ✅ Récapitulatif visible
   - ✅ CGU cochable

2. **Cliquer** : "Payer 14,00 €"

3. **Sur Stripe**, entrer :
   ```
   Numéro : 4242 4242 4242 4242
   Expiration : 12/25
   CVC : 123
   Email : test@example.com
   ```

4. **Valider** le paiement

---

## ✅ Étape 3 : Vérifications (2 min)

### A. Vérification Visuelle
- ✅ Redirection vers `/payment/success`
- ✅ Message de confirmation affiché
- ✅ Bouton "Retour à l'accueil" visible

### B. Vérification Supabase
1. **Ouvrir** : Supabase Dashboard → Table Editor → consultations
2. **Vérifier** la dernière ligne :
   ```
   ✅ email = test@example.com
   ✅ payment_status = "done"
   ✅ payment_id = pi_xxx (ID Stripe)
   ```

### C. Vérification Stripe
1. **Ouvrir** : Stripe Dashboard (mode TEST) → Payments
2. **Vérifier** le dernier paiement :
   ```
   ✅ Montant : €14.00
   ✅ Statut : Succeeded
   ✅ Metadata : client_reference_id = UUID
   ```

### D. Vérification Webhook
1. **Ouvrir** : Stripe Dashboard → Developers → Webhooks
2. **Cliquer** sur votre webhook
3. **Vérifier** le dernier événement :
   ```
   ✅ Type : checkout.session.completed
   ✅ Status : 200
   ✅ Time : Il y a quelques secondes
   ```

### E. Vérification Email (Optionnel)
- ✅ Email de notification reçu à `contact@consult-chrono.fr`
- ✅ Contenu : Détails de la consultation
- ✅ Pièce jointe CSV présente

---

## 🎉 Résultat Attendu

Si tout fonctionne, vous devriez avoir :

```
✅ Formulaire rempli et validé
✅ Redirection vers Stripe
✅ Paiement accepté
✅ Redirection vers /payment/success
✅ Supabase : payment_status = "done"
✅ Stripe : Paiement enregistré
✅ Webhook : Événement traité (200)
✅ Email : Notification envoyée
```

---

## ❌ En cas de Problème

### Le paiement est refusé
- **Utiliser** : `4242 4242 4242 4242` (pas une autre carte)
- **Vérifier** : Mode TEST activé dans Stripe

### Pas de redirection vers /payment/success
- **Vérifier** : Success URL configurée dans Payment Link
- **Vérifier** : Route `/payment/success` existe dans App.tsx

### payment_status reste "pending"
- **Vérifier** : Webhook configuré et actif
- **Vérifier** : `STRIPE_WEBHOOK_SECRET` correct
- **Consulter** : Logs Vercel pour erreurs

### Pas d'email reçu
- **Vérifier** : `SUPABASE_WEBHOOK_TOKEN` configuré
- **Vérifier** : SMTP ou Resend configuré
- **Consulter** : Logs Vercel

---

## 🔄 Test Rapide Suivant

Pour les tests suivants (après le premier succès) :

```bash
# Données minimales
Maladie : Grippe
Nom : Test 2
Email : test2@example.com
Carte : 4242 4242 4242 4242

# Temps estimé : 2 minutes
```

---

## 📊 Dashboard de Monitoring

**Après chaque test, vérifiez** :

1. **Supabase** → Nombre de consultations
2. **Stripe** → Nombre de paiements
3. **Vercel** → Logs sans erreurs
4. **Email** → Notification reçue

---

## 🚀 Prêt pour la Prod ?

Une fois 3-5 tests réussis :
- [ ] Tous les statuts passent à "done"
- [ ] Tous les webhooks retournent 200
- [ ] Tous les emails sont reçus
- [ ] Aucune erreur dans les logs

👉 **Vous pouvez passer en production !**

Voir [INSTRUCTIONS_STRIPE.md](./INSTRUCTIONS_STRIPE.md) pour le passage en mode LIVE.

---

✅ **Bon test !** Le premier test complet devrait prendre ~5 minutes.

