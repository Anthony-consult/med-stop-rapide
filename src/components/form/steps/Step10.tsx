import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step10Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step10Data = z.infer<typeof step10Schema>;

export function Step10({ form }: StepComponentProps<Step10Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="profession" className="text-base font-medium">
          Quelle est votre profession actuelle ?
        </Label>
        
        <Controller
          name="profession"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="profession"
              type="text"
              placeholder="Ex: Enseignant, Infirmier, Commercial..."
              className={`text-[16px] min-h-[48px] ${
                errors.profession ? "border-red-500" : ""
              }`}
              inputMode="text"
              autoComplete="organization-title"
              aria-invalid={errors.profession ? "true" : "false"}
            />
          )}
        />

        {errors.profession && (
          <p className="text-sm text-red-600" role="alert">
            {errors.profession.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Information</strong> : Indiquez votre profession ou "Sans emploi" si vous ne travaillez pas actuellement.
        </p>
      </div>
    </div>
  );
}

