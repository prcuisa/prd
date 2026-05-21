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

    const systemPrompt = `Kamu adalah seorang Product Manager profesional yang berpengalaman di Indonesia. 
Tugasmu adalah membuat dokumen perencanaan pengembangan yang komprehensif dan profesional 
berdasarkan informasi kebutuhan bisnis yang diberikan oleh pengguna.

Dokumen harus ditulis dalam Bahasa Indonesia dengan format dan struktur yang jelas. 
Gunakan bahasa yang profesional namun mudah dipahami oleh orang non-teknis.

Struktur dokumen yang harus dihasilkan:

# Dokumen Kebutuhan Bisnis & Perencanaan Pengembangan

## 1. Ringkasan Eksekutif
## 2. Latar Belakang Bisnis
## 3. Definisi Masalah
## 4. Target Pengguna & Persona (buat 2-3 persona)
## 5. Persyaratan Fungsional (Fitur) — klasifikasi Must Have, Should Have, Nice to Have
## 6. Persyaratan Non-Fungsional (Performa, Keamanan, Skalabilitas, dll)
## 7. Integrasi Sistem
## 8. Tujuan & KPI
## 9. Estimasi Budget & Sumber Daya
## 10. Timeline & Milestone
## 11. Prioritas Fitur & Rekomendasi MVP
## 12. Risiko & Mitigasi
## 13. Rekomendasi Teknis
## 14. Lampiran

Gunakan formatting markdown yang rapi. Pastikan setiap bagian memiliki konten substansial.`;

    const userPrompt = `Buatkan dokumen kebutuhan bisnis berdasarkan data berikut:

**Informasi Bisnis:**
- Nama Bisnis: ${formData.businessName}
- Industri: ${formData.industry}
- Deskripsi: ${formData.businessDescription}
- Kontak: ${formData.contactName} (${formData.contactEmail})

**Masalah:**
- Masalah Utama: ${formData.mainProblem}
- Solusi Saat Ini: ${formData.currentSolution}
- Dampak: ${formData.businessImpact}

**Target Pengguna:**
- Pengguna: ${formData.targetUsers}
- Jumlah: ${formData.estimatedUsers}
- Familiaritas Teknologi: ${formData.techFamiliarity}
- Perangkat: ${formData.devices?.join(", ") || ""}

**Fitur:**
${(formData.features || []).map((f: { name: string; description: string }, i: number) => `- ${f.name}: ${f.description}`).join("\n")}
- Prioritas: ${formData.priorityFeatures}
- Fitur Khusus: ${formData.specialFeatures}
- Integrasi: ${formData.integrations}

**Tujuan & Target:**
- Tujuan: ${formData.mainGoal}
- Timeline: ${formData.targetTimeline}
- Budget: ${formData.budget}
- KPI: ${formData.kpi}
- Deadline: ${formData.deadline}`;

    // Call NVIDIA API with streaming (standard OpenAI SSE format)
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
        temperature: 0.7,
        top_p: 1,
        max_tokens: 4096,
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

    // Stream SSE from NVIDIA directly to client
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
            // Parse SSE lines for content
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
                // skip malformed JSON
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
