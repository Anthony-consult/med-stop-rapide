import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step11Schema } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { DateField } from "../DateField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, subDays } from "date-fns";

type Step11Data = z.infer<typeof step11Schema>;

export function Step11({ form }: StepComponentProps<Step11Data>) {
  const { control, formState: { errors }, watch } = form;
  
  const dateDebut = watch("date_debut");
  const dateFin = watch("date_fin");

  // Calculate days difference
  const daysDiff = dateDebut && dateFin 
    ? Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* Date début */}
      <div className="space-y-2">
        <Controller
          name="date_debut"
          control={control}
          render={({ field }) => (
            <DateField
              value={field.value}
              onChange={field.onChange}
              label="Date de début d'incapacité"
              placeholder="Sélectionner la date"
              error={errors.date_debut?.message}
              minDate={subDays(new Date(), 1)}
              maxDate={addDays(new Date(), 30)}
            />
          )}
        />
      </div>

      {/* Date fin */}
      <div className="space-y-2">
        <Controller
          name="date_fin"
          control={control}
          render={({ field }) => (
            <DateField
              value={field.value}
              onChange={field.onChange}
              label="Date de fin d'incapacité"
              placeholder="Sélectionner la date"
              error={errors.date_fin?.message}
              minDate={dateDebut || new Date()}
              maxDate={dateDebut ? addDays(dateDebut, 7) : addDays(new Date(), 7)}
            />
          )}
        />
        {daysDiff > 0 && (
          <p className="text-sm text-gray-600">
            Durée : {daysDiff} jour{daysDiff > 1 ? "s" : ""} {daysDiff > 7 && "(⚠️ Maximum 7 jours)"}
          </p>
        )}
      </div>

      {/* Date fin en lettres */}
      <div className="space-y-2">
        <Label htmlFor="date_fin_lettres" className="text-base font-medium">
          Date de fin en toutes lettres (MAJUSCULES)
        </Label>
        
        <Controller
          name="date_fin_lettres"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="date_fin_lettres"
              type="text"
              placeholder="Ex: DIX SEPTEMBRE DEUX MILLE VINGT CINQ"
              className={`text-[16px] min-h-[48px] uppercase ${
                errors.date_fin_lettres ? "border-red-500" : ""
              }`}
              inputMode="text"
              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              aria-invalid={errors.date_fin_lettres ? "true" : "false"}
            />
          )}
        />

        {errors.date_fin_lettres && (
          <p className="text-sm text-red-600" role="alert">
            {errors.date_fin_lettres.message}
          </p>
        )}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          ⚠️ <strong>Important</strong> : La durée maximale d'un arrêt maladie en ligne est de 7 jours.
        </p>
      </div>
    </div>
  );
}

