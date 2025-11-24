import { useState, useEffect, ReactNode } from "react";
import { useForm, FieldValues, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConsultationFormData } from "@/lib/validation/consultation-schema";
import { saveFormData, loadFormData, clearFormData } from "@/lib/storage";
import { BottomBar } from "./BottomBar";
import { useToast } from "@/hooks/use-toast";

interface Step<T extends FieldValues = FieldValues> {
  id: number;
  title: string;
  description?: string;
  schema: z.ZodType<T>;
  component: (props: StepComponentProps<T>) => ReactNode;
}

export interface StepComponentProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  onNext: () => void;
  onPrev?: () => void;
  formData?: Partial<ConsultationFormData>;
  onAutoFill?: () => void;
}

interface FormWizardProps {
  steps: Step[];
  onComplete: (data: ConsultationFormData) => void;
}

export function FormWizard({ steps, onComplete }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ConsultationFormData>>({});
  const { toast } = useToast();

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadFormData<Partial<ConsultationFormData>>();
    if (savedData) {
      setFormData(savedData);
      // Silently restore data without toast
    }
  }, []);

  const currentStepConfig = steps[currentStep];
  
  const form = useForm({
    resolver: zodResolver(currentStepConfig.schema),
    defaultValues: formData as any,
    mode: "onChange",
  });

  const { formState, handleSubmit } = form;

  // Save form data on step change
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  const handleNext = handleSubmit((stepData) => {
    // Merge step data with global form data
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    // Move to next step or complete
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Final step - complete form
      clearFormData();
      onComplete(updatedData as ConsultationFormData);
    }
  });

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleAutoFill = () => {
    // Données de test pré-remplies - TOUTES les données nécessaires
    const today = new Date();
    const dateFin = new Date(today);
    dateFin.setDate(dateFin.getDate() + 3); // +3 jours
    
    const testData: Partial<ConsultationFormData> = {
      // Step 1
      maladie_presumee: "gastro",
      // Step 2
      symptomes: ["fievre", "douleurs", "nausees"],
      // Step 3
      diagnostic_anterieur: "non",
      // Step 4
      autres_symptomes: "Maux de tête et fatigue générale depuis quelques jours",
      // Step 5
      zones_douleur: ["ventre", "tete"],
      // Step 6
      apparition_soudaine: "non",
      // Step 7
      medicaments_reguliers: "Aucun",
      // Step 8
      facteurs_risque: [],
      // Step 9
      type_arret: "nouvel",
      // Step 10
      profession: "Employé de bureau",
      // Step 11
      date_debut: today,
      date_fin: dateFin,
      date_fin_lettres: "TROIS",
      // Step 12
      nom_prenom: "DUPONT JEAN",
      // Step 13
      date_naissance: new Date("1990-01-15"),
      // Step 14
      email: "test@example.com",
      email_confirmation: "test@example.com",
      // Step 15 (Step16)
      adresse: "123 RUE DE TEST",
      code_postal: "75001",
      ville: "PARIS",
      pays: "FR",
      // Step 16 (Step17)
      situation_pro: "employe",
      // Step 17 (Step18)
      localisation_medecin: "Paris",
      // Step 18 (Step19)
      numero_securite_sociale: "190010112345678",
      // Step 19 (Step20)
      conditions_acceptees: true,
    };
    
    // Mettre à jour formData et sauvegarder
    setFormData(testData);
    saveFormData(testData);
    
    // Sauter directement à la dernière étape (Step 20 - Paiement)
    // Index 18 car il y a 19 steps (0-18)
    setCurrentStep(steps.length - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    toast({
      title: "✅ Quick Test activé",
      description: "Formulaire rempli automatiquement. Vous êtes à l'étape de paiement.",
    });
  };

  const StepComponent = currentStepConfig.component;

  // Check if current step is the payment step (Step20)
  const isPaymentStep = currentStep === steps.length - 1;

  return (
    <div className="h-dvh min-h-dvh flex flex-col bg-gradient-to-b from-[#f6f9fc] to-white">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto pb-32">
        {isPaymentStep ? (
          // Payment step has its own full-screen layout
          <StepComponent form={form} onNext={handleNext} onPrev={handlePrev} formData={formData} onAutoFill={handleAutoFill} />
        ) : (
          // Regular steps use the standard layout
          <div className="max-w-sm mx-auto px-4 py-6">
            {/* Step header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepConfig.title}
              </h1>
              {currentStepConfig.description && (
                <p className="text-sm text-gray-500">
                  {currentStepConfig.description}
                </p>
              )}
            </div>

            {/* Step content in card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6">
              <StepComponent form={form} onNext={handleNext} formData={formData} onAutoFill={handleAutoFill} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom navigation bar - only for non-payment steps */}
      {!isPaymentStep && (
        <BottomBar
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          canGoNext={formState.isValid}
          canGoPrev={currentStep > 0}
          onNext={handleNext}
          onPrev={handlePrev}
          isLastStep={currentStep === steps.length - 1}
        />
      )}
    </div>
  );
}

