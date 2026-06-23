"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import myStatue from "../../public/my-statue.png";
import SignatureBoard from "./SignatureBoard";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statueDesktopRef = useRef<HTMLDivElement>(null);
  const statueMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });

      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    const desktopStatue = statueDesktopRef.current;
    if (desktopStatue) {
      gsap.fromTo(
        desktopStatue,
        { y: -45 },
        {
          y: 45,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    const mobileStatue = statueMobileRef.current;
    if (mobileStatue) {
      gsap.fromTo(
        mobileStatue,
        { y: -25 },
        {
          y: 25,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <section className="pt-section-v pb-0" id="contact">
      <div
        ref={containerRef}
        className="opacity-0 text-left flex flex-col md:flex-row justify-between items-stretch gap-xl relative"
      >
        {/* Left Column */}
        <div className="flex flex-col flex-grow pb-xl md:pb-lg md:pr-[370px] lg:pr-[480px] gap-xl justify-start">
          <div>
            <span className="font-mono-label text-[11px] text-text-muted uppercase mb-xs block tracking-[0.04em]">
              CONNECT
            </span>
            <h2 className="font-body-md text-headline-lg-mobile md:text-headline-lg font-bold text-text-primary mb-xl leading-none">
              Let's build something.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-xl">
            {/* Email Link */}
            <a href="mailto:adityamulyaf@gmail.com" className="group">
              <span className="font-mono-label text-[11px] text-text-muted uppercase block mb-xs tracking-[0.04em]">
                Email
              </span>
              <span className="font-body-md text-headline-md-mobile md:text-[24px] font-medium text-primary-container link-hover">
                adityamulyaf@gmail.com
              </span>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://linkedin.com/in/firizqi-aditya-mulya"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <span className="font-mono-label text-[11px] text-text-muted uppercase block mb-xs tracking-[0.04em]">
                LinkedIn
              </span>
              <span className="font-body-md text-headline-md-mobile md:text-[24px] font-medium text-primary-container link-hover">
                Firizqi Aditya Mulya
              </span>
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/adityamulyaf"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <span className="font-mono-label text-[11px] text-text-muted uppercase block mb-xs tracking-[0.04em]">
                GitHub
              </span>
              <span className="font-body-md text-headline-md-mobile md:text-[24px] font-medium text-primary-container link-hover">
                @adityamulyaf
              </span>
            </a>
          </div>

          {/* Signature Guestbook */}
          <div className="mt-md border-t border-border/40 pt-lg">
            <SignatureBoard />
          </div>
        </div>

        {/* Right Column: Statue Image (Absolute on Desktop, stretches to end of web) */}
        <div ref={statueDesktopRef} className="absolute right-0 top-0 bottom-[-155px] w-[350px] lg:w-[450px] hidden md:block z-10">
          <Image
            src={myStatue}
            alt="My Statue"
            fill
            sizes="(max-width: 1024px) 350px, 450px"
            className="object-contain object-bottom pointer-events-none"
            priority
          />
        </div>

        {/* Mobile Statue Image (Falls back to normal flow below links) */}
        <div ref={statueMobileRef} className="relative w-full h-[280px] flex-shrink-0 md:hidden mt-xl">
          <Image
            src={myStatue}
            alt="My Statue"
            fill
            sizes="100vw"
            className="object-contain object-bottom pointer-events-none"
            priority
          />
        </div>
      </div>
    </section>
  );
}
