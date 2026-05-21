import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prcuisa | Kirim Kebutuhan Bisnis",
  description:
    "Ceritakan kebutuhan bisnis Anda dan tim Prcuisa akan membuatkan dokumen perencanaan pengembangan yang komprehensif.",
  keywords: [
    "kebutuhan bisnis",
    "pengembangan aplikasi",
    "AI",
    "bisnis Indonesia",
    "Prcuisa",
    "dokumen bisnis",
  ],
  authors: [{ name: "Prcuisa Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Prcuisa | Kirim Kebutuhan Bisnis",
    description:
      "Ceritakan kebutuhan bisnis Anda dan tim Prcuisa akan membuatkan dokumen perencanaan pengembangan yang komprehensif.",
    siteName: "Prcuisa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prcuisa | Kirim Kebutuhan Bisnis",
    description:
      "Ceritakan kebutuhan bisnis Anda dan tim Prcuisa akan membuatkan dokumen perencanaan pengembangan yang komprehensif.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
