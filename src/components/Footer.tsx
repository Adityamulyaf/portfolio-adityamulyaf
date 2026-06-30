import Image from "next/image";
import myStatue from "../../public/my-statue.png";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-border mt-auto relative z-0 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-max-width mx-auto px-gutter md:px-xl pt-xl pb-[260px] md:pb-xl relative">
        <div className="mb-lg md:mb-0 text-left z-10">
          <p className="font-mono-label text-[11px] text-on-surface uppercase tracking-widest mb-xs">
            Adityamulyaf
          </p>
          <p className="font-metadata text-[13px] text-secondary leading-relaxed">
            © {new Date().getFullYear()} Adityamulyaf.
          </p>
        </div>

        {/* Mobile Statue at the absolute bottom edge of the footer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[280px] h-[240px] md:hidden z-0">
          <Image
            src={myStatue}
            alt="My Statue"
            fill
            sizes="280px"
            className="object-contain object-bottom pointer-events-none"
            priority
          />
        </div>
      </div>
    </footer>
  );
}
