import { useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight, Dna, X } from "lucide-react";
import { Link } from "react-router-dom";

const dismissalKey = "compbio-fall-2026-recruitment-update-2026-09-03-dismissed";
const coffeeChatLink =
  "https://docs.google.com/document/d/1ZGq3KV4MprEdPDUu8v7QO9AuGSpB2eEmsyVCCK9nLDU/edit?usp=sharing";
const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const RecruitmentBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  useBrowserLayoutEffect(() => {
    try {
      setIsDismissed(window.sessionStorage.getItem(dismissalKey) === "true");
    } catch {
      // Keep the banner available when browser storage is disabled.
    }
  }, []);

  const dismissBanner = () => {
    setIsDismissed(true);

    try {
      window.sessionStorage.setItem(dismissalKey, "true");
    } catch {
      // The in-memory dismissal still applies for this page view.
    }
  };

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Fall 2026 recruitment announcement"
      className="relative isolate overflow-hidden border-b border-border bg-card/90"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(90deg, hsl(var(--background) / 0.72), hsl(var(--gold) / 0.07) 36%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.07) 64%, hsl(var(--background) / 0.72))",
        }}
      />

      <div className="mx-auto flex min-h-12 max-w-6xl items-center justify-center px-14 py-2.5 text-center sm:px-16">
        <div className="flex w-full min-w-0 flex-col items-center justify-center gap-1.5 sm:flex-row sm:gap-3">
          <div className="flex min-w-0 items-center justify-center gap-2">
            <Dna className="h-4 w-4 shrink-0 text-label" aria-hidden="true" />
            <p className="min-w-0 text-[13px] leading-5 text-foreground">
              <strong className="font-bold text-heading">
                Fall 2026 recruitment timeline updated.
              </strong>{" "}
              Apply by September 11 at 5 PM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/signup/"
              className="group inline-flex min-h-8 shrink-0 items-center gap-1.5 border-b border-heading/40 text-xs font-bold text-heading transition-colors hover:border-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              sign up
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <a
              href={coffeeChatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-8 shrink-0 items-center gap-1.5 border-b border-heading/40 text-xs font-bold text-heading transition-colors hover:border-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              coffee chats
              <ArrowRight
                className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={dismissBanner}
        aria-label="Dismiss Fall 2026 recruitment announcement"
        className="absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/70 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:right-3"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
};

export default RecruitmentBanner;
