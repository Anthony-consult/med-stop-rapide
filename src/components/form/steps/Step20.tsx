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
    console.log("🚀 handlePay called - termsChecked:", termsChecked, "isSubmitting:", isSubmitting);
    
    if (!termsChecked) {
      console.log("❌ Terms not checked");
      toast({
        title: "Erreur",
        description: "Veuillez accepter les CGU.",
        variant: "destructive",
      });
      return;
    }

    if (isSubmitting) {
      console.log("❌ Already submitting, ignoring");
      return;
    }
    
    console.log("✅ Starting payment process...");
    setIsSubmitting(true);

    try {
      // Get all form data from formData prop
      const allFormData = formData as ConsultationFormData;
      
      console.log("💳 STEP 1: Form data validation");
      console.log("💳 All form data:", allFormData);
      console.log("💳 Email:", allFormData.email);
      console.log("💳 Nom:", allFormData.nom_prenom);
      console.log("💳 Fields count:", Object.keys(allFormData).length);

      // Prepare data for Stripe (will be stored in metadata)
      console.log("💳 STEP 2: Preparing consultation data");
      
      const consultationData = {
        maladie_presumee: allFormData.maladie_presumee,
        symptomes: allFormData.symptomes,
        diagnostic_anterieur: allFormData.diagnostic_anterieur,
        autres_symptomes: allFormData.autres_symptomes || "",
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
      };
      
      console.log("💳 STEP 2: Consultation data prepared:", consultationData);

      // 1. D'ABORD : Créer la ligne dans Supabase (avec payment_status = 'pending')
      console.log('💾 STEP 3: Creating consultation in Supabase...');
      console.log('💾 Supabase client exists:', !!supabase);
      console.log('💾 Data to insert:', {
        ...consultationData,
        payment_status: "pending",
      });
      
      const { data: savedData, error: supabaseError } = await supabase
        .from("consultations")
        .insert([{
          ...consultationData,
          payment_status: "pending",
        }])
        .select()
        .single();

      console.log('💾 Supabase response - data:', savedData);
      console.log('💾 Supabase response - error:', supabaseError);

      if (supabaseError) {
        console.error("❌ SUPABASE ERROR DETAILS:", {
          message: supabaseError.message,
          code: supabaseError.code,
          details: supabaseError.details,
          hint: supabaseError.hint,
        });
        throw new Error(`Impossible d'enregistrer votre consultation: ${supabaseError.message}`);
      }

      if (!savedData || !savedData.id) {
        console.error("❌ No data returned from Supabase insert");
        throw new Error("Aucune donnée retournée par Supabase");
      }

      console.log('✅ STEP 3 SUCCESS: Consultation créée dans Supabase');
      console.log('✅ Consultation ID:', savedData.id);
      console.log('✅ Full saved data:', savedData);

      // 2. ENSUITE : Rediriger vers le Payment Link Stripe avec client_reference_id
      console.log('💳 STEP 4: Preparing Stripe Payment Link...');
      console.log('💳 Consultation ID:', savedData.id);
      
      // Récupérer le Payment Link depuis les variables d'environnement ou utiliser le lien par défaut
      // Pour le mode TEST: https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00
      // Pour le mode LIVE: https://buy.stripe.com/aFa6oHfLFcnDgJ8eHY4Ja00
      const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK || 
                                   'https://buy.stripe.com/test_aFa6oHfLFcnDgJ8eHY4Ja00';
      
      // Construire l'URL avec client_reference_id
      const stripeUrl = `${STRIPE_PAYMENT_LINK}?client_reference_id=${savedData.id}`;
      
      console.log('✅ STEP 4 SUCCESS: Payment Link préparé');
      console.log('🔗 Stripe URL:', stripeUrl);

      // Clear form data
      console.log('💳 STEP 5: Clearing form data and redirecting...');
      clearFormData();

      toast({
        title: "✅ Redirection vers le paiement",
        description: "Vous allez être redirigé vers Stripe...",
      });

      // Redirect to Stripe Checkout
      console.log('💳 STEP 5: Setting timeout for redirect...');
      setTimeout(() => {
        console.log('🚀 REDIRECTING TO STRIPE CHECKOUT...');
        console.log('🚀 URL:', stripeUrl);
        window.location.href = stripeUrl;
      }, 1000);

    } catch (error) {
      console.error("❌ PAYMENT ERROR - Full error details:", error);
      console.error("❌ Error name:", error?.name);
      console.error("❌ Error message:", error?.message);
      console.error("❌ Error stack:", error?.stack);
      
      toast({
        title: "❌ Erreur",
        description: error instanceof Error ? error.message : "Impossible d'enregistrer votre consultation. Veuillez réessayer.",
        variant: "destructive",
      });
      
      console.log("❌ Resetting isSubmitting to false");
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

