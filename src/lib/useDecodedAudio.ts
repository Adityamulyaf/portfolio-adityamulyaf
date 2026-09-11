"use client";

import { useEffect, useRef, useState } from "react";

type Status = "loading" | "ready" | "unavailable";

/**
 * Holds one short sound fully decoded in memory, ready to fire on a gesture.
 *
 * An <audio> element cannot promise this. `preload="auto"` is a hint the
 * browser is free to ignore — and routinely does on mobile and under data
 * saver — so the first play() can find an empty buffer and go to the network
 * while whatever it was meant to accompany runs on schedule without it.
 *
 * Fetching and decoding up front removes both the network and the decode from
 * the click: start() is then synchronous and sample-accurate. It also hands
 * back the AudioContext clock, which is the only clock that actually knows
 * when the first sample leaves.
 *
 * An AudioContext may be constructed before any gesture — it is born
 * suspended, and decodeAudioData works in that state. Only resume() needs the
 * gesture, and that is exactly where start() is called from.
 */
export function useDecodedAudio(src: string) {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    let ctx: AudioContext | null = null;

    (async () => {
      try {
        // The fetch goes first so that everything after it is off the
        // synchronous path of the effect — including the failure branch, which
        // would otherwise set state during the effect body.
        const res = await fetch(src);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const bytes = await res.arrayBuffer();

        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!Ctor) throw new Error("Web Audio unsupported");

        ctx = new Ctor();
        if (cancelled) {
          void ctx.close();
          return;
        }
        ctxRef.current = ctx;

        const buffer = await ctx.decodeAudioData(bytes);
        if (cancelled) return;
        bufferRef.current = buffer;
        setStatus("ready");
      } catch {
        // A missing, unsupported or undecodable sound is not a reason to hold
        // anything up.
        if (!cancelled) setStatus("unavailable");
      }
    })();

    return () => {
      cancelled = true;
      void ctx?.close();
      ctxRef.current = null;
    };
  }, [src]);

  /**
   * Plays the sound and returns a function giving seconds elapsed since its
   * first sample — the clock to drive an animation from. Returns null when
   * there is no sound to play, so the caller can fall back to its own timing.
   */
  const start = () => {
    const ctx = ctxRef.current;
    const buffer = bufferRef.current;
    if (!ctx || !buffer) return null;

    // resume() is a promise, but start() below is scheduled on the audio
    // clock rather than on its resolution, so it needs no awaiting.
    void ctx.resume();

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const at = ctx.currentTime;
    source.start(at);
    return () => ctx.currentTime - at;
  };

  return { status, start };
}
