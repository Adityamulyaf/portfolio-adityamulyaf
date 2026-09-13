"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useDecodedAudio } from "@/lib/useDecodedAudio";

/**
 * How long the loading screen waits for the sound to finish decoding before
 * revealing the button anyway, so a stalled fetch can't strand a visitor.
 */
const MAX_WAIT_MS = 8000;

/**
 * How long the audio clock has to start ticking before the animation stops
 * waiting on it and runs silently. Covers a refused or never-settling
 * resume(), which would otherwise freeze the intro permanently.
 */
const SILENT_FALLBACK_MS = 400;

interface MagicCircleIntroProps {
  onComplete: () => void;
}

export default function MagicCircleIntro({ onComplete }: MagicCircleIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const circleWrapperRef = useRef<HTMLDivElement>(null);
  const flashOverlayRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const { status: audioStatus, start: startAudio } = useDecodedAudio(
    "/sounds/magic-sound.mp3"
  );
  // Flips true if decoding is still going after MAX_WAIT_MS, so a stalled
  // fetch reveals the button instead of trapping the visitor on a loader.
  const [forceReady, setForceReady] = useState(false);
  const readyToInteract = audioStatus !== "loading" || forceReady;
  const startedRef = useRef(false);

  useEffect(() => {
    if (audioStatus !== "loading") return;
    const id = setTimeout(() => setForceReady(true), MAX_WAIT_MS);
    return () => clearTimeout(id);
  }, [audioStatus]);

  useEffect(() => {
    // Sembunyikan scrollbar pada body saat intro berlangsung
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const finish = () => {
    document.body.style.overflow = "";
    onComplete();
  };

  const run = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    // elapsed() reports seconds since the first sample actually left, or is
    // null when there is no sound — in which case the timeline keeps its own
    // time and the intro plays silently.
    const elapsed = startAudio();

    // Fired immediately, outside the audio-gated timeline below: this fade is
    // purely cosmetic and has no cue to hit, so it shouldn't sit frozen for
    // however long resume() takes. Without this, a click felt unresponsive
    // for that whole stretch even though the sound itself started as fast as
    // it could.
    gsap.to(buttonRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      display: "none",
    });

    // Menjalankan timeline GSAP untuk koordinasi transisi
    const tl = gsap.timeline({
      paused: elapsed !== null,
      onComplete: elapsed === null ? finish : undefined,
    });

    // 1. Fade & Scale In lingkaran sihir (mulai detik 0.2, selesai detik 1.1)
    tl.fromTo(
      circleWrapperRef.current,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
      0.2
    );

    // 2. Trigger Flash (mulai detik 1.32, selesai detik 1.5 untuk menyesuaikan sound effect)
    tl.to(
      flashOverlayRef.current,
      { 
        opacity: 1, 
        duration: 0.18, 
        ease: "power2.in"
      },
      1.32
    );

    // 3. Sembunyikan lingkaran sihir saat layar putih (tepat detik 1.5)
    tl.set(circleWrapperRef.current, { display: "none" }, 1.5);

    // 4. Redupkan Flash + Trigger Gelombang Kejut (Shockwave) + Memudarkan kontainer utama (mulai detik 1.5)
    tl.to(
      flashOverlayRef.current,
      { 
        opacity: 0, 
        duration: 0.7, 
        ease: "power2.out" 
      },
      1.5
    );
    tl.to(
      containerRef.current,
      { 
        opacity: 0, 
        duration: 0.7, 
        ease: "power2.out" 
      },
      1.5
    );
    tl.fromTo(
      shockwaveRef.current,
      { scale: 0.1, opacity: 0.9 },
      { scale: 5, opacity: 0, duration: 1.0, ease: "power3.out" },
      1.5
    );

    if (!elapsed) {
      tl.play();
      return;
    }

    // Drive the timeline from the audio clock instead of letting it run on its
    // own. The cue at 1.5s is then 1.5s *of sound*, so the flash cannot drift
    // away from the climax over the two seconds it takes to get there.
    const total = tl.duration();
    const clickedAt = performance.now();

    // A context that has not resumed yet reports a frozen clock, which is the
    // right thing to wait on — for a moment. But resume() can also be refused
    // outright, or never settle, and a timeline slaved to a clock that never
    // starts would leave the reader stranded on the intro forever. So the
    // audio clock gets a short grace period to prove it is running, and if it
    // does not, the animation goes on without it.
    const releaseTimeline = () => {
      gsap.ticker.remove(sync);
      tl.eventCallback("onComplete", finish);
      tl.play();
    };

    const sync = () => {
      const t = elapsed();

      if (t <= 0) {
        if (performance.now() - clickedAt > SILENT_FALLBACK_MS) releaseTimeline();
        return;
      }
      if (t >= total) {
        gsap.ticker.remove(sync);
        tl.time(total, true);
        finish();
        return;
      }
      tl.time(t, true);
    };

    sync(); // render frame zero now rather than a tick from now
    gsap.ticker.add(sync);
  };

  /**
   * The button only exists once readyToInteract is true, so this is mostly a
   * defensive guard against a click landing in the same tick that flips it.
   */
  const startIntro = () => {
    if (startedRef.current || !readyToInteract) return;
    run();
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden"
    >
      {/* Efek pendaran cahaya hangat halus di latar belakang */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,rgba(250,234,208,0)_75%)] pointer-events-none z-0" />

      {/* Tombol Interaksi Awal "Zoltraak" — baru muncul setelah sound siap
          diputar, supaya tidak ada yang bisa diklik sebelum itu. */}
      {readyToInteract ? (
        <button
          ref={buttonRef}
          // click only: pointerdown/touchstart looked like a free latency win,
          // but iOS Safari (and some other mobile browsers) don't reliably
          // treat that event as a valid gesture for unlocking Web Audio.
          // run() only ever fires once, so when pointerdown's resume() call
          // was silently ignored there, the click that followed — the one
          // that *would* have worked — got skipped as an already-started
          // intro. The animation still played, just silently.
          onClick={startIntro}
          className="z-20 font-display italic text-h2 text-primary tracking-[0.08em] transition-all duration-300 relative pulsing-text px-lg py-md focus:outline-none cursor-pointer hover:scale-105 active:scale-95"
        >
          Adityamulyaf
        </button>
      ) : (
        <div
          role="status"
          aria-live="polite"
          className="z-20 flex items-center gap-3 px-lg py-md"
        >
          <span className="sr-only">Memuat</span>
          {/* Three sparks charging up left to right, echoing the magic
              circle's own glow instead of a generic spinner. */}
          <span className="spark-dot" style={{ animationDelay: "0ms" }} />
          <span className="spark-dot" style={{ animationDelay: "180ms" }} />
          <span className="spark-dot" style={{ animationDelay: "360ms" }} />
        </div>
      )}

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
          animation: rotateInfinite 15s linear infinite;
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
        .spark-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: var(--color-primary);
          animation: sparkCharge 1.4s ease-in-out infinite;
        }
        @keyframes sparkCharge {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.7);
            filter: drop-shadow(0 0 2px rgba(28, 46, 70, 0.15));
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
            filter: drop-shadow(0 0 8px rgba(28, 46, 70, 0.45)) drop-shadow(0 0 4px rgba(43, 78, 114, 0.35));
          }
        }
      `}</style>
    </div>
  );
}
