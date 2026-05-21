"use client";

import React from "react";
import { Input } from "@/components/ui/input";
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
import { Building2, Briefcase } from "lucide-react";
import type { FormData } from "@/lib/prd-types";
import { INDUSTRIES } from "@/lib/prd-types";

interface Step1BusinessInfoProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

export function Step1BusinessInfo({ data, onChange }: Step1BusinessInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6f7f9] mb-4">
          <Building2 className="w-8 h-8 text-[#009AA5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-space-grotesk)]">
          Informasi Bisnis
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Ceritakan tentang bisnis Anda. Informasi ini membantu kami memahami
          konteks dan kebutuhan Anda dengan lebih baik.
        </p>
      </div>

      <Card className="border-[#c0ebf0] glass-card">
        <CardContent className="space-y-5">
          <div className="flex items-center gap-2 text-sm font-medium text-[#007780] mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Detail Perusahaan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-foreground">
                Nama Bisnis / Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="businessName"
                placeholder="Contoh: PT Maju Bersama Indonesia"
                value={data.businessName}
                onChange={(e) => onChange("businessName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-foreground">
                Jenis Industri <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.industry}
                onValueChange={(val) => onChange("industry", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis industri" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription" className="text-foreground">
              Deskripsi Singkat Bisnis <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="businessDescription"
              placeholder="Jelaskan secara singkat tentang bisnis Anda, produk atau layanan yang ditawarkan, dan pasar yang dilayani..."
              value={data.businessDescription}
              onChange={(e) => onChange("businessDescription", e.target.value)}
              rows={3}
            />
          </div>

          <div className="border-t border-[#c0ebf0] pt-5 mt-2">
            <div className="flex items-center gap-2 text-sm font-medium text-[#007780] mb-4">
              <span>👤</span>
              <span>Informasi Kontak</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-foreground">
                  Nama Kontak / PIC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactName"
                  placeholder="Contoh: Budi Santoso"
                  value={data.contactName}
                  onChange={(e) => onChange("contactName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-foreground">
                  Email Kontak <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contoh@perusahaan.com"
                  value={data.contactEmail}
                  onChange={(e) => onChange("contactEmail", e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
