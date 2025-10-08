import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step5Schema, zonesDouleursOptions } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step5Data = z.infer<typeof step5Schema>;

export function Step5({ form }: StepComponentProps<Step5Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Controller
          name="zones_douleur"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {zonesDouleursOptions.map((option) => {
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
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-2">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        />

        {errors.zones_douleur && (
          <p className="text-sm text-red-600" role="alert">
            {errors.zones_douleur.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Sélection multiple</strong> : Vous pouvez sélectionner plusieurs zones.
        </p>
      </div>
    </div>
  );
}

