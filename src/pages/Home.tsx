import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { HeroGenomePathfinder } from "@/components/HeroGenomePathfinder";
import { HeroScienceGraphic } from "@/components/HeroScienceGraphic";
import { PartnerLogoWall } from "@/components/PartnerLogoWall";
import { SectionHeading } from "@/components/PageHeader";
import RecruitmentBanner from "@/components/RecruitmentBanner";

const objectives = [
  {
    n: "01",
    title: "Expand understanding",
    body: "Expand members' understanding of computational biology through hands-on learning and research.",
  },
  {
    n: "02",
    title: "Build connections",
    body: "Build connections with peers, faculty, alumni, and industry professionals in the field.",
  },
  {
    n: "03",
    title: "Real-world impact",
    body: "Engage in projects with real-world impact on healthcare and communities.",
  },
];

const Home = () => (
  <div>
    <RecruitmentBanner />

    <section className="hero-shell relative isolate overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0 z-0 bg-lab-grid" aria-hidden="true" />
      <HeroGenomePathfinder />

      <div className="hero-content relative z-10 mx-auto flex max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="hero-copy max-w-[36rem]">
          <p className="eyebrow">Student org / UC Berkeley</p>
          <h1 className="hero-title mt-5 max-w-[15ch] text-4xl font-bold leading-[1.08] text-heading sm:text-5xl md:text-6xl">
            Computational Biology at <span className="gold-mark hero-title-mark">Berkeley</span>
          </h1>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            A student-driven community exploring the intersection of computer science, biology, and healthcare.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <EnhancedButton asChild variant="primary" size="lg">
              <a
                href="https://forms.gle/4cR1nfRoLb2LGNbi7"
                target="_blank"
                rel="noopener noreferrer"
              >
                apply for Fall 2026
                <ExternalLink />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </EnhancedButton>
            <EnhancedButton asChild variant="outline" size="lg">
              <Link to="/about/">about us</Link>
            </EnhancedButton>
          </div>
        </div>
      </div>

      <div className="hero-science-field" aria-hidden="true">
        <HeroScienceGraphic className="w-full" />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      <SectionHeading title="What we aim to do" meta="03 objectives" />
      <p className="mb-8 max-w-[68ch] text-sm leading-relaxed text-muted-foreground md:text-base">
        We make computational biology easier to enter and more useful to practice. Members can learn
        core methods, meet collaborators across disciplines, and apply those skills in student-led
        work. Our public calendar, officer directory, collaboration information, and interest forms
        are the best starting points for students and partners looking for current opportunities.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {objectives.map((item) => (
          <article
            key={item.n}
            className="rounded border border-border bg-card p-6 transition-colors hover:border-border-strong"
          >
            <p className="text-[11px] text-label">[{item.n}]</p>
            <h3 className="mt-3 text-base font-bold text-heading">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </article>
        ))}
      </div>

      <EnhancedButton asChild variant="outline" className="mt-8">
        <Link to="/about/">read our mission</Link>
      </EnhancedButton>

      <div className="mt-16 border-t border-border pt-12">
        <SectionHeading title="A practical starting point" meta="all experience levels" />
        <div className="grid gap-6 text-sm leading-relaxed text-muted-foreground md:grid-cols-3 md:text-base">
          <p>
            Computational biology brings software, statistics, and biological knowledge together to
            study living systems and health. Students arrive from many majors, so participation does
            not depend on already knowing every part of that toolkit. Workshops and peer learning
            create a shared foundation before members move into deeper research or project work.
          </p>
          <p>
            New members can begin with a public event, join the update list, and meet students who
            are learning the same methods. As their interests develop, they can explore technical
            projects, leadership, professional conversations, and connections with research groups.
            The organization is a place to ask informed questions and build experience with others.
          </p>
          <p>
            Faculty, researchers, alumni, and industry teams can use the collaboration page to
            propose a talk, mentorship opportunity, research problem, or partnership. The calendar
            and officer roster provide current public context, while the contact page identifies the
            verified channels for reaching the student team without relying on an outdated address.
          </p>
        </div>
      </div>
    </section>

    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <PartnerLogoWall
          title="Collaborators in our orbit"
          lede="From research institutions to biotech teams, these organizations have shared expertise, projects, and opportunities with our community."
        />
      </div>
    </section>

    <section className="border-t border-border bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-heading">Come build with us</h2>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
            Workshops, project teams, and a mailing list that tells you when things happen. No prior
            bioinformatics experience required.
          </p>
        </div>
        <EnhancedButton asChild variant="gold" size="lg" className="shrink-0">
          <Link to="/signup/">join the list</Link>
        </EnhancedButton>
      </div>
    </section>
  </div>
);

export default Home;
