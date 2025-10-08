import { Controller, useFormContext } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step15Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

type Step15Data = z.infer<typeof step15Schema>;

export function Step15({ form }: StepComponentProps<Step15Data>) {
  const { control, formState: { errors }, watch, setError, clearErrors } = form;
  
  // Get the global form data to access the first email
  const formContext = useFormContext();
  const firstEmail = formContext?.getValues("email") || "";

  const handleEmailConfirmation = (value: string) => {
    if (value && firstEmail && value !== firstEmail) {
      setError("email_confirmation", {
        type: "manual",
        message: "Les adresses e-mail ne correspondent pas",
      });
      return false;
    } else {
      clearErrors("email_confirmation");
      return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Display first email */}
      {firstEmail && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">E-mail saisi :</p>
          <p className="text-base font-medium text-gray-900">{firstEmail}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email_confirmation" className="text-base font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Confirmez votre adresse e-mail
        </Label>
        
        <Controller
          name="email_confirmation"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="email_confirmation"
              type="email"
              placeholder="Saisissez à nouveau votre e-mail"
              className={`text-[16px] min-h-[48px] ${
                errors.email_confirmation ? "border-red-500" : ""
              }`}
              inputMode="email"
              autoComplete="email"
              onChange={(e) => {
                field.onChange(e);
                handleEmailConfirmation(e.target.value);
              }}
              onBlur={(e) => {
                field.onBlur();
                handleEmailConfirmation(e.target.value);
              }}
              aria-invalid={errors.email_confirmation ? "true" : "false"}
            />
          )}
        />

        {errors.email_confirmation && (
          <p className="text-sm text-red-600" role="alert">
            {errors.email_confirmation.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          🔒 <strong>Sécurité</strong> : Confirmez votre adresse pour éviter les erreurs de saisie.
        </p>
      </div>
    </div>
  );
}

