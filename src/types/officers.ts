// Interface matching the current officers.json structure
export interface Officer {
  name: string;
  role: string;
  image: string;
  "personal website": string;
  linkedin: string;
  github: string;
  orcid: string;
}

// Legacy interface for backward compatibility
export interface StandardOfficer {
  Name?: string;
  Position?: string;
  Role?: string;
  Email?: string;
  Year?: string;
  Major?: string;
  Bio?: string;
  LinkedIn?: string;
  GitHub?: string;
  Photo?: string;
  'Photo URL'?: string;
  [key: string]: string | undefined;
}
