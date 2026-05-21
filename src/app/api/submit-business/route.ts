import { NextResponse } from "next/server";
import type { FormData } from "@/lib/prd-types";
import { BUDGET_OPTIONS } from "@/lib/prd-types";

function getBudgetLabel(value: string): string {
  const opt = BUDGET_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : value;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formData, documentContent } = body as {
      formData: FormData;
      documentContent: string;
    };

    const FORMSPREE_ID = process.env.FORMSPREE_FORM_ID;

    if (!FORMSPREE_ID) {
      console.warn("FORMSPREE_FORM_ID not configured. Submission skipped.");
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Formspree belum dikonfigurasi.",
      });
    }

    const subject = `[Kebutuhan Bisnis Baru] dari ${formData.businessName || "Unknown"} - ${formData.industry || "Lainnya"}`;

    // Build JSON payload for Formspree
    const payload: Record<string, string> = {
      _subject: subject,
      _replyto: formData.contactEmail || "",
      "Nama Kontak / PIC": formData.contactName || "-",
      Email: formData.contactEmail || "-",
      "Nama Bisnis / Perusahaan": formData.businessName || "-",
      "Jenis Industri": formData.industry || "-",
      "Deskripsi Singkat": formData.businessDescription || "-",
      "Masalah Utama": formData.mainProblem || "-",
      "Solusi Saat Ini": formData.currentSolution || "-",
      "Dampak Bisnis": formData.businessImpact || "-",
      "Target Pengguna": formData.targetUsers || "-",
      "Estimasi Jumlah Pengguna": formData.estimatedUsers || "-",
      "Familiaritas Teknologi": formData.techFamiliarity || "-",
      Perangkat: formData.devices?.join(", ") || "-",
      "Fitur Utama":
        formData.features
          .filter((f) => f.name)
          .map((f) => `${f.name}: ${f.description}`)
          .join("\n") || "-",
      "Fitur Prioritas": formData.priorityFeatures || "-",
      "Fitur Khusus": formData.specialFeatures || "-",
      Integrasi: formData.integrations || "-",
      "Tujuan Utama": formData.mainGoal || "-",
      "Target Timeline": formData.targetTimeline || "-",
      "Estimasi Budget": getBudgetLabel(formData.budget) || "-",
      KPI: formData.kpi || "-",
      Deadline: formData.deadline || "-",
      "Dokumen (Markdown)": documentContent || "-",
    };

    // Submit to Formspree as JSON
    const formspreeRes = await fetch(
      `https://formspree.io/f/${FORMSPREE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (formspreeRes.ok) {
      console.log("Formspree submission successful");
      return NextResponse.json({
        success: true,
        emailSent: true,
        message: "Kebutuhan bisnis berhasil dikirim ke tim Prcuisa.",
      });
    } else {
      const errText = await formspreeRes.text();
      console.error("Formspree error:", formspreeRes.status, errText);
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Dokumen berhasil dibuat, namun gagal dikirim via Formspree.",
      });
    }
  } catch (error) {
    console.error("Error in submit-business:", error);
    return NextResponse.json(
      {
        success: false,
        emailSent: false,
        message: "Terjadi kesalahan saat mengirim data.",
      },
      { status: 500 }
    );
  }
}
