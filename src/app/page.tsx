"use client";

import React from "react";
import { FormWizard } from "@/components/prd/form-wizard";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-blobs bg-gradient-to-b from-white via-white to-[#f0fdfd]">
      {/* Compact Header */}
      <header className="w-full py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#009AA5] to-[#0ea5e9] flex items-center justify-center shadow-lg shadow-[#009AA5]/20">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight font-[family-name:var(--font-space-grotesk)]">
                <span className="gradient-text">Prcuisa</span>
              </span>
            </div>
          </div>
          <p className="hidden sm:block text-sm text-muted-foreground">
            AI • Automation • Smart Systems
          </p>
        </div>
      </header>

      {/* Main Content - Form Wizard */}
      <section className="flex-1 px-4 py-6 md:py-10">
        <div className="container mx-auto">
          {/* Subtitle */}
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-[family-name:var(--font-space-grotesk)] mb-3">
              Kirim Kebutuhan Bisnis Anda
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              Ceritakan kebutuhan bisnis Anda, dan tim Prcuisa akan menganalisis
              serta menyusun rencana pengembangan yang tepat.
            </p>
          </div>
          <FormWizard />
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-5 px-6 mt-auto border-t border-border/50">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© 2025 Prcuisa. All rights reserved.</p>
          <a
            href="mailto:prcuisa@gmail.com"
            className="inline-flex items-center gap-1.5 hover:text-[#009AA5] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            prcuisa@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
