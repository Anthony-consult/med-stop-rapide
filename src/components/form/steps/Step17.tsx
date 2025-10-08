import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step17Schema, situationsProOptions } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Step17Data = z.infer<typeof step17Schema>;

export function Step17({ form }: StepComponentProps<Step17Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="situation_pro" className="text-base font-medium">
          Quelle est votre situation professionnelle ?
        </Label>
        
        <Controller
          name="situation_pro"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="situation_pro"
                className={`min-h-[48px] text-[16px] ${
                  errors.situation_pro ? "border-red-500" : ""
                }`}
                aria-invalid={errors.situation_pro ? "true" : "false"}
              >
                <SelectValue placeholder="Sélectionner votre situation" />
              </SelectTrigger>
              <SelectContent>
                {situationsProOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-[16px]"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {errors.situation_pro && (
          <p className="text-sm text-red-600" role="alert">
            {errors.situation_pro.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Information</strong> : Sélectionnez la situation qui correspond le mieux à votre statut actuel.
        </p>
      </div>
    </div>
  );
}

