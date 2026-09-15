import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Limitless Sweet | Cafetería Temática & Repostería Inclusiva en Lima, Perú",
  description:
    "Cafetería temática en Miraflores, Lima especializada en repostería para personas con alergias e intolerancias alimentarias. 100% libre de gluten, opciones veganas y sin azúcar en un ambiente único.",
  openGraph: {
    title: "Limitless Sweet | Cafetería Temática & Repostería Inclusiva en Lima, Perú",
    description:
      "Cafetería temática en Miraflores, Lima especializada en repostería para personas con alergias e intolerancias alimentarias. 100% libre de gluten, opciones veganas y sin azúcar en un ambiente único.",
    url: "https://limitless-sweet.com",
    siteName: "Limitless Sweet",
    locale: "es_PE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE" className="scroll-smooth">
      <body
        className={cn(
          fraunces.variable,
          inter.variable,
          "min-h-screen bg-cream text-ink font-body antialiased selection:bg-yellow-light selection:text-ink"
        )}
      >
        {children}
      </body>
    </html>
  );
}
