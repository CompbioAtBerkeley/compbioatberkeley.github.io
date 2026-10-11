import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { NewsletterPartnerLogo } from "@/components/NewsletterMedia";
import { newsletterImage } from "@/lib/newsletterImage";
import { newsletters, newsletterPath, type Newsletter } from "@/data/newsletters";
import "./newsletter.css";

const slides = ["Cover", "Event spotlight", "Projects", "New member bootcamp"];

const NewsletterTile = ({ newsletter }: { newsletter: Newsletter }) => {
  const [slide, setSlide] = useState(0);
  const previewId = `${newsletter.slug}-preview`;
  const move = (step: number) => setSlide((current) => (current + step + slides.length) % slides.length);

  return (
    <li className="newsletter-tile">
      <div className="newsletter-preview" role="region" aria-roledescription="carousel" aria-label={`${newsletter.title} preview`}>
        <Link to={newsletterPath(newsletter)} className="newsletter-preview-link" aria-label={`Read ${newsletter.title}`}>
          <div id={previewId} className="newsletter-preview-slide" role="group" aria-roledescription="slide" aria-label={`${slide + 1} of ${slides.length}: ${slides[slide]}`}>
            {slide === 0 && <>
              <img className="newsletter-preview-cover" src={newsletterImage("cover")} alt="CB@B officers on the steps of a Berkeley campus building" width="1600" height="1067" />
              <div className="newsletter-preview-masthead">
                <p>Computational Biology<br />at Berkeley</p>
                <span>{newsletter.term}, Newsletter {newsletter.issue}</span>
              </div>
              <p className="newsletter-preview-quote">A new semester of research,<br />education, and community.</p>
            </>}
            {slide === 1 && <>
              <p className="newsletter-preview-heading">Past event spotlight</p>
              <img className="newsletter-preview-feature" src={newsletterImage("shane-brubaker")} alt="Shane Brubaker speaking at a general meeting" />
              <p className="newsletter-preview-subtitle">Conversations that connect<br />biology and computation</p>
              <p className="newsletter-preview-small">Guest speakers · Resume & LinkedIn workshop</p>
            </>}
            {slide === 2 && <>
              <p className="newsletter-preview-heading">Last semester’s projects</p>
              <div className="newsletter-preview-logos">
                {['Progenic Genomics', 'Coagulant Therapeutics', 'Streamind Health', 'Google DeepVariant', 'NeuroAge Therapeutics'].map((name) => <NewsletterPartnerLogo key={name} name={name} />)}
              </div>
              <p className="newsletter-preview-subtitle">Five projects.<br />Many paths to discovery.</p>
              <p className="newsletter-preview-small">Genomics · Drug discovery · Health technology</p>
            </>}
            {slide === 3 && <>
              <p className="newsletter-preview-heading">New member bootcamp</p>
              <img className="newsletter-preview-feature" src={newsletterImage("bootcamp-lecture")} alt="Students attending a computational biology bootcamp lecture" />
              <p className="newsletter-preview-subtitle">A first step into<br />computational biology</p>
              <p className="newsletter-preview-small">Workshops · Real-world datasets · Guided projects</p>
            </>}
          </div>
        </Link>
        <div className="newsletter-preview-controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous preview slide" aria-controls={previewId}><ChevronLeft size={17} /></button>
          <div className="newsletter-preview-dots">
            {slides.map((name, index) => <button key={name} type="button" onClick={() => setSlide(index)} aria-label={`Show ${name.toLowerCase()} preview`} aria-current={slide === index ? "true" : undefined} aria-controls={previewId}><span /></button>)}
          </div>
          <span className="sr-only" aria-live="polite" aria-atomic="true">{slides[slide]}, slide {slide + 1} of {slides.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="Next preview slide" aria-controls={previewId}><ChevronRight size={17} /></button>
        </div>
      </div>
      <div className="newsletter-tile-copy">
        <p className="eyebrow">{newsletter.term} / Issue {String(newsletter.issue).padStart(2, "0")}</p>
        <h3><Link to={newsletterPath(newsletter)}>{newsletter.title}</Link></h3>
        <p className="newsletter-abstract">{newsletter.abstract}</p>
        <ul className="newsletter-topics" aria-label="In this issue">{newsletter.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>
        <Link className="newsletter-read-link" to={newsletterPath(newsletter)}>Read newsletter <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </li>
  );
};

const Newsletters = () => (
  <div>
    <PageHeader eyebrow="newsletter / the archive" title="Newsletter" lede="Stories, projects, and people from Computational Biology at Berkeley. Explore each edition of our club newsletter." />
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20 lg:px-8" aria-labelledby="newsletter-publications">
      <div id="newsletter-publications"><SectionHeading title="All publications" meta="Newest first" /></div>
      <ol className="newsletter-publications">{newsletters.map((newsletter) => <NewsletterTile key={newsletter.slug} newsletter={newsletter} />)}</ol>
    </section>
  </div>
);

export default Newsletters;
