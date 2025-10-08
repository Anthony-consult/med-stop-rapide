import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step9Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileText, RefreshCw } from "lucide-react";

type Step9Data = z.infer<typeof step9Schema>;

const options = [
  { value: "nouvel", label: "Nouvel arrêt maladie", icon: FileText, description: "Première demande d'arrêt" },
  { value: "prolongation", label: "Prolongation d'arrêt", icon: RefreshCw, description: "Suite d'un arrêt existant" },
];

export function Step9({ form }: StepComponentProps<Step9Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <Controller
        name="type_arret"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="space-y-3"
          >
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className="flex items-start space-x-3 p-5 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => field.onChange(option.value)}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="min-w-[20px] min-h-[20px] mt-1"
                  />
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor={option.value}
                        className="cursor-pointer text-[16px] font-semibold block mb-1"
                      >
                        {option.label}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </RadioGroup>
        )}
      />

      {errors.type_arret && (
        <p className="text-sm text-red-600" role="alert">
          {errors.type_arret.message}
        </p>
      )}
    </div>
  );
}

