"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Project } from "../data/projects";

interface ProjectDetailsProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetails({ project, onClose }: ProjectDetailsProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rollTopRef = useRef<HTMLDivElement>(null);
  const rollBottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // FIX #2: ref for the scrollable parchment body
  const parchmentBodyRef = useRef<HTMLDivElement>(null);
  const isClosingRef = useRef(false);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);

  // --- Open Animation ---
  useEffect(() => {
    if (!project) return;
    isClosingRef.current = false;

    // Lock body scroll so the page behind doesn't scroll
    document.body.style.overflow = "hidden";

    // Reset scroll position on new project open
    if (parchmentBodyRef.current) {
      parchmentBodyRef.current.scrollTop = 0;
    }

    // Kill any leftover timeline
    if (openTlRef.current) openTlRef.current.kill();

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    openTlRef.current = tl;

    // 1. Show backdrop
    gsap.set(backdropRef.current, { display: "flex" });
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 });

    // 2. Scroll container unfurls from center (scaleY)
    tl.fromTo(
      scrollContainerRef.current,
      { scaleY: 0.02, opacity: 0 },
      { scaleY: 1, opacity: 1, duration: 0.7, ease: "expo.out" },
      "<0.1"
    );

    // 3. Rolls slide out from center
    tl.fromTo(
      rollTopRef.current,
      { y: "50%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.55, ease: "expo.out" },
      "<0.15"
    );
    tl.fromTo(
      rollBottomRef.current,
      { y: "-50%", opacity: 0 },
      { y: "0%", opacity: 1, duration: 0.55, ease: "expo.out" },
      "<"
    );

    // 4. Content children stagger fade-in
    if (contentRef.current) {
      const children = contentRef.current.querySelectorAll(".scroll-item");
      tl.fromTo(
        children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" },
        "<0.15"
      );
    }

    return () => {
      tl.kill();
      // Restore body scroll if component unmounts while open
      document.body.style.overflow = "";
    };
  }, [project]);

  const handleClose = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    // Kill open timeline if still playing
    if (openTlRef.current) openTlRef.current.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(backdropRef.current, { display: "none" });
        // Restore body scroll after modal is fully closed
        document.body.style.overflow = "";
        onClose();
      },
    });

    // Slower, more dramatic close — content fades out first
    if (contentRef.current) {
      const children = contentRef.current.querySelectorAll(".scroll-item");
      tl.to(children, {
        opacity: 0,
        y: 10,
        duration: 0.25,
        stagger: 0.025,
        ease: "power2.in",
      });
    }

    // FIX #1: Rolls collapse inward with more time to see them move
    tl.to(
      rollTopRef.current,
      { y: "50%", opacity: 0, duration: 0.45, ease: "expo.in" },
      "<0.05"
    );
    tl.to(
      rollBottomRef.current,
      { y: "-50%", opacity: 0, duration: 0.45, ease: "expo.in" },
      "<"
    );

    // FIX #1: Scroll body collapses — longer and more visible
    tl.to(
      scrollContainerRef.current,
      { scaleY: 0.02, opacity: 0, duration: 0.6, ease: "expo.in" },
      "<0.08"
    );

    // Backdrop fades after scroll has mostly collapsed
    tl.to(backdropRef.current, { opacity: 0, duration: 0.3 }, "<0.3");
  };

  // --- Keyboard ESC close ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 items-center justify-center p-4 md:p-8"
      style={{ display: "none" }}
      onClick={(e) => {
        if (e.target === backdropRef.current) handleClose();
      }}
    >
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[6px]" />

      {/* Scroll wrapper — transform origin at center for unfurl effect */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 w-full max-w-[680px] max-h-[90vh] flex flex-col"
        style={{ transformOrigin: "center center", opacity: 0 }}
      >
        {/* Roll — Top (wooden rod visual) */}
        <div
          ref={rollTopRef}
          className="relative z-20 w-full h-[32px] flex-shrink-0"
          style={{ opacity: 0 }}
        >
          <div
            className="w-full h-full"
            style={{
              borderRadius: "50% / 100% 100% 0 0",
              background: "linear-gradient(to bottom, #E2C07A, #C8A050, #A07830, #C8A050, #B89040)",
              boxShadow:
                "0 6px 20px rgba(0,0,0,0.4), inset 0 3px 6px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.2)",
            }}
          />
        </div>

        {/* Parchment Body — flex-1 min-h-0 is critical: lets it fill remaining height and actually overflow-scroll */}
        <div
          ref={parchmentBodyRef}
          className="relative flex flex-col flex-1 min-h-0 overflow-y-auto"
          style={{
            background: "linear-gradient(160deg, #F7EAC8 0%, #EDDA9F 30%, #F0E0A8 60%, #E8D49A 100%)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.5), inset 6px 0 18px rgba(0,0,0,0.05), inset -6px 0 18px rgba(0,0,0,0.05)",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Vignette edge shadow */}
          <div
            className="sticky top-0 pointer-events-none z-10 h-0"
            style={{ overflow: "visible" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                height: "100vh",
                background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.1) 100%)",
              }}
            />
          </div>

          {/* Subtle ruled paper lines */}
          <div
            className="absolute inset-0 pointer-events-none z-[1] opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(139,110,60,0.15) 28px)",
            }}
          />

          {/* All scrollable content */}
          <div
            ref={contentRef}
            className="relative z-[2] px-8 py-10 md:px-12 flex flex-col gap-6"
          >
            {/* ── Header bar ── */}
            <div className="scroll-item flex justify-between items-center">
              <div
                className="font-mono-label text-[10px] uppercase tracking-[0.14em]"
                style={{ color: "#8B6E3C" }}
              >
                ✦ Codex Entry ✦
              </div>
              <button
                onClick={handleClose}
                className="font-mono-label text-[10px] uppercase tracking-widest transition-opacity hover:opacity-50 focus:outline-none cursor-pointer"
                style={{ color: "#8B6E3C" }}
              >
                [ Close Scroll ]
              </button>
            </div>

            {/* Top ornamental divider */}
            <div className="scroll-item flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(139,110,60,0.3)" }} />
              <span className="text-[13px]" style={{ color: "rgba(139,110,60,0.5)" }}>
                ⬡
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(139,110,60,0.3)" }} />
            </div>

            {/* Domain */}
            <div className="scroll-item">
              <span
                className="font-mono-label text-[10px] uppercase tracking-[0.14em] block"
                style={{ color: "#8B6E3C" }}
              >
                {project?.domain}
              </span>
            </div>

            {/* Title */}
            <div className="scroll-item">
              <h2
                className="font-display-hero text-[44px] md:text-[58px] italic leading-none font-normal"
                style={{ color: "#2A1A06", textShadow: "1px 2px 0 rgba(139,110,60,0.15)" }}
              >
                {project?.title}
              </h2>
            </div>

            {/* Stack tags */}
            <div className="scroll-item flex flex-wrap gap-2">
              {project?.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono-label text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{
                    color: "#6B4F1E",
                    borderColor: "rgba(139,110,60,0.35)",
                    background: "rgba(139,110,60,0.08)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* ── Overview divider ── */}
            <div className="scroll-item flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(139,110,60,0.22)" }} />
              <span
                className="font-mono-label text-[9px] tracking-[0.22em] uppercase"
                style={{ color: "rgba(139,110,60,0.6)" }}
              >
                Overview
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(139,110,60,0.22)" }} />
            </div>

            {/* Overview */}
            <div className="scroll-item">
              <p
                className="font-body-md text-[15px] leading-relaxed"
                style={{ color: "#3D2B0E" }}
              >
                {project?.details.overview}
              </p>
            </div>

            {/* Challenge & Solution */}
            <div className="scroll-item grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span
                  className="font-mono-label text-[10px] uppercase tracking-[0.12em] block mb-2"
                  style={{ color: "#8B6E3C" }}
                >
                  ⚔ The Challenge
                </span>
                <p
                  className="font-body-sm text-[13px] leading-relaxed"
                  style={{ color: "#5C3D14" }}
                >
                  {project?.details.challenge}
                </p>
              </div>
              <div>
                <span
                  className="font-mono-label text-[10px] uppercase tracking-[0.12em] block mb-2"
                  style={{ color: "#8B6E3C" }}
                >
                  ✦ The Solution
                </span>
                <p
                  className="font-body-sm text-[13px] leading-relaxed"
                  style={{ color: "#5C3D14" }}
                >
                  {project?.details.solution}
                </p>
              </div>
            </div>

            {/* Project Image */}
            <div className="scroll-item">
              <span
                className="font-mono-label text-[10px] uppercase tracking-[0.12em] block mb-2"
                style={{ color: "#8B6E3C" }}
              >
                ❮□❯ Preview
              </span>
              <div
                className="relative w-full rounded-lg overflow-hidden border"
                style={{
                  borderColor: "rgba(139,110,60,0.3)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.3)",
                  aspectRatio: "16 / 9",
                }}
              >
                {project?.imageUrl && (
                  <Image
                    src={project.imageUrl}
                    alt={project.title ?? "Project preview"}
                    fill
                    sizes="(max-width: 768px) 90vw, 640px"
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            {/* ── FIX #3: CTA Links — Repo + Live ── */}
            <div className="scroll-item flex flex-wrap items-center gap-x-6 gap-y-3 mt-2">
              {/* Visit Repo — always visible */}
              <a
                href={project?.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body-md text-[14px] font-medium inline-flex items-center gap-2 group transition-opacity hover:opacity-60"
                style={{ color: "#5C3D14" }}
              >
                <span
                  className="underline underline-offset-4"
                  style={{ textDecorationColor: "rgba(139,110,60,0.5)" }}
                >
                  View Repository
                </span>
                <span className="transition-transform duration-300 group-hover:translate-x-1 text-[17px]">
                  →
                </span>
              </a>

              {/* Visit Live — only if liveUrl exists */}
              {project?.liveUrl && (
                <>
                  <span
                    className="font-mono-label text-[10px]"
                    style={{ color: "rgba(139,110,60,0.4)" }}
                  >
                    ·
                  </span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-md text-[14px] font-medium inline-flex items-center gap-2 group transition-opacity hover:opacity-60"
                    style={{ color: "#5C3D14" }}
                  >
                    <span
                      className="underline underline-offset-4"
                      style={{ textDecorationColor: "rgba(139,110,60,0.5)" }}
                    >
                      Visit Live
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1 text-[17px]">
                      ↗
                    </span>
                  </a>
                </>
              )}
            </div>

            {/* Bottom decorative seal */}
            <div className="scroll-item flex flex-col items-center gap-2 pt-4 pb-2">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px" style={{ background: "rgba(139,110,60,0.22)" }} />
                <span className="text-[22px]" style={{ color: "rgba(139,110,60,0.35)" }}>
                  ❧
                </span>
                <div className="flex-1 h-px" style={{ background: "rgba(139,110,60,0.22)" }} />
              </div>
              <span
                className="font-mono-label text-[9px] uppercase tracking-[0.22em]"
                style={{ color: "rgba(139,110,60,0.35)" }}
              >
                End of Record
              </span>
            </div>
          </div>
        </div>

        {/* Roll — Bottom (wooden rod visual) */}
        <div
          ref={rollBottomRef}
          className="relative z-20 w-full h-[32px] flex-shrink-0"
          style={{ opacity: 0 }}
        >
          <div
            className="w-full h-full"
            style={{
              borderRadius: "0 0 50% 50% / 0 0 100% 100%",
              background: "linear-gradient(to top, #E2C07A, #C8A050, #A07830, #C8A050, #B89040)",
              boxShadow:
                "0 -6px 20px rgba(0,0,0,0.4), inset 0 -3px 6px rgba(255,255,255,0.25), inset 0 3px 6px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
