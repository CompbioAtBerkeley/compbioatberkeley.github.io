import { ExternalLink } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { EnhancedButton } from "@/components/ui/enhanced-button";

const contactChannels = [
  {
    label: "General and professional inquiries",
    detail:
      "Email compbioatberkeley@gmail.com with questions from students, researchers, alumni, speakers, sponsors, and organizations interested in working with us. A short note describing who you are and what you would like to discuss helps the student team route the request.",
    action: "email our team",
    href: "mailto:compbioatberkeley@gmail.com",
  },
  {
    label: "Events and community updates",
    detail:
      "Use Instagram for current event announcements, community recaps, and informal updates. Check the public calendar first when you need a date, time, or location; event details can change during the academic term.",
    action: "visit our Instagram",
    href: "https://www.instagram.com/ucb_compbio/",
  },
  {
    label: "Current forms and destinations",
    detail:
      "Use Linktree when you need the latest public signup, application, or community link. Forms are hosted by their respective providers, and their availability may follow a recruitment or project cycle.",
    action: "open our Linktree",
    href: "https://linktr.ee/UCB_CompBio",
  },
];

const Contact = () => (
  <div>
    <PageHeader
      eyebrow="07 / contact"
      title="Contact our team"
      lede="Choose the public channel that best matches your question. Computational Biology at Berkeley is student-run, so response times may vary during exams and academic breaks."
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <SectionHeading title="Where to reach us" meta="03 channels" />
      <p className="mb-8 max-w-[68ch] text-sm leading-relaxed text-muted-foreground md:text-base">
        The channels below are the organization&apos;s verified public contact points. We do not
        currently publish a phone number. Please do not send sensitive health, research, academic,
        or personal data through email, social platforms, or public forms.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {contactChannels.map((channel, index) => (
          <article key={channel.label} className="flex flex-col rounded border border-border bg-card p-6">
            <p className="text-[11px] text-label">[{String(index + 1).padStart(2, "0")}]</p>
            <h2 className="mt-3 text-lg font-bold text-heading">{channel.label}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {channel.detail}
            </p>
            <EnhancedButton asChild variant="outline" className="mt-6 self-start">
              <a href={channel.href} target="_blank" rel="noopener noreferrer">
                {channel.action}
                <ExternalLink />
              </a>
            </EnhancedButton>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded border border-border bg-muted p-7 md:p-9">
        <h2 className="text-xl font-bold text-heading">Before you contact us</h2>
        <p className="mt-3 max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
          Students looking to participate should begin with the Join page. Potential project,
          research, speaker, or sponsorship partners should review Collaborations. For scheduled
          activities, the Calendar is the canonical public event source. Providing the relevant
          program, date, and desired next step in your first message makes it easier for our officers
          to respond.
        </p>
      </div>
    </section>
  </div>
);

export default Contact;
