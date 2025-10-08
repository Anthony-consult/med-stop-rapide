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
    // Données de test pré-remplies
    const testData: Partial<ConsultationFormData> = {
      maladie_presumee: "Grippe",
      symptomes: ["Fièvre", "Toux"],
      diagnostic_anterieur: "non",
      autres_symptomes: "",
      zones_douleur: [],
      apparition_soudaine: "progressif",
      medicaments_reguliers: "non",
      facteurs_risque: [],
      type_arret: "initial",
      profession: "Employé",
      date_debut: new Date(),
      date_fin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 jours
      date_fin_lettres: "trois",
      nom_prenom: "Test User",
      date_naissance: new Date("1990-01-01"),
      email: "test@example.com",
      adresse: "123 rue Test",
      code_postal: "75001",
      ville: "Paris",
      pays: "France",
      situation_pro: "salarie",
      localisation_medecin: "Paris",
      numero_securite_sociale: "190010112345678",
      conditions_acceptees: false,
    };
    
    // Mettre à jour formData et sauvegarder
    setFormData(testData);
    saveFormData(testData);
    
    // Sauter à l'étape 18 (index 18 = Step 19 - numéro sécu)
    setCurrentStep(18);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    toast({
      title: "✅ Formulaire rempli",
      description: "Données de test chargées. Vous êtes à l'étape 19.",
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

