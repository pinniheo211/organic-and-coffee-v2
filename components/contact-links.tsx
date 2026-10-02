import { email, facebookUrl, instagramUrl, mapsUrl, phoneHref } from "@/lib/site";

const contacts = [
  { name: "Facebook", href: facebookUrl, icon: "facebook", external: true },
  { name: "Instagram", href: instagramUrl, icon: "instagram", external: true },
  { name: `Email ${email}`, href: `mailto:${email}`, icon: "mail", external: false },
  { name: "Call the Organic Market", href: phoneHref, icon: "phone", external: false },
  { name: "Directions on Google Maps", href: mapsUrl, icon: "map", external: true },
] as const;

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`contact-links ${className}`}>
      {contacts.map(({ name, href, icon, external }) => (
        <a
          key={icon}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          aria-label={`${name}${external ? " (opens in a new tab)" : ""}`}
          title={name}
          className="contact-icon"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {icon === "facebook" && <path d="M14 21v-8h3l.5-4H14V7c0-1 .3-1.5 1.5-1.5H18V2.2c-.6-.1-1.8-.2-3.2-.2C11.7 2 10 3.8 10 7v2H7v4h3v8" />}
            {icon === "instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>}
            {icon === "mail" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>}
            {icon === "phone" && <path d="m8 3 3 5-3 3c1.3 2.5 2.5 3.7 5 5l3-3 5 3c-1 5-4 6-8 4-5-2.4-8.6-6-11-11C0 5 3 2 8 3Z" />}
            {icon === "map" && <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
          </svg>
        </a>
      ))}
    </div>
  );
}
