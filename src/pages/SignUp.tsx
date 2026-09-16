import { ExternalLink } from "lucide-react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { SiLinktree } from "react-icons/si";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { PageHeader } from "@/components/PageHeader";
import { publicAssetPath } from "@/lib/publicAsset";

const NEWSLETTER_FORM = "https://forms.gle/qCxn93mfunF3Dtep7";

const socials = [
  {
    name: "Instagram",
    detail: "@ucb_compbio",
    url: "https://www.instagram.com/ucb_compbio/",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    detail: "CompBio at Berkeley",
    url: "https://www.linkedin.com/company/computational-biology-at-berkeley/",
    icon: FaLinkedinIn,
  },
  {
    name: "Linktree",
    detail: "All club links",
    url: "https://linktr.ee/UCB_CompBio",
    icon: SiLinktree,
  },
];

const SignUp = () => (
  <div>
    <PageHeader
      eyebrow="Stay connected"
      title="Join our community"
      lede="Stay connected with Computational Biology at Berkeley and be the first to know about events, opportunities, and updates."
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <div className="grid gap-4">
        <article className="rounded border border-border bg-card p-6 md:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="eyebrow">Recruitment update</p>
            <h2 className="mt-3 text-3xl font-bold text-heading">
              Recruiting for fall 2026 has ended.
            </h2>
            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted-foreground md:text-base">
              Thank you to everyone who applied or joined us during recruiting. Subscribe to our
              newsletter or follow our public channels for future recruitment updates, events, and
              ways to get involved.
            </p>
          </div>
        </article>

        <article className="relative isolate flex min-h-64 flex-col overflow-hidden rounded border border-border bg-card p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <img
              src={publicAssetPath("/forms/newsletter-form-preview.webp")}
              alt=""
              width="960"
              height="600"
              loading="lazy"
              decoding="async"
              draggable="false"
              className="h-full w-full object-cover object-top opacity-[0.14] grayscale contrast-75 dark:opacity-[0.1]"
            />
            <span className="absolute inset-0 bg-gradient-to-r from-card via-card/95 to-card/75" />
          </div>

          <div className="flex flex-1 flex-col">
            <div>
              <p className="eyebrow">Monthly newsletter</p>
              <h2 className="mt-3 text-2xl font-bold text-heading">Get the newsletter</h2>
              <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                Subscribe for club news, upcoming socials, general meetings, and professional
                opportunities.
              </p>
            </div>

            <div className="mt-auto pt-8">
              <EnhancedButton asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <a href={NEWSLETTER_FORM} target="_blank" rel="noopener noreferrer">
                  Sign up for the newsletter
                  <ExternalLink />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </EnhancedButton>
            </div>
          </div>
        </article>

        <article className="rounded border border-border bg-card p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div>
              <p className="eyebrow">Social channels</p>
              <h2 className="mt-3 text-2xl font-bold text-heading">Connect with us</h2>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                Follow along between meetings. Events, recaps, and opportunities go out here first.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name} (opens in a new tab)`}
                    className="flex min-h-28 items-center gap-4 rounded border border-border bg-background p-4 text-heading transition-colors duration-150 hover:border-border-strong hover:bg-muted hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="h-9 w-9 shrink-0 text-link" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-bold">
                        {social.name}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {social.detail}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
);

export default SignUp;
