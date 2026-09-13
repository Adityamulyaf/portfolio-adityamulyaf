import Image from "next/image";
import myStatue from "../../public/my-statue.png";
import { SocialIcon, ICON_PATHS } from "./SocialIcon";

const CONTACT_LINKS = [
  { label: "Email", href: "mailto:adityamulyaf@gmail.com", icon: ICON_PATHS.email, external: false },
  { label: "LinkedIn", href: "https://linkedin.com/in/firizqi-aditya-mulya", icon: ICON_PATHS.linkedin, external: true },
  { label: "GitHub", href: "https://github.com/adityamulyaf", icon: ICON_PATHS.github, external: true },
  { label: "Instagram", href: "https://instagram.com/adityamulyaf", icon: ICON_PATHS.instagram, external: true },
];

interface FooterProps {
  /** The homepage already has a full Contact section with these same links,
      so the icon row here is only for pages that don't: project detail
      pages and the guestbook. */
  showContactIcons?: boolean;
}

export default function Footer({ showContactIcons = false }: FooterProps) {
  return (
    <footer className="bg-transparent border-t border-border mt-auto relative z-0 overflow-hidden">
      <div className="flex flex-row justify-between items-start md:items-center max-w-max-width mx-auto px-gutter md:px-xl pt-xl pb-[260px] md:pb-xl gap-lg relative">
        <div className="text-left z-10">
          <p className="font-display italic text-h4 text-on-surface mb-xs">
            Adityamulyaf
          </p>
          <p className="font-body text-label text-secondary">
            © {new Date().getFullYear()} Adityamulyaf.
          </p>
        </div>

        {/* Icon-only: the destination is enough, no label needed. */}
        {showContactIcons && (
          <div className="flex items-center gap-md z-10">
            {CONTACT_LINKS.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                {...(contact.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                aria-label={contact.label}
                className="group"
              >
                <SocialIcon path={contact.icon} className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}

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
