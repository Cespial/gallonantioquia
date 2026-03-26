import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "600"],
  display: "swap",
});

const jacked = localFont({
  src: "../fonts/Jacked_Font.ttf",
  variable: "--font-jacked",
  display: "swap",
});

const thorce = localFont({
  src: "../fonts/Thorce.otf",
  variable: "--font-thorce",
  display: "swap",
});

const myriadPro = localFont({
  src: "../fonts/MyriadPro-Regular.otf",
  variable: "--font-myriad",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gallón Antioquia — Conversaciones para Antioquia",
    template: "%s | Gallón Antioquia",
  },
  description:
    "Una plataforma de pensamiento, territorio y liderazgo para Antioquia. Historias, ideas, conversaciones y liderazgo regional.",
  keywords: [
    "Antioquia",
    "infraestructura Antioquia",
    "vías Antioquia",
    "desarrollo rural",
    "Suroeste antioqueño",
    "Tren Multipropósito",
    "conectividad rural",
    "líderes Antioquia",
    "Horacio Gallón",
    "Andes Antioquia",
  ],
  openGraph: {
    title: "Gallón Antioquia — Conversaciones para Antioquia",
    description:
      "Una plataforma de pensamiento, territorio y liderazgo para Antioquia.",
    url: "https://www.gallonantioquia.com",
    siteName: "Gallón Antioquia",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallón Antioquia — Conversaciones para Antioquia",
    description:
      "Una plataforma de pensamiento, territorio y liderazgo para Antioquia.",
    creator: "@GallonHoracio",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${playfair.variable} ${sourceSerif.variable} ${jacked.variable} ${thorce.variable} ${myriadPro.variable} font-body antialiased bg-arena text-texto-principal`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
