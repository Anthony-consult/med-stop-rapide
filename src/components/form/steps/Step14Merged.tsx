import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";

// Merged schema for both email fields
const mergedEmailSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  email_confirmation: z.string().email("Adresse e-mail invalide"),
}).refine(
  (data) => data.email === data.email_confirmation,
  {
    message: "Les adresses e-mail ne correspondent pas",
    path: ["email_confirmation"],
  }
);

type Step14MergedData = z.infer<typeof mergedEmailSchema>;

export function Step14Merged({ form }: StepComponentProps<Step14MergedData>) {
  const { control, formState: { errors }, watch } = form;
  
  const email = watch("email");
  const emailConfirmation = watch("email_confirmation");
  const emailsMatch = email && emailConfirmation && email === emailConfirmation;

  return (
    <div className="space-y-6">
      {/* Premier champ email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Adresse e-mail
        </Label>
        
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="votre.email@exemple.fr"
              className={`text-[16px] min-h-[48px] ${
                errors.email ? "border-red-500" : ""
              }`}
              inputMode="email"
              autoComplete="email"
              aria-invalid={errors.email ? "true" : "false"}
            />
          )}
        />

        {errors.email && (
          <p className="text-sm text-red-600" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Confirmation email */}
      <div className="space-y-2">
        <Label htmlFor="email_confirmation" className="text-sm font-medium flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Confirmez votre adresse e-mail
        </Label>
        
        <Controller
          name="email_confirmation"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <div className="relative">
              <Input
                {...field}
                id="email_confirmation"
                type="email"
                placeholder="Saisissez à nouveau votre e-mail"
                className={`text-[16px] min-h-[48px] ${
                  errors.email_confirmation 
                    ? "border-red-500" 
                    : emailsMatch 
                    ? "border-green-500" 
                    : ""
                }`}
                inputMode="email"
                autoComplete="email"
                aria-invalid={errors.email_confirmation ? "true" : "false"}
              />
              {emailsMatch && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
              )}
            </div>
          )}
        />

        {errors.email_confirmation && (
          <p className="text-sm text-red-600" role="alert">
            {errors.email_confirmation.message}
          </p>
        )}
        
        {emailsMatch && !errors.email_confirmation && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Les adresses e-mail correspondent
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          📧 <strong>Important</strong> : Votre arrêt maladie sera envoyé à cette adresse. Vérifiez qu'elle est correcte.
        </p>
      </div>
    </div>
  );
}

export { mergedEmailSchema };
