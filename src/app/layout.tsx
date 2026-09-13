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
  title: "Firizqi Aditya Mulya | Portfolio",
  description: "Personal portfolio of Firizqi Aditya Mulya",
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
      className={`${instrumentSerif.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* The intro sound is fetched and decoded by MagicCircleIntro, but that
            cannot begin until React has hydrated. Starting the download with
            the document buys those seconds back, so the sound is usually
            already in memory by the time anyone can click.
            No crossOrigin here: this is a same-origin file, and useDecodedAudio's
            fetch() uses default (same-origin) credentials — a mismatched
            crossorigin attribute makes Chrome treat this as a different request
            and reload it from scratch instead of reusing the preload. */}
        <link
          rel="preload"
          as="fetch"
          href="/sounds/magic-sound.mp3"
          type="audio/mpeg"
        />
      </head>
      <body
        className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col font-sans"
        suppressHydrationWarning
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
