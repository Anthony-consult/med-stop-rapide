# 🔍 Debug Vercel - Pourquoi ça ne Fonctionne Pas

## ✅ Ce qui vient d'être Corrigé

J'ai poussé une correction pour configurer les fonctions Vercel dans `vercel.json`.

**Attends 2-3 minutes** que Vercel redéploie automatiquement.

---

## 🚨 Problèmes Identifiés

### 1. Page `/payment/success` affiche blanc
**Cause possible** : Le déploiement Vercel n'a pas encore pris en compte les nouveaux fichiers

### 2. Webhook ne met pas à jour `payment_status`
**Cause possible** : Variables d'environnement manquantes sur Vercel

---

## 🔧 Actions Immédiates

### Étape 1 : Vérifier les Variables d'Environnement Vercel

**VA MAINTENANT sur** : https://vercel.com/dashboard → Ton projet → Settings → Environment Variables

**Vérifie que TU AS CES 4 VARIABLES** :

```bash
✅ VITE_SUPABASE_URL          = https://ton-projet.supabase.co
✅ VITE_SUPABASE_ANON_KEY     = eyJhb...  (clé publique)
✅ SUPABASE_SERVICE_ROLE_KEY  = eyJhb...  (clé privée - différente!)
✅ STRIPE_SECRET_KEY          = sk_test_...
✅ STRIPE_WEBHOOK_SECRET      = whsec_...
```

**Si une variable manque**, ajoute-la maintenant :
1. Click "Add New"
2. Name = nom de la variable
3. Value = valeur
4. Environment = **Production, Preview, Development** (SÉLECTIONNE LES 3)
5. Save

### Étape 2 : Forcer un Redéploiement

Une fois les variables ajoutées :

1. **Va sur** : https://vercel.com/dashboard → Ton projet → Deployments
2. **Clique** sur le dernier déploiement (le plus récent)
3. **Clique** sur les 3 points `⋮` → "Redeploy"
4. **COCHE** : "Use existing Build Cache" = **NON** (décoché)
5. **Clique** : "Redeploy"

**Attends 2-3 minutes** que le déploiement se termine.

---

## 🧪 Test Après Redéploiement

### Test 1 : Page de Succès

```bash
# Ouvre dans ton navigateur
https://consult-chrono.fr/payment/success
```

**Résultat attendu** : Page avec "Paiement confirmé !" ✅  
**Si blanc** : Le build n'a pas inclus le fichier → Vérifie les logs Vercel

### Test 2 : Webhook API

```bash
# Dans ton terminal
curl https://consult-chrono.fr/api/stripe/webhook
```

**Résultat attendu** : `{"error":"Method not allowed"}` ✅  
**Si "Redirecting..."** : La fonction n'est pas déployée

### Test 3 : Webhook avec POST

```bash
curl -X POST https://consult-chrono.fr/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

**Résultat attendu** : `{"error":"Webhook Error:..."}` (erreur signature, c'est normal) ✅  
**Si autre chose** : La fonction ne fonctionne pas

---

## 🔍 Vérifier les Logs Vercel

1. **Va sur** : https://vercel.com/dashboard → Ton projet → **Logs**
2. **Filtre** : Sélectionne "Functions"
3. **Cherche** les erreurs récentes

### Erreurs Communes

**Si tu vois** : `Cannot find module '@supabase/supabase-js'`
→ **Solution** : Les dépendances ne sont pas installées
→ **Fix** : Vérifie que `package.json` contient `@supabase/supabase-js` et `stripe`

**Si tu vois** : `SUPABASE_SERVICE_ROLE_KEY is not defined`
→ **Solution** : Variable d'environnement manquante
→ **Fix** : Ajoute-la dans Vercel Settings

**Si tu vois** : `Table 'consultations' does not exist`
→ **Solution** : La connexion Supabase ne fonctionne pas
→ **Fix** : Vérifie `VITE_SUPABASE_URL`

---

## 📊 Checklist Debug

- [ ] Variables d'environnement vérifiées dans Vercel
- [ ] Les 5 variables sont présentes et correctes
- [ ] Redéploiement forcé effectué (sans cache)
- [ ] Déploiement terminé avec succès (status: Ready)
- [ ] Test page `/payment/success` : ✅ Affiche contenu
- [ ] Test webhook GET : ✅ Retourne erreur 405
- [ ] Test webhook POST : ✅ Retourne erreur signature
- [ ] Logs Vercel : Aucune erreur visible

---

## 🆘 Si Rien ne Fonctionne

### Option 1 : Vérifier que les fichiers sont bien déployés

```bash
# Dans ton terminal local
git ls-files | grep -E "(PaymentSuccess|webhook)"
```

**Tu dois voir** :
```
api/stripe/webhook.js
src/pages/PaymentSuccess.tsx
```

**Si manquant**, ajoute-les :
```bash
git add api/stripe/webhook.js
git add src/pages/PaymentSuccess.tsx
git commit -m "add: Missing files for payment flow"
git push
```

### Option 2 : Vérifier la configuration Vercel

1. **Vercel Dashboard** → Ton projet → Settings → General
2. **Build & Development Settings** :
   - Framework Preset : **Vite**
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Install Command : `npm install`

3. **Root Directory** : `.` (vide ou point)

4. **Node.js Version** : 18.x ou 20.x

### Option 3 : Contact Vercel Support

Si vraiment rien ne fonctionne, le problème peut être :
- Configuration du domaine `consult-chrono.fr`
- Problème de build spécifique à ton compte Vercel
- Limite de plan gratuit atteinte

---

## 🎯 Résultat Final Attendu

Une fois tout configuré :

**Test complet** :
1. Formulaire → Step20 → Payer 14 €
2. Sauvegarde Supabase : `payment_status = "pending"` ✅
3. Redirection Stripe
4. Paiement avec `4242 4242 4242 4242`
5. **Redirection** : `https://consult-chrono.fr/payment/success` ✅
6. **Page affichée** : "Paiement confirmé !" ✅
7. **Supabase** : `payment_status = "done"` ✅

---

**Commence par vérifier les variables d'environnement et redéployer !**

