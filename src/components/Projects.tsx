"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { projects } from "../data/projects";

interface ProjectsProps {
  activeSpecialization: string | null;
  onClearFilter: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Every step back is this much smaller; the rest of the geometry is derived
    from the stage's measured width so the ring can never grow wider than the
    screen it is standing on. */
const SCALE_STEP = 0.12;

/** Which project was opened, so the ring can face it again on the way back. */
const LAST_OPENED_KEY = "last-opened-project";

/** How long the ring waits after the last touch before turning on its own. */
const IDLE_BEFORE_DRIFT = 3000;
/** The drift loop counts quiet ticks instead of reading the clock, which keeps
    timestamps — an impure read — out of anything defined during render. */
const DRIFT_TICK = 500;
const QUIET_TICKS = Math.round(IDLE_BEFORE_DRIFT / DRIFT_TICK);

export default function Projects({
  activeSpecialization,
  onClearFilter,
}: ProjectsProps) {
  const router = useRouter();
  const [center, setCenter] = useState(0);
  const [stageW, setStageW] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragFrom = useRef<number | null>(null);
  const wheelCooling = useRef(false);
  const quietTicks = useRef(0);
  const hovered = useRef(false);

  /** Any deliberate turn, so the ring knows to stop drifting for a while. */
  const noteInput = () => {
    quietTicks.current = 0;
  };

  // Measured, not read from a media query: the ring has to fit the element it
  // stands in, which is narrower than the viewport by the page gutters.
  //
  // The measurement happens in a callback ref rather than an effect or a
  // ResizeObserver because both of those deliver after the first paint, and a
  // ring that is briefly the wrong size is a ring that visibly jumps.
  const measureStage = useCallback((el: HTMLDivElement | null) => {
    stageRef.current = el;
    if (!el) return;
    setStageW(el.getBoundingClientRect().width);

    // Coming back from a project page, face the card that was opened rather
    // than snapping to the first one.
    try {
      const id = sessionStorage.getItem(LAST_OPENED_KEY);
      if (id) {
        const index = projects.findIndex((p) => p.id === id);
        if (index >= 0) setCenter(index);
      }
    } catch {
      /* storage unavailable; the ring simply starts at the first card */
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      const el = stageRef.current;
      if (el) setStageW(el.getBoundingClientRect().width);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const visible = activeSpecialization
    ? projects.filter((p) => p.specializations.includes(activeSpecialization))
    : projects;

  const n = visible.length;
  // Clamped on read rather than reset in an effect, so filtering down to one
  // project can never leave the centre pointing past the end of the ring.
  const current = n ? ((center % n) + n) % n : 0;
  const active = visible[current];

  // A ring has no last card: the distance to the centre wraps the short way
  // round, so stepping past the end simply arrives back at the beginning.
  const offsetOf = (i: number) => {
    let d = (((i - current) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  const cardW = Math.min(400, Math.max(200, stageW * 0.62));
  const spread = cardW * 0.48;
  // Far enough out to clear the front card's edge, so the arrows land on the
  // cards behind it rather than crowding the work in focus.
  const armReach = spread + cardW * 0.18;
  // A phone has no room for two cards either side of the front one.
  const ring = stageW < 640 ? 1 : 2;

  const remember = (id: string) => {
    try {
      sessionStorage.setItem(LAST_OPENED_KEY, id);
    } catch {
      /* storage unavailable; the ring just starts at the first card */
    }
  };

  const go = (direction: 1 | -1) => {
    noteInput();
    setCenter((c) => c + direction);
  };

  // The ring turns by itself once it has been left alone, but only while it is
  // actually on screen and not being pointed at. Readers who ask for reduced
  // motion get a ring that never moves on its own.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Visibility is measured here rather than watched with an
    // IntersectionObserver: an observer delivers through the rendering
    // pipeline, so until its first callback arrives the ring is stuck
    // believing it is off screen. A rect read costs nothing once every few
    // seconds and is right immediately.
    const mostlyOnScreen = () => {
      const box = stage.getBoundingClientRect();
      const shown =
        Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
      return shown > box.height * 0.4;
    };

    const drift = window.setInterval(() => {
      // Anything that should hold the ring still also resets the count, so the
      // full quiet period has to pass again after a hover or a tab switch.
      if (document.hidden || hovered.current || !mostlyOnScreen()) {
        quietTicks.current = 0;
        return;
      }
      if (++quietTicks.current < QUIET_TICKS) return;
      quietTicks.current = 0;
      setCenter((c) => c + 1);
    }, DRIFT_TICK);

    return () => window.clearInterval(drift);
  }, [n]);

  const onWheel = (e: React.WheelEvent) => {
    // Sideways intent only — hijacking vertical wheel would steal the page.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    if (wheelCooling.current) return;
    wheelCooling.current = true;
    window.setTimeout(() => {
      wheelCooling.current = false;
    }, 320);
    go(e.deltaX > 0 ? 1 : -1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  // Placed over the side cards rather than at the stage's edges, where there
  // is still bare background — glass needs something behind it to be glass.
  const arrowClass =
    "absolute top-1/2 z-20 w-11 h-11 grid place-items-center -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/55 hover:bg-background/80 backdrop-blur-md backdrop-saturate-150 border border-border/70 shadow-warm-glass text-primary text-h4 leading-none transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container disabled:opacity-0 disabled:pointer-events-none";

  return (
    <section
      className="pt-divider-clear md:pt-section-v-tight pb-xl scroll-mt-24 overflow-x-clip"
      id="projects"
    >
      <div className="mb-xl text-left">
        <span className="font-body text-label text-text-muted mb-xs block">
          Work
        </span>
        <h2 className="font-display text-h2 italic text-text-primary">
          Projects
        </h2>
      </div>

      <div className="mb-lg h-[34px] flex items-center">
        <AnimatePresence>
          {activeSpecialization && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex items-center gap-sm"
            >
              <span className="font-body text-label text-text-muted">
                Showing{" "}
                <span className="text-text-primary font-medium">
                  {activeSpecialization}
                </span>
                {" · "}
                {n} of {projects.length}
              </span>
              <button
                onClick={onClearFilter}
                className="font-body text-label font-medium text-primary-container hover:text-accent-hover underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
              >
                Show all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The stage. Cards stay square-on to the viewer; depth is carried by
          size and shade alone. `touch-action: pan-y` keeps the page scrollable
          under a horizontal drag. */}
      <div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects — use the arrow keys to turn the ring"
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        onPointerEnter={() => (hovered.current = true)}
        onPointerLeave={() => (hovered.current = false)}
        onFocus={() => (hovered.current = true)}
        onBlur={() => (hovered.current = false)}
        onPointerDown={(e) => {
          noteInput();
          dragFrom.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (dragFrom.current === null) return;
          const dx = e.clientX - dragFrom.current;
          dragFrom.current = null;
          if (Math.abs(dx) > 60) go(dx > 0 ? -1 : 1);
        }}
        onPointerCancel={() => (dragFrom.current = null)}
        ref={measureStage}
        className="relative w-full select-none touch-pan-y focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary-container rounded-card"
        style={{ height: cardW * 0.75 }}
      >
        {visible.map((project, i) => {
          const off = offsetOf(i);
          const dist = Math.abs(off);
          const isCenter = off === 0;
          if (dist > ring) return null;

          return (
            <motion.button
              key={project.id}
              type="button"
              tabIndex={isCenter ? 0 : -1}
              onClick={() => {
                noteInput();
                if (!isCenter) {
                  setCenter(i);
                  return;
                }
                remember(project.id);
                router.push(`/projects/${project.id}`);
              }}
              aria-label={
                isCenter ? `Open ${project.title}` : `Turn to ${project.title}`
              }
              animate={{
                x: off * spread,
                scale: 1 - dist * SCALE_STEP,
              }}
              transition={{ duration: 0.55, ease: EASE }}
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: cardW,
                marginLeft: -cardW / 2,
                zIndex: 10 - dist,
              }}
              className="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary-container rounded-card"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-card bg-surface shadow-lg">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 62vw, 400px"
                  className="object-cover"
                  draggable={false}
                />
                {/* Cards behind the front one sit in its shadow. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-primary transition-opacity duration-500"
                  style={{ opacity: dist * 0.22 }}
                />
              </div>
            </motion.button>
          );
        })}

        <button
          onClick={() => go(-1)}
          disabled={n < 2}
          aria-label="Previous project"
          className={arrowClass}
          style={{ left: `calc(50% - ${armReach}px)` }}
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          disabled={n < 2}
          aria-label="Next project"
          className={arrowClass}
          style={{ left: `calc(50% + ${armReach}px)` }}
        >
          ›
        </button>
      </div>

      {/* One caption for whichever project is facing front. Keeping the words
          out of the cards is what lets every card stay the same size. */}
      <div className="mt-xl min-h-[150px] text-center max-w-[52ch] mx-auto">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <span className="font-body text-label text-text-muted mb-xs block">
                {active.domain}
              </span>
              <h3 className="font-display text-feature text-text-primary mb-xs">
                {active.title}
              </h3>
              <p className="font-body text-small font-light text-secondary-fixed-dim mb-sm">
                {active.description}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-sm gap-y-xs mb-sm">
                {active.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-body text-micro text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Link
                href={`/projects/${active.id}`}
                onClick={() => remember(active.id)}
                className="font-body text-micro text-parchment inline-flex items-center gap-1 hover:gap-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
              >
                Open codex entry
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
