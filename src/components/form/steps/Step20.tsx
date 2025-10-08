import { Controller } from "react-hook-form";
import { useState } from "react";
import { StepComponentProps } from "../FormWizard";
import { step20Schema, ConsultationFormData } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { clearFormData } from "@/lib/storage";

type Step20Data = z.infer<typeof step20Schema>;

export function Step20({ form, onNext, onPrev, formData }: StepComponentProps<Step20Data>) {
  const { control, formState: { errors } } = form;
  const { toast } = useToast();
  
  const [termsChecked, setTermsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple pricing
  const total = 14.00;

  // Currency formatter
  const currency = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  });

  const handlePay = async () => {
    if (!termsChecked) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter les CGU.",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Get all form data from formData prop
      const allFormData = formData as ConsultationFormData;
      
      console.log("📝 Sauvegarde des données dans Supabase...", allFormData);

      // Prepare data for Supabase
      const consultationData = {
        maladie_presumee: allFormData.maladie_presumee,
        symptomes: allFormData.symptomes,
        diagnostic_anterieur: allFormData.diagnostic_anterieur,
        autres_symptomes: allFormData.autres_symptomes,
        zones_douleur: allFormData.zones_douleur,
        apparition_soudaine: allFormData.apparition_soudaine,
        medicaments_reguliers: allFormData.medicaments_reguliers,
        facteurs_risque: allFormData.facteurs_risque?.length > 0,
        type_arret: allFormData.type_arret,
        profession: allFormData.profession,
        date_debut: allFormData.date_debut?.toISOString().split('T')[0],
        date_fin: allFormData.date_fin?.toISOString().split('T')[0],
        date_fin_lettres: allFormData.date_fin_lettres,
        nom_prenom: allFormData.nom_prenom,
        date_naissance: allFormData.date_naissance?.toISOString().split('T')[0],
        email: allFormData.email,
        adresse: allFormData.adresse,
        code_postal: allFormData.code_postal,
        ville: allFormData.ville,
        pays: allFormData.pays,
        situation_pro: allFormData.situation_pro,
        localisation_medecin: allFormData.localisation_medecin,
        numero_securite_sociale: allFormData.numero_securite_sociale,
        conditions_acceptees: termsChecked,
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

      // Clear form data
      clearFormData();

      toast({
        title: "✅ Consultation enregistrée",
        description: "Redirection vers le paiement de 14 €...",
      });

      // Redirect to Stripe payment with consultation ID
      const consultationId = savedData.id;
      const stripeUrl = `https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00?client_reference_id=${consultationId}`;
      
      console.log('🔗 REDIRECTION STRIPE');
      console.log('🔗 Consultation ID:', consultationId);
      console.log('🔗 Stripe URL:', stripeUrl);
      
      setTimeout(() => {
        console.log('🚀 Redirecting to Stripe...');
        window.location.href = stripeUrl;
      }, 1500);

    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      
      toast({
        title: "❌ Erreur",
        description: "Impossible d'enregistrer votre consultation. Veuillez réessayer.",
        variant: "destructive",
      });
      
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    if (onPrev) {
      onPrev();
    }
  };

  return (
    <section className="h-[100dvh] min-h-[100dvh] grid grid-rows-[auto_1fr_auto] bg-gray-50 text-gray-900 overflow-hidden">
      {/* Top Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900"></h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Payment Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif du paiement</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Arrêt maladie</span>
              <span className="font-medium">{currency.format(total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Frais de service</span>
              <span className="font-medium">{currency.format(0)}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-semibold text-gray-900">{currency.format(total)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <Controller
            name="conditions_acceptees"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setTermsChecked(checked === true);
                  }}
                  className="h-5 w-5 mt-0.5"
                  aria-invalid={errors.conditions_acceptees ? "true" : "false"}
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  J'accepte les{" "}
                  <a 
                    className="text-blue-600 underline hover:no-underline" 
                    href="/cgu" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    conditions générales d'utilisation
                  </a>
                  {" "}et la{" "}
                  <a 
                    className="text-blue-600 underline hover:no-underline" 
                    href="/confidentialite" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    politique de confidentialité
                  </a>
                </span>
              </label>
            )}
          />

          {errors.conditions_acceptees && (
            <p className="text-sm text-red-600 mt-3" role="alert">
              {errors.conditions_acceptees.message}
            </p>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-600">
            Paiement 100% sécurisé • Conforme RGPD • Remboursé si non éligible
          </p>
        </div>
      </div>

      {/* Bottom Payment Bar */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Carte à définir</div>
            <div className="text-lg font-semibold text-gray-900">{currency.format(total)}</div>
          </div>
          <Button 
            onClick={handlePay}
            disabled={!termsChecked}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Payer {currency.format(total)}
          </Button>
        </div>
      </div>
    </section>
  );
}

