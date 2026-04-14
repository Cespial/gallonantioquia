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
  metadataBase: new URL("https://gallonantioquia.vercel.app"),
  title: {
    default: "Gallón Memorias — Memorias de Antioquia",
    template: "%s | Gallón Memorias",
  },
  description:
    "Memorias, reflexiones y conversaciones sobre Antioquia. Columnas, historias, ideas y diálogos desde el territorio.",
  keywords: [
    "Antioquia",
    "memorias Antioquia",
    "columnas opinión",
    "conversaciones",
    "desarrollo rural",
    "Suroeste antioqueño",
    "líderes Antioquia",
    "Horacio Gallón",
    "Andes Antioquia",
  ],
  openGraph: {
    title: "Gallón Memorias — Memorias de Antioquia",
    description:
      "Memorias, reflexiones y conversaciones sobre Antioquia.",
    url: "https://gallonantioquia.vercel.app",
    siteName: "Gallón Memorias",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallón Memorias — Memorias de Antioquia",
    description:
      "Memorias, reflexiones y conversaciones sobre Antioquia.",
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
        className={`${playfair.variable} ${sourceSerif.variable} ${jacked.variable} ${thorce.variable} ${myriadPro.variable} font-body antialiased bg-arena text-texto-principal grain-overlay`}
      >
        <a href="#main-content" className="skip-link">
          Saltar al contenido
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
