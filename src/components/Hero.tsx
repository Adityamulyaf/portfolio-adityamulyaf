"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".gsap-hero-item");
      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power4.out",
          delay: 0.1,
        }
      );
    }
  }, []);

  useEffect(() => {
    const button = buttonRef.current;
    const arrow = arrowRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull strength: button shifts 35%, arrow shifts 70% of cursor distance
      const buttonStrength = 0.35;
      const arrowStrength = 0.7;

      gsap.to(button, {
        x: x * buttonStrength,
        y: y * buttonStrength,
        duration: 0.3,
        ease: "power2.out",
      });

      if (arrow) {
        gsap.to(arrow, {
          x: x * arrowStrength,
          y: y * arrowStrength,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      // Elastic spring back to center
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });

      if (arrow) {
        gsap.to(arrow, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      }
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-md flex flex-col items-start w-full" id="hero">
      <div ref={containerRef} className="w-full max-w-[800px] text-left flex flex-col items-start">
        {/* Nameplate */}
        <h1 className="gsap-hero-item opacity-0 font-display-hero text-hero text-text-primary italic tracking-tight font-normal leading-none mb-sm">
          Hi, I&apos;m Ditya!
        </h1>

        {/* Descriptor */}
        <p className="gsap-hero-item opacity-0 font-body-md text-[20px] md:text-[28px] font-light text-secondary-fixed-dim leading-relaxed mb-xl max-w-[700px]">
          A Builder. Informatics student at{" "}
          <span className="text-on-surface italic font-normal">
            Universitas Sebelas Maret.
          </span>
        </p>

        {/* Call to action */}
        <div className="gsap-hero-item opacity-0">
          <a
            ref={buttonRef}
            href="#projects"
            className="font-body-md text-[15px] font-medium text-primary-container hover:text-accent-hover transition-colors inline-flex items-center gap-xs link-hover group"
            style={{ display: "inline-flex" }}
          >
            <span>See my work</span>{" "}
            <span
              ref={arrowRef}
              className="font-normal text-[22px] inline-block"
              style={{ display: "inline-block" }}
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
