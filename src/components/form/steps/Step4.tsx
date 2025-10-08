import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step4Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Step4Data = z.infer<typeof step4Schema>;

export function Step4({ form }: StepComponentProps<Step4Data>) {
  const { control, formState: { errors }, watch } = form;
  const value = watch("autres_symptomes") || "";
  const charCount = value.length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="autres_symptomes" className="text-base font-medium">
          Décrivez tous les autres symptômes
        </Label>
        
        <Controller
          name="autres_symptomes"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea
              {...field}
              id="autres_symptomes"
              rows={6}
              placeholder="Décrivez vos symptômes en détail..."
              className={`text-[16px] min-h-[160px] resize-none ${
                errors.autres_symptomes ? "border-red-500" : ""
              }`}
              aria-invalid={errors.autres_symptomes ? "true" : "false"}
            />
          )}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>{charCount} / 600 caractères</span>
          <span>Minimum 10 caractères</span>
        </div>

        {errors.autres_symptomes && (
          <p className="text-sm text-red-600" role="alert">
            {errors.autres_symptomes.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Conseil</strong> : Soyez précis sur la durée, l'intensité et l'évolution de vos symptômes.
        </p>
      </div>
    </div>
  );
}

