"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagicCircleIntro from "@/components/MagicCircleIntro";
import { AnimatePresence } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSpecialization, setActiveSpecialization] = useState<string | null>(null);
  const flowerRef = useRef<HTMLDivElement>(null);

  const handleClearFilter = () => {
    setActiveSpecialization(null);
  };

  useEffect(() => {
    // Mengecek apakah user sudah berkunjung di sesi browser ini
    if (typeof window !== "undefined") {
      const hasVisited = sessionStorage.getItem("intro_visited");
      if (hasVisited === "true") {
        setTimeout(() => {
          setShowIntro(false);
        }, 0);
      } else {
        sessionStorage.setItem("intro_visited", "true");
      }
    }
  }, []);

  useEffect(() => {
    if (flowerRef.current) {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === flowerRef.current) {
          trigger.kill();
        }
      });

      gsap.fromTo(
        flowerRef.current,
        { y: 0 },
        {
          y: 50,
          ease: "none",
          scrollTrigger: {
            trigger: flowerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <MagicCircleIntro onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      <Navbar />

      {/* Hero and Flower Divider: Absolute at bottom on mobile, normal flow on desktop */}
      <div className="relative w-full min-h-[100vh] md:min-h-none flex flex-col justify-center md:justify-start md:block">
        <header className="max-w-max-width mx-auto px-gutter md:px-xl w-full pt-[80px] md:pt-[120px] z-10 -translate-y-[8vh] md:translate-y-0">
          <Hero active={!showIntro} />
        </header>

        {/* Flower Divider */}
        <div ref={flowerRef} className="w-full overflow-hidden leading-[0] pointer-events-none z-0 absolute bottom-[-60px] left-0 md:relative md:bottom-auto md:left-auto md:mt-[-70px]">
          <Image
            src="/flower-line.png"
            alt="Flower Divider"
            width={2400}
            height={785}
            className="w-full h-auto min-h-[320px] md:min-h-none object-cover object-bottom"
            priority
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        <div className="max-w-max-width mx-auto px-gutter md:px-xl w-full">
          <Projects
            activeSpecialization={activeSpecialization}
            onClearFilter={handleClearFilter}
          />
          <About
            activeSpecialization={activeSpecialization}
            onSelectSpecialization={setActiveSpecialization}
          />
        </div>

        {/* Skills runs the full width of the window: its staves are meant to
            be cut off by the screen edge, which cannot happen inside a
            container that stops short of it. It holds its own gutters. */}
        <Skills />

        <div className="max-w-max-width mx-auto px-gutter md:px-xl w-full">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
