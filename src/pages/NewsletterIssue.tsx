import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ChevronDown, Clock, Expand, ArrowUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewsletterPartnerLogo } from "@/components/NewsletterMedia";
import { newsletterImage, newsletterImageSize } from "@/lib/newsletterImage";
import { newsletters } from "@/data/newsletters";
import content from "@/data/newsletters/fall-2026-newsletter-1.json";
import NotFound from "./NotFound";
import "./newsletter.css";

const Photo = ({ name, alt, caption, portrait = false }: { name: string; alt: string; caption?: string; portrait?: boolean }) => (
  <figure className={portrait ? "newsletter-photo newsletter-photo-portrait" : "newsletter-photo"}>
    <Dialog>
      <DialogTrigger asChild>
        <button className="newsletter-photo-button" aria-label={`Enlarge photo: ${alt}`} type="button">
          <img src={newsletterImage(name)} {...newsletterImageSize(name)} alt={alt} loading="lazy" decoding="async" />
          <span className="newsletter-photo-expand" aria-hidden="true"><Expand size={15} /></span>
        </button>
      </DialogTrigger>
      <DialogContent className="newsletter-image-dialog">
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <img src={newsletterImage(name)} {...newsletterImageSize(name)} alt={alt} />
        <DialogDescription>{caption || alt}</DialogDescription>
      </DialogContent>
    </Dialog>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

const sectionLinks = [
  ["upcoming-events", "On the calendar"], ["introduction", "Meet the community"],
  ["past-events", "Event spotlight"], ["spring-projects", "Explore the projects"],
  ["fall-projects", "What’s next"], ["fall-recap", "Back on campus"],
  ["bootcamp", "The new bootcamp"],
];

const linkedText = (text: string) => {
  const links: Record<string, string> = {
    "anonymous feedback form": content.links.feedback, "Slack": content.links.slack,
    "Instagram": "https://www.instagram.com/ucb_compbio/", "LinkedIn": content.links.linkedin,
    "priyambaruah1199@berkeley.edu": "mailto:priyambaruah1199@berkeley.edu",
    "soumtalu@berkeley.edu": "mailto:soumtalu@berkeley.edu", "club website": content.links.website,
  };
  return text.split(/(anonymous feedback form|Slack|Instagram|LinkedIn|priyambaruah1199@berkeley.edu|soumtalu@berkeley.edu|club website)/g)
    .map((part, index) => links[part] ? <a key={index} href={links[part]}>{part}</a> : part);
};

const projectFields = ["Genomics", "Drug discovery", "Health technology", "AI & genomics", "Biological aging"];
const ProjectExplorer = () => {
  const [open, setOpen] = useState<number[]>([0]);
  const allOpen = open.length === content.projects.length;
  const toggle = (index: number) => setOpen((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  return <>
    <div className="newsletter-project-tools"><span>Five teams. Five questions to explore.</span><button type="button" onClick={() => setOpen(allOpen ? [] : content.projects.map((_, index) => index))}>{allOpen ? "Collapse all" : "Expand all"}</button></div>
    <div className="newsletter-project-grid">
      {content.projects.map((project, index) => <section className={`newsletter-project ${open.includes(index) ? "is-open" : ""}`} key={project.title}>
        <div className="newsletter-project-mark"><NewsletterPartnerLogo name={project.title.replace(/^Project \d+: /, "")} /></div>
        <p className="newsletter-project-field">0{index + 1} / {projectFields[index]}</p>
        <h3><button type="button" aria-expanded={open.includes(index)} aria-controls={`project-${index}-description`} onClick={() => toggle(index)}>{project.title.replace(/^Project \d+: /, "")}<ChevronDown size={18} aria-hidden="true" /></button></h3>
        <div id={`project-${index}-description`} hidden={!open.includes(index)}><p>{project.text}</p></div>
      </section>)}
    </div>
  </>;
};

const NewsletterIssue = () => {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState("upcoming-events");
  const [progress, setProgress] = useState(0);
  const newsletter = newsletters.find((candidate) => candidate.slug === slug);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".newsletter-article");
    if (!article) return;
    let frame = 0;
    const measure = () => {
      const rect = article.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight + 64);
      setProgress(Math.min(100, Math.max(0, (64 - rect.top) / distance * 100)));
      let current = sectionLinks[0][0];
      for (const [id] of sectionLinks) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < window.innerHeight * 0.4) current = id;
      }
      setActiveSection(current);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(article);
    measure();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); resize.disconnect(); cancelAnimationFrame(frame); };
  }, [slug]);

  if (!newsletter || slug !== "fall-2026-newsletter-1") return <NotFound />;

  return (
    <div className="newsletter-reader" id="newsletter-top">
      <div className="newsletter-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="newsletter-reader-bar"><Link to="/newsletter/"><ArrowLeft size={15} aria-hidden="true" /> All newsletters</Link><span>CB@B / Fall 2026 / Issue 01</span></div>
      <article className="newsletter-article">
        <header className="newsletter-hero">
          <div className="newsletter-hero-copy">
            <p className="eyebrow">The newsletter / Issue 01</p>
            <h1><span>Fall 2026</span> Newsletter 1</h1>
            <p className="newsletter-hero-deck">A new semester of ideas, discoveries, and connections at Computational Biology at Berkeley.</p>
            <div className="newsletter-byline"><img src={newsletterImage("benjamin-tong")} alt="" width="44" height="44" /><span><strong>Benjamin Tong</strong><span>Club secretary</span></span><span className="newsletter-read-time"><Clock size={13} aria-hidden="true" /> 9 min read</span></div>
          </div>
          <div className="newsletter-hero-photo"><Photo name="cover" alt="Computational Biology at Berkeley officers on campus" /><span>Biology × computation × community</span></div>
        </header>

        <div className="newsletter-reading-layout">
          <aside className="newsletter-sidebar">
            <nav className="newsletter-contents" aria-label="In this newsletter">
              <p>In this issue</p>
              {sectionLinks.map(([id, label], index) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}><span>0{index + 1}</span>{label}</a>)}
            </nav>
            <p className="newsletter-reading-status">{Math.round(progress)}% through this issue</p>
            <Link className="newsletter-sidebar-archive" to="/newsletter/">View the archive <ArrowUpRight size={13} aria-hidden="true" /></Link>
          </aside>
          <div className="newsletter-body">
            <div className="newsletter-opening"><blockquote>{content.openingQuote}</blockquote><p>{content.opening}</p></div>

            <section id="upcoming-events" className="newsletter-section newsletter-events">
              <p className="newsletter-section-label">01 / Save the dates</p><h2>Upcoming events</h2>
              <ul>{content.events.map((event) => <li key={event.name}><span>{event.date}</span><strong>{event.name}</strong><span>{event.time}</span></li>)}</ul>
              <p className="newsletter-note">Dates from this Fall 2026 edition. <Link to="/calendar/">View the current calendar <ArrowUpRight size={12} aria-hidden="true" /></Link></p>
            </section>

            <section id="introduction" className="newsletter-section">
              <p className="newsletter-section-label">02 / The people behind CB@B</p><h2>Introduction</h2>
              <div className="newsletter-columns newsletter-author-intro"><p>{content.introduction.secretary}</p><Photo name="benjamin-tong" alt="Benjamin Tong, newsletter secretary" caption="Secretary: Benjamin Tong" /></div>
              {content.introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="newsletter-columns newsletter-leadership"><Photo name="co-presidents" alt="Priyam Baruah and Soumyadeep Talukdar presenting to members" caption="Co-presidents (from left to right): Priyam Baruah and Soumyadeep Talukdar" /><p>{content.introduction.presidents}</p></div>
              <div className="newsletter-highlights">{['guest-speaker', 'project-community', 'professional-development'].map((name, index) => <Photo key={name} name={name} alt={['A guest speaker presenting at a club meeting', 'Club members presenting a research project', 'Members attending a pitch preparation event'][index]} caption={content.highlights[index]} />)}</div>
            </section>

            <section id="past-events" className="newsletter-section">
              <p className="newsletter-section-label">03 / In good company</p><h2>Past event spotlight</h2>
              <h3>First General Meeting Recap with Guest Speaker Shane Brubaker</h3><p>{content.spotlight.intro}</p>
              <Photo name="shane-brubaker" alt="Shane Brubaker delivering a bioinformatics talk" caption={content.spotlight.caption} />
              {content.spotlight.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="newsletter-workshop"><h3>Resume &amp; LinkedIn Workshop</h3><div className="newsletter-columns"><p>{content.workshop[0]}</p><Photo name="resume-workshop" alt="The Professional Development team hosting a resume and LinkedIn workshop" /></div>{content.workshop.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </section>

            <section id="spring-projects" className="newsletter-section">
              <p className="newsletter-section-label">04 / From ideas to experiments</p><h2>Last semester’s projects</h2>
              <p>{content.projectsIntro}</p><ProjectExplorer />
            </section>

            <section id="fall-projects" className="newsletter-section newsletter-next"><p className="newsletter-section-label">05 / Looking ahead</p><h2>This semester’s projects</h2><p>{content.currentProjects}</p><p className="newsletter-note">{content.projectsNote}</p></section>

            <section id="fall-recap" className="newsletter-section">
              <p className="newsletter-section-label">06 / Back on campus</p><h2>First Fall 2026 General Meeting recap</h2><p>{content.fallRecap}</p>
              <div className="newsletter-columns"><Photo name="fall-social" alt="Members getting to know one another at the fall meeting social" caption="Members lined up to participate in a “speed dating” social to get to know one another with prepared questions." /><Photo name="officer-info-session" alt="Club officers gathered after an information session" caption="Officers debriefing at our second info session, where prospective general and committee members met the board." /></div>
            </section>

            <section id="bootcamp" className="newsletter-section">
              <p className="newsletter-section-label">07 / Start here</p><h2>New member bootcamp program highlight</h2>
              <Photo name="bootcamp-lecture" alt="A classroom lecture from the new member bootcamp" caption={content.bootcampCaption} />
              <div className="newsletter-columns newsletter-bootcamp-copy"><div>{content.bootcamp.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><Photo name="bootcamp-workshop" alt="Bootcamp leaders helping students with workshop materials" /></div>
            </section>

            <footer className="newsletter-signoff">
              <p className="newsletter-section-label">Keep the conversation going</p><h2>Built by this community.</h2>
              {content.closing.map((paragraph) => <p key={paragraph}>{linkedText(paragraph)}</p>)}
              <a className="newsletter-feedback" href={content.links.feedback}>Share your newsletter feedback <ArrowUpRight size={16} aria-hidden="true" /></a>
              <p className="newsletter-farewell">{content.signoff}</p>
            </footer>
          </div>
        </div>
      </article>
      <div className="newsletter-end-links"><Link to="/newsletter/"><ArrowLeft size={16} aria-hidden="true" /> Back to all newsletters</Link><a href="#newsletter-top">Back to top <ArrowUp size={15} aria-hidden="true" /></a></div>
    </div>
  );
};

export default NewsletterIssue;
