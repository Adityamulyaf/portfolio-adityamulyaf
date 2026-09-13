"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarveModal from "@/components/CarveModal";
import StatueTile from "@/components/StatueTile";
import { useSignatures } from "@/lib/useSignatures";

const PAGE = 60;

export default function GuestbookPage() {
  // The wall is unbounded, so it loads a page at a time rather than all of it.
  const [take, setTake] = useState(PAGE);
  const [carving, setCarving] = useState(false);
  const { signatures, loading, addSignature } = useSignatures(take);

  const mightHaveMore = signatures.length >= take;

  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col">
        <div className="max-w-max-width mx-auto px-gutter md:px-xl w-full pt-[120px] md:pt-[160px] pb-xxl">
          <header className="mb-xl">
            <Link
              href="/#contact"
              className="font-body text-label text-text-muted hover:text-primary transition-colors link-hover"
            >
              ← Back to the portfolio
            </Link>

            <h1 className="font-display text-h2 italic text-text-primary mt-md">
              Carved Statues
            </h1>
            <p className="font-body text-lead font-light text-secondary-fixed-dim mt-sm max-w-[58ch]">
              Everyone who passed through left a mark on the stone. Add yours.
            </p>

            <button
              onClick={() => setCarving(true)}
              className="mt-lg font-body text-label font-medium text-white bg-primary-container hover:bg-accent-hover transition-colors px-lg py-sm rounded-md shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
            >
              Carve your statue
            </button>
          </header>

          <section aria-label="Carved statues">
            {loading ? (
              <p className="font-body text-small text-text-muted">Reading the wall…</p>
            ) : signatures.length === 0 ? (
              <p className="font-body text-small text-text-muted">
                No statues carved yet. Be the first.
              </p>
            ) : (
              <>
                <p className="font-body text-label text-text-muted mb-md">
                  {signatures.length} carved
                </p>
                <div className="flex flex-wrap gap-md">
                  {signatures.map((sig) => (
                    <StatueTile key={sig.id} signature={sig} />
                  ))}
                </div>
              </>
            )}

            {mightHaveMore && (
              <button
                onClick={() => setTake((t) => t + PAGE)}
                className="mt-xl font-body text-label font-medium text-primary-container hover:text-accent-hover underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
              >
                Load more
              </button>
            )}
          </section>
        </div>
      </main>

      <Footer showContactIcons />

      <CarveModal
        open={carving}
        onClose={() => setCarving(false)}
        onCarve={addSignature}
      />
    </>
  );
}
