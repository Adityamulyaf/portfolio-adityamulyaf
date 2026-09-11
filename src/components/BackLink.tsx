"use client";

import { useRouter } from "next/navigation";

/**
 * Returns to wherever the reader came from.
 *
 * Every attempt to compute this — a hash link, a stored section name, a
 * measured offset — has to work out where the section will sit on a page that
 * is still being assembled, and lands on whatever the transition happened to
 * measure. Browser history already holds the exact answer: the scroll position
 * the reader left behind. So ask for that instead of recomputing it.
 *
 * Falls back to the homepage when there is no in-site history to go back to —
 * someone arriving from a search result or a shared link.
 */
export default function BackLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const goBack = () => {
    const cameFromHere =
      typeof document !== "undefined" &&
      document.referrer !== "" &&
      new URL(document.referrer).origin === window.location.origin;

    if (cameFromHere) router.back();
    else router.push("/");
  };

  return (
    <button type="button" onClick={goBack} className={className}>
      {children}
    </button>
  );
}
