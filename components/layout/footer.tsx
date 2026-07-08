import Link from "next/link";
import Image from "next/image";

const socials = [
  { label: "Instagram", href: "https://instagram.com", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg> },
  { label: "TikTok", href: "https://tiktok.com", icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.2c.9.8 2 1.3 3.4 1.4v2.9a6.3 6.3 0 0 1-3.4-1v6.1a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v3a2.5 2.5 0 1 0 1.7 2.4V2h2.8c0 1.2.4 2.3 1 3.2Z" /></svg> },
  { label: "YouTube", href: "https://youtube.com", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" /><path d="M10.5 9.5 15 12l-4.5 2.5v-5Z" fill="currentColor" stroke="none" /></svg> },
  { label: "Discord", href: "https://discord.com", icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 6.4A16 16 0 0 0 15 5.2l-.2.4a13 13 0 0 1 3.3 1.3 12.7 12.7 0 0 0-12.2 0 13 13 0 0 1 3.3-1.3l-.2-.4a16 16 0 0 0-3.9 1.2C3 9.8 2.3 13 2.6 16.2a16.2 16.2 0 0 0 4.7 2.3l.7-1.2a10 10 0 0 1-1.6-.8l.4-.3a11.6 11.6 0 0 0 10.4 0l.4.3a10 10 0 0 1-1.6.8l.7 1.2a16.2 16.2 0 0 0 4.7-2.3c.4-3.6-.5-6.7-2.4-9.8ZM9.7 14.3c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8c0 1-.7 1.8-1.6 1.8Zm4.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8c0 1-.7 1.8-1.6 1.8Z" /></svg> },
  { label: "X", href: "https://x.com", icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4l7.3 9.3L4.4 20h2.3l5.8-5.9 4.4 5.9H21l-7.6-9.7L20 4h-2.3l-5.3 5.4L8.3 4H4Zm3.4 1.6h2l9.3 12.8h-2L7.4 5.6Z" /></svg> },
  { label: "Reddit", href: "https://reddit.com", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="13" r="7.5" /><circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" /><path d="M8.5 16.5c1 .7 2.2 1 3.5 1s2.5-.3 3.5-1" /><path d="M15 6.5 16 3l3 .7" /><circle cx="19" cy="4" r="1.4" /></svg> },
];

const columns = [
  { title: "Explore", links: [{ label: "All content", href: "/" }, { label: "Mods", href: "/mods" }, { label: "Modpacks", href: "/modpacks" }, { label: "Shaders", href: "/shaders" }, { label: "Plugins", href: "/plugins" }, { label: "Maps", href: "/maps" }] },
  { title: "Create", links: [{ label: "Start a project", href: "/create" }, { label: "Submission guide", href: "/docs/submission" }, { label: "Author rewards", href: "/rewards" }, { label: "Apply for an API key", href: "/developers/api-key" }, { label: "3rd party API terms", href: "/developers/terms" }] },
  { title: "Community", links: [{ label: "Join our Discord!", href: "https://discord.com" }, { label: "Ideas portal", href: "/ideas" }, { label: "Plugify blog", href: "/blog" }, { label: "Newsletter", href: "/newsletter" }, { label: "Roadmap", href: "/roadmap" }] },
  { title: "Support", links: [{ label: "Knowledge base", href: "/help" }, { label: "Troubleshooting", href: "/help/troubleshooting" }, { label: "Contact us", href: "/contact" }] },
  { title: "Company", links: [{ label: "About Plugify", href: "/about" }, { label: "Careers", href: "/careers" }, { label: "Press kit", href: "/press" }, { label: "Partnerships", href: "/partners" }] },
];

const legalLinks = [
  { label: "Terms of Service", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Licenses", href: "/legal/licenses" },
  { label: "Author Terms", href: "/legal/author-terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10 lg:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/image/logo.svg"
              alt="Plugify"
              width={40}
              height={40}
              priority
              className="h-10 w-auto"
            />
            <p className="text-sm italic leading-snug text-muted-foreground">
              Plugify — a world of endless possibilities for Minecraft creators
              and players.
              <br />
              Find the best mods, plugins, and modpacks here!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={social.label}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="block h-5 w-5">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="my-8 h-px w-full bg-border" aria-hidden />

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-8 h-px w-full bg-border" aria-hidden />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Plugify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}