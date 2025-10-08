import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step8Schema, facteursRisqueOptions } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step8Data = z.infer<typeof step8Schema>;

export function Step8({ form }: StepComponentProps<Step8Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Controller
          name="facteurs_risque"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="space-y-2">
              {facteursRisqueOptions.map((option) => {
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
                      "flex items-start justify-between p-4 rounded-xl border-2 transition-all text-[16px] min-h-[56px] w-full text-left",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className={cn(
                      "font-medium flex-1",
                      isSelected ? "text-primary" : "text-gray-700"
                    )}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-3">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        />

        {errors.facteurs_risque && (
          <p className="text-sm text-red-600" role="alert">
            {errors.facteurs_risque.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 Si aucun facteur ne s'applique, laissez tout décoché et continuez.
        </p>
      </div>
    </div>
  );
}

