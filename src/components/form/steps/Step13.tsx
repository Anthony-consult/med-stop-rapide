import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step13Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { BirthDateField } from "../BirthDateField";

type Step13Data = z.infer<typeof step13Schema>;

export function Step13({ form }: StepComponentProps<Step13Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <Controller
        name="date_naissance"
        control={control}
        render={({ field }) => (
          <BirthDateField
            value={field.value}
            onChange={field.onChange}
            error={errors.date_naissance?.message}
          />
        )}
      />

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Information</strong> : Vous devez avoir au moins 16 ans pour utiliser ce service.
        </p>
      </div>
    </div>
  );
}

