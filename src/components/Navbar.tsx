"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      // 1. Tentukan status scrolled untuk border navbar
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Scroll Spy: Tentukan section yang aktif secara dinamis
      const sections = ["about", "projects", "contact"];
      const triggerPoint = 200; // 200px dari atas viewport
      let currentSection = "";

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    // Jalankan sekali saat mount untuk mendeteksi posisi awal
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 h-[64px] transition-all duration-300 ${
          isScrolled
            ? "bg-surface/95 backdrop-blur-[8px] border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center h-full max-w-max-width mx-auto px-gutter md:px-xl">
          <a
            href="#"
            className="font-body-md text-[15px] font-medium text-primary tracking-tight flex items-center gap-xs"
          >
            <Image
              src="/head.png"
              alt="Head Icon"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
              priority
            />
            <span>Adityamulyaf</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-xl">
            <a
              href="#about"
              className={`font-body-md text-[15px] transition-all duration-200 link-hover ${
                activeSection === "about"
                  ? "text-primary font-medium link-active"
                  : "text-secondary font-normal hover:text-primary"
              }`}
            >
              About
            </a>
            <a
              href="#projects"
              className={`font-body-md text-[15px] transition-all duration-200 link-hover ${
                activeSection === "projects"
                  ? "text-primary font-medium link-active"
                  : "text-secondary font-normal hover:text-primary"
              }`}
            >
              Projects
            </a>
            <a
              href="#contact"
              className={`font-body-md text-[15px] transition-all duration-200 link-hover ${
                activeSection === "contact"
                  ? "text-primary font-medium link-active"
                  : "text-secondary font-normal hover:text-primary"
              }`}
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden font-mono-label text-[11px] uppercase tracking-widest text-primary focus:outline-none"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-background flex flex-col justify-center items-center transition-all duration-500 ease-out-expo md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-lg">
          <a
            href="#about"
            onClick={toggleMobileMenu}
            className={`font-display-hero text-[48px] italic transition-colors ${
              activeSection === "about" ? "text-primary font-medium" : "text-secondary hover:text-primary"
            }`}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={toggleMobileMenu}
            className={`font-display-hero text-[48px] italic transition-colors ${
              activeSection === "projects" ? "text-primary font-medium" : "text-secondary hover:text-primary"
            }`}
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={toggleMobileMenu}
            className={`font-display-hero text-[48px] italic transition-colors ${
              activeSection === "contact" ? "text-primary font-medium" : "text-secondary hover:text-primary"
            }`}
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
