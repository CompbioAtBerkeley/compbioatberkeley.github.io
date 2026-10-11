import { partners } from "@/data/partners";
import { publicAssetPath } from "@/lib/publicAsset";

const sizes: Record<string, { width: number; height: number }> = {
  "Progenic Genomics": { width: 119, height: 200 },
  "Coagulant Therapeutics": { width: 1497, height: 284 },
  "Streamind Health": { width: 1310, height: 396 },
  "Google DeepVariant": { width: 540, height: 179 },
  "NeuroAge Therapeutics": { width: 490, height: 131 },
};

// Reuse the approved light logos on the newsletter's cream paper.
export const NewsletterPartnerLogo = ({ name }: { name: string }) => {
  const partner = partners.find((candidate) => candidate.name === name);
  if (!partner) return null;
  return (
    <img
      src={publicAssetPath(partner.logoPath)}
      alt={`${name} logo`}
      className="newsletter-partner-logo"
      {...sizes[name]}
      loading="lazy"
      decoding="async"
    />
  );
};
