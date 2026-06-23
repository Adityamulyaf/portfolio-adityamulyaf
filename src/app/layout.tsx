import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic", "normal"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Firizqi Aditya Mulya | Intentional Builder",
  description: "Personal portfolio of Firizqi Aditya Mulya, an Informatika student at Universitas Sebelas Maret and cross-disciplinary builder coding in robotics, web, machine learning, and mobile apps.",
  authors: [{ name: "Firizqi Aditya Mulya" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetBrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col font-sans">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
