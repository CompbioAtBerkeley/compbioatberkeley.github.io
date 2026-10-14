export type Partner = {
  name: string;
  website: string;
  logoPath: string;
  darkLogoPath?: string;
  logoClassName: string;
  collageClassName: string;
  brandSourceUrl?: string;
  sourceNote?: string;
};

/**
 * The single source of truth for the partner logo wall rendered on Home and
 * Collaborations. Update a partner or asset here and both pages update.
 */
export const partners: Partner[] = [
  {
    name: "Streamind Health",
    website: "https://www.streamindhealth.com/",
    logoPath: "partners/raster/streamind.png",
    darkLogoPath: "partners/raster/streamind-dark.png",
    logoClassName: "max-h-28 w-full",
    collageClassName:
      "col-span-2 md:left-[8%] md:top-[8%] md:w-[34%]",
    brandSourceUrl:
      "https://static.wixstatic.com/media/18bc51_9fa019fc425a48e1a841d82ce7f1ca30~mv2.png",
  },
  {
    name: "NeuroAge Therapeutics",
    website: "https://www.neuroagetx.com/",
    logoPath: "partners/raster/neuroage.png",
    darkLogoPath: "partners/raster/neuroage-dark.png",
    logoClassName: "max-h-28 w-full",
    collageClassName:
      "col-span-2 md:left-[55%] md:top-[7%] md:w-[37%]",
    brandSourceUrl: "https://www.neuroagetx.com/img/logo.webp",
  },
  {
    name: "NovaFlow",
    website: "https://www.novaflowapp.com/",
    logoPath: "partners/raster/novaflow.png",
    logoClassName: "max-h-24 w-full",
    collageClassName:
      "col-span-2 md:left-[6%] md:top-[41%] md:w-[31%]",
    brandSourceUrl: "https://www.novaflowapp.com/",
  },
  {
    name: "Google DeepVariant",
    website: "https://github.com/google/deepvariant",
    logoPath: "partners/raster/google-wordmark.png",
    logoClassName: "max-h-20 w-full",
    collageClassName:
      "col-span-2 md:left-[45%] md:top-[40%] md:w-[27%]",
    brandSourceUrl:
      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  },
  {
    name: "Coagulant Therapeutics",
    website: "https://www.coagulanttherapeutics.com/",
    logoPath: "partners/raster/coagulant.png",
    darkLogoPath: "partners/raster/coagulant-dark.png",
    logoClassName: "max-h-24 w-full",
    collageClassName:
      "col-span-2 md:left-[46%] md:top-[75%] md:w-[43%]",
    brandSourceUrl:
      "https://images.squarespace-cdn.com/content/v1/6154cdcf4a92db78fc554755/75dd0feb-5f86-47fc-9f1a-72edeebe2f1a/Coagulant+Therapeutics+Logo_RGB.png?format=1500w",
  },
  {
    name: "DrugRepAI",
    website: "https://www.drugrepai.com/",
    logoPath: "partners/raster/drugrepai.png",
    darkLogoPath: "partners/raster/drugrepai-dark.png",
    logoClassName: "max-h-24 w-full",
    collageClassName:
      "col-span-2 md:left-[10%] md:top-[76%] md:w-[27%]",
    sourceNote: "Official logo supplied by the partner on August 14, 2026.",
  },
  {
    name: "Progenic Genomics",
    website: "https://progenicgenomics.com/",
    logoPath: "partners/raster/progenic.png",
    darkLogoPath: "partners/raster/progenic-dark.png",
    logoClassName: "max-h-52 w-auto",
    collageClassName:
      "col-span-2 md:left-[81%] md:top-[34%] md:w-[11%]",
    brandSourceUrl:
      "https://progenicgenomics.com/wp-content/uploads/2025/05/cropped-PrognicLogo-Colored.png",
  },
];
