import { publicAssetPath } from "./publicAsset";
import imageSizes from "@/data/newsletters/imageSizes.json";

export const newsletterImage = (name: string) =>
  publicAssetPath(`newsletters/fall-2026-newsletter-1/${name}.webp`);

export const newsletterImageSize = (name: string) =>
  imageSizes[name as keyof typeof imageSizes];
