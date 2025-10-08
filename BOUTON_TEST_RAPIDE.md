# ⚡ Bouton "Test Rapide" - Mode Développement

## 🎯 Fonctionnalité Ajoutée

Un bouton **"Test rapide"** a été ajouté sur la **Step 1** (première étape) du formulaire pour faciliter les tests.

### 📍 Localisation

**Première étape du formulaire** (Maladie présumée)  
→ En haut à droite, à côté du bouton "Retour"

**Icône** : ⚡ (éclair violet)  
**Texte** : "Test rapide"

---

## ⚡ Que Fait Ce Bouton ?

Quand tu cliques sur **"Test rapide"** :

1. ✅ **Remplit automatiquement TOUTES les étapes** avec des données de test valides
2. ✅ **Saute directement à l'étape 19** (Numéro de sécurité sociale)
3. ✅ Affiche un toast : "Formulaire rempli - Vous êtes à l'étape 19"

**Tu peux alors** :
- Vérifier l'étape 19
- Cliquer "Suivant" pour aller à Step 20 (paiement)
- Tester le paiement rapidement

---

## 📝 Données de Test Pré-remplies

```javascript
Maladie : Grippe
Symptômes : Fièvre, Toux
Diagnostic antérieur : Non
Apparition : Progressive
Médicaments : Non
Type d'arrêt : Initial
Profession : Employé
Date début : Aujourd'hui
Date fin : Dans 3 jours
Nom : Test User
Date naissance : 01/01/1990
Email : test@example.com
Adresse : 123 rue Test
Code postal : 75001
Ville : Paris
Pays : France
Situation pro : Salarié
Médecin : Paris
N° Sécurité sociale : 190010112345678
```

---

## 🧪 Utilisation pour les Tests

### Scénario 1 : Test Complet Rapide

1. **Ouvre** : `https://consult-chrono.fr/consultation`
2. **Clique** : "Test rapide" ⚡
3. **Résultat** : Tu es à l'étape 19
4. **Clique** : "Suivant"
5. **Tu arrives** : Step 20 (Paiement)
6. **Teste** le paiement

**Temps gagné** : ~5 minutes (au lieu de remplir 19 étapes manuellement)

### Scénario 2 : Test d'une Étape Spécifique

1. **Clique** : "Test rapide"
2. **Utilise** : Bouton "Précédent" pour revenir à l'étape que tu veux tester
3. **Les données** sont déjà remplies

### Scénario 3 : Test du Workflow Complet

1. **Clique** : "Test rapide"
2. **Va** : Step 20
3. **Accepte** : CGU
4. **Clique** : "Payer 14 €"
5. **Vérifie** : 
   - ✅ Sauvegarde Supabase
   - ✅ Redirection Stripe
   - ✅ Paiement
   - ✅ Webhook
   - ✅ Success page

---

## 🎨 Design du Bouton

**Couleur** : Violet/Pourpre (pour indiquer que c'est un outil de développement)  
**Style** : Outline (bordure, pas plein)  
**Taille** : Small  
**Position** : Haut à droite de Step 1

**Contraste avec** :
- Bouton "Retour" (gris, à gauche)
- Bouton "Suivant" (bleu, en bas)

---

## 🔒 Sécurité

### ⚠️ Pour la Production

**Actuellement** : Le bouton est visible pour TOUT LE MONDE

**Options pour la production** :

#### Option 1 : Supprimer le Bouton
```bash
# Avant de déployer en production, supprimer le bouton
# Dans Step1.tsx, supprimer tout le code du bouton "Test rapide"
```

#### Option 2 : Mode Développement Seulement
```javascript
// Afficher seulement en mode dev
{process.env.NODE_ENV === 'development' && (
  <Button ... >Test rapide</Button>
)}
```

#### Option 3 : URL Secrète
```javascript
// Afficher seulement si un paramètre URL est présent
{new URLSearchParams(window.location.search).has('debug') && (
  <Button ... >Test rapide</Button>
)}
// Usage : https://consult-chrono.fr/consultation?debug
```

---

## 🔧 Code Source

### FormWizard.tsx

Fonction `handleAutoFill()` :
- Crée un objet `testData` avec toutes les données
- Appelle `setFormData(testData)`
- Sauvegarde dans localStorage via `saveFormData(testData)`
- Change l'étape courante : `setCurrentStep(18)` (Step 19)
- Affiche un toast de confirmation

### Step1.tsx

Bouton avec handler :
- Appelle `onAutoFill()` (passé en prop depuis FormWizard)
- Icône `Zap` (éclair)
- Classe `text-purple-600`

---

## ✅ Avantages

1. **Gain de temps** : 5 minutes → 5 secondes
2. **Tests répétés** : Facilite les tests multiples
3. **Données cohérentes** : Toujours les mêmes données de test
4. **Debug rapide** : Aller directement à l'étape problématique
5. **Démo client** : Montrer rapidement le workflow complet

---

## 📊 Checklist d'Utilisation

- [ ] Bouton "Test rapide" visible sur Step 1
- [ ] Clic sur le bouton remplit le formulaire
- [ ] Navigation automatique vers Step 19
- [ ] Toast de confirmation affiché
- [ ] Toutes les données sont valides
- [ ] Peut continuer vers Step 20
- [ ] Le paiement fonctionne avec les données de test

---

**Le bouton est maintenant disponible ! Teste-le en local ou après déploiement.** ⚡

