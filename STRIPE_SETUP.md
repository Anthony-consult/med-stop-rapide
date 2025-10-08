# 🔵 Configuration Stripe - Consult-Chrono

## 📋 Vue d'ensemble

Le système de paiement Stripe est maintenant intégré avec les fonctionnalités suivantes :
- ✅ **Lien de paiement Stripe (TEST)** : https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00
- ✅ **Sauvegarde automatique** de la consultation dans Supabase avec `payment_status: "pending"`
- ✅ **Redirection vers Stripe** avec l'ID de consultation
- ✅ **Webhook Stripe** pour mettre à jour le statut de paiement à `"done"`

> 🧪 **Mode TEST** : Actuellement configuré avec un lien de paiement Stripe en mode test pour les tests. Pour la production, remplacez par le lien live.

---

## 🔧 Configuration Requise

### 1️⃣ Variables d'Environnement

Ajoutez ces variables dans **Vercel Project Settings → Environment Variables** :

```bash
# Stripe API Keys (depuis https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...  # ou sk_test_... pour le mode test
STRIPE_WEBHOOK_SECRET=whsec_...  # Généré lors de la création du webhook

# Supabase (depuis https://supabase.com/dashboard/project/_/settings/api)
VITE_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ATTENTION: Ne jamais exposer côté client !
```

---

## 🌐 Configuration du Webhook Stripe

### Étape 1 : Créer le webhook dans Stripe Dashboard

1. **Connectez-vous** à [Stripe Dashboard](https://dashboard.stripe.com)
2. **Allez dans** : Developers → Webhooks
3. **Cliquez sur** : "Add endpoint"
4. **Configurez** :
   - **Endpoint URL** : `https://consult-chrono.fr/api/stripe/webhook`
   - **Description** : "Consult-Chrono - Payment Confirmation"
   - **Version** : Latest API version
   - **Événements à écouter** :
     - ✅ `checkout.session.completed` *(obligatoire)*
     - ✅ `payment_intent.payment_failed` *(optionnel)*

5. **Cliquez sur** : "Add endpoint"

### Étape 2 : Récupérer le Webhook Secret

1. **Après création**, cliquez sur le webhook que vous venez de créer
2. **Copiez** le **Signing secret** (commence par `whsec_...`)
3. **Ajoutez-le** dans Vercel :
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
   ```

---

## 🔗 Configuration du Lien de Paiement Stripe

### Vérifier les paramètres du Payment Link

1. **Allez dans** : Stripe Dashboard → Payment Links
2. **Trouvez** : https://buy.stripe.com/aFa6oHfLFcnDgJ8eHY4Ja00
3. **Vérifiez** :
   - ✅ **Prix** : 21,00 € (ou votre tarif)
   - ✅ **Mode** : `payment` (paiement unique)
   - ✅ **Success URL** : `https://consult-chrono.fr/?payment=success`
   - ✅ **Cancel URL** : `https://consult-chrono.fr/?payment=cancelled`

### Important : Activer `client_reference_id`

Le paramètre `client_reference_id` est **automatiquement ajouté** dans l'URL par notre code :
```javascript
const stripeUrl = `https://buy.stripe.com/aFa6oHfLFcnDgJ8eHY4Ja00?client_reference_id=${consultationId}`;
```

Stripe le récupérera dans le webhook via `session.client_reference_id`.

---

## 🔄 Flux de Paiement

### 1. Utilisateur remplit le formulaire
```
Étapes 1-19 → Données collectées
```

### 2. Soumission du formulaire (Étape 19)
```javascript
// ConsultationNew.tsx - handleComplete()
const { data: savedData } = await supabase
  .from("consultations")
  .insert([{ ...consultationData, payment_status: "pending" }])
  .select()
  .single();

localStorage.setItem('consultation_id', savedData.id);
```

### 3. Affichage de la page de paiement (Step20)
```
✅ Consultation sauvegardée avec payment_status = "pending"
✅ ID stocké dans localStorage
✅ Utilisateur voit le récapitulatif
```

### 4. Redirection vers Stripe
```javascript
// Step20.tsx - handlePay()
const consultationId = localStorage.getItem('consultation_id');
window.location.href = `https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00?client_reference_id=${consultationId}`;
```
> 🧪 Lien de test Stripe - utilisez les cartes de test Stripe

### 5. Paiement sur Stripe
```
Utilisateur entre ses informations de carte
Stripe traite le paiement
```

### 6. Webhook reçu (après paiement réussi)
```javascript
// api/stripe/webhook.js
event.type === 'checkout.session.completed'
const consultationId = session.client_reference_id;

await supabase
  .from('consultations')
  .update({ 
    payment_status: 'done',
    payment_id: session.payment_intent 
  })
  .eq('id', consultationId);
```

### 7. Redirection de l'utilisateur
```
Success → https://consult-chrono.fr/?payment=success
Cancel → https://consult-chrono.fr/?payment=cancelled
```

---

## 🧪 Test en Local

### 1. Installer Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Ou télécharger depuis https://stripe.com/docs/stripe-cli
```

### 2. Login Stripe CLI

```bash
stripe login
```

### 3. Écouter les webhooks en local

```bash
# Terminal 1 - Lancer le serveur local
vercel dev

# Terminal 2 - Écouter les webhooks Stripe
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Stripe CLI vous donnera un **webhook secret temporaire** commençant par `whsec_...`. Copiez-le dans votre `.env.local` :

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Tester le paiement

1. Créez une consultation test sur votre site local
2. Notez l'ID de consultation dans la console
3. Utilisez une [carte de test Stripe](https://stripe.com/docs/testing) :
   - **Carte** : `4242 4242 4242 4242`
   - **Expiration** : N'importe quelle date future
   - **CVC** : N'importe quel 3 chiffres
   - **ZIP** : N'importe quel code postal

4. Vérifiez dans la console que le webhook est reçu et que le statut est mis à jour

---

## 🚀 Déploiement en Production

### 1. Configurer les variables d'environnement dans Vercel

```bash
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add VITE_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### 2. Déployer

```bash
git add .
git commit -m "feat: Stripe payment integration"
git push origin main
```

Vercel déploiera automatiquement.

### 3. Vérifier le webhook en production

1. **Allez dans** : Stripe Dashboard → Developers → Webhooks
2. **Cliquez** sur votre webhook
3. **Testez** : "Send test webhook" → `checkout.session.completed`
4. **Vérifiez** : Logs dans Vercel pour confirmer la réception

---

## 📊 Monitoring

### Vérifier les paiements

```sql
-- Dans Supabase SQL Editor
SELECT 
  id,
  nom_prenom,
  email,
  payment_status,
  payment_id,
  created_at
FROM consultations
WHERE payment_status = 'done'
ORDER BY created_at DESC;
```

### Logs Stripe

- **Dashboard** : Stripe → Developers → Events
- **Filtrer** : `checkout.session.completed`
- **Vérifier** : `client_reference_id` est bien l'ID de consultation

### Logs Vercel

- **Vercel Dashboard** → Votre projet → Logs
- **Rechercher** : "Payment successful for consultation"

---

## 🔒 Sécurité

### ✅ Points de sécurité implémentés

- **Vérification de signature** : Le webhook vérifie la signature Stripe
- **Service Role Key** : Utilisée côté serveur uniquement (jamais exposée au client)
- **RLS Supabase** : Row Level Security activée
- **HTTPS uniquement** : Toutes les communications sont chiffrées
- **Validation côté client** : Vérification des CGU avant paiement

### ⚠️ Checklist de production

- [ ] `STRIPE_SECRET_KEY` configurée (mode `live`, pas `test`)
- [ ] `STRIPE_WEBHOOK_SECRET` configurée (depuis webhook en production)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurée et **jamais exposée au client**
- [ ] Webhook Stripe configuré avec l'URL de production
- [ ] Success/Cancel URLs configurées dans le Payment Link
- [ ] Test de bout en bout effectué
- [ ] Monitoring activé (Stripe + Vercel logs)

---

## 🆘 Dépannage

### Le webhook ne reçoit rien

1. **Vérifier** l'URL du webhook : `https://consult-chrono.fr/api/stripe/webhook`
2. **Vérifier** que le webhook est activé dans Stripe
3. **Tester** avec "Send test webhook" dans Stripe Dashboard
4. **Consulter** les logs Vercel pour voir les erreurs

### Le statut ne se met pas à jour

1. **Vérifier** dans Stripe Events que `client_reference_id` est présent
2. **Vérifier** que l'ID de consultation existe dans Supabase
3. **Vérifier** les logs du webhook : `console.log('✅ Payment status updated:', data)`
4. **Tester** manuellement la requête UPDATE dans Supabase SQL Editor

### Erreur "Webhook signature verification failed"

1. **Vérifier** que `STRIPE_WEBHOOK_SECRET` est bien configurée
2. **Vérifier** que le secret correspond au webhook en production (pas au local)
3. **Regénérer** le webhook secret si nécessaire

---

## 📝 Fichiers Modifiés

- ✅ `src/components/form/steps/Step20.tsx` - Redirection vers Stripe
- ✅ `src/pages/ConsultationNew.tsx` - Sauvegarde ID dans localStorage
- ✅ `api/stripe/webhook.js` - Endpoint webhook Stripe
- ✅ `vercel.json` - Configuration Vercel
- ✅ `STRIPE_SETUP.md` - Cette documentation

---

## ✅ Prêt pour la Production !

Une fois toutes les étapes complétées, le système de paiement Stripe sera entièrement fonctionnel et automatique. Les consultations seront créées avec `payment_status: "pending"` et mises à jour automatiquement à `"done"` après paiement réussi. 🎉

