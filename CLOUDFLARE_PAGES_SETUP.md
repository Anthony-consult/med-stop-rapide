# ⚙️ Configuration Cloudflare Pages - Variables d'Environnement

## 🚨 PROBLÈME ACTUEL

L'erreur `ERR_NAME_NOT_RESOLVED` indique que les variables d'environnement Supabase ne sont **pas configurées** sur Cloudflare Pages.

## ✅ SOLUTION : Configurer les Variables

### Étape 1 : Accéder aux Variables d'Environnement

1. Allez sur **https://dash.cloudflare.com**
2. Sélectionnez votre compte
3. Allez dans **Pages** → Votre projet
4. Cliquez sur **Settings** (Paramètres)
5. Cliquez sur **Environment variables** (Variables d'environnement)

### Étape 2 : Ajouter les Variables OBLIGATOIRES

Ajoutez ces variables **UNE PAR UNE** :

#### 1️⃣ VITE_SUPABASE_URL

**Où trouver la valeur** :
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Settings → API
4. Copiez **Project URL** (ex: `https://mfzqyjjxhyytpgobllkz.supabase.co`)

**Dans Cloudflare Pages** :
- **Variable name** : `VITE_SUPABASE_URL`
- **Value** : `https://mfzqyjjxhyytpgobllkz.supabase.co` (votre URL)
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez **Save**

#### 2️⃣ VITE_SUPABASE_ANON_KEY

**Où trouver la valeur** :
1. Supabase Dashboard → Settings → API
2. Section **Project API keys**
3. Copiez la clé **anon public** (commence par `eyJhbGci...`)

**Dans Cloudflare Pages** :
- **Variable name** : `VITE_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGci...` (votre clé complète)
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez **Save**

#### 3️⃣ RESEND_API_KEY

**Où trouver la valeur** :
1. Allez sur https://resend.com
2. Dashboard → API Keys
3. Copiez votre clé (commence par `re_...`)

**Dans Cloudflare Pages** :
- **Variable name** : `RESEND_API_KEY`
- **Value** : `re_...` (votre clé)
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez **Save**

#### 4️⃣ ALERT_RECIPIENT

**Dans Cloudflare Pages** :
- **Variable name** : `ALERT_RECIPIENT`
- **Value** : `soniwork009@gmail.com`
- **Environment** : ✅ Production, ✅ Preview, ✅ Development
- Cliquez **Save**

### Étape 3 : Redéployer

Après avoir ajouté toutes les variables :

1. Retournez sur la page **Deployments**
2. Cliquez sur les **3 points** `⋮` du dernier déploiement
3. Cliquez sur **Retry deployment** (Réessayer le déploiement)
4. Attendez 2-3 minutes

## ✅ Vérification

Après le redéploiement, testez le formulaire :

1. Allez sur votre site Cloudflare Pages
2. Remplissez le formulaire
3. Vérifiez la console du navigateur (F12)
4. **Plus d'erreur** `ERR_NAME_NOT_RESOLVED` ✅

## 📋 Checklist Complète

Variables à configurer sur Cloudflare Pages :

- [ ] `VITE_SUPABASE_URL` = `https://mfzqyjjxhyytpgobllkz.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGci...` (clé publique)
- [ ] `RESEND_API_KEY` = `re_...`
- [ ] `ALERT_RECIPIENT` = `soniwork009@gmail.com`

**Optionnel** (pour les fonctions serverless) :
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGci...` (clé privée - serveur uniquement)
- [ ] `STRIPE_SECRET_KEY` = `sk_test_...`
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...`
- [ ] `SUPABASE_WEBHOOK_TOKEN` = (token aléatoire)

## 🐛 Si ça ne marche toujours pas

1. **Vérifiez l'orthographe** des noms de variables (sensible à la casse)
2. **Vérifiez que les valeurs** sont complètes (pas tronquées)
3. **Vérifiez les logs** Cloudflare Pages → Functions → Logs
4. **Redéployez** après chaque modification de variable

## 📚 Documentation Cloudflare

- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

