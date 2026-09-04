import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { SiteLogo } from "@/components/SiteLogo";
import { SITE_FAVICON_DARK_SRC, SITE_FAVICON_LIGHT_SRC } from "@/lib/siteLogo";
import { runBioThemeTransition } from "@/lib/themeTransition";

const navItems = [
  { name: "home", path: "/" },
  { name: "about", path: "/about/" },
  { name: "calendar", path: "/calendar/" },
  { name: "collabs", path: "/collaborations/" },
  { name: "officers", path: "/officers/" },
];

const ThemeToggle = ({ mobile = false }: { mobile?: boolean }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const themeColor = isDark ? "#0A1220" : "#FFFFFF";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColor);
    document
      .querySelector('link[data-theme-favicon]')
      ?.setAttribute("href", isDark ? SITE_FAVICON_DARK_SRC : SITE_FAVICON_LIGHT_SRC);
  }, [isDark, mounted]);

  return (
    <button
      type="button"
      onClick={(event) =>
        runBioThemeTransition({
          nextTheme: isDark ? "light" : "dark",
          setTheme,
          trigger: event.currentTarget,
        })
      }
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded border border-border bg-button-surface font-sans text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px ${
        mobile ? "w-full px-3" : "px-2.5"
      }`}
    >
      {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      {isDark ? "light" : "dark"}
    </button>
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const normalizePath = (path: string) => path === "/" ? path : path.replace(/\/$/, "");
  const isActive = (path: string) => normalizePath(location.pathname) === normalizePath(path);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 text-heading hover:text-heading"
            aria-label="Computational Biology at Berkeley home"
          >
            <span className="logo-plate flex h-8 w-8 items-center justify-center overflow-hidden rounded">
              <SiteLogo className="h-8 w-8" imageClassName="h-8 w-8 object-contain" />
            </span>
            <span className="text-[13px] font-bold tracking-[-0.01em]">
              compbio<span className="text-gold">@</span>berkeley
            </span>
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`border-b-2 pb-0.5 text-xs tracking-wide transition-colors ${
                  isActive(item.path)
                    ? "border-gold text-heading"
                    : "border-transparent text-muted-foreground hover:text-heading"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <Link
              to="/signup/"
              aria-current={isActive("/signup/") ? "page" : undefined}
              className="rounded bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px"
            >
              Join Us
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded text-heading hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div id="mobile-navigation" className="border-t border-border py-2 lg:hidden">
            {[...navItems, { name: "Join Us", path: "/signup/" }].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`flex min-h-11 items-center border-l-2 px-3 text-sm ${
                  isActive(item.path)
                    ? "border-gold bg-muted text-heading"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-heading"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-1 pb-1 pt-2">
              <ThemeToggle mobile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
