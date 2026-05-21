"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { STEPS } from "@/lib/prd-types";
import {
  Building2,
  AlertTriangle,
  Users,
  Puzzle,
  Target,
  ClipboardCheck,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  AlertTriangle,
  Users,
  Puzzle,
  Target,
  ClipboardCheck,
};

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-center gap-1">
        {STEPS.map((step, index) => {
          const Icon = iconMap[step.icon];
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = isCompleted || step.id <= Math.max(...completedSteps, 0) + 1;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 max-w-16 transition-colors duration-500",
                    isCompleted || currentStep > step.id
                      ? "bg-[#009AA5]"
                      : "bg-muted"
                  )}
                />
              )}
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer group",
                  !isClickable && "cursor-not-allowed opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive && "bg-[#009AA5] border-[#009AA5] text-white shadow-lg shadow-[#009AA5]/25 scale-110",
                    isCompleted && "bg-[#009AA5] border-[#009AA5] text-white",
                    !isActive && !isCompleted && "border-muted-foreground/30 text-muted-foreground bg-background group-hover:border-[#3cc6d5]"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-5 h-5" />
                  ) : Icon ? (
                    <Icon className="w-4 h-4" />
                  ) : null}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-300 whitespace-nowrap",
                    isActive
                      ? "text-[#009AA5]"
                      : isCompleted
                      ? "text-[#009AA5]"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#009AA5]">
            Langkah {currentStep} dari {STEPS.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {STEPS[currentStep - 1]?.title}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-[#009AA5] rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
