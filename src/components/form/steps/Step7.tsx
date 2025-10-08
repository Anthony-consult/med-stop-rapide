import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step7Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Step7Data = z.infer<typeof step7Schema>;

export function Step7({ form }: StepComponentProps<Step7Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="medicaments_reguliers" className="text-base font-medium">
          Médicaments pris régulièrement
        </Label>
        
        <Controller
          name="medicaments_reguliers"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Textarea
              {...field}
              id="medicaments_reguliers"
              rows={5}
              placeholder="Listez vos médicaments ou indiquez 'Aucun'"
              className={`text-[16px] min-h-[140px] resize-none ${
                errors.medicaments_reguliers ? "border-red-500" : ""
              }`}
              aria-invalid={errors.medicaments_reguliers ? "true" : "false"}
            />
          )}
        />

        {errors.medicaments_reguliers && (
          <p className="text-sm text-red-600" role="alert">
            {errors.medicaments_reguliers.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Conseil</strong> : Indiquez le nom, le dosage et la fréquence de prise. Si vous ne prenez aucun médicament, écrivez "Aucun".
        </p>
      </div>
    </div>
  );
}

