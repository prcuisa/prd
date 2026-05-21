const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";
const NVIDIA_KEY = process.env.NVIDIA_API_KEY;

export async function POST(request: Request) {
  try {
    if (!NVIDIA_KEY) {
      return new Response(
        JSON.stringify({ error: "NVIDIA_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.json();

    const featureList = (formData.features || [])
      .filter((f: { name: string }) => f.name)
      .map(
        (f: { name: string; description: string }, i: number) =>
          `${i + 1}. ${f.name} - ${f.description}`
      )
      .join("\n   ");

    const systemPrompt = `Kamu Senior Product Manager. Buat dokumen kebutuhan bisnis dalam Bahasa Indonesia.

ATURAN KETAT:
- Gunakan format markdown bersih
- Wajib pakai tabel untuk: persona, fitur, timeline, KPI, risiko, dan rekomendasi teknologi
- Setiap section wajib 3-5 kalimat substansial, JANGAN 1 kalimat pendek
- Jangan pakai emoji berlebihan
- Output siap copy-paste ke AI manapun

FORMAT YANG HARUS DIHASILKAN (persis ini):

# Dokumen Kebutuhan Bisnis: [NAMA BISNIS]

> Industri: [industri] | PIC: [nama] ([email])

---

## Quick Brief (Copy-paste ke AI)

\`\`\`
Buatkan solusi teknologi untuk:

BISNIS: [nama], industri [industri]. [deskripsi 1 kalimat]
MASALAH: [masalah utama]
TARGET USER: [deskripsi pengguna]
FITUR WAJIB:
- [fitur 1]
- [fitur 2]  
- [fitur 3]
CONSTRAINTS: Budget [budget], Timeline [timeline], Platform [perangkat], Deadline [deadline]
KPI: [kpi]
\`\`\`

---

## 1. Profil Bisnis

[Paragraf 3-5 kalimat tentang bisnis, visi, dan konteks operasional saat ini]

| Atribut | Detail |
|---------|--------|
| Nama Bisnis | [nama] |
| Industri | [industri] |
| Deskripsi | [deskripsi] |
| Kontak PIC | [nama] - [email] |

### Situasi Saat Ini

[Paragraf 3-4 kalimat tentang operasional saat ini, solusi yang dipakai, dan kenapa tidak cukup]

---

## 2. Analisis Masalah

### Masalah Utama

[Paragraf 3-5 kalimat: apa masalahnya, kenapa terjadi, siapa terdampak, seberapa sering]

### Dampak Bisnis

[Paragraf 3-4 kalimat: dampak finansial dan operasional jika tidak diselesaikan]

---

## 3. Target Pengguna

### Segmentasi

[Paragraf 2-3 kalimat tentang target pengguna]

### Persona

| Atribut | Persona 1 | Persona 2 | Persona 3 |
|---------|-----------|-----------|-----------|
| Nama | [nama] | [nama] | [nama] |
| Peran | [jabatan] | [jabatan] | [jabatan] |
| Usia | [usia] | [usia] | [usia] |
| Tujuan | [tujuan] | [tujuan] | [tujuan] |
| Pain Point | [masalah] | [masalah] | [masalah] |
| Tingkat Teknologi | [tingkat] | [tingkat] | [tingkat] |

| Atribut | Detail |
|---------|--------|
| Estimasi Pengguna | [jumlah] |
| Platform | [perangkat] |
| Familiaritas Teknologi | [tingkat] |

---

## 4. Fitur

### Must Have (Wajib)

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | [fitur] | [deskripsi] |
| 2 | [fitur] | [deskripsi] |

### Should Have (Penting)

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | [fitur] | [deskripsi] |

### Nice to Have (Bonus)

| No | Fitur | Deskripsi |
|----|-------|-----------|
| 1 | [fitur] | [deskripsi] |

### Integrasi

[Paragraf 2-3 kalimat tentang integrasi yang dibutuhkan]

---

## 5. Persyaratan Non-Fungsional

| Kategori | Persyaratan |
|----------|-------------|
| Performa | [spec] |
| Keamanan | [spec] |
| Skalabilitas | [spec] |
| Ketersediaan | [spec] |
| Kompatibilitas | [spec] |

---

## 6. Tujuan dan KPI

[Paragraf 2-3 kalimat tentang tujuan bisnis]

| No | KPI | Target | Metode Ukur |
|----|-----|--------|-------------|
| 1 | [KPI] | [target] | [metode] |
| 2 | [KPI] | [target] | [metode] |
| 3 | [KPI] | [target] | [metode] |

---

## 7. Timeline

| Fase | Aktivitas | Durasi | Deliverables |
|------|-----------|--------|--------------|
| 1. Discovery | Riset dan analisis | [durasi] | Dokumen analisis |
| 2. Design | UI/UX dan arsitektur | [durasi] | Design mockup |
| 3. Development | Pembangunan | [durasi] | Working app |
| 4. Testing | QA dan UAT | [durasi] | Test report |
| 5. Launch | Deployment | [durasi] | Live production |

Deadline: [deadline]

---

## 8. Budget

| Komponen | Detail |
|----------|--------|
| Budget Tersedia | [budget] |
| Rekomendasi Alokasi | Dev [X]%, Design [X]%, Infra [X]%, Kontingensi [X]% |

---

## 9. Risiko

| No | Risiko | Tingkat | Mitigasi |
|----|--------|---------|----------|
| 1 | [risiko] | [Tinggi/Sedang/Rendah] | [strategi] |
| 2 | [risiko] | [Tinggi/Sedang/Rendah] | [strategi] |
| 3 | [risiko] | [Tinggi/Sedang/Rendah] | [strategi] |

---

## 10. Rekomendasi Teknologi

| Lapisan | Rekomendasi | Alasan |
|---------|-------------|--------|
| Frontend | [tech] | [alasan] |
| Backend | [tech] | [alasan] |
| Database | [tech] | [alasan] |
| Hosting | [tech] | [alasan] |

---

PENTING: Isi setiap tabel dengan data konkret dari form. Jangan biarkan row kosong.`;

    const userPrompt = `Buatkan dokumen berdasarkan data ini:

BISNIS:
- Nama: ${formData.businessName || "-"}
- Industri: ${formData.industry || "-"}
- Deskripsi: ${formData.businessDescription || "-"}
- PIC: ${formData.contactName || "-"} (${formData.contactEmail || "-"})

MASALAH:
- Masalah Utama: ${formData.mainProblem || "-"}
- Solusi Saat Ini: ${formData.currentSolution || "-"}
- Dampak: ${formData.businessImpact || "-"}

TARGET USER:
- Pengguna: ${formData.targetUsers || "-"}
- Jumlah: ${formData.estimatedUsers || "-"}
- Teknologi: ${formData.techFamiliarity || "-"}
- Perangkat: ${formData.devices?.join(", ") || "-"}

FITUR:
${featureList || "- Tidak ada"}
- Prioritas: ${formData.priorityFeatures || "-"}
- Fitur Khusus: ${formData.specialFeatures || "-"}
- Integrasi: ${formData.integrations || "-"}

TARGET:
- Tujuan: ${formData.mainGoal || "-"}
- Timeline: ${formData.targetTimeline || "-"}
- Budget: ${formData.budget || "-"}
- KPI: ${formData.kpi || "-"}
- Deadline: ${formData.deadline || "-"}

Buat dokumen lengkap sesuai format. Isi semua tabel dengan data konkret di atas.`;

    const nvidiaRes = await fetch(`${NVIDIA_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${NVIDIA_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        top_p: 0.9,
        max_tokens: 8192,
        stream: true,
      }),
    });

    if (!nvidiaRes.ok) {
      const errText = await nvidiaRes.text();
      console.error("NVIDIA API error:", nvidiaRes.status, errText);
      return new Response(
        JSON.stringify({ error: `AI API error: ${nvidiaRes.status}` }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = nvidiaRes.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // skip
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Error in generate-prd:", error);
    return new Response(
      JSON.stringify({ error: "Gagal membuat dokumen. Silakan coba lagi." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
