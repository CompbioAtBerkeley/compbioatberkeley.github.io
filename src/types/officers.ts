export interface Officer {
  [key: string]: string;
}

// Common expected fields (these may vary based on your Google Sheet structure)
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
