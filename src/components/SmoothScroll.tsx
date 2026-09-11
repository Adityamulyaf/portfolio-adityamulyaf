"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Lenis is the page's smooth scrolling now that the CSS rule is gone, so
    // it is also what has to stand down when the reader asks for less motion.
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: !calm,
      // Lenis owns anchor scrolling too, so the page needs no
      // `scroll-behavior: smooth` of its own — two smooth-scroll engines on one
      // document fight each other.
      anchors: calm ? { immediate: true } : true,
    });
    lenisRef.current = lenis;

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    return () => {
      // Without this the loop keeps calling .raf() on a destroyed instance.
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // This layout survives a route change, so Lenis is never rebuilt and keeps
  // the scroll offset of the page you came from. Left alone it writes that old
  // offset onto the new page — the jump to mid-page on every navigation.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    // A hash in the URL means the browser has already placed the page on its
    // target, and it measures that better than anything done from here.
    const hash = window.location.hash;
    if (hash.length > 1 && document.querySelector(hash)) return;

    lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return <>{children}</>;
}
