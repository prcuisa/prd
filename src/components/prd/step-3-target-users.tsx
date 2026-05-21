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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Smartphone, Tablet, Monitor, Globe } from "lucide-react";
import type { FormData } from "@/lib/prd-types";
import { USER_ESTIMATES, TECH_FAMILIARITY, DEVICE_OPTIONS } from "@/lib/prd-types";

interface Step3TargetUsersProps {
  data: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  onDeviceChange: (devices: string[]) => void;
}

const deviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Tablet,
  "Laptop/PC": Monitor,
  Semua: Globe,
};

export function Step3TargetUsers({
  data,
  onChange,
  onDeviceChange,
}: Step3TargetUsersProps) {
  const handleDeviceToggle = (device: string) => {
    const current = data.devices;
    if (device === "Semua") {
      if (current.includes("Semua")) {
        onDeviceChange([]);
      } else {
        onDeviceChange(["Semua"]);
      }
      return;
    }
    const withoutAll = current.filter((d) => d !== "Semua");
    if (withoutAll.includes(device)) {
      onDeviceChange(withoutAll.filter((d) => d !== device));
    } else {
      onDeviceChange([...withoutAll, device]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e6f7f9] mb-4">
          <Users className="w-8 h-8 text-[#009AA5]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2 font-[family-name:var(--font-space-grotesk)]">
          Target Pengguna
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Siapa yang akan menggunakan produk/fitur ini? Pemahaman yang baik
          tentang pengguna membantu kami merancang solusi yang tepat.
        </p>
      </div>

      <Card className="border-[#c0ebf0] glass-card">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetUsers" className="text-foreground">
              Siapa pengguna utama aplikasi/produk yang diinginkan?
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="targetUsers"
              placeholder="Contoh: Karyawan administrasi (umur 25-40 tahun), bagian keuangan dan operasional yang sehari-hari melakukan pencatatan transaksi..."
              value={data.targetUsers}
              onChange={(e) => onChange("targetUsers", e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              💡 Jelaskan siapa pengguna, peran mereka, dan bagaimana mereka akan menggunakan produk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-foreground">
                Berapa estimasi jumlah pengguna?
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.estimatedUsers}
                onValueChange={(val) => onChange("estimatedUsers", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih estimasi" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ESTIMATES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label} pengguna
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">
                Apakah pengguna sudah terbiasa dengan teknologi?
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.techFamiliarity}
                onValueChange={(val) => onChange("techFamiliarity", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tingkat" />
                </SelectTrigger>
                <SelectContent>
                  {TECH_FAMILIARITY.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">
              Perangkat apa yang paling sering digunakan pengguna?
              <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DEVICE_OPTIONS.map((device) => {
                const Icon = deviceIcons[device] || Smartphone;
                const isChecked = data.devices.includes(device);
                return (
                  <label
                    key={device}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      isChecked
                        ? "border-[#009AA5] bg-[#e6f7f9] shadow-sm"
                        : "border-muted hover:border-[#3cc6d5] hover:bg-[#e6f7f9]/50"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleDeviceToggle(device)}
                    />
                    <Icon className={`w-4 h-4 ${isChecked ? "text-[#009AA5]" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${isChecked ? "text-[#007780]" : "text-foreground"}`}>
                      {device}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
