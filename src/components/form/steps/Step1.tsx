import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step1Schema, maladiesOptions } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step1Data = z.infer<typeof step1Schema>;

export function Step1({ form, onAutoFill }: StepComponentProps<Step1Data>) {
  const { control, formState: { errors } } = form;
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Bouton de navigation */}
      <div className="flex justify-start items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700 p-2"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="maladie_presumee" className="text-base font-medium">
          Choisissez la maladie présumée
        </Label>
        
        <Controller
          name="maladie_presumee"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="maladie_presumee"
                className={`min-h-[48px] text-[16px] ${
                  errors.maladie_presumee ? "border-red-500" : ""
                }`}
                aria-invalid={errors.maladie_presumee ? "true" : "false"}
              >
                <SelectValue placeholder="Veuillez sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {maladiesOptions.map((option) => (
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

        {errors.maladie_presumee && (
          <p className="text-sm text-red-600" role="alert">
            {errors.maladie_presumee.message}
          </p>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Information</strong> : Sélectionnez la maladie qui correspond le mieux à vos symptômes actuels.
        </p>
      </div>
    </div>
  );
}

