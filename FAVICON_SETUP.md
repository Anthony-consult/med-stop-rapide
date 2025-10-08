# 🎨 Configuration des Favicons — Consult-Rapide

## 📋 Fichiers générés

Tous les fichiers d'icônes ont été générés à partir de `/public/favicon.png` (512x512px) :

| Fichier | Taille | Usage |
|---------|--------|-------|
| `apple-touch-icon.png` | 180x180 | iOS Safari, Add to Home Screen |
| `favicon-32x32.png` | 32x32 | Navigateurs modernes (tabs) |
| `favicon-16x16.png` | 16x16 | Navigateurs modernes (petite taille) |
| `android-chrome-192x192.png` | 192x192 | Android Chrome, PWA |
| `android-chrome-512x512.png` | 512x512 | Android Chrome, PWA (haute résolution) |
| `favicon.ico` | Multi-tailles | Compatibilité navigateurs anciens |
| `safari-pinned-tab.svg` | Vectoriel | Safari pinned tabs (macOS) |
| `site.webmanifest` | JSON | Manifest PWA pour Android/Chrome |
| `browserconfig.xml` | XML | Windows tiles (IE/Edge legacy) |

## 🎯 Couleur du thème

**Couleur principale :** `#0A6ABF` (bleu Consult-Rapide)

Cette couleur est utilisée pour :
- `theme-color` (barre d'adresse mobile)
- `msapplication-TileColor` (Windows tiles)
- `mask-icon color` (Safari pinned tab)
- Fond du manifest PWA

## 🔧 Meta tags dans `index.html`

```html
<!-- Favicons -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0A6ABF">
<link rel="shortcut icon" href="/favicon.ico">
<meta name="theme-color" content="#0A6ABF">
<meta name="msapplication-TileColor" content="#0A6ABF">
<meta name="msapplication-config" content="/browserconfig.xml">
```

## ✅ Plateformes couvertes

- ✅ **iOS Safari** : `apple-touch-icon.png`
- ✅ **Android Chrome** : `android-chrome-*.png` + `site.webmanifest`
- ✅ **Desktop (Chrome, Firefox, Edge)** : `favicon-32x32.png`, `favicon-16x16.png`
- ✅ **Safari macOS (pinned tabs)** : `safari-pinned-tab.svg`
- ✅ **Windows Tiles** : `browserconfig.xml`
- ✅ **PWA Support** : `site.webmanifest`
- ✅ **Navigateurs anciens** : `favicon.ico`

## 🧪 Tests de vérification

### Local
```bash
# Démarrer le serveur de dev
npm run dev

# Ouvrir dans différents navigateurs
open http://localhost:8080
```

### Vérifications visuelles

1. **Desktop (Chrome/Firefox/Safari)** :
   - ✅ Icône visible dans l'onglet
   - ✅ Icône visible dans les favoris
   - ✅ Icône visible dans la barre d'adresse

2. **iOS Safari** :
   - ✅ Ajouter à l'écran d'accueil → icône correcte
   - ✅ Pas d'icône "planète grise" par défaut

3. **Android Chrome** :
   - ✅ Ajouter à l'écran d'accueil → icône correcte
   - ✅ Menu → Installer l'application → icône correcte
   - ✅ Barre d'adresse avec couleur `#0A6ABF`

4. **Safari macOS (pinned tabs)** :
   - ✅ Épingler l'onglet → icône SVG monochrome visible

## 🔄 Regénération des icônes

Si vous devez regénérer les icônes à partir d'un nouveau `favicon.png` :

```bash
# Apple Touch Icon (180x180)
sips -z 180 180 public/favicon.png --out public/apple-touch-icon.png

# Favicon 32x32
sips -z 32 32 public/favicon.png --out public/favicon-32x32.png

# Favicon 16x16
sips -z 16 16 public/favicon.png --out public/favicon-16x16.png

# Android Chrome 192x192
sips -z 192 192 public/favicon.png --out public/android-chrome-192x192.png

# Android Chrome 512x512 (copie directe si source = 512x512)
cp public/favicon.png public/android-chrome-512x512.png

# Favicon ICO (via ICNS)
sips -s format icns public/favicon-32x32.png --out public/favicon.icns
mv public/favicon.icns public/favicon.ico
```

## 📦 Déploiement

Tous les fichiers dans `/public` sont automatiquement servis à la racine du domaine par Vercel/Vite :
- `/apple-touch-icon.png` → `https://www.consult-rapide.fr/apple-touch-icon.png`
- `/favicon.ico` → `https://www.consult-rapide.fr/favicon.ico`
- etc.

**Aucune configuration supplémentaire nécessaire.**

## 🌐 Cache et propagation

Après déploiement, les navigateurs peuvent mettre en cache les anciennes icônes. Pour forcer le rafraîchissement :

### Chrome/Firefox
- `Cmd+Shift+R` (macOS) ou `Ctrl+Shift+R` (Windows)

### Safari
- `Cmd+Option+E` puis `Cmd+R`

### iOS Safari
- Supprimer l'icône de l'écran d'accueil et la rajouter

### Android Chrome
- Paramètres → Confidentialité → Effacer les données de navigation → Images et fichiers en cache

---

**Date de configuration :** 8 octobre 2025  
**Version du favicon source :** `/public/favicon.png` (512x512px)

