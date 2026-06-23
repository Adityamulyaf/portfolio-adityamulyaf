"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  activeSpecialization: string | null;
  onSelectSpecialization: (spec: string | null) => void;
}

export default function About({
  activeSpecialization,
  onSelectSpecialization,
}: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear any existing scroll triggers for this container
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
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  const specializations = [
    "Software Architecture",
    "Embedded Systems",
    "UI/UX Design",
  ];

  return (
    <section className="pt-section-v pb-xl" id="about">
      <div
        ref={containerRef}
        className="gsap-about-content opacity-0 max-w-[1000px] mx-auto text-left"
      >
        <span className="font-mono-label text-[11px] text-text-muted uppercase mb-xs block tracking-[0.04em]">
          ABOUT
        </span>
        <h2 className="font-body-md text-headline-lg-mobile md:text-headline-lg font-bold text-text-primary mb-lg leading-tight">
          Intentionality over domain.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/* Main Description */}
          <div className="md:col-span-5 flex flex-col gap-md">
            <p className="font-body-md text-[18px] md:text-[22px] text-secondary-fixed-dim leading-relaxed">
              I am a builder who codes and designs across robotics, mobile, and
              web. Currently pursuing Informatika at Universitas Sebelas Maret,
              I believe that great engineering isn't just about the code—it's
              about the purpose and physical nature of the solution.
            </p>
            <p className="font-body-md text-[18px] md:text-[22px] text-secondary-fixed-dim leading-relaxed">
              Whether I'm debugging a ROS node for an autonomous boat or
              refining the padding of a React component, my goal is to create
              systems that feel grounded, reliable, and expertly crafted.
            </p>
          </div>

          {/* Photo Slot */}
          <div className="md:col-span-4">
            <div className="relative overflow-hidden rounded-card bg-surface aspect-[3/4] w-full">
              <Image
                src="/about_profile.png"
                alt="Personal illustration of Firizqi Aditya Mulya"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-all duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>

          {/* Metadata Lists */}
          <div className="md:col-span-3 flex flex-col gap-md">
            <div>
              <span className="font-mono-label text-[11px] text-text-muted uppercase block mb-xs tracking-[0.04em]">
                Specializations
              </span>
              <div className="flex flex-col items-start gap-xs mt-xs">
                {specializations.map((spec) => {
                  const isActive = activeSpecialization === spec;
                  return (
                    <button
                      key={spec}
                      onClick={() =>
                        onSelectSpecialization(isActive ? null : spec)
                      }
                      className={`font-body-sm text-[15px] transition-all duration-200 text-left hover:text-primary-container focus:outline-none cursor-pointer ${
                        isActive
                          ? "text-primary-container font-semibold underline underline-offset-4"
                          : "text-text-primary font-normal"
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <span className="font-mono-label text-[11px] text-text-muted uppercase block mb-xs tracking-[0.04em]">
                Location
              </span>
              <p className="font-body-sm text-[15px] font-normal text-text-primary leading-relaxed">
                Surakarta, ID
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
