import { Controller } from "react-hook-form";
import { useState } from "react";
import { StepComponentProps } from "../FormWizard";
import { step20Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Step20Data = z.infer<typeof step20Schema>;

export function Step20({ form, onNext, onPrev }: StepComponentProps<Step20Data>) {
  const { control, formState: { errors } } = form;
  const { toast } = useToast();
  
  const [termsChecked, setTermsChecked] = useState(false);

  // Simple pricing
  const total = 21.00;

  // Currency formatter
  const currency = new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR' 
  });

  const handlePay = () => {
    if (!termsChecked) {
      toast({
        title: "Erreur",
        description: "Veuillez accepter les CGU.",
        variant: "destructive",
      });
      return;
    }

    // Simulate payment for now
    toast({
      title: "Paiement simulé",
      description: `Paiement de ${currency.format(total)} traité avec succès.`,
    });
    
    // Proceed to next step
    onNext();
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
              <span className="text-gray-600">Traitement du dossier médical</span>
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

