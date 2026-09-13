"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import myStatue from "../../public/my-statue.png";
import GuestbookTeaser from "./GuestbookTeaser";
import { SocialIcon, ICON_PATHS } from "./SocialIcon";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const statueDesktopRef = useRef<HTMLDivElement>(null);

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
            <span className="font-body text-label text-text-muted mb-xs block">
              Connect
            </span>
            <h2 className="font-display text-h2 italic text-text-primary mb-xl">
              Let&apos;s make some magic.
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-xl">
            {/* Email Link */}
            <a href="mailto:adityamulyaf@gmail.com" className="group">
              <span className="font-body text-label text-text-muted block mb-xs">
                Email
              </span>
              <span className="flex items-center gap-xs">
                <SocialIcon path={ICON_PATHS.email} />
                <span className="font-body text-lead font-medium text-primary-container link-hover">
                  adityamulyaf@gmail.com
                </span>
              </span>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://linkedin.com/in/firizqi-aditya-mulya"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <span className="font-body text-label text-text-muted block mb-xs">
                LinkedIn
              </span>
              <span className="flex items-center gap-xs">
                <SocialIcon path={ICON_PATHS.linkedin} />
                <span className="font-body text-lead font-medium text-primary-container link-hover">
                  Firizqi Aditya Mulya
                </span>
              </span>
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/adityamulyaf"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <span className="font-body text-label text-text-muted block mb-xs">
                GitHub
              </span>
              <span className="flex items-center gap-xs">
                <SocialIcon path={ICON_PATHS.github} />
                <span className="font-body text-lead font-medium text-primary-container link-hover">
                  @adityamulyaf
                </span>
              </span>
            </a>

            {/* Instagram Link */}
            <a
              href="https://instagram.com/adityamulyaf"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <span className="font-body text-label text-text-muted block mb-xs">
                Instagram
              </span>
              <span className="flex items-center gap-xs">
                <SocialIcon path={ICON_PATHS.instagram} />
                <span className="font-body text-lead font-medium text-primary-container link-hover">
                  @adityamulyaf
                </span>
              </span>
            </a>
          </div>

          {/* Signature Guestbook */}
          <div className="mt-md border-t border-border/40 pt-lg">
            <GuestbookTeaser />
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

      </div>
    </section>
  );
}
