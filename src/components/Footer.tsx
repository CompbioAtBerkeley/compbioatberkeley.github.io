import { Link as RouterLink } from "react-router-dom";
import { SiteLogo } from "@/components/SiteLogo";

const quickLinks = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "calendar", path: "/calendar/" },
  { name: "collaborations", path: "/collaborations/" },
  { name: "officers", path: "/officers/" },
  { name: "Join Us", path: "/signup/" },
  { name: "contact", path: "/contact/" },
  { name: "privacy", path: "/privacy/" },
  { name: "developers", path: "/developers/" },
];

const socialLinks = [
  { name: "instagram", url: "https://www.instagram.com/ucb_compbio/" },
  { name: "linkedin", url: "https://www.linkedin.com/company/computational-biology-at-berkeley/" },
  { name: "github", url: "https://github.com/CompbioAtBerkeley" },
  { name: "projects", url: "https://github.com/Compbio-at-berkeley-projects" },
  { name: "linktree", url: "https://linktr.ee/UCB_CompBio" },
];

const Footer = () => (
  <footer className="border-t border-border bg-muted">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div className="flex flex-col gap-3">
        <RouterLink
          to="/"
          className="flex items-center gap-2.5 text-heading hover:text-heading"
          aria-label="Computational Biology at Berkeley home"
        >
          <span className="logo-plate flex h-8 w-8 items-center justify-center overflow-hidden rounded">
            <SiteLogo
              className="h-8 w-8"
              imageClassName="h-8 w-8 object-contain"
              loading="lazy"
            />
          </span>
          <span className="text-[13px] font-bold tracking-[-0.01em]">
            compbio<span className="text-gold">@</span>berkeley
          </span>
        </RouterLink>
        <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
          Bridging the gap between biology and computation through education, research, and community.
        </p>
      </div>

      <nav aria-label="Footer">
        <h2 className="mb-3 text-[11px] font-normal uppercase tracking-[0.14em] text-muted-foreground">
          Pages
        </h2>
        <ul className="space-y-1.5">
          {quickLinks.map((link) => (
            <li key={link.path}>
              <RouterLink
                to={link.path}
                className="text-[13px] text-muted-foreground hover:text-link"
              >
                {link.name}
              </RouterLink>
            </li>
          ))}
        </ul>
      </nav>

      <div>
        <h2 className="mb-3 text-[11px] font-normal uppercase tracking-[0.14em] text-muted-foreground">
          Elsewhere
        </h2>
        <ul className="space-y-1.5">
          {socialLinks.map((social) => (
            <li key={social.name}>
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-muted-foreground hover:text-link"
              >
                {social.name} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-[11px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© {new Date().getFullYear()} computational biology at berkeley</span>
        <span>designed by students, for students</span>
      </div>
    </div>
  </footer>
);

export default Footer;
