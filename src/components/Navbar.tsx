"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
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
              className="font-body-md text-[15px] font-normal text-secondary hover:text-primary transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#projects"
              className="font-body-md text-[15px] font-normal text-secondary hover:text-primary transition-colors duration-200"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="font-body-md text-[15px] font-normal text-secondary hover:text-primary transition-colors duration-200"
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
            className="font-display-hero text-[48px] text-secondary hover:text-primary italic transition-colors"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={toggleMobileMenu}
            className="font-display-hero text-[48px] text-secondary hover:text-primary italic transition-colors"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={toggleMobileMenu}
            className="font-display-hero text-[48px] text-secondary hover:text-primary italic transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </>
  );
}
