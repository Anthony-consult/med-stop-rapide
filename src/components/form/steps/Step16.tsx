import { Controller } from "react-hook-form";
import { StepComponentProps } from "../FormWizard";
import { step16Schema, paysOptions } from "@/lib/validation/consultation-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Step16Data = z.infer<typeof step16Schema>;

export function Step16({ form }: StepComponentProps<Step16Data>) {
  const { control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      {/* Adresse */}
      <div className="space-y-2">
        <Label htmlFor="adresse" className="text-base font-medium">
          Numéro et voie
        </Label>
        
        <Controller
          name="adresse"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              id="adresse"
              type="text"
              placeholder="Ex: 12 rue de la République"
              className={`text-[16px] min-h-[48px] ${
                errors.adresse ? "border-red-500" : ""
              }`}
              inputMode="text"
              autoComplete="street-address"
              aria-invalid={errors.adresse ? "true" : "false"}
            />
          )}
        />

        {errors.adresse && (
          <p className="text-sm text-red-600" role="alert">
            {errors.adresse.message}
          </p>
        )}
      </div>

      {/* Code postal et Ville */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code_postal" className="text-base font-medium">
            Code postal
          </Label>
          
          <Controller
            name="code_postal"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                id="code_postal"
                type="text"
                placeholder="75001"
                className={`text-[16px] min-h-[48px] ${
                  errors.code_postal ? "border-red-500" : ""
                }`}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                aria-invalid={errors.code_postal ? "true" : "false"}
              />
            )}
          />

          {errors.code_postal && (
            <p className="text-sm text-red-600" role="alert">
              {errors.code_postal.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ville" className="text-base font-medium">
            Ville
          </Label>
          
          <Controller
            name="ville"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                id="ville"
                type="text"
                placeholder="Paris"
                className={`text-[16px] min-h-[48px] ${
                  errors.ville ? "border-red-500" : ""
                }`}
                inputMode="text"
                autoComplete="address-level2"
                aria-invalid={errors.ville ? "true" : "false"}
              />
            )}
          />

          {errors.ville && (
            <p className="text-sm text-red-600" role="alert">
              {errors.ville.message}
            </p>
          )}
        </div>
      </div>

      {/* Pays */}
      <div className="space-y-2">
        <Label htmlFor="pays" className="text-base font-medium">
          Pays
        </Label>
        
        <Controller
          name="pays"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="pays"
                className={`min-h-[48px] text-[16px] ${
                  errors.pays ? "border-red-500" : ""
                }`}
                aria-invalid={errors.pays ? "true" : "false"}
              >
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {paysOptions.map((option) => (
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

        {errors.pays && (
          <p className="text-sm text-red-600" role="alert">
            {errors.pays.message}
          </p>
        )}
      </div>
    </div>
  );
}

