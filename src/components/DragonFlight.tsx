"use client";

import { useEffect, useRef } from "react";

/**
 * A dragon crossing the page between two sections.
 *
 * Its position is tied to *where* the band sits in the viewport rather than to
 * which way the wheel last turned: scrolling down carries it right to left, and
 * scrolling back up carries it left to right again, without any direction
 * tracking to jitter or get stuck.
 *
 * The transform is written straight to the node in the scroll handler. Routing
 * it through React state would re-render the tree on every scroll frame for a
 * decoration.
 */
export default function DragonFlight() {
  const bandRef = useRef<HTMLDivElement | null>(null);
  const dragonRef = useRef<HTMLDivElement | null>(null);
  const facingRef = useRef<HTMLDivElement | null>(null);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    const band = bandRef.current;
    const dragon = dragonRef.current;
    if (!band || !dragon) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      // Park it in the middle and leave it there.
      dragon.style.transform = `translate3d(${
        (band.clientWidth - dragon.offsetWidth) / 2
      }px, 0, 0)`;
      return;
    }

    const place = () => {
      const box = band.getBoundingClientRect();
      // 0 as the band meets the bottom of the screen, 1 once it has cleared the
      // top — so the crossing spans the whole time it is in view.
      const span = window.innerHeight + box.height;
      const progress = Math.min(
        1,
        Math.max(0, (window.innerHeight - box.top) / span)
      );

      const travel = box.width + dragon.offsetWidth;
      const x = (1 - progress) * travel - dragon.offsetWidth;
      dragon.style.transform = `translate3d(${Math.round(x)}px, 0, 0)`;

      // Turn to face the way it is travelling. The threshold keeps it from
      // flipping back and forth on the tiny deltas around a resting scroll.
      const facing = facingRef.current;
      if (facing && lastX.current !== null) {
        const dx = x - lastX.current;
        if (Math.abs(dx) > 1) {
          facing.style.transform = dx > 0 ? "scaleX(-1)" : "scaleX(1)";
        }
      }
      lastX.current = x;
    };

    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <div
      ref={bandRef}
      aria-hidden="true"
      className="relative w-full h-0 overflow-x-clip pointer-events-none select-none"
    >
      {/* Nudged below the seam rather than centred on it: Projects ends 40px
          above the line and About's heading starts 160px below, so the room is
          lopsided. Sitting low lets the dragon be bigger while it leans into
          the empty side. */}
      <div
        ref={dragonRef}
        className="absolute left-0 -translate-y-1/2 will-change-transform"
        style={{ top: 26, width: "clamp(220px, 34vw, 430px)" }}
      >
        <div
          ref={facingRef}
          className="transition-transform duration-500 ease-out"
        >
        {/* A plain img, not next/image: the file is an animated WebP, which the
            image optimiser would flatten to a single frame, and swapping the
            source for the reduced-motion still is simpler without it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dragon-flight.webp"
          alt=""
          width={560}
          height={315}
          loading="lazy"
          decoding="async"
          className="w-full h-auto motion-reduce:hidden"
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dragon-still.webp"
          alt=""
          width={560}
          height={315}
          loading="lazy"
          decoding="async"
          className="w-full h-auto hidden motion-reduce:block"
          draggable={false}
        />
        </div>
      </div>
    </div>
  );
}
