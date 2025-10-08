import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step18Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

type Step18Data = z.infer<typeof step18Schema>;

export function Step18({ form }: StepComponentProps<Step18Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="localisation_medecin" className="text-base font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Ville ou région du médecin habituel
        </Label>
        
        <Controller
          name="localisation_medecin"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="localisation_medecin"
              type="text"
              placeholder="Ex: Paris, Lyon, Bordeaux..."
              className={`text-[16px] min-h-[48px] ${
                errors.localisation_medecin ? "border-red-500" : ""
              }`}
              inputMode="text"
              autoComplete="address-level2"
              aria-invalid={errors.localisation_medecin ? "true" : "false"}
            />
          )}
        />

        {errors.localisation_medecin && (
          <p className="text-sm text-red-600" role="alert">
            {errors.localisation_medecin.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Information</strong> : Indiquez la ville où se trouve votre médecin traitant habituel.
        </p>
      </div>
    </div>
  );
}

