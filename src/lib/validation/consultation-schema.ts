import { z } from "zod";

/**
 * Validation schemas for each step of the consultation form
 * All questions are mandatory unless explicitly marked optional
 */

// Step 1: Maladie présumée
export const step1Schema = z.object({
  maladie_presumee: z.string().min(1, "Veuillez sélectionner une maladie"),
});

// Step 2: Symptômes (multi-select)
export const step2Schema = z.object({
  symptomes: z.array(z.string()).min(1, "Veuillez sélectionner au moins un symptôme"),
});

// Step 3: Diagnostic antérieur
export const step3Schema = z.object({
  diagnostic_anterieur: z.enum(["oui", "non", "peut-etre"], {
    required_error: "Veuillez sélectionner une réponse",
  }),
});

// Step 4: Description libre
export const step4Schema = z.object({
  autres_symptomes: z
    .string()
    .min(10, "Veuillez décrire vos symptômes (minimum 10 caractères)")
    .max(600, "Description trop longue (maximum 600 caractères)"),
});

// Step 5: Localisation des douleurs
export const step5Schema = z.object({
  zones_douleur: z.array(z.string()).min(1, "Veuillez sélectionner au moins une zone"),
});

// Step 6: Apparition soudaine
export const step6Schema = z.object({
  apparition_soudaine: z.enum(["oui", "non", "peut-etre"], {
    required_error: "Veuillez sélectionner une réponse",
  }),
});

// Step 7: Médicaments
export const step7Schema = z.object({
  medicaments_reguliers: z
    .string()
    .min(1, "Veuillez indiquer vos médicaments ou 'Aucun'"),
});

// Step 8: Facteurs de risque (gate critique)
export const step8Schema = z.object({
  facteurs_risque: z.array(z.string()),
  // Note: validation logique dans le composant pour bloquer si facteurs présents
});

// Step 9: Type de demande
export const step9Schema = z.object({
  type_arret: z.enum(["nouvel", "prolongation"], {
    required_error: "Veuillez sélectionner le type d'arrêt",
  }),
});

// Step 10: Profession
export const step10Schema = z.object({
  profession: z.string().min(2, "Veuillez indiquer votre profession"),
});

// Step 11: Dates d'incapacité
export const step11Schema = z.object({
  date_debut: z.date({
    required_error: "Veuillez sélectionner la date de début",
  }),
  date_fin: z.date({
    required_error: "Veuillez sélectionner la date de fin",
  }),
  date_fin_lettres: z
    .string()
    .min(10, "Veuillez saisir la date en toutes lettres")
    .regex(/^[A-Z\s]+$/, "La date doit être en majuscules"),
}).refine(
  (data) => {
    if (!data.date_debut || !data.date_fin) return true;
    return data.date_fin >= data.date_debut;
  },
  {
    message: "La date de fin doit être après la date de début",
    path: ["date_fin"],
  }
).refine(
  (data) => {
    if (!data.date_debut || !data.date_fin) return true;
    const diffDays = Math.ceil((data.date_fin.getTime() - data.date_debut.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  },
  {
    message: "La durée maximale est de 7 jours",
    path: ["date_fin"],
  }
);

// Step 12: Identité (Nom et Prénom)
export const step12Schema = z.object({
  nom_prenom: z
    .string()
    .min(3, "Veuillez saisir votre nom et prénom")
    .regex(/^[A-Z\s-]+$/, "Le nom doit être en majuscules"),
});

// Step 13: Date de naissance
export const step13Schema = z.object({
  date_naissance: z.date({
    required_error: "Veuillez sélectionner votre date de naissance",
  }),
}).refine(
  (data) => {
    if (!data.date_naissance) return true;
    const age = Math.floor((Date.now() - data.date_naissance.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age >= 16;
  },
  {
    message: "Vous devez avoir au moins 16 ans",
    path: ["date_naissance"],
  }
);

// Step 14: Email merged (both fields on same page)
export const step14MergedSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  email_confirmation: z.string().email("Adresse e-mail invalide"),
}).refine(
  (data) => data.email === data.email_confirmation,
  {
    message: "Les adresses e-mail ne correspondent pas",
    path: ["email_confirmation"],
  }
);

// Keep old schemas for backward compatibility (not used anymore)
export const step14Schema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
});

export const step15Schema = z.object({
  email_confirmation: z.string().email("Adresse e-mail invalide"),
});

// Step 16: Adresse postale
export const step16Schema = z.object({
  adresse: z.string().min(5, "Veuillez saisir votre adresse complète"),
  code_postal: z
    .string()
    .regex(/^\d{5}$/, "Code postal invalide (5 chiffres)"),
  ville: z.string().min(2, "Veuillez saisir votre ville"),
  pays: z.string().min(1, "Veuillez sélectionner un pays"),
});

// Step 17: Situation professionnelle
export const step17Schema = z.object({
  situation_pro: z.enum([
    "employe",
    "fonctionnaire",
    "sans_emploi",
    "alternant",
    "independant",
    "etudiant",
    "agricole",
  ], {
    required_error: "Veuillez sélectionner votre situation",
  }),
});

// Step 18: Localisation médecin
export const step18Schema = z.object({
  localisation_medecin: z
    .string()
    .min(2, "Veuillez indiquer la ville ou région de votre médecin"),
});

// Step 19: Numéro de sécurité sociale
export const step19Schema = z.object({
  numero_securite_sociale: z
    .string()
    .regex(/^\d{15}$/, "Le numéro de sécurité sociale doit contenir 15 chiffres"),
});

// Step 20: CGU et paiement
export const step20Schema = z.object({
  conditions_acceptees: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions générales",
  }),
});

// Type global pour toutes les données du formulaire
export type ConsultationFormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> &
  z.infer<typeof step4Schema> &
  z.infer<typeof step5Schema> &
  z.infer<typeof step6Schema> &
  z.infer<typeof step7Schema> &
  z.infer<typeof step8Schema> &
  z.infer<typeof step9Schema> &
  z.infer<typeof step10Schema> &
  z.infer<typeof step11Schema> &
  z.infer<typeof step12Schema> &
  z.infer<typeof step13Schema> &
  z.infer<typeof step14Schema> &
  z.infer<typeof step15Schema> &
  z.infer<typeof step16Schema> &
  z.infer<typeof step17Schema> &
  z.infer<typeof step18Schema> &
  z.infer<typeof step19Schema> &
  z.infer<typeof step20Schema> & {
    email_confirmation?: string;
  };

// Options pour les selects
export const maladiesOptions = [
  { value: "gastro", label: "Gastro-entérite" },
  { value: "epuisement", label: "Syndrome d'épuisement" },
  { value: "covid", label: "Symptômes COVID-19" },
  { value: "stress", label: "Stress" },
  { value: "migraine", label: "Migraine" },
];

export const symptomesOptions = [
  { value: "fievre", label: "Fièvre" },
  { value: "nausees", label: "Nausées" },
  { value: "diarrhee", label: "Diarrhée" },
  { value: "toux_seche", label: "Toux sèche" },
  { value: "toux_mucosites", label: "Toux avec mucosités" },
  { value: "malaise", label: "Malaise" },
  { value: "fatigue", label: "Fatigue" },
  { value: "hypertension", label: "Hypertension artérielle" },
  { value: "raideurs", label: "Raideurs / mouvements limités" },
  { value: "stress_recent", label: "Événement stressant récent" },
  { value: "troubles_sommeil", label: "Troubles du sommeil" },
];

export const zonesDouleursOptions = [
  { value: "tete", label: "Tête" },
  { value: "ventre", label: "Ventre" },
  { value: "dents", label: "Dents" },
  { value: "dos", label: "Dos" },
  { value: "cou", label: "Cou" },
  { value: "membres", label: "Membres" },
  { value: "oreilles", label: "Oreilles" },
  { value: "organes_genitaux", label: "Organes génitaux" },
];

export const facteursRisqueOptions = [
  { value: "respiration", label: "Difficultés respiratoires, vomissements ou diarrhée sévère" },
  { value: "obstruction", label: "Bruits ou obstructions lors de la respiration" },
  { value: "enceinte", label: "Enceinte ou immunodéficience" },
  { value: "douleur_intense", label: "Douleur intense (oreille, visage, membres)" },
  { value: "douleur_organes", label: "Douleur au larynx, poitrine ou abdomen" },
  { value: "maladie_chronique", label: "Maladie cardiaque, respiratoire ou intestinale chronique" },
  { value: "voyage_tropical", label: "Voyage tropical récent (moins de 2 mois)" },
  { value: "sentiment_grave", label: "Sentiment de maladie grave ou difficulté à avaler" },
  { value: "symptomes_neuro", label: "Paralysie, troubles de la conscience, saignements ou éruptions cutanées" },
];

export const situationsProOptions = [
  { value: "employe", label: "Employé" },
  { value: "fonctionnaire", label: "Fonctionnaire" },
  { value: "sans_emploi", label: "Sans emploi" },
  { value: "alternant", label: "Alternant" },
  { value: "independant", label: "Indépendant" },
  { value: "etudiant", label: "Étudiant" },
  { value: "agricole", label: "Activité agricole" },
];

export const paysOptions = [
  { value: "FR", label: "France" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
  { value: "LU", label: "Luxembourg" },
  { value: "CA", label: "Canada" },
];

