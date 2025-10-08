import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step19Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

type Step19Data = z.infer<typeof step19Schema>;

export function Step19({ form }: StepComponentProps<Step19Data>) {
  const { control, formState: { errors }, watch } = form;
  const value = watch("numero_securite_sociale") || "";

  // Format: 1 23 45 67 890 123 45
  const formatSecu = (val: string) => {
    const digits = val.replace(/\D/g, "");
    const formatted = digits.match(/.{1,2}/g)?.join(" ") || digits;
    return formatted;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="numero_securite_sociale" className="text-base font-medium flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Numéro de sécurité sociale
        </Label>
        
        <Controller
          name="numero_securite_sociale"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div>
              <Input
                {...field}
                id="numero_securite_sociale"
                type="text"
                placeholder="1 23 45 67 890 123 45"
                className={`text-[16px] min-h-[48px] font-mono tracking-wider ${
                  errors.numero_securite_sociale ? "border-red-500" : ""
                }`}
                inputMode="numeric"
                autoComplete="off"
                maxLength={21} // 15 digits + 6 spaces
                value={formatSecu(field.value || "")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  field.onChange(digits);
                }}
                aria-invalid={errors.numero_securite_sociale ? "true" : "false"}
              />
              <p className="text-xs text-gray-500 mt-2">
                15 chiffres {value.length > 0 && `(${value.replace(/\D/g, "").length}/15)`}
              </p>
            </div>
          )}
        />

        {errors.numero_securite_sociale && (
          <p className="text-sm text-red-600" role="alert">
            {errors.numero_securite_sociale.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          🔒 <strong>Sécurité</strong> : Votre numéro de sécurité sociale est crypté et sécurisé conformément au RGPD.
        </p>
      </div>
    </div>
  );
}

