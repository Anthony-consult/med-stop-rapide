# 📧 Guide de Test Email avec Resend

## ✅ Configuration Vérifiée

Vous avez configuré :
- ✅ `ALERT_RECIPIENT=soniwork009@gmail.com` (dans .env et Cloudflare)
- ✅ `RESEND_API_KEY=re_...` (dans .env et Cloudflare)

## 🧪 Tester l'Envoi d'Email

### Option 1 : Test via l'Endpoint (Recommandé)

1. **Déployez votre projet** sur Cloudflare Pages (ou Vercel)

2. **Appelez l'endpoint de test** :
   ```bash
   curl -X GET https://votre-domaine.com/api/test-email
   ```
   
   Ou via votre navigateur :
   ```
   https://votre-domaine.com/api/test-email
   ```

3. **Vérifiez la réponse** :
   ```json
   {
     "ok": true,
     "message": "Test email sent successfully!",
     "to": "soniwork009@gmail.com",
     "from": "onboarding@resend.dev",
     "subject": "🧪 TEST EMAIL – Jean Dupont",
     "emailId": "re_...",
     "timestamp": "2025-01-07T..."
   }
   ```

4. **Vérifiez votre boîte Gmail** (soniwork009@gmail.com)
   - L'email devrait arriver dans quelques secondes
   - Vérifiez aussi les spams si nécessaire

### Option 2 : Test Local (si vous utilisez Vercel CLI)

```bash
# Installer Vercel CLI si nécessaire
npm i -g vercel

# Lancer en local
vercel dev

# Tester l'endpoint
curl http://localhost:3000/api/test-email
```

## 🔍 Vérification dans Resend Dashboard

1. Allez sur [resend.com](https://resend.com) → Dashboard
2. Section **Emails** → Vérifiez que l'email apparaît
3. Statut devrait être **"Delivered"** ✅

## ⚠️ Important : Domaine Resend

Par défaut, le code utilise `onboarding@resend.dev` comme adresse "from".

**Pour utiliser votre propre domaine** (consult-chrono.fr) :
1. Vérifiez votre domaine dans Resend Dashboard → Domains
2. Ajoutez la variable d'environnement :
   ```bash
   RESEND_FROM_EMAIL=Consult-Chrono <notifications@consult-chrono.fr>
   ```

## 🐛 Dépannage

### Erreur "RESEND_API_KEY not configured"
- Vérifiez que la variable est bien définie dans Cloudflare Pages
- Redéployez après avoir ajouté la variable

### Erreur "Invalid API key"
- Vérifiez que votre clé API Resend commence par `re_`
- Vérifiez qu'elle est active dans Resend Dashboard

### Email non reçu
- Vérifiez les spams dans Gmail
- Vérifiez les logs Cloudflare Pages
- Vérifiez Resend Dashboard pour voir le statut de livraison

### Erreur "Domain not verified"
- Utilisez `onboarding@resend.dev` pour les tests (déjà configuré)
- Ou vérifiez votre domaine dans Resend Dashboard

## ✅ Test Réussi ?

Si vous recevez l'email de test, tout fonctionne ! 🎉

Les emails de formulaire seront maintenant envoyés à **soniwork009@gmail.com** automatiquement.

