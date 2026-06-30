"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface MagicCircleIntroProps {
  onComplete: () => void;
}

export default function MagicCircleIntro({ onComplete }: MagicCircleIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const circleWrapperRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sembunyikan scrollbar pada body saat intro berlangsung
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const startIntro = () => {
    // Memutar sound effect
    const audio = new Audio("/sounds/magic-sound.mp3");
    audio.play().catch((err) => console.log("Audio playback blocked/failed:", err));

    // Menjalankan timeline GSAP untuk koordinasi transisi
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      }
    });

    // 1. Fade out tombol "Zoltraak"
    tl.to(buttonRef.current, { 
      opacity: 0, 
      scale: 0.8, 
      duration: 0.4, 
      ease: "power2.in", 
      display: "none" 
    });

    // 2. Fade & Scale In lingkaran sihir
    tl.fromTo(
      circleWrapperRef.current, 
      { opacity: 0, scale: 0.7 }, 
      { opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    );

    // 3. Jeda, lalu trigger Flash
    tl.to(
      flashOverlayRef.current,
      { 
        opacity: 1, 
        duration: 0.18, 
        ease: "power2.in"
      },
      "+=1.8" // Jeda waktu melihat lingkaran berputar sebelum meledak
    );

    // 4. Sembunyikan lingkaran sihir saat tertutup warna putih terang
    tl.set(circleWrapperRef.current, { display: "none" });

    // 5. Redupkan Flash + Trigger Gelombang Kejut (Shockwave) + Memudarkan kontainer utama
    tl.to(
      flashOverlayRef.current,
      { 
        opacity: 0, 
        duration: 0.8, 
        ease: "power2.out" 
      }
    );
    tl.to(
      containerRef.current,
      { 
        opacity: 0, 
        duration: 0.8, 
        ease: "power2.out" 
      },
      "<" // Mulai bersamaan dengan memudarnya flash
    );
    tl.fromTo(
      shockwaveRef.current,
      { scale: 0.1, opacity: 0.9 },
      { scale: 5, opacity: 0, duration: 1.1, ease: "power3.out" },
      "<"
    );
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
    >
      {/* Efek pendaran cahaya hangat halus di latar belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,rgba(250,234,208,0)_75%)] pointer-events-none z-0" />

      {/* Tombol Interaksi Awal "Zoltraak" */}
      <button
        ref={buttonRef}
        onClick={startIntro}
        className="z-20 font-display-hero italic text-[40px] sm:text-[64px] text-primary tracking-[0.15em] hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer pulsing-text px-lg py-md focus:outline-none"
      >
        Zoltraak
      </button>

      {/* Kontainer Utama Animasi Lingkaran Sihir (Dimulai dengan opacity 0) */}
      <div
        ref={circleWrapperRef}
        className="absolute flex items-center justify-center w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] md:w-[550px] md:h-[550px] aspect-square z-10 opacity-0"
      >
        {/* Lingkaran Sihir WebP dengan Animasi Rotasi dan Glow */}
        <div className="relative w-full h-full animate-rotate">
          <Image
            src="/magic-circle.webp"
            alt="Magic Circle"
            fill
            sizes="(max-width: 768px) 300px, (max-width: 1200px) 450px, 550px"
            priority
            className="object-contain filter-glow"
            style={{
              animation: "pulseGlow 2.5s ease-in-out infinite alternate"
            }}
          />
        </div>

        {/* Cincin luar bercahaya tambahan */}
        <div className="absolute inset-0 rounded-full border border-primary/10 blur-[2px] pointer-events-none animate-pulse-slow" />
      </div>

      {/* Efek Riak Gelombang Kejut (Shockwave) */}
      <div 
        ref={shockwaveRef}
        className="absolute w-[200px] h-[200px] rounded-full border-2 border-primary/30 pointer-events-none z-20 opacity-0"
        style={{ transformOrigin: "center center" }}
      />

      {/* Overlay Kilatan Cahaya (Flash) */}
      <div 
        ref={flashOverlayRef}
        className="absolute inset-0 bg-white opacity-0 pointer-events-none z-30"
      />

      {/* Menambahkan inline style untuk efek glow dan animasi pembantu */}
      <style jsx global>{`
        .pulsing-text {
          animation: textPulse 2s ease-in-out infinite alternate;
          text-shadow: 0 0 10px rgba(28, 46, 70, 0.1);
        }
        @keyframes textPulse {
          0% {
            opacity: 0.65;
            text-shadow: 0 0 5px rgba(28, 46, 70, 0.1);
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 20px rgba(28, 46, 70, 0.4), 0 0 8px rgba(43, 78, 114, 0.2);
          }
        }
        @keyframes pulseGlow {
          0% {
            filter: drop-shadow(0 0 5px rgba(28, 46, 70, 0.15)) brightness(0.98);
          }
          100% {
            filter: drop-shadow(0 0 20px rgba(28, 46, 70, 0.4)) drop-shadow(0 0 8px rgba(43, 78, 114, 0.25)) brightness(1.02);
          }
        }
        .animate-rotate {
          animation: rotateInfinite 1s linear infinite;
        }
        @keyframes rotateInfinite {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        @keyframes pulseSlow {
          0%, 100% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
