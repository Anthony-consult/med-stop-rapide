import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateFieldProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function DateField({
  value,
  onChange,
  label,
  error,
  placeholder = "Sélectionner une date",
  disabled = false,
  minDate,
  maxDate,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal min-h-[48px] text-[16px]",
              !value && "text-gray-500",
              error && "border-red-500 focus:ring-red-500"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
            {value ? (
              format(value, "dd/MM/yyyy", { locale: fr })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          sideOffset={4}
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            initialFocus
            locale={fr}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

