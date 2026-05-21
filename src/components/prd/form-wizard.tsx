"use client";

import React, { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { StepIndicator } from "./step-indicator";
import { Step1BusinessInfo } from "./step-1-business-info";
import { Step2Problem } from "./step-2-problem";
import { Step3TargetUsers } from "./step-3-target-users";
import { Step4Features } from "./step-4-features";
import { Step5Goals } from "./step-5-goals";
import { Step6Summary } from "./step-6-summary";
import { PRDPreview } from "./prd-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { FormData, FeatureItem } from "@/lib/prd-types";
import { initialFormData } from "@/lib/prd-types";

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export type AppView = "hero" | "form" | "preview";

export function FormWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [view, setView] = useState<AppView>("form");
  const [prdContent, setPrdContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFeaturesChange = useCallback((features: FeatureItem[]) => {
    setFormData((prev) => ({ ...prev, features }));
  }, []);

  const handleDeviceChange = useCallback((devices: string[]) => {
    setFormData((prev) => ({ ...prev, devices }));
  }, []);

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.businessName &&
          formData.industry &&
          formData.businessDescription &&
          formData.contactName &&
          formData.contactEmail
        );
      case 2:
        return !!(formData.mainProblem && formData.businessImpact);
      case 3:
        return !!(
          formData.targetUsers &&
          formData.estimatedUsers &&
          formData.techFamiliarity &&
          formData.devices.length > 0
        );
      case 4:
        return formData.features.some((f) => f.name);
      case 5:
        return !!(
          formData.mainGoal &&
          formData.targetTimeline &&
          formData.budget &&
          formData.kpi
        );
      default:
        return true;
    }
  };

  const goNext = () => {
    if (currentStep < 6) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
      }
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step < currentStep || completedSteps.includes(step)) {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setPrdContent("");
    setView("preview");

    try {
      abortRef.current = new AbortController();

      const response = await fetch("/api/generate-prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        // Try to read error from JSON body
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const errData = await response.json();
          throw new Error(errData.error || "Gagal membuat dokumen");
        }
        throw new Error(`Error ${response.status}`);
      }

      // Read streaming text from NVIDIA API (proxied via our backend)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          accumulated += text;
          setPrdContent(accumulated);
        }
      }

      if (!accumulated.trim()) {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error generating document:", error);
      setPrdContent(
        "# Gagal Membuat Dokumen\n\nTerjadi kesalahan saat menghasilkan dokumen. Silakan coba lagi.\n\nJika masalah berlanjut, hubungi tim Prcuisa."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setFormData(initialFormData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setPrdContent("");
    setIsGenerating(false);
    setDirection(0);
    setView("form");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BusinessInfo
            data={formData}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <Step2Problem
            data={formData}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <Step3TargetUsers
            data={formData}
            onChange={handleChange}
            onDeviceChange={handleDeviceChange}
          />
        );
      case 4:
        return (
          <Step4Features
            data={formData}
            onChange={handleChange}
            onFeaturesChange={handleFeaturesChange}
          />
        );
      case 5:
        return (
          <Step5Goals
            data={formData}
            onChange={handleChange}
          />
        );
      case 6:
        return (
          <Step6Summary
            data={formData}
            onGoToStep={goToStep}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
          />
        );
      default:
        return null;
    }
  };

  if (view === "preview") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <PRDPreview
          content={prdContent}
          isStreaming={isGenerating}
          businessName={formData.businessName}
          formData={formData}
          onBack={() => {
            if (!isGenerating) {
              setView("form");
              setCurrentStep(6);
            }
          }}
          onReset={handleReset}
        />
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-[#c0ebf0] glass-card">
          <CardContent className="py-4 px-4 md:px-6">
            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Steps */}
      <div className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {currentStep < 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between pt-2"
        >
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {currentStep} / 5
            </span>
            <Button
              onClick={goNext}
              disabled={!validateCurrentStep()}
              className="gap-2 bg-gradient-to-r from-[#009AA5] to-[#0ea5e9] hover:from-[#008a94] hover:to-[#0284c7] text-white disabled:opacity-50 transition-all duration-300"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick info from any step */}
      {currentStep === 6 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Sparkles className="w-4 h-4" />
          <span>Dokumen kebutuhan bisnis akan dibuat menggunakan AI berdasarkan data Anda</span>
        </motion.div>
      )}
    </div>
  );
}
