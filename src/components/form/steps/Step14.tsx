import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step14Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

type Step14Data = z.infer<typeof step14Schema>;

export function Step14({ form }: StepComponentProps<Step14Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-base font-medium flex items-center gap-2">
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

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          📧 <strong>Important</strong> : Votre arrêt maladie sera envoyé à cette adresse. Vérifiez qu'elle est correcte.
        </p>
      </div>
    </div>
  );
}

