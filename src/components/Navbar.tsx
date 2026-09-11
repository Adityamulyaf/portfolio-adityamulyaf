"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      if (!onHome) return;
      const triggerPoint = 200;
      let current = "";
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint && rect.bottom > triggerPoint) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onHome]);

  // Off the homepage the anchor has to carry the route. Next falls back to a
  // full page load for a cross-route hash, which reloads rather than
  // transitions — but the browser then lands on the section exactly, which the
  // client-side alternatives did not.
  const sectionHref = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);

  const isActive = (id: string) => onHome && activeSection === id;
  const guestbookActive = pathname === "/guestbook";

  return (
    <>
      {/* Scrolled, the bar contracts into a floating pill. Keeping the blurred
          area small matters: backdrop-filter is expensive across a full-width
          strip and cheap across a pill. */}
      <nav
        className={`fixed left-1/2 -translate-x-1/2 z-40 flex items-center transition-all duration-500 ease-out ${
          isScrolled
            ? "top-3 w-[calc(100%-2rem)] max-w-[820px] h-[56px] rounded-full px-sm md:px-md bg-background/70 backdrop-blur-xl backdrop-saturate-150 border border-border shadow-warm-glass"
            : "top-0 w-full max-w-max-width h-[64px] rounded-none px-gutter md:px-xl bg-transparent border border-transparent"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <Link
            href="/"
            className="font-body text-small font-medium text-primary tracking-tight flex items-center gap-xs"
          >
            <Image
              src="/head.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
              priority
            />
            <span>Adityamulyaf</span>
          </Link>

          <div className="hidden md:flex items-center gap-xs">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={sectionHref(id)}
                className={`font-body text-small rounded-full px-sm py-1.5 transition-colors duration-200 ${
                  isActive(id)
                    ? "text-primary-container font-medium bg-primary-container/15"
                    : "text-secondary font-normal hover:text-primary-container hover:bg-primary-container/10"
                }`}
              >
                {label}
              </a>
            ))}
            <Link
              href="/guestbook"
              className={`font-body text-small rounded-full px-sm py-1.5 transition-colors duration-200 ${
                guestbookActive
                  ? "text-primary-container font-medium bg-primary-container/15"
                  : "text-secondary font-normal hover:text-primary-container hover:bg-primary-container/10"
              }`}
            >
              Guestbook
            </Link>
          </div>

          <button
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden font-body text-label font-medium text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-30 bg-background flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-lg">
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={sectionHref(id)}
              onClick={toggleMobileMenu}
              className={`font-display text-h2 italic transition-colors ${
                isActive(id) ? "text-primary" : "text-secondary hover:text-primary"
              }`}
            >
              {label}
            </a>
          ))}
          <Link
            href="/guestbook"
            onClick={toggleMobileMenu}
            className={`font-display text-h2 italic transition-colors ${
              guestbookActive ? "text-primary" : "text-secondary hover:text-primary"
            }`}
          >
            Guestbook
          </Link>
        </div>
      </div>
    </>
  );
}
