import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MetaPixel } from "@/components/MetaPixel";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "ALLROUND.IMMO · Webinar — Bewerte Immobilien-Deals wie ein institutioneller Investor",
  description:
    "Kostenloses Webinar: Wie du mit dem KI-System von ALLROUND.IMMO Cashflow, Rendite und Risiko jedes Objekts sofort sichtbar machst — und in einer Demo ein reales Inserat in Minuten durchrechnest.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${manrope.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
