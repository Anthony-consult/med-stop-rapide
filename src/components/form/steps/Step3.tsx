import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step3Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Step3Data = z.infer<typeof step3Schema>;

const options = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
  { value: "peut-etre", label: "Peut-être" },
];

export function Step3({ form }: StepComponentProps<Step3Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <Controller
        name="diagnostic_anterieur"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            className="space-y-3"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => field.onChange(option.value)}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="min-w-[20px] min-h-[20px]"
                />
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer text-[16px] font-medium"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />

      {errors.diagnostic_anterieur && (
        <p className="text-sm text-red-600" role="alert">
          {errors.diagnostic_anterieur.message}
        </p>
      )}
    </div>
  );
}

