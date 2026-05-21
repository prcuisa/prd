"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Pencil, CheckCircle2 } from "lucide-react";
import type { FormData } from "@/lib/prd-types";
import { INDUSTRIES, BUDGET_OPTIONS } from "@/lib/prd-types";

interface Step6SummaryProps {
  data: FormData;
  onGoToStep: (step: number) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

function getBudgetLabel(value: string): string {
  const opt = BUDGET_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : value;
}

function SummarySection({
  title,
  stepNumber,
  children,
  onEdit,
}: {
  title: string;
  stepNumber: number;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <Card className="border-[#c0ebf0] hover:border-[#3cc6d5] transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#e6f7f9] text-[#007780] text-xs font-bold">
              {stepNumber}
            </span>
            {title}
          </CardTitle>
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="gap-1.5 text-muted-foreground hover:text-[#009AA5]"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
      <span className="text-sm text-muted-foreground sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}

export function Step6Summary({
  data,
  onGoToStep,
  isGenerating,
  onGenerate,
}: Step6SummaryProps) {
  const allRequiredFilled =
    data.businessName &&
    data.industry &&
    data.businessDescription &&
    data.contactName &&
    data.contactEmail &&
    data.mainProblem &&
    data.businessImpact &&
    data.targetUsers &&
    data.estimatedUsers &&
    data.techFamiliarity &&
    data.devices.length > 0 &&
    data.features.some((f) => f.name) &&
    data.mainGoal &&
    data.targetTimeline &&
    data.budget &&
    data.kpi;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6f7f9] mb-4">
          <ClipboardCheck className="w-8 h-8 text-[#009AA5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-space-grotesk)]">
          Ringkasan & Konfirmasi
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Periksa kembali semua informasi yang telah Anda masukkan.
          Pastikan semuanya sudah benar sebelum mengirim ke tim Prcuisa.
        </p>
      </div>

      <div className="flex items-center gap-2 justify-center mb-4">
        <CheckCircle2
          className={`w-5 h-5 ${allRequiredFilled ? "text-[#009AA5]" : "text-amber-500"}`}
        />
        <span
          className={`text-sm font-medium ${allRequiredFilled ? "text-[#009AA5]" : "text-amber-600"}`}
        >
          {allRequiredFilled
            ? "Semua data wajib sudah terisi — siap dikirim!"
            : "Beberapa data wajib belum terisi. Silakan lengkapi terlebih dahulu."}
        </span>
      </div>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {/* Step 1 */}
        <SummarySection title="Informasi Bisnis" stepNumber={1} onEdit={() => onGoToStep(1)}>
          <InfoRow label="Nama Bisnis" value={data.businessName} />
          <InfoRow
            label="Jenis Industri"
            value={INDUSTRIES.includes(data.industry as typeof INDUSTRIES[number]) ? data.industry : data.industry}
          />
          <InfoRow label="Deskripsi" value={data.businessDescription} />
          <InfoRow label="Nama Kontak" value={data.contactName} />
          <InfoRow label="Email" value={data.contactEmail} />
        </SummarySection>

        {/* Step 2 */}
        <SummarySection title="Masalah" stepNumber={2} onEdit={() => onGoToStep(2)}>
          <InfoRow label="Masalah Utama" value={data.mainProblem} />
          <InfoRow label="Solusi Saat Ini" value={data.currentSolution} />
          <InfoRow label="Dampak Bisnis" value={data.businessImpact} />
        </SummarySection>

        {/* Step 3 */}
        <SummarySection title="Target Pengguna" stepNumber={3} onEdit={() => onGoToStep(3)}>
          <InfoRow label="Pengguna Utama" value={data.targetUsers} />
          <InfoRow label="Jumlah Pengguna" value={data.estimatedUsers} />
          <InfoRow label="Familiaritas Teknologi" value={data.techFamiliarity} />
          {data.devices.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
              <span className="text-sm text-muted-foreground sm:w-40 shrink-0">Perangkat</span>
              <div className="flex flex-wrap gap-1.5">
                {data.devices.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs">
                    {d}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </SummarySection>

        {/* Step 4 */}
        <SummarySection title="Fitur" stepNumber={4} onEdit={() => onGoToStep(4)}>
          {data.features.filter((f) => f.name).length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Daftar Fitur:</span>
              {data.features
                .filter((f) => f.name)
                .map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-xs font-bold text-[#009AA5] mt-0.5">
                      {i + 1}.
                    </span>
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {f.name}
                      </span>
                      {f.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {f.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
          <InfoRow label="Fitur Prioritas" value={data.priorityFeatures} />
          <InfoRow label="Fitur Khusus" value={data.specialFeatures} />
          <InfoRow label="Integrasi" value={data.integrations} />
        </SummarySection>

        {/* Step 5 */}
        <SummarySection title="Tujuan & Target" stepNumber={5} onEdit={() => onGoToStep(5)}>
          <InfoRow label="Tujuan Utama" value={data.mainGoal} />
          <InfoRow label="Timeline" value={data.targetTimeline} />
          <InfoRow label="Estimasi Budget" value={getBudgetLabel(data.budget)} />
          <InfoRow label="KPI" value={data.kpi} />
          <InfoRow label="Deadline" value={data.deadline} />
        </SummarySection>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={onGenerate}
          disabled={!allRequiredFilled || isGenerating}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#009AA5] to-[#0ea5e9] hover:from-[#008a94] hover:to-[#0284c7] text-white shadow-lg shadow-[#009AA5]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sedang Membuat Dokumen...
            </>
          ) : (
            <>
              <ClipboardCheck className="w-5 h-5" />
              Kirim Kebutuhan Bisnis
            </>
          )}
        </Button>
        {!allRequiredFilled && (
          <p className="text-xs text-center text-amber-600 mt-2">
            Silakan lengkapi semua data bertanda * terlebih dahulu
          </p>
        )}
      </div>
    </div>
  );
}
