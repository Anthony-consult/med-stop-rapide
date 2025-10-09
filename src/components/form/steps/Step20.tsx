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
      
      console.log("💳 Création de la session Stripe...", {
        email: allFormData.email,
        nom_prenom: allFormData.nom_prenom,
      });

      // Prepare data for Stripe (will be stored in metadata)
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

      // 1. D'ABORD : Créer la ligne dans Supabase (avec payment_status = 'pending')
      console.log('💾 Création de la ligne dans Supabase...');
      
      const { data: savedData, error: supabaseError } = await supabase
        .from("consultations")
        .insert([{
          ...consultationData,
          payment_status: "pending",
        }])
        .select()
        .single();

      if (supabaseError) {
        console.error("❌ Erreur Supabase:", supabaseError);
        throw new Error("Impossible d'enregistrer votre consultation");
      }

      console.log('✅ Consultation créée dans Supabase:', savedData.id);

      // 2. ENSUITE : Créer la session Stripe avec l'ID de consultation
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: consultationData,
          consultationId: savedData.id, // Passer l'ID pour le webhook
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }

      const { url: stripeUrl } = await response.json();

      if (!stripeUrl) {
        throw new Error('URL Stripe non reçue');
      }

      console.log('✅ Session Stripe créée');
      console.log('🔗 Stripe URL:', stripeUrl);

      // Clear form data
      clearFormData();

      toast({
        title: "✅ Redirection vers le paiement",
        description: "Vous allez être redirigé vers Stripe...",
      });

      // Redirect to Stripe Checkout
      setTimeout(() => {
        console.log('🚀 Redirecting to Stripe Checkout...');
        window.location.href = stripeUrl;
      }, 1000);

    } catch (error) {
      console.error("❌ Erreur lors de la création de la session:", error);
      
      toast({
        title: "❌ Erreur",
        description: error instanceof Error ? error.message : "Impossible de créer la session de paiement. Veuillez réessayer.",
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

