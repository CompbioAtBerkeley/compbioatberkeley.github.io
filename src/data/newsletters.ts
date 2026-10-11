export type Newsletter = {
  slug: string;
  title: string;
  term: string;
  // Sort editions by their academic term and issue number; no inferred publication date.
  termOrder: number;
  issue: number;
  abstract: string;
  topics: string[];
};

export const newsletters: Newsletter[] = [
  {
    slug: "fall-2026-newsletter-1",
    title: "Fall 2026 Newsletter 1",
    term: "Fall 2026",
    termOrder: 20263,
    issue: 1,
    abstract:
      "A new semester at CB@B: meet the leadership team, revisit spring events and five computational biology projects, and explore fall partnerships, upcoming meetings, and the new member bootcamp.",
    topics: ["Community", "Projects", "Bootcamp"],
  },
].sort((a, b) => b.termOrder - a.termOrder || b.issue - a.issue);

export const newsletterPath = (newsletter: Newsletter) => `/newsletter/${newsletter.slug}/`;
