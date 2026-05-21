"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, HelpCircle } from "lucide-react";
import type { FormData } from "@/lib/prd-types";

interface Step2ProblemProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export function Step2Problem({ data, onChange }: Step2ProblemProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-space-grotesk)]">
          Masalah yang Ingin Diselesaikan
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Identifikasi masalah yang ingin Anda selesaikan. Semakin jelas masalahnya,
          semakin baik solusi yang bisa kami rekomendasikan.
        </p>
      </div>

      <Card className="border-amber-100 glass-card">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mainProblem" className="text-foreground flex items-center gap-2">
              Jelaskan masalah utama yang ingin diselesaikan
              <span className="text-red-500">*</span>
              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
            </Label>
            <Textarea
              id="mainProblem"
              placeholder="Contoh: Proses pencatatan transaksi masih dilakukan secara manual menggunakan spreadsheet, sehingga sering terjadi kesalahan input data dan sulit untuk mendapatkan laporan keuangan secara real-time..."
              value={data.mainProblem}
              onChange={(e) => onChange("mainProblem", e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              💡 Jelaskan masalah dengan detail: siapa yang terdampak, kapan masalah terjadi,
              dan apa penyebabnya.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentSolution" className="text-foreground">
              Apa yang sudah dilakukan untuk mengatasi masalah ini?
            </Label>
            <Textarea
              id="currentSolution"
              placeholder="Contoh: Kami sudah mencoba menggunakan beberapa aplikasi spreadsheet online, namun tetap saja prosesnya masih manual dan membutuhkan banyak waktu..."
              value={data.currentSolution}
              onChange={(e) => onChange("currentSolution", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessImpact" className="text-foreground">
              Bagaimana masalah ini berdampak pada bisnis Anda?
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="businessImpact"
              placeholder="Contoh: Setiap bulan kami kehilangan sekitar 15 jam kerja hanya untuk merekonsiliasi data. Selain itu, kesalahan data menyebabkan kerugian finansial sekitar 5-10% dari pendapatan..."
              value={data.businessImpact}
              onChange={(e) => onChange("businessImpact", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              💡 Jika bisa, sebutkan dampak dalam angka (waktu, biaya, kehilangan pelanggan, dll).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
