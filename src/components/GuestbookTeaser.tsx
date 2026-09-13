"use client";

import Link from "next/link";
import { useSignatures } from "@/lib/useSignatures";
import StatueTile from "./StatueTile";

const PREVIEW = 4;

/**
 * The guestbook's footprint on the homepage. Deliberately fixed-size: it shows
 * the newest few statues and sends people to /guestbook for the rest, so the
 * Contact section's height no longer grows with every signature.
 */
export default function GuestbookTeaser() {
  const { signatures, loading } = useSignatures(PREVIEW);

  return (
    <div className="w-full text-left">
      <div className="flex flex-wrap justify-between items-end gap-sm border-b border-border pb-sm mb-md">
        <div>
          <span className="font-body text-label text-text-muted block">
            Guestbook
          </span>
          <h3 className="font-display text-h3 italic text-text-primary mt-1">
            Carved Statues
          </h3>
        </div>

        <Link
          href="/guestbook"
          className="font-body text-label font-medium text-primary-container hover:text-accent-hover border border-primary-container/25 hover:border-accent-hover rounded-md px-sm py-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
        >
          Sign the guestbook →
        </Link>
      </div>

      <div className="flex flex-wrap gap-md items-center min-h-[60px]">
        {loading ? (
          <p className="font-body text-small text-text-muted">Reading the wall…</p>
        ) : signatures.length === 0 ? (
          <p className="font-body text-small text-text-muted">
            No statues carved yet. Be the first.
          </p>
        ) : (
          signatures.map((sig) => <StatueTile key={sig.id} signature={sig} />)
        )}
      </div>
    </div>
  );
}
