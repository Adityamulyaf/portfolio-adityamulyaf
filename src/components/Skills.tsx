"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  siC,
  siGstreamer,
  siJavascript,
  siLaravel,
  siMysql,
  siNextdotjs,
  siOpencv,
  siOpenjdk,
  siPandas,
  siPhp,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siRos,
  siScikitlearn,
  siTailwindcss,
} from "simple-icons";

type SimpleIcon = { path: string; hex: string };
type Item = {
  label: string;
  title?: string;
  /** A mark from simple-icons. */
  icon?: SimpleIcon;
  /**
   * A mark supplied as a file under /public/logos, for the few tools no icon
   * set carries. Takes precedence over `icon`.
   */
  image?: string;
  /** A wordmark rather than a square mark, so it needs room to be read. */
  wide?: boolean;
};

/**
 * Every entry carries a mark. Tools with no logo anywhere — SITL, RViz, rqt,
 * zbar, TensorRT, PyCUDA — are left out rather than spelled in text, and Path
 * Planning and Multi-Object Tracking are techniques rather than products so
 * they never had one to find.
 *
 * simple-icons wins over a supplied file wherever it has the mark: its icons
 * are vectors, so Pandas, PyTorch and scikit-learn use it rather than the PNGs
 * in /public/logos.
 */
const RINGS: { label: string; items: Item[] }[] = [
  {
    label: "Languages",
    items: [
      { label: "Python", icon: siPython },
      { label: "C", icon: siC },
      { label: "JavaScript", icon: siJavascript },
      { label: "PHP", icon: siPhp },
      { label: "Java", title: "Java (OpenJDK)", icon: siOpenjdk },
    ],
  },
  {
    label: "Robotics / AI",
    items: [
      { label: "ROS", title: "ROS (Noetic)", icon: siRos },
      {
        label: "MAVLink",
        title: "MAVLink (MAVROS, pymavlink)",
        image: "/logos/mavlink.png",
      },
      {
        label: "ArduPilot",
        title: "ArduPilot (ArduSub / ArduRover)",
        image: "/logos/ardupilot.png",
        wide: true,
      },
      { label: "OpenCV", icon: siOpencv },
      { label: "PyTorch", icon: siPytorch },
      { label: "scikit-learn", icon: siScikitlearn },
      { label: "pandas", icon: siPandas },
      { label: "GStreamer", icon: siGstreamer },
      { label: "Protobuf", image: "/logos/protobuf.png" },
    ],
  },
  {
    label: "Software / Web",
    items: [
      { label: "React", icon: siReact },
      { label: "Next.js", icon: siNextdotjs },
      { label: "Laravel", icon: siLaravel },
      { label: "Tailwind", title: "TailwindCSS", icon: siTailwindcss },
      { label: "MySQL", icon: siMysql },
      { label: "PostgreSQL", icon: siPostgresql },
    ],
  },
];

/**
 * Where the visible paint sits inside each staff's PNG, as a fraction of the
 * image height, measured over only the half that stays on screen.
 *
 * Both staves run diagonally across a mostly transparent canvas and are held
 * head-up-and-right, so the half that shows carries its ink in the top ~55% and
 * nothing below. Laying them out by the image box instead leaves a hole the
 * size of the empty canvas.
 *
 * Both figures come from the image's RIGHT half — Fern is mirrored on screen,
 * so the side facing the viewer is still the source file's right-hand side.
 * Re-measure these if either PNG is ever replaced.
 */
const INK = {
  frieren: { top: 0.01, bottom: 0.551 },
  fern: { top: 0.0, bottom: 0.557 },
};

/** Distance to nudge an image so its ink, not its canvas, is centred. */
const inkOffset = (ink: { top: number; bottom: number }, imageH: number) =>
  Math.round((0.5 - (ink.top + ink.bottom) / 2) * imageH);

const GAP = 24;

/** WCAG relative luminance, used to keep marks legible on the page's ground. */
const luminance = ([r, g, b]: number[]) => {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** Contrast of a colour against the page's peach background. */
const PAGE_LUM = luminance([250, 234, 208]); // --color-background
const contrast = (rgb: number[]) => {
  const l = luminance(rgb);
  const [hi, lo] = l > PAGE_LUM ? [l, PAGE_LUM] : [PAGE_LUM, l];
  return (hi + 0.05) / (lo + 0.05);
};

/**
 * A brand colour to paint a mark in, adjusted to survive this background.
 *
 * Two things go wrong if the published hex is used as-is. A few marks —
 * Next.js, OpenJDK — are specified as pure black, which this page never uses;
 * its darkest ink is the navy in --color-primary. And the bright ones —
 * JavaScript's yellow, React's cyan — sit at barely 1.2:1 against a warm cream
 * ground and simply vanish. Those keep their hue and lose some lightness until
 * they can actually be seen.
 */
const brandColour = (hex: string) => {
  const value = parseInt(hex, 16);
  const rgb = [value >> 16, (value >> 8) & 255, value & 255];

  if (Math.max(...rgb) < 40) return "var(--color-primary)";

  let scale = 1;
  while (scale > 0.3 && contrast(rgb.map((c) => c * scale)) < 2.6) {
    scale -= 0.05;
  }
  const [r, g, b] = rgb.map((c) => Math.round(c * scale));
  return `rgb(${r}, ${g}, ${b})`;
};

function Ring({
  label,
  items,
  diameter,
}: {
  label: string;
  items: Item[];
  diameter: number;
}) {
  const big = diameter > 260;
  const spoke = diameter / 2 - (big ? 26 : 18);

  return (
    <div
      className="relative shrink-0 grid place-items-center"
      style={{ width: diameter, height: diameter }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-parchment/25"
      />

      <span
        className={`font-display italic text-text-primary text-center leading-tight px-3 ${
          big ? "text-h3" : "text-small"
        }`}
      >
        {label}
      </span>

      <ul className="orbit-spin absolute inset-0 list-none">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="absolute left-1/2 top-1/2"
            style={{
              // Centre on the hub, swing the arm out to the rim, then undo the
              // swing so the mark is upright again. Without that last rotation
              // every item sits tilted by its own position on the circle.
              transform: `translate(-50%, -50%) rotate(${
                (i * 360) / items.length
              }deg) translateY(${-spoke}px) rotate(${
                (-i * 360) / items.length
              }deg)`,
            }}
          >
            {/* Counter-rotates at the ring's own rate, so each item stays the
                right way up while the circle turns. */}
            <span className="orbit-counter block">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title ?? item.label}
                  width={item.wide ? 626 : 240}
                  height={item.wide ? 98 : 240}
                  // The rest of the ring is inline SVG and always present, so
                  // these few kilobytes load with it rather than trickling in
                  // afterwards and leaving gaps in a composed figure.
                  loading="eager"
                  className={`${
                    item.wide
                      ? big
                        ? "w-16 h-auto"
                        : "w-12 h-auto"
                      : big
                        ? "w-7 h-7"
                        : "w-5 h-5"
                  } object-contain opacity-85 hover:opacity-100 hover:scale-110 transition duration-300`}
                />
              ) : item.icon ? (
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label={item.title ?? item.label}
                  style={{ color: brandColour(item.icon.hex) }}
                  className={`${
                    big ? "w-7 h-7" : "w-5 h-5"
                  } opacity-85 hover:opacity-100 hover:scale-110 transition duration-300`}
                  fill="currentColor"
                >
                  <title>{item.title ?? item.label}</title>
                  <path d={item.icon.path} />
                </svg>
              ) : (
                <span
                  title={item.title ?? item.label}
                  className={`font-body ${
                    big ? "text-[11px]" : "text-[9px]"
                  } leading-none whitespace-nowrap text-text-muted hover:text-primary transition-colors duration-300`}
                >
                  {item.label}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageW, setStageW] = useState(0);
  const [spinning, setSpinning] = useState(true);

  // Sized from the element, not from `vw`: the stage runs the full window while
  // the gutters belong to the heading, and on a phone that difference is most
  // of the room the staves have to live in.
  const measureStage = useCallback((el: HTMLDivElement | null) => {
    stageRef.current = el;
    if (el) setStageW(el.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    const onResize = () => {
      const el = stageRef.current;
      if (el) setStageW(el.getBoundingClientRect().width);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Three circles abreast need the room the staves were using, so below this
  // width they stack and the staves keep their reach.
  const stacked = stageW > 0 && stageW < 860;

  const centerD = stacked
    ? Math.min(300, Math.max(190, stageW * 0.5))
    : Math.min(380, Math.max(230, stageW * 0.3));
  const sideD = Math.round(centerD * (stacked ? 0.66 : 0.46));

  // Abreast, the three circles eat the width the staves want. Dropped to the
  // lower left and right instead, the small ones tuck under the big one's
  // shoulders: the group gets narrower, the staves get their size back, and the
  // arrangement reads as a cast rather than a row of buttons.
  const tuck = sideD * 0.35;
  const dx = centerD / 2 + sideD / 2 - tuck;
  // Far enough down that the rims still clear each other at that tuck.
  const minDist = (centerD + sideD) / 2 + 12;
  const dy = Math.round(Math.sqrt(Math.max(0, minDist * minDist - dx * dx)));

  const ringsW = stacked
    ? Math.max(centerD, sideD * 2 + GAP)
    : Math.round(dx * 2 + sideD);

  // Whatever the circles leave is split between the staves, and each is drawn
  // at twice its share then hung half off the window — so the half on screen
  // runs right to the edge with no strip of background left beside it.
  const staffVisible = Math.max(70, (stageW - ringsW) / 2 - GAP);
  const staffW = Math.max(140, Math.min(900, Math.round(staffVisible * 2)));
  const staffPull = -Math.round(staffW / 2);

  const staffH = staffW * (1276 / 1233);
  const inkH =
    Math.max(
      INK.frieren.bottom - INK.frieren.top,
      INK.fern.bottom - INK.fern.top
    ) * staffH;

  const ringsH = stacked
    ? centerD + sideD + GAP
    : Math.round(centerD / 2 + dy + sideD / 2);
  const stageH = Math.max(ringsH, Math.round(inkH));

  // A ring turning where nobody can see it is wasted compositor work. Measured
  // on a timer rather than watched with an IntersectionObserver, which does not
  // deliver until its first callback and would leave the rings frozen on load.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const check = () => {
      const box = stage.getBoundingClientRect();
      const shown =
        Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
      setSpinning(!document.hidden && shown > box.height * 0.25);
    };

    check();
    const id = window.setInterval(check, 600);
    return () => window.clearInterval(id);
  }, []);

  const [ai, robotics, web] = RINGS;

  return (
    <section className="pt-section-v pb-xl overflow-x-clip" id="skills">
      <div className="relative z-20 max-w-max-width mx-auto px-gutter md:px-xl w-full">
        <div className="mb-xl text-left">
          <span className="font-body text-label text-text-muted mb-xs block">
            Craft
          </span>
          <h2 className="font-display text-h2 italic text-text-primary">
            The spells I know.
          </h2>
        </div>
      </div>

      <div
        ref={measureStage}
        className={`relative flex items-center justify-center ${
          spinning ? "" : "orbit-paused"
        }`}
        style={{ height: stageH }}
      >
        {/* The staves lean in from either side, each hung half off the window on
            purpose — cropped by the screen rather than shrunk to fit inside it
            — and nudged so their ink, not their mostly empty canvas, sits level
            with the circles. */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none"
          style={{
            left: staffPull,
            width: staffW,
            marginTop: inkOffset(INK.frieren, staffH),
          }}
        >
          <Image
            src="/frieren-magic2.png"
            alt=""
            width={1233}
            height={1276}
            className="w-full h-auto"
          />
        </div>

        <div
          className="absolute top-1/2 -translate-y-1/2 z-0 scale-x-[-1] pointer-events-none select-none"
          style={{
            right: staffPull,
            width: staffW,
            marginTop: inkOffset(INK.fern, staffH),
          }}
        >
          <Image
            src="/fern-magic.png"
            alt=""
            width={1278}
            height={1230}
            className="w-full h-auto"
          />
        </div>

        {stacked ? (
          <div
            className="relative z-10 flex flex-col items-center justify-center"
            style={{ gap: GAP }}
          >
            <Ring
              label={robotics.label}
              items={robotics.items}
              diameter={centerD}
            />
            <div className="flex items-center" style={{ gap: GAP }}>
              <Ring label={ai.label} items={ai.items} diameter={sideD} />
              <Ring label={web.label} items={web.items} diameter={sideD} />
            </div>
          </div>
        ) : (
          <div
            className="relative z-10"
            style={{ width: ringsW, height: ringsH }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 0 }}
            >
              <Ring
                label={robotics.label}
                items={robotics.items}
                diameter={centerD}
              />
            </div>
            <div
              className="absolute left-1/2"
              style={{
                top: ringsH - sideD,
                transform: `translateX(calc(-50% - ${Math.round(dx)}px))`,
              }}
            >
              <Ring label={ai.label} items={ai.items} diameter={sideD} />
            </div>
            <div
              className="absolute left-1/2"
              style={{
                top: ringsH - sideD,
                transform: `translateX(calc(-50% + ${Math.round(dx)}px))`,
              }}
            >
              <Ring label={web.label} items={web.items} diameter={sideD} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
