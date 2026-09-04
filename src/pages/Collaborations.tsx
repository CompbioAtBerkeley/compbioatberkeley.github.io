import { ExternalLink } from "lucide-react";
import { PartnerLogoWall } from "@/components/PartnerLogoWall";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { PageHeader, SectionHeading } from "@/components/PageHeader";

const LINKEDIN =
  "https://www.linkedin.com/company/computational-biology-at-berkeley/";
const LINKTREE = "https://linktr.ee/UCB_CompBio";

const Collaborations = () => (
  <div>
    <PageHeader
      eyebrow="03 / collaborations"
      title="Work with us"
      lede="We welcome collaboration with students, alumni, faculty, and industry partners to advance computational biology education and research."
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <PartnerLogoWall
        title="Organizations we work with"
        lede="A shared network spanning research, therapeutics, genomics, and computational tooling."
      />
    </section>

    <div className="border-t border-border" />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <SectionHeading title="Ways to work together" meta="03 tracks" />

      <div className="border-y border-border">
        <div className="grid gap-6 py-8 md:grid-cols-[180px_1fr] md:gap-10">
          <div>
            <p className="text-[11px] text-label">[01]</p>
            <h3 className="mt-2 text-lg font-bold text-heading">Research projects</h3>
          </div>
          <div>
            <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              We can help you build computational tools and analyze data to accelerate your biological research.
            </p>
            <EnhancedButton asChild variant="outline" className="mt-4">
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                contact our projects lead
                <ExternalLink />
              </a>
            </EnhancedButton>
          </div>
        </div>

        <div className="grid gap-6 border-t border-border py-8 md:grid-cols-[180px_1fr] md:gap-10">
          <div>
            <p className="text-[11px] text-label">[02]</p>
            <h3 className="mt-2 text-lg font-bold text-heading">Share your experience</h3>
          </div>
          <div>
            <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              Give a presentation on industry or research topics related to computational biology.
            </p>
            <EnhancedButton asChild variant="outline" className="mt-4">
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                contact our academic lead
                <ExternalLink />
              </a>
            </EnhancedButton>
          </div>
        </div>

        <div className="grid gap-6 border-t border-border py-8 md:grid-cols-[180px_1fr] md:gap-10">
          <div>
            <p className="text-[11px] text-label">[03]</p>
            <h3 className="mt-2 text-lg font-bold text-heading">Industry partners</h3>
          </div>
          <div>
            <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
              Partner with us through sponsorships, guest lectures, workshop collaborations, and internship
              opportunities. Help us bridge the gap between academia and industry.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded border border-border bg-card p-5">
                <h4 className="text-[11px] uppercase tracking-[0.12em] text-label">
                  What we can provide
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Top undergraduates in computational biology</li>
                  <li>Software development for research</li>
                  <li>A platform to promote events and opportunities</li>
                </ul>
              </div>
              <div className="rounded border border-border bg-card p-5">
                <h4 className="text-[11px] uppercase tracking-[0.12em] text-label">
                  What we are looking for
                </h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>Company tours and connections</li>
                  <li>Computational resources and mentorship</li>
                  <li>Research partnerships</li>
                </ul>
                <p className="mt-3 text-[11px] text-muted-foreground">open to discussion</p>
              </div>
            </div>

            <EnhancedButton asChild variant="primary" className="mt-6">
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                contact partnerships
                <ExternalLink />
              </a>
            </EnhancedButton>
          </div>
        </div>
      </div>

      <div className="mt-14 rounded border border-border bg-muted p-8 md:p-10">
        <h2 className="text-2xl font-bold text-heading">Ready to collaborate?</h2>
        <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
          We are always looking for opportunities to work with people and organizations who share our
          commitment to computational biology.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <EnhancedButton asChild variant="gold">
            <a href={LINKTREE} target="_blank" rel="noopener noreferrer">
              contact us
              <ExternalLink />
            </a>
          </EnhancedButton>
          <EnhancedButton asChild variant="outline">
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              message us on linkedin
              <ExternalLink />
            </a>
          </EnhancedButton>
        </div>
      </div>
    </section>
  </div>
);

export default Collaborations;
