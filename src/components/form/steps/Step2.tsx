import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step2Schema, symptomesOptions } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step2Data = z.infer<typeof step2Schema>;

export function Step2({ form }: StepComponentProps<Step2Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Controller
          name="symptomes"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-2">
              {symptomesOptions.map((option) => {
                const isSelected = field.value?.includes(option.value);
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      const currentValues = field.value || [];
                      const newValues = isSelected
                        ? currentValues.filter((v) => v !== option.value)
                        : [...currentValues, option.value];
                      field.onChange(newValues);
                    }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-[16px] min-h-[56px]",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className={cn(
                      "font-medium text-left",
                      isSelected ? "text-primary" : "text-gray-700"
                    )}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        />

        {errors.symptomes && (
          <p className="text-sm text-red-600" role="alert">
            {errors.symptomes.message}
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Sélection multiple</strong> : Vous pouvez choisir plusieurs symptômes.
        </p>
      </div>
    </div>
  );
}

