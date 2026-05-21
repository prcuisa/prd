"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Calendar, TrendingUp, Wallet } from "lucide-react";
import type { FormData } from "@/lib/prd-types";
import { TIMELINE_OPTIONS, BUDGET_OPTIONS } from "@/lib/prd-types";

interface Step5GoalsProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export function Step5Goals({ data, onChange }: Step5GoalsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6f7f9] mb-4">
          <Target className="w-8 h-8 text-[#009AA5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-space-grotesk)]">
          Tujuan & Target
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Tentukan tujuan dan target yang ingin dicapai. Ini membantu kami
          membuat rencana pengembangan yang terarah dan terukur.
        </p>
      </div>

      <Card className="border-[#c0ebf0] glass-card">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mainGoal" className="text-foreground">
              Tujuan utama dari pengembangan ini
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="mainGoal"
              placeholder="Contoh: Membangun sistem pencatatan transaksi digital yang dapat mengotomatisasi proses akuntansi dan menghasilkan laporan keuangan secara real-time..."
              value={data.mainGoal}
              onChange={(e) => onChange("mainGoal", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Target yang ingin dicapai dalam
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.targetTimeline}
                onValueChange={(val) => onChange("targetTimeline", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Estimasi Budget
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.budget}
                onValueChange={(val) => onChange("budget", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih estimasi budget" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Apakah ada deadline penting?
            </Label>
            <Textarea
              id="deadline"
              placeholder="Contoh: Harap sudah bisa digunakan sebelum akhir tahun 2025 untuk persiapan audit..."
              value={data.deadline}
              onChange={(e) => onChange("deadline", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kpi" className="text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Indikator keberhasilan / KPI yang diharapkan
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="kpi"
              placeholder={`Contoh: \n- Pengurangan waktu pencatatan dari 2 jam menjadi 15 menit per hari\n- Akurasi data meningkat menjadi 99%\n- Efisiensi operasional meningkat 30%...`}
              value={data.kpi}
              onChange={(e) => onChange("kpi", e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              💡 Tulis KPI yang terukur (angka/percentase) agar keberhasilan bisa dievaluasi.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
