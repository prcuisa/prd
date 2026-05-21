"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, Plus, X } from "lucide-react";
import type { FormData, FeatureItem } from "@/lib/prd-types";

interface Step4FeaturesProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onFeaturesChange: (features: FeatureItem[]) => void;
}

export function Step4Features({
  data,
  onChange,
  onFeaturesChange,
}: Step4FeaturesProps) {
  const addFeature = () => {
    const newFeature: FeatureItem = {
      id: String(Date.now()),
      name: "",
      description: "",
    };
    onFeaturesChange([...data.features, newFeature]);
  };

  const removeFeature = (id: string) => {
    if (data.features.length > 1) {
      onFeaturesChange(data.features.filter((f) => f.id !== id));
    }
  };

  const updateFeature = (id: string, field: "name" | "description", value: string) => {
    onFeaturesChange(
      data.features.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6f7f9] mb-4">
          <Puzzle className="w-8 h-8 text-[#009AA5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-space-grotesk)]">
          Fitur yang Diinginkan
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Daftar fitur apa saja yang Anda butuhkan. Jangan khawatir jika belum sempurna —
          kami akan membantu merinci dan mengoptimalkannya.
        </p>
      </div>

      <Card className="border-[#c0ebf0] glass-card">
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-base font-semibold">
                Daftar Fitur Utama <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="gap-1.5 text-[#009AA5] border-[#c0ebf0] hover:bg-[#e6f7f9]"
              >
                <Plus className="w-4 h-4" />
                Tambah Fitur
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {data.features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="relative p-4 rounded-xl border bg-background space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Fitur #{index + 1}
                    </span>
                    {data.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(feature.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Input
                        placeholder="Nama fitur (misal: Dashboard)"
                        value={feature.name}
                        onChange={(e) =>
                          updateFeature(feature.id, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Input
                        placeholder="Deskripsi singkat fitur"
                        value={feature.description}
                        onChange={(e) =>
                          updateFeature(feature.id, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorityFeatures" className="text-foreground">
              Fitur wajib / prioritas tertinggi
            </Label>
            <Textarea
              id="priorityFeatures"
              placeholder="Tulis fitur-fitur yang harus ada di versi pertama (MVP)..."
              value={data.priorityFeatures}
              onChange={(e) => onChange("priorityFeatures", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialFeatures" className="text-foreground">
              Apakah ada fitur khusus yang dibutuhkan?
            </Label>
            <Textarea
              id="specialFeatures"
              placeholder="Misalnya: fitur notifikasi real-time, multi-bahasa, offline mode, dll..."
              value={data.specialFeatures}
              onChange={(e) => onChange("specialFeatures", e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="integrations" className="text-foreground">
              Apakah ada integrasi dengan sistem lain?
            </Label>
            <Textarea
              id="integrations"
              placeholder="Misalnya: integrasi dengan sistem akuntansi, payment gateway, CRM, dll..."
              value={data.integrations}
              onChange={(e) => onChange("integrations", e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
