import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step12Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step12Data = z.infer<typeof step12Schema>;

export function Step12({ form }: StepComponentProps<Step12Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nom_prenom" className="text-base font-medium">
          Nom et prénom (en MAJUSCULES)
        </Label>
        
        <Controller
          name="nom_prenom"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="nom_prenom"
              type="text"
              placeholder="Ex: DUPONT JEAN"
              className={`text-[16px] min-h-[48px] uppercase ${
                errors.nom_prenom ? "border-red-500" : ""
              }`}
              inputMode="text"
              autoComplete="name"
              autoCapitalize="characters"
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              aria-invalid={errors.nom_prenom ? "true" : "false"}
            />
          )}
        />

        {errors.nom_prenom && (
          <p className="text-sm text-red-600" role="alert">
            {errors.nom_prenom.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-900">
          💡 <strong>Format</strong> : Saisissez votre nom et prénom en lettres majuscules, séparés par un espace.
        </p>
      </div>
    </div>
  );
}

