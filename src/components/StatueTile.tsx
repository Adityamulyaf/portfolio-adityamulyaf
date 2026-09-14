"use client";

import type { Signature } from "@/lib/useSignatures";

/** One carved statue: the drawing, with the signer's name on hover. */
export default function StatueTile({ signature }: { signature: Signature }) {
  return (
    <div className="group relative flex items-center justify-center bg-surface hover:bg-border/30 border border-border/60 hover:border-border rounded-card h-[60px] w-[140px] px-sm transition-colors duration-300 shadow-sm cursor-help">
      {/* The drawing is clipped here, not on the tile, so the tooltip below
          can still overflow the tile's bounds. */}
      <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={signature.dataUrl}
          alt={`Signature of ${signature.name}`}
          className="max-h-[85%] max-w-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-primary text-white font-body text-micro px-sm py-xs rounded shadow-lg pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-20">
        <span className="block font-medium">{signature.name}</span>
        <span className="block text-[10px] text-on-primary-container mt-0.5">
          {signature.date}
        </span>
      </div>
    </div>
  );
}
