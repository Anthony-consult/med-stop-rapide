import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface BottomBarProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  isLastStep?: boolean;
}

export function BottomBar({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  isLastStep = false,
}: BottomBarProps) {
  const progressPercent = ((currentStep) / totalSteps) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50"
         style={{
           paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
           paddingTop: '8px',
         }}>
      {/* Progress bar */}
      <div className="px-4 pb-3">
        <Progress value={progressPercent} className="h-0.5" />
        <p className="text-xs text-center text-gray-500 mt-2">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="px-4 pb-2 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="min-h-[48px] rounded-xl disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Précédent
        </Button>

        <Button
          type="submit"
          size="lg"
          onClick={onNext}
          disabled={!canGoNext}
          className="min-h-[48px] rounded-xl flex-1 max-w-[200px] shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLastStep ? "Payer 14 €" : "Suivant"}
        </Button>
      </div>
    </div>
  );
}

