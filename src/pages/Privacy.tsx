import { PageHeader, SectionHeading } from "@/components/PageHeader";

const practices = [
  {
    title: "Information this site receives",
    body: "The public website does not provide member accounts, accept payments, or directly collect form submissions. Like most hosted websites, requests may include technical information such as an IP address, browser type, device type, referring page, and requested URL. Google Analytics may process usage events so the student team can understand which public pages are useful.",
  },
  {
    title: "Forms, calendars, and external services",
    body: "Newsletter and other public forms are hosted by Google Forms, and the events page displays a Google Calendar. Social and community links lead to services including LinkedIn, Instagram, Linktree, and GitHub. When you open or submit through those services, their privacy terms and account settings govern the information they receive. Review a form before sending personal information.",
  },
  {
    title: "Local preferences and site operation",
    body: "The site stores a theme preference in your browser so light, dark, or system appearance can persist across visits. This preference supports display and interface choices; it is not used by the organization to build a member profile.",
  },
  {
    title: "Choices and questions",
    body: "You can limit analytics or external-service storage through browser controls, content blockers, and the privacy settings of each linked service. Avoid submitting confidential health, research, academic, or identity information unless a form clearly requests it and you are comfortable with its stated purpose. Use the Contact page for questions about this notice or a public organization channel.",
  },
];

const Privacy = () => (
  <div>
    <PageHeader
      eyebrow="08 / privacy"
      title="Privacy notice"
      lede="This notice explains the data surfaces on the Computational Biology at Berkeley public website and where third-party services take over."
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <SectionHeading title="How the site handles information" meta="updated Sep 15, 2026" />
      <p className="mb-10 max-w-[72ch] text-base leading-relaxed text-muted-foreground">
        Computational Biology at Berkeley is a student organization, and this site is published
        through GitHub Pages. We collect only what is needed to operate and understand the public
        site. This notice covers pages at compbioatberkeley.github.io; it does not replace the
        policies shown by services linked or embedded on those pages.
      </p>

      <div className="border-y border-border">
        {practices.map((practice, index) => (
          <article
            key={practice.title}
            className="grid gap-4 border-b border-border py-8 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-10"
          >
            <div>
              <p className="text-[11px] text-label">[{String(index + 1).padStart(2, "0")}]</p>
              <h2 className="mt-2 text-lg font-bold text-heading">{practice.title}</h2>
            </div>
            <p className="max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
              {practice.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default Privacy;
