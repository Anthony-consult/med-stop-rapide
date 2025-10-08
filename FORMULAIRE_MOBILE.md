# 📱 Formulaire de Consultation Mobile — Guide de Développement

## 🎯 Objectif
Refactorisation complète du formulaire médical multi-étapes pour mobile avec les exigences suivantes :
- **One-screen-per-step** : Pas de scroll par étape
- **Prévention du zoom iOS** : Font-size ≥ 16px sur tous les inputs
- **Safe-area support** : Gestion des encoches iPhone
- **Validation avant navigation** : Bouton "Suivant" disabled si invalide
- **Persistance localStorage** : Sauvegarde auto + restauration

## 📊 Progression : 8/20 étapes complétées

### ✅ Infrastructure terminée
1. Configuration viewport iOS (maximum-scale=1, viewport-fit=cover)
2. CSS global anti-zoom (16px minimum sur inputs)
3. Système localStorage avec versioning
4. Schémas Zod pour les 20 étapes
5. Composants réutilisables (FormWizard, BottomBar, DateField)

### ✅ Steps implémentés (3)
- **Step 1** : Maladie présumée (Select)
- **Step 2** : Symptômes (Multi-select chips)
- **Step 3** : Diagnostic antérieur (Radio)

### 🚧 Steps à implémenter (17)

#### Étapes médicales
- [ ] Step 4: Description libre (Textarea 10-600 chars)
- [ ] Step 5: Localisation douleurs (Multi-select)
- [ ] Step 6: Apparition soudaine (Radio)
- [ ] Step 7: Médicaments (Textarea)
- [ ] Step 8: **Facteurs de risque [GATE]** (Dialog si ≥1 coché)

#### Étapes administratives
- [ ] Step 9: Type arrêt (nouvel/prolongation)
- [ ] Step 10: Profession
- [ ] Step 11: Dates incapacité (3 sous-steps)
- [ ] Step 12: Nom/Prénom (auto-majuscules)
- [ ] Step 13: Date naissance (≥16 ans)
- [ ] Step 14: Email
- [ ] Step 15: Confirmation email
- [ ] Step 16: Adresse postale
- [ ] Step 17: Situation pro
- [ ] Step 18: Ville médecin
- [ ] Step 19: N° sécurité sociale (15 chiffres)

#### Étape finale
- [ ] Step 20: CGU + Paiement Stripe
  - Réassurance (SSL, RGPD, Médecins certifiés)
  - Prix 21€ TTC
  - Checkbox CGU obligatoire
  - Intégration Stripe Payment Element

## 🧪 Test actuel

### URL de test
```
http://localhost:8080/consultation-new
```

### Lancer le serveur
```bash
npm run dev
# Serveur disponible sur http://localhost:8080
```

### Fonctionnalités testables
- ✅ Navigation prev/next
- ✅ Validation avec messages d'erreur inline
- ✅ Sauvegarde auto dans localStorage
- ✅ Restauration des données au reload
- ✅ Bouton "Suivant" disabled si formulaire invalide
- ✅ Progress bar avec indicateur "Étape X sur Y"
- ✅ Layout full-screen sans scroll

### Debug
Si la page est blanche, ouvrir la console navigateur (F12) et vérifier :
1. Erreurs JavaScript
2. Imports manquants
3. Port du serveur (8080 par défaut)

## 📁 Architecture des fichiers

```
src/
├── lib/
│   ├── storage.ts                    # localStorage avec versioning
│   └── validation/
│       └── consultation-schema.ts     # 20 schémas Zod + options
│
├── components/
│   └── form/
│       ├── FormWizard.tsx            # Orchestrateur principal
│       ├── BottomBar.tsx             # Navigation fixe + progress
│       ├── DateField.tsx             # Date picker mobile
│       └── steps/
│           ├── Step1.tsx             # Maladie présumée
│           ├── Step2.tsx             # Symptômes
│           ├── Step3.tsx             # Diagnostic antérieur
│           ├── Step4.tsx             # [À créer] Description
│           ├── Step5.tsx             # [À créer] Douleurs
│           └── ...                   # [À créer] Steps 6-20
│
└── pages/
    └── ConsultationNew.tsx            # Page de test du wizard
```

## 🔧 Comment ajouter un nouveau step

### 1. Créer le composant Step
```tsx
// src/components/form/steps/Step4.tsx
import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step4Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Step4Data = z.infer<typeof step4Schema>;

export function Step4({ form }: StepComponentProps<Step4Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="autres_symptomes">
          Décrivez tous les autres symptômes
        </Label>
        
        <Controller
          name="autres_symptomes"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="autres_symptomes"
              rows={6}
              placeholder="Décrivez vos symptômes..."
              className="text-[16px] min-h-[120px]"
              aria-invalid={errors.autres_symptomes ? "true" : "false"}
            />
          )}
        />
        
        {errors.autres_symptomes && (
          <p className="text-sm text-red-600" role="alert">
            {errors.autres_symptomes.message}
          </p>
        )}
      </div>
    </div>
  );
}
```

### 2. Ajouter au tableau des steps dans ConsultationNew.tsx
```tsx
import { Step4 } from "@/components/form/steps/Step4";
import { step4Schema } from "@/lib/validation/consultation-schema";

const steps = [
  // ... steps existants
  {
    id: 4,
    title: "Autres symptômes",
    description: "Décrivez tous les autres symptômes que vous ressentez",
    schema: step4Schema,
    component: Step4,
  },
];
```

## 🎨 Design System

### Couleurs
- **Primary** : `hsl(201, 58%, 43%)` - Bleu médical
- **Error** : `hsl(0, 84%, 60%)` - Rouge validation
- **Background** : Gradient `#f6f9fc → #ffffff`

### Typographie
- **Titre step** : `text-2xl font-bold`
- **Description** : `text-sm text-gray-500`
- **Labels** : `text-base font-medium`
- **Inputs** : `text-[16px]` (anti-zoom iOS)

### Composants
- **Inputs** : `min-h-[48px]` (touch-friendly)
- **Boutons** : `min-h-[48px] rounded-xl`
- **Cards** : `rounded-2xl border shadow-md`
- **Bottom bar** : `fixed bottom-0` + `pb-[calc(env(safe-area-inset-bottom)+12px)]`

## 📱 Tests iOS Safari

### Checklist de validation
- [ ] Aucun zoom au focus des inputs
- [ ] Keyboard n'obstrue pas le bouton "Suivant"
- [ ] Safe-area respectée (pas de contenu caché par l'encoche)
- [ ] Layout 100dvh sans scroll par step
- [ ] Validation fonctionne avant navigation
- [ ] localStorage persiste au reload
- [ ] Transitions fluides entre steps

### Simulateur iOS (Chrome DevTools)
1. F12 → Toggle device toolbar
2. Sélectionner "iPhone 13" (390x844)
3. Tester le formulaire step par step

### Test sur appareil réel
1. Build de prod : `npm run build`
2. Serve : `npm run preview`
3. Ouvrir sur iPhone via IP locale
4. Tester en conditions réelles

## 🚀 Prochaines étapes

### Priorité 1 : Compléter les steps
Implémenter les steps 4 à 20 selon le pattern établi

### Priorité 2 : Intégrations
- **Supabase** : Sauvegarder en base à la step 20
- **Stripe** : Payment Element dans Dialog full-screen

### Priorité 3 : Polish
- Animations de transition entre steps
- Loading states
- Error handling global
- Tests E2E Playwright

## 📝 Notes techniques

### Prévention zoom iOS
- Viewport : `maximum-scale=1`
- Inputs : `font-size: 16px` (forcé en CSS global)
- Classes Tailwind : `text-[16px]` sur tous les champs

### Safe-area iOS
```css
padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
```

### Validation Zod
Tous les champs sont requis par défaut.
Pour un champ optionnel :
```ts
z.string().optional()
```

### localStorage
- Clé : `consultation-form`
- Version : `1`
- Auto-save à chaque step
- Migration si changement de version

---

**Développé pour** : med-stop-rapide  
**Stack** : React + Vite + TypeScript + shadcn/ui + Tailwind  
**Date** : Octobre 2025

