import Image from "next/image";
import myStatue from "../../public/my-statue.png";

export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-border mt-auto relative z-0 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-max-width mx-auto px-gutter md:px-xl pt-xl pb-[260px] md:pb-xl relative">
        <div className="mb-lg md:mb-0 text-left z-10">
          <p className="font-display italic text-h4 text-on-surface mb-xs">
            Adityamulyaf
          </p>
          <p className="font-body text-label text-secondary">
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
