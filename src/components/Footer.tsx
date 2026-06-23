export default function Footer() {
  return (
    <footer className="bg-transparent border-t border-border mt-auto relative z-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center max-w-max-width mx-auto px-gutter md:px-xl py-xl">
        <div className="mb-lg md:mb-0 text-left">
          <p className="font-mono-label text-[11px] text-on-surface uppercase tracking-widest mb-xs">
            Adityamulyaf
          </p>
          <p className="font-metadata text-[13px] text-secondary leading-relaxed">
            © {new Date().getFullYear()} Adityamulyaf.
          </p>
        </div>
      </div>
    </footer>
  );
}
