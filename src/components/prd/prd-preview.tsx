"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Download,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Mail,
  Loader2,
} from "lucide-react";
import type { FormData } from "@/lib/prd-types";

interface PRDPreviewProps {
  content: string;
  isStreaming: boolean;
  businessName: string;
  formData: FormData;
  onBack: () => void;
  onReset: () => void;
}

type EmailStatus = "idle" | "sending" | "sent" | "no-smtp" | "error";

export function PRDPreview({
  content,
  isStreaming,
  businessName,
  formData,
  onBack,
  onReset,
}: PRDPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const hasAttemptedEmail = useState(false);

  const submitToPrcuisa = async (docContent: string) => {
    setEmailStatus("sending");
    try {
      const response = await fetch("/api/submit-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          documentContent: docContent,
        }),
      });

      const result = await response.json();

      if (result.success && result.emailSent) {
        setEmailStatus("sent");
      } else if (result.success && !result.emailSent) {
        setEmailStatus("no-smtp");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  };

  // After streaming completes, auto-submit email
  useEffect(() => {
    if (content && !isStreaming && hasAttemptedEmail[0] === false) {
      hasAttemptedEmail[1](true);
      const timer = setTimeout(() => setShowSuccess(true), 500);
      // Auto-send email after a short delay
      const emailTimer = setTimeout(() => {
        submitToPrcuisa(content);
      }, 1500);
      return () => {
        clearTimeout(timer);
        clearTimeout(emailTimer);
      };
    }
  }, [content, isStreaming]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = (format: "md" | "txt") => {
    let fileContent: string;
    let mimeType: string;
    let extension: string;

    if (format === "md") {
      fileContent = content;
      mimeType = "text/markdown";
      extension = "md";
    } else {
      fileContent = content;
      mimeType = "text/plain";
      extension = "txt";
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = (businessName || "Kebutuhan_Bisnis").replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
    link.download = `Kebutuhan_Bisnis_${safeName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isComplete = !!content && !isStreaming;

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {showSuccess && isComplete && (
        <div className="bg-[#e6f7f9] border border-[#c0ebf0] rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c0ebf0]">
            <CheckCircle2 className="w-6 h-6 text-[#009AA5]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#00464d]">
              Dokumen Kebutuhan Bisnis Berhasil Dibuat! 🎉
            </h3>
            <p className="text-sm text-[#00656d]">
              Dokumen Anda sudah siap. Anda bisa menyalin atau mengunduhnya.
            </p>
          </div>
        </div>
      )}

      {/* Email Status Banner */}
      {emailStatus === "sending" && (
        <div className="bg-[#e0f2fe] border border-[#bae6fd] rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Loader2 className="w-5 h-5 text-[#0ea5e9] animate-spin" />
          <div>
            <p className="text-sm font-medium text-[#0c4a6e]">
              Mengirim ke tim Prcuisa...
            </p>
            <p className="text-xs text-[#0369a1]">
              Mohon tunggu, data sedang dikirim.
            </p>
          </div>
        </div>
      )}

      {emailStatus === "sent" && (
        <div className="bg-[#e6f7f9] border border-[#c0ebf0] rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c0ebf0]">
            <Mail className="w-5 h-5 text-[#009AA5]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#00464d]">
              Kebutuhan bisnis Anda berhasil dikirim ke tim Prcuisa!
            </p>
            <p className="text-xs text-[#00656d]">
              Kami akan segera menghubungi Anda.
            </p>
          </div>
        </div>
      )}

      {emailStatus === "no-smtp" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Mail className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Email otomatis belum aktif
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Dokumen sudah berhasil dibuat. Silakan unduh file (.md / .txt) lalu kirim manual ke{" "}
              <a href="mailto:prcuisa@gmail.com" className="underline font-medium">prcuisa@gmail.com</a>.
            </p>
          </div>
        </div>
      )}

      {emailStatus === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Mail className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Gagal mengirim email otomatis
            </p>
            <p className="text-xs text-red-700 mt-1">
              Dokumen tetap bisa diunduh. Silakan kirim manual ke{" "}
              <a href="mailto:prcuisa@gmail.com" className="underline font-medium">prcuisa@gmail.com</a>.
            </p>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 font-[family-name:var(--font-space-grotesk)]">
            <FileText className="w-7 h-7 text-[#009AA5]" />
            Dokumen Kebutuhan Bisnis
          </h2>
          {businessName && (
            <p className="text-sm text-muted-foreground mt-1">
              Untuk: {businessName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isStreaming && (
            <Badge variant="secondary" className="gap-1.5 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-[#009AA5]" />
              Sedang menulis...
            </Badge>
          )}
          {isComplete && (
            <Badge variant="secondary" className="bg-[#e6f7f9] text-[#007780] border-[#c0ebf0] gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Selesai
            </Badge>
          )}
        </div>
      </div>

      {/* Document Preview */}
      <Card className="overflow-hidden glass-card">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Preview Dokumen</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!content}
                className="gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#009AA5]" />
                    <span className="text-[#009AA5]">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Salin
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[65vh]">
            <div className="p-6 md:p-8 max-w-4xl mx-auto">
              {content ? (
                <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-foreground prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-[#c0ebf0] prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4 prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-ul:my-2 prose-ol:my-2 prose-table:text-sm prose-th:bg-muted prose-th:p-2 prose-td:p-2 prose-th:text-left prose-table:border prose-table:border-collapse">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#c0ebf0] border-t-[#009AA5] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium">Menghubungi AI...</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Dokumen akan mulai muncul dalam beberapa detik
                    </p>
                  </div>
                </div>
              )}
              {isStreaming && content && (
                <span className="inline-block w-2 h-5 bg-[#009AA5] animate-pulse ml-1" />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Formulir
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Buat Baru
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleDownload("md")}
            disabled={!content}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Unduh Markdown (.md)
          </Button>
          <Button
            onClick={() => handleDownload("txt")}
            disabled={!content}
            className="gap-2 bg-gradient-to-r from-[#009AA5] to-[#0ea5e9] hover:from-[#008a94] hover:to-[#0284c7] text-white transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Unduh Teks (.txt)
          </Button>
        </div>
      </div>
    </div>
  );
}
