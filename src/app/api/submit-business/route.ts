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

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.warn("Telegram credentials not configured.");
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Telegram belum dikonfigurasi.",
      });
    }

    const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
    const safeName =
      (formData.businessName || "Bisnis")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "_") || "Bisnis";

    // ── 1. Send text message with form summary ──
    const summary = [
      `<b>🚀 Kebutuhan Bisnis Baru</b>`,
      `<i>Diterima dari formulir Prcuisa.com</i>`,
      ``,
      `<b>═══ INFORMASI KONTAK ═══</b>`,
      `👤 Nama: ${formData.contactName || "-"}`,
      `📧 Email: ${formData.contactEmail || "-"}`,
      ``,
      `<b>═══ INFORMASI BISNIS ═══</b>`,
      `🏢 Bisnis: ${formData.businessName || "-"}`,
      `🏭 Industri: ${formData.industry || "-"}`,
      `📝 Deskripsi: ${formData.businessDescription || "-"}`,
      ``,
      `<b>═══ MASALAH & TARGET ═══</b>`,
      `❓ Masalah: ${formData.mainProblem || "-"}`,
      `💡 Solusi Saat Ini: ${formData.currentSolution || "-"}`,
      `📊 Dampak: ${formData.businessImpact || "-"}`,
      `🎯 Target User: ${formData.targetUsers || "-"}`,
      `👥 Jumlah User: ${formData.estimatedUsers || "-"}`,
      `📱 Perangkat: ${formData.devices?.join(", ") || "-"}`,
      ``,
      `<b>═══ FITUR ═══</b>`,
      ...formData.features
        .filter((f) => f.name)
        .map((f) => `  ▫️ ${f.name}: ${f.description}`),
      `📌 Prioritas: ${formData.priorityFeatures || "-"}`,
      `✨ Fitur Khusus: ${formData.specialFeatures || "-"}`,
      `🔗 Integrasi: ${formData.integrations || "-"}`,
      ``,
      `<b>═══ TARGET & BUDGET ═══</b>`,
      `🎯 Tujuan: ${formData.mainGoal || "-"}`,
      `📅 Timeline: ${formData.targetTimeline || "-"}`,
      `💰 Budget: ${getBudgetLabel(formData.budget) || "-"}`,
      `📈 KPI: ${formData.kpi || "-"}`,
      `⏰ Deadline: ${formData.deadline || "-"}`,
    ].join("\n");

    await fetch(`${TG_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: summary,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    // ── 2. Send .md file as Telegram document ──
    const mdBuffer = Buffer.from(documentContent, "utf-8");
    const mdForm = new FormData();
    mdForm.append("chat_id", CHAT_ID);
    mdForm.append("document", new Blob([mdBuffer], { type: "text/markdown" }), `Kebutuhan_Bisnis_${safeName}.md`);
    mdForm.append("caption", `📄 Dokumen lengkap: ${formData.businessName || "Bisnis"} - ${formData.industry || "-"}`);

    await fetch(`${TG_API}/sendDocument`, {
      method: "POST",
      body: mdForm,
    });

    // ── 3. Send .txt file as Telegram document ──
    const txtBuffer = Buffer.from(documentContent, "utf-8");
    const txtForm = new FormData();
    txtForm.append("chat_id", CHAT_ID);
    txtForm.append("document", new Blob([txtBuffer], { type: "text/plain" }), `Kebutuhan_Bisnis_${safeName}.txt`);
    txtForm.append("caption", `📝 Versi teks: ${formData.businessName || "Bisnis"} - ${formData.industry || "-"}`);

    await fetch(`${TG_API}/sendDocument`, {
      method: "POST",
      body: txtForm,
    });

    console.log("Telegram: Message + 2 files sent successfully");

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: "Kebutuhan bisnis berhasil dikirim ke tim Prcuisa via Telegram!",
    });
  } catch (error) {
    console.error("Error in submit-business:", error);
    return NextResponse.json(
      {
        success: false,
        emailSent: false,
        message: "Gagal mengirim data.",
      },
      { status: 500 }
    );
  }
}
