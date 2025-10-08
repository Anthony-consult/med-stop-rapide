import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DayPicker } from "react-day-picker";

interface BirthDateFieldProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  error?: string;
}

export function BirthDateField({
  value,
  onChange,
  error,
}: BirthDateFieldProps) {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(value || new Date());

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120;
  const maxYear = currentYear - 16;

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">
        Date de naissance
      </label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
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
              <span>JJ/MM/AAAA</span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          className="w-auto p-0" 
          align="center"
          sideOffset={4}
        >
          <div className="p-3 border-b space-y-2">
            {/* Month and Year selectors */}
            <div className="flex gap-2">
              <Select
                value={selectedMonth.getMonth().toString()}
                onValueChange={(month) => {
                  const newDate = new Date(selectedMonth);
                  newDate.setMonth(parseInt(month));
                  setSelectedMonth(newDate);
                }}
              >
                <SelectTrigger className="flex-1 text-[14px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, idx) => (
                    <SelectItem key={idx} value={idx.toString()} className="text-[14px]">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedMonth.getFullYear().toString()}
                onValueChange={(year) => {
                  const newDate = new Date(selectedMonth);
                  newDate.setFullYear(parseInt(year));
                  setSelectedMonth(newDate);
                }}
              >
                <SelectTrigger className="w-[100px] text-[14px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()} className="text-[14px]">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            month={selectedMonth}
            onMonthChange={setSelectedMonth}
            disabled={(date) => {
              const age = (new Date().getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
              return age < 16 || age > 120;
            }}
            locale={fr}
            className="p-3"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium hidden",
              nav: "space-x-1 flex items-center",
              nav_button: cn(
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-200 rounded-md"
              ),
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative",
              day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-md",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
            }}
            components={{
              IconLeft: () => <ChevronLeft className="h-4 w-4" />,
              IconRight: () => <ChevronRight className="h-4 w-4" />,
            }}
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

