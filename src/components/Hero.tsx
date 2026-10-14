"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero({ active = true }: { active?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const cvButtonRef = useRef<HTMLAnchorElement>(null);
  const cvIconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (active && containerRef.current) {
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
  }, [active]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const buttonStrength = 0.25;

      gsap.to(button, {
        x: x * buttonStrength,
        y: y * buttonStrength,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      // Elastic spring back to center
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const cvButton = cvButtonRef.current;
    const cvIcon = cvIconRef.current;
    if (!cvButton) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cvButton.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const buttonStrength = 0.25;
      const iconStrength = 0.5;

      gsap.to(cvButton, {
        x: x * buttonStrength,
        y: y * buttonStrength,
        duration: 0.3,
        ease: "power2.out",
      });

      if (cvIcon) {
        gsap.to(cvIcon, {
          x: x * iconStrength,
          y: y * iconStrength,
          duration: 0.35,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cvButton, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)",
      });

      if (cvIcon) {
        gsap.to(cvIcon, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        });
      }
    };

    cvButton.addEventListener("mousemove", handleMouseMove);
    cvButton.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cvButton.removeEventListener("mousemove", handleMouseMove);
      cvButton.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-md flex flex-col items-start w-full" id="hero">
      <div ref={containerRef} className="w-full max-w-[800px] text-left flex flex-col items-start">
        {/* Nameplate */}
        <h1 className="gsap-hero-item opacity-0 font-display text-display italic text-text-primary mb-sm">
          Hi, I&apos;m Ditya!
        </h1>

        {/* Descriptor */}
        <p className="gsap-hero-item opacity-0 font-body text-lead font-light text-secondary-fixed-dim mb-xl max-w-[60ch]">
          I build autonomous vehicles, AI models, and whatever seems interesting.
        </p>

        {/* Call to action */}
        <div className="gsap-hero-item opacity-0 flex flex-wrap items-center gap-md">
          <a
            ref={buttonRef}
            href="#projects"
            className="font-body text-small font-medium text-[#FAEAD0] bg-primary-container hover:bg-accent-hover hover:text-white rounded-full px-5 py-2.5 transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md cursor-pointer"
            style={{ display: "inline-flex" }}
          >
            <span>See my work</span>
          </a>

          <a
            ref={cvButtonRef}
            href="/cv/Firizqi%20Aditya%20Mulya%20-%20CV.pdf"
            download="Firizqi Aditya Mulya - CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-small font-medium text-primary-container hover:text-white bg-primary-container/10 hover:bg-primary-container border border-primary-container/25 hover:border-transparent rounded-full px-5 py-2.5 transition-all duration-300 inline-flex items-center gap-2 group shadow-sm hover:shadow cursor-pointer"
            style={{ display: "inline-flex" }}
          >
            <svg
              ref={cvIconRef}
              className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download CV</span>
          </a>
        </div>
      </div>
    </section>
  );
}
