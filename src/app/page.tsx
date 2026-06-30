"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ProjectDetails from "@/components/ProjectDetails";
import { Project } from "@/data/projects";
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const flowerRef = useRef<HTMLDivElement>(null);

  const handleClearFilter = () => {
    setActiveSpecialization(null);
  };

  // Note: ESC key handling is managed inside ProjectDetails
  // to allow the close animation to complete before clearing state.

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
          <Hero />
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

      {/* Main container for standard sections */}
      <main className="max-w-max-width mx-auto px-gutter md:px-xl flex-1 flex flex-col">
        <Projects
          activeSpecialization={activeSpecialization}
          onSelectProject={setSelectedProject}
          onClearFilter={handleClearFilter}
        />
        <About
          activeSpecialization={activeSpecialization}
          onSelectSpecialization={setActiveSpecialization}
        />
        <Contact />
      </main>
      <Footer />

      {/* Project Details — Ancient Scroll Overlay */}
      <ProjectDetails
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
