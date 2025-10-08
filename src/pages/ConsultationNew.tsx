import { FormWizard } from "@/components/form/FormWizard";
import { Step1 } from "@/components/form/steps/Step1";
import { Step2 } from "@/components/form/steps/Step2";
import { Step3 } from "@/components/form/steps/Step3";
import { Step4 } from "@/components/form/steps/Step4";
import { Step5 } from "@/components/form/steps/Step5";
import { Step6 } from "@/components/form/steps/Step6";
import { Step7 } from "@/components/form/steps/Step7";
import { Step8 } from "@/components/form/steps/Step8";
import { Step9 } from "@/components/form/steps/Step9";
import { Step10 } from "@/components/form/steps/Step10";
import { Step11 } from "@/components/form/steps/Step11";
import { Step12 } from "@/components/form/steps/Step12";
import { Step13 } from "@/components/form/steps/Step13";
import { Step14Merged } from "@/components/form/steps/Step14Merged";
import { Step16 } from "@/components/form/steps/Step16";
import { Step17 } from "@/components/form/steps/Step17";
import { Step18 } from "@/components/form/steps/Step18";
import { Step19 } from "@/components/form/steps/Step19";
import { Step20 } from "@/components/form/steps/Step20";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
  step10Schema,
  step11Schema,
  step12Schema,
  step13Schema,
  step14MergedSchema,
  step16Schema,
  step17Schema,
  step18Schema,
  step19Schema,
  step20Schema,
  ConsultationFormData,
} from "@/lib/validation/consultation-schema";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { clearFormData } from "@/lib/storage";

export default function ConsultationNew() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    {
      id: 1,
      title: "Maladie présumée",
      description: "Sélectionnez la maladie qui correspond à vos symptômes",
      schema: step1Schema,
      component: Step1,
    },
    {
      id: 2,
      title: "Symptômes observés",
      description: "Quels sont vos symptômes actuels ?",
      schema: step2Schema,
      component: Step2,
    },
    {
      id: 3,
      title: "Diagnostic antérieur",
      description: "Avez-vous déjà été diagnostiqué pour ce symptôme ?",
      schema: step3Schema,
      component: Step3,
    },
    {
      id: 4,
      title: "Description des symptômes",
      description: "Décrivez tous les autres symptômes que vous ressentez",
      schema: step4Schema,
      component: Step4,
    },
    {
      id: 5,
      title: "Localisation des douleurs",
      description: "Où se situent vos douleurs ?",
      schema: step5Schema,
      component: Step5,
    },
    {
      id: 6,
      title: "Apparition des symptômes",
      description: "Les symptômes sont-ils apparus soudainement ?",
      schema: step6Schema,
      component: Step6,
    },
    {
      id: 7,
      title: "Médicaments",
      description: "Médicaments pris régulièrement",
      schema: step7Schema,
      component: Step7,
    },
    {
      id: 8,
      title: "Facteurs de risque",
      description: "Présentez-vous l'un de ces facteurs de risque ?",
      schema: step8Schema,
      component: Step8,
    },
    {
      id: 9,
      title: "Type de demande",
      description: "Nouvel arrêt ou prolongation ?",
      schema: step9Schema,
      component: Step9,
    },
    {
      id: 10,
      title: "Profession",
      description: "Quelle est votre profession actuelle ?",
      schema: step10Schema,
      component: Step10,
    },
    {
      id: 11,
      title: "Dates d'incapacité",
      description: "Période d'arrêt de travail (maximum 7 jours)",
      schema: step11Schema,
      component: Step11,
    },
    {
      id: 12,
      title: "Identité",
      description: "Nom et prénom",
      schema: step12Schema,
      component: Step12,
    },
    {
      id: 13,
      title: "Date de naissance",
      description: "Vous devez avoir au moins 16 ans",
      schema: step13Schema,
      component: Step13,
    },
    {
      id: 14,
      title: "Adresse e-mail",
      description: "Votre arrêt sera envoyé à cette adresse",
      schema: step14MergedSchema,
      component: Step14Merged,
    },
    {
      id: 15,
      title: "Adresse postale",
      description: "Adresse complète",
      schema: step16Schema,
      component: Step16,
    },
    {
      id: 16,
      title: "Situation professionnelle",
      description: "Quelle est votre situation ?",
      schema: step17Schema,
      component: Step17,
    },
    {
      id: 17,
      title: "Médecin traitant",
      description: "Ville ou région de votre médecin",
      schema: step18Schema,
      component: Step18,
    },
    {
      id: 18,
      title: "Numéro de sécurité sociale",
      description: "15 chiffres",
      schema: step19Schema,
      component: Step19,
    },
    {
      id: 19,
      title: "Paiement sécurisé",
      description: "21 € TTC - Remboursé si non éligible",
      schema: step20Schema,
      component: Step20,
    },
  ];

  const handleComplete = async (data: ConsultationFormData) => {
    try {
      console.log("📝 Sauvegarde des données dans Supabase...", data);

      // Prepare data for Supabase (convert arrays and dates to proper format)
      const consultationData = {
        maladie_presumee: data.maladie_presumee,
        symptomes: data.symptomes,
        diagnostic_anterieur: data.diagnostic_anterieur,
        autres_symptomes: data.autres_symptomes,
        zones_douleur: data.zones_douleur,
        apparition_soudaine: data.apparition_soudaine,
        medicaments_reguliers: data.medicaments_reguliers,
        facteurs_risque: data.facteurs_risque?.length > 0,
        type_arret: data.type_arret,
        profession: data.profession,
        date_debut: data.date_debut?.toISOString().split('T')[0],
        date_fin: data.date_fin?.toISOString().split('T')[0],
        date_fin_lettres: data.date_fin_lettres,
        nom_prenom: data.nom_prenom,
        date_naissance: data.date_naissance?.toISOString().split('T')[0],
        email: data.email,
        adresse: data.adresse,
        code_postal: data.code_postal,
        ville: data.ville,
        pays: data.pays,
        situation_pro: data.situation_pro,
        localisation_medecin: data.localisation_medecin,
        numero_securite_sociale: data.numero_securite_sociale,
        conditions_acceptees: data.conditions_acceptees,
        payment_status: "pending",
      };

      const { data: savedData, error } = await supabase
        .from("consultations")
        .insert([consultationData])
        .select()
        .single();

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        throw error;
      }

      console.log("✅ Consultation sauvegardée:", savedData);

      // Save consultation ID for payment
      localStorage.setItem('consultation_id', savedData.id);

      // Clear form data but keep consultation_id
      clearFormData();

      toast({
        title: "✅ Consultation enregistrée",
        description: "Redirection vers le paiement...",
      });

      // Proceed to payment step (onNext will be called, which shows Step20)

    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      
      toast({
        title: "❌ Erreur",
        description: "Impossible d'enregistrer votre consultation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return <FormWizard steps={steps} onComplete={handleComplete} />;
}

