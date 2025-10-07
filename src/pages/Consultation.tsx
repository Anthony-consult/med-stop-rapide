import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Q1
  maladie_presumee: string;
  // Q2
  symptomes: string[];
  // Q3
  diagnostic_anterieur: string;
  // Q4
  autres_symptomes: string;
  // Q5
  zones_douleur: string[];
  // Q6
  apparition_soudaine: string;
  // Q7
  medicaments_reguliers: string;
  // Q8
  facteurs_risque: boolean | null;
  // Q9
  type_arret: string;
  // Q10
  profession: string;
  // Q11
  date_debut: string;
  date_fin: string;
  date_fin_lettres: string;
  // Q12
  nom_prenom: string;
  date_naissance: string;
  email: string;
  email_confirm: string;
  // Q13
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
  // Q14
  situation_pro: string;
  // Q15
  localisation_medecin: string;
  // Q16
  numero_securite_sociale: string;
  // Q17
  conditions_acceptees: boolean;
}

export default function Consultation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = 19;

  const [formData, setFormData] = useState<FormData>({
    maladie_presumee: "",
    symptomes: [],
    diagnostic_anterieur: "",
    autres_symptomes: "",
    zones_douleur: [],
    apparition_soudaine: "",
    medicaments_reguliers: "",
    facteurs_risque: null,
    type_arret: "",
    profession: "",
    date_debut: "",
    date_fin: "",
    date_fin_lettres: "",
    nom_prenom: "",
    date_naissance: "",
    email: "",
    email_confirm: "",
    adresse: "",
    code_postal: "",
    ville: "",
    pays: "France",
    situation_pro: "",
    localisation_medecin: "",
    numero_securite_sociale: "",
    conditions_acceptees: false,
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "symptomes" | "zones_douleur", value: string) => {
    setFormData((prev) => {
      const array = prev[field];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  const saveToDatabase = async () => {
    setIsSaving(true);
    
    const insertData = {
      maladie_presumee: formData.maladie_presumee || null,
      symptomes: formData.symptomes,
      diagnostic_anterieur: formData.diagnostic_anterieur || null,
      autres_symptomes: formData.autres_symptomes || null,
      zones_douleur: formData.zones_douleur,
      apparition_soudaine: formData.apparition_soudaine || null,
      medicaments_reguliers: formData.medicaments_reguliers || null,
      facteurs_risque: formData.facteurs_risque || false,
      type_arret: formData.type_arret || null,
      profession: formData.profession || null,
      date_debut: formData.date_debut || null,
      date_fin: formData.date_fin || null,
      date_fin_lettres: formData.date_fin_lettres || null,
      nom_prenom: formData.nom_prenom,
      date_naissance: formData.date_naissance || null,
      email: formData.email,
      adresse: formData.adresse || null,
      code_postal: formData.code_postal || null,
      ville: formData.ville || null,
      pays: formData.pays || "France",
      situation_pro: formData.situation_pro || null,
      localisation_medecin: formData.localisation_medecin || null,
      numero_securite_sociale: formData.numero_securite_sociale || null,
      conditions_acceptees: formData.conditions_acceptees,
      payment_status: "pending",
    };
    
    console.log("📝 Tentative de sauvegarde des données:", insertData);
    
    try {
      const { data, error } = await supabase
        .from("consultations")
        .insert([insertData])
        .select();

      if (error) {
        console.error("❌ Erreur lors de la sauvegarde:", error);
        toast({
          variant: "destructive",
          title: "Erreur de sauvegarde",
          description: `${error.message} (Code: ${error.code})`,
        });
        setIsSaving(false);
        return false;
      }

      if (data && data[0]) {
        console.log("✅ Sauvegarde réussie !", data[0]);
        setConsultationId(data[0].id);
        toast({
          title: "Succès",
          description: "Vos données ont été sauvegardées avec succès.",
        });
        setIsSaving(false);
        return true;
      }
    } catch (err) {
      console.error("❌ Exception lors de la sauvegarde:", err);
      toast({
        variant: "destructive",
        title: "Erreur technique",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      });
      setIsSaving(false);
      return false;
    }
    setIsSaving(false);
    return false;
  };

  const handleNext = async () => {
    if (currentStep === 8 && formData.facteurs_risque === true) {
      setShowRiskWarning(true);
      return;
    }

    if (currentStep === 12) {
      if (formData.email !== formData.email_confirm) {
        alert("Les adresses email ne correspondent pas.");
        return;
      }
    }

    if (currentStep === 18) {
      const saved = await saveToDatabase();
      if (!saved) {
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    console.log("Consultation ID:", consultationId);
    alert("Paiement Stripe à intégrer");
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header minimaliste */}
      <div className="border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {currentStep}→
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* STEP 1: Maladie présumée */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Quelle est votre <strong>maladie présumée</strong> ? *
              </h2>
            </div>
            <div>
              <Select
                value={formData.maladie_presumee}
                onValueChange={(value) => updateFormData("maladie_presumee", value)}
              >
                <SelectTrigger className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0">
                  <SelectValue placeholder="Sélectionnez votre maladie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gastro">Gastro-entérite</SelectItem>
                  <SelectItem value="epuisement">Syndrome d'épuisement</SelectItem>
                  <SelectItem value="corona">Symptôme Corona</SelectItem>
                  <SelectItem value="stress">Stress</SelectItem>
                  <SelectItem value="migraine">Migraine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 2: Symptômes observés */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Quels sont vos <strong>symptômes</strong> ? *
              </h2>
            </div>
            <div className="space-y-4">
              {[
                "Fièvre",
                "Nausées",
                "Diarrhée",
                "Toux sans mucus",
                "Toux avec mucosités",
                "Malaise",
                "Fatigue",
                "Hypertension artérielle",
                "Le corps n'est pas libre de ses mouvements",
                "Événement stressant",
                "Troubles du sommeil",
              ].map((symptome) => (
                <div key={symptome} className="flex items-center space-x-3">
                  <Checkbox
                    id={symptome}
                    checked={formData.symptomes.includes(symptome)}
                    onCheckedChange={() => toggleArrayItem("symptomes", symptome)}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={symptome} className="text-gray-700 cursor-pointer">
                    {symptome}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Diagnostic antérieur */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Avez-vous déjà été <strong>diagnostiqué</strong> pour ce symptôme par un médecin ? *
              </h2>
            </div>
            <RadioGroup
              value={formData.diagnostic_anterieur}
              onValueChange={(value) => updateFormData("diagnostic_anterieur", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="oui" id="diag-oui" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="diag-oui" className="text-gray-700 cursor-pointer">
                  Oui
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="non" id="diag-non" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="diag-non" className="text-gray-700 cursor-pointer">
                  Non
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="peut-etre" id="diag-peut-etre" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="diag-peut-etre" className="text-gray-700 cursor-pointer">
                  Peut-être
                </label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* STEP 4: Description libre */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Décrivez tous les <strong>autres symptômes</strong> que vous ressentez.
              </h2>
            </div>
            <div>
              <Textarea
                id="autres-symptomes"
                rows={6}
                value={formData.autres_symptomes}
                onChange={(e) => updateFormData("autres_symptomes", e.target.value)}
                placeholder="Décrivez vos symptômes..."
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0 resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Localisation des douleurs */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Où se situent vos <strong>douleurs</strong> ?
              </h2>
            </div>
            <div className="space-y-4">
              {[
                "Tête",
                "Ventre",
                "Dents",
                "Dos",
                "Cou",
                "Membres",
                "Oreilles",
                "Organes sexuels",
              ].map((zone) => (
                <div key={zone} className="flex items-center space-x-3">
                  <Checkbox
                    id={zone}
                    checked={formData.zones_douleur.includes(zone)}
                    onCheckedChange={() => toggleArrayItem("zones_douleur", zone)}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={zone} className="text-gray-700 cursor-pointer">
                    {zone}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Apparition des symptômes */}
        {currentStep === 6 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Les symptômes sont-ils apparus <strong>soudainement</strong> ?
              </h2>
            </div>
            <RadioGroup
              value={formData.apparition_soudaine}
              onValueChange={(value) => updateFormData("apparition_soudaine", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="oui" id="app-oui" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="app-oui" className="text-gray-700 cursor-pointer">
                  Oui
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="non" id="app-non" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="app-non" className="text-gray-700 cursor-pointer">
                  Non
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="peut-etre" id="app-peut-etre" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="app-peut-etre" className="text-gray-700 cursor-pointer">
                  Peut-être
                </label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* STEP 7: Médicaments */}
        {currentStep === 7 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Si vous prenez des <strong>médicaments</strong>, lesquels prenez-vous régulièrement ?
              </h2>
            </div>
            <div>
              <Textarea
                id="medicaments"
                rows={4}
                value={formData.medicaments_reguliers}
                onChange={(e) => updateFormData("medicaments_reguliers", e.target.value)}
                placeholder="Listez vos médicaments..."
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0 resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 8: Facteurs de risque */}
        {currentStep === 8 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Présentez-vous l'un de ces <strong>facteurs de risque</strong> ?
              </h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li>Difficultés respiratoires, vomissements ou diarrhée</li>
                <li>Bruits ou obstructions lors de la respiration</li>
                <li>Enceinte, immunodéficience</li>
                <li>Douleur intense (oreille, visage, membres)</li>
                <li>Douleur au larynx, poitrine ou abdomen</li>
                <li>Maladie cardiaque, respiratoire ou intestinale chronique</li>
                <li>Voyage tropical récent (moins de deux mois)</li>
                <li>Sentiment de maladie grave ou difficulté à avaler</li>
                <li>Paralysie, troubles de la conscience, saignements ou éruptions cutanées</li>
              </ul>
            </div>

            {showRiskWarning && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="font-semibold">Attention</span>
                </div>
                <p className="text-sm text-red-700">
                  Nous ne pouvons pas traiter votre cas en ligne. Veuillez contacter un
                  service médical d'urgence.
                </p>
              </div>
            )}

            <RadioGroup
              value={
                formData.facteurs_risque === null
                  ? ""
                  : formData.facteurs_risque
                  ? "oui"
                  : "non"
              }
              onValueChange={(value) => {
                updateFormData("facteurs_risque", value === "oui");
                if (value === "oui") {
                  setShowRiskWarning(true);
                } else {
                  setShowRiskWarning(false);
                }
              }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="oui" id="risk-oui" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="risk-oui" className="text-gray-700 cursor-pointer">
                  Oui
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="non" id="risk-non" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="risk-non" className="text-gray-700 cursor-pointer">
                  Non
                </label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* STEP 9: Type de demande */}
        {currentStep === 9 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Avez-vous besoin d'un <strong>nouvel arrêt maladie</strong> ou d'une prolongation ?
              </h2>
            </div>
            <RadioGroup
              value={formData.type_arret}
              onValueChange={(value) => updateFormData("type_arret", value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="nouvel" id="type-nouvel" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="type-nouvel" className="text-gray-700 cursor-pointer">
                  Nouvel arrêt maladie
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="prolongation" id="type-prolongation" className="w-5 h-5 text-blue-500 border-gray-300" />
                <label htmlFor="type-prolongation" className="text-gray-700 cursor-pointer">
                  Suivi (prolongation)
                </label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* STEP 10: Profession */}
        {currentStep === 10 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Quelle est votre <strong>profession actuelle</strong> ?
              </h2>
            </div>
            <div>
              <Input
                id="profession"
                type="text"
                value={formData.profession}
                onChange={(e) => updateFormData("profession", e.target.value)}
                placeholder="Ex: Développeur, Infirmier, etc."
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        )}

        {/* STEP 11: Date de début */}
        {currentStep === 11 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Choisissez la date de <strong>DÉBUT</strong> de votre incapacité de travail.
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                (Rappel : maximum 7 jours d'arrêt)
              </p>
            </div>
            <div>
              <Input
                id="date-debut"
                type="date"
                value={formData.date_debut}
                onChange={(e) => updateFormData("date_debut", e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        )}

        {/* STEP 12: Date de fin */}
        {currentStep === 12 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Choisissez la date de <strong>FIN</strong> de votre incapacité de travail.
              </h2>
            </div>
            <div>
              <Input
                id="date-fin"
                type="date"
                value={formData.date_fin}
                onChange={(e) => updateFormData("date_fin", e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        )}

        {/* STEP 13: Date de fin en lettres */}
        {currentStep === 13 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Merci de saisir la date de <strong>FIN</strong> en toutes lettres et en MAJUSCULES.
              </h2>
              <p className="text-sm text-gray-500 italic">
                Exemple : DIX SEPTEMBRE DEUX MILLE VINGT-CINQ
              </p>
            </div>
            <div>
              <Input
                id="date-fin-lettres"
                type="text"
                value={formData.date_fin_lettres}
                onChange={(e) =>
                  updateFormData("date_fin_lettres", e.target.value.toUpperCase())
                }
                placeholder="DIX SEPTEMBRE DEUX MILLE VINGT-CINQ"
                className="uppercase border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        )}

        {/* STEP 14: Identité du patient */}
        {currentStep === 14 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                <strong>Identité du patient</strong>
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <Input
                  id="nom-prenom"
                  type="text"
                  value={formData.nom_prenom}
                  onChange={(e) =>
                    updateFormData("nom_prenom", e.target.value.toUpperCase())
                  }
                  placeholder="DUPONT JEAN"
                  className="uppercase border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div>
                <Input
                  id="date-naissance"
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) => updateFormData("date_naissance", e.target.value)}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="votre@email.com"
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div>
                <Input
                  id="email-confirm"
                  type="email"
                  value={formData.email_confirm}
                  onChange={(e) => updateFormData("email_confirm", e.target.value)}
                  placeholder="votre@email.com"
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 15: Adresse postale */}
        {currentStep === 15 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                <strong>Adresse postale</strong>
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <Input
                  id="adresse"
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => updateFormData("adresse", e.target.value)}
                  placeholder="12 rue de la République"
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    id="code-postal"
                    type="text"
                    value={formData.code_postal}
                    onChange={(e) => updateFormData("code_postal", e.target.value)}
                    placeholder="75001"
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                  />
                </div>
                <div>
                  <Input
                    id="ville"
                    type="text"
                    value={formData.ville}
                    onChange={(e) => updateFormData("ville", e.target.value)}
                    placeholder="Paris"
                    className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                  />
                </div>
              </div>
              <div>
                <Input
                  id="pays"
                  type="text"
                  value={formData.pays}
                  onChange={(e) => updateFormData("pays", e.target.value)}
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 16: Situation professionnelle */}
        {currentStep === 16 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                Quelle est votre <strong>situation actuelle</strong> ?
              </h2>
            </div>
            <RadioGroup
              value={formData.situation_pro}
              onValueChange={(value) => updateFormData("situation_pro", value)}
              className="space-y-4"
            >
              {[
                "Employé",
                "Fonctionnaire",
                "Sans emploi",
                "Alternant",
                "Indépendant",
                "Étudiant",
                "Activité sans salarié",
                "Agricole",
              ].map((situation) => (
                <div key={situation} className="flex items-center space-x-3">
                  <RadioGroupItem
                    value={situation.toLowerCase()}
                    id={`sit-${situation}`}
                    className="w-5 h-5 text-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`sit-${situation}`}
                    className="text-gray-700 cursor-pointer"
                  >
                    {situation}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* STEP 17: Localisation du médecin */}
        {currentStep === 17 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                <strong>Localisation du médecin</strong>
              </h2>
            </div>
            <div>
              <Input
                id="localisation-medecin"
                type="text"
                value={formData.localisation_medecin}
                onChange={(e) => updateFormData("localisation_medecin", e.target.value)}
                placeholder="Paris, Lyon, etc."
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>
        )}

        {/* STEP 18: Finalisation */}
        {currentStep === 18 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                <strong>Finalisation</strong>
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  id="secu"
                  type="text"
                  maxLength={15}
                  value={formData.numero_securite_sociale}
                  onChange={(e) =>
                    updateFormData("numero_securite_sociale", e.target.value)
                  }
                  placeholder="1 23 45 67 890 123 45"
                  className="border-0 border-b-2 border-gray-200 rounded-none px-0 py-3 text-gray-700 focus:border-blue-500 focus:ring-0"
                />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="conditions"
                  checked={formData.conditions_acceptees}
                  onCheckedChange={(checked) =>
                    updateFormData("conditions_acceptees", checked === true)
                  }
                  className="w-5 h-5 text-blue-500 border-gray-300 rounded mt-1"
                />
                <label
                  htmlFor="conditions"
                  className="text-gray-700 cursor-pointer text-sm"
                >
                  J'ai lu et j'accepte les{" "}
                  <a href="/terms" className="text-blue-500 underline">
                    conditions générales d'utilisation
                  </a>{" "}
                  et la politique de confidentialité.
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 19: Paiement */}
        {currentStep === 19 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg text-gray-700 mb-1">
                <strong>Paiement</strong>
              </h2>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold">Vos données ont été sauvegardées</span>
              </div>
              <p className="text-sm text-green-700">
                Votre dossier a été enregistré avec succès. Vous pouvez maintenant
                procéder au paiement.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="font-semibold mb-3 text-gray-700">Récapitulatif :</div>
              <div className="text-sm space-y-2 text-gray-600">
                <p>• Consultation médicale en ligne</p>
                <p>• Validation par un médecin certifié sous 24h</p>
                <p>• Arrêt maladie légal envoyé par email</p>
                <div className="border-t pt-3 mt-3">
                  <p className="font-semibold text-lg text-gray-700">Montant : 21,00 €</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
              <p>
                <strong>Numéro de dossier :</strong>{" "}
                {consultationId ? consultationId.substring(0, 8).toUpperCase() : "En cours..."}
              </p>
            </div>
          </div>
        )}

        {/* Navigation minimaliste */}
        <div className="fixed bottom-0 left-0 right-0 bg-blue-500 px-4 py-4">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1 || (currentStep === 19 && isSaving)}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={
                  showRiskWarning ||
                  isSaving ||
                  (currentStep === 18 && !formData.conditions_acceptees)
                }
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && currentStep === 18 ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    OK ✓
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-white text-blue-500 px-6 py-3 rounded-lg font-medium"
              >
                Paiement (21€)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}