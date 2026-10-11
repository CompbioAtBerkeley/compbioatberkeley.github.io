import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import siteIdentity from "@/data/siteIdentity.json";
import sitePages from "@/data/sitePages.json";
import { buildStructuredData } from "@/lib/siteStructuredData";

const siteOrigin = (
  import.meta.env.VITE_SITE_ORIGIN || siteIdentity.productionOrigin
).replace(/\/$/, "");
const forceNoindex = import.meta.env.VITE_NOINDEX === "true";

const normalizedPath = (pathname: string) => {
  if (pathname === "/") return pathname;
  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
};

const canonicalUrl = (pathname: string) =>
  new URL(pathname.replace(/^\//, ""), `${siteOrigin}/`).href;

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

const RouteMetadata = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const routePath = normalizedPath(pathname);
    const page = sitePages.find((candidate) => candidate.path === routePath);
    const shouldNoindex = forceNoindex || !page;

    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: shouldNoindex ? "noindex, nofollow" : "index, follow",
    });

    const existingMarkdownAlternate = document.head.querySelector<HTMLLinkElement>(
      "link[data-route-markdown]",
    );
    const markdownPath = page && "markdownPath" in page && typeof page.markdownPath === "string" ? page.markdownPath : undefined;
    if (markdownPath) {
      const markdownAlternate = existingMarkdownAlternate ?? document.createElement("link");
      markdownAlternate.rel = "alternate";
      markdownAlternate.type = "text/markdown";
      markdownAlternate.href = canonicalUrl(markdownPath);
      markdownAlternate.dataset.routeMarkdown = "";
      if (!existingMarkdownAlternate) document.head.appendChild(markdownAlternate);
    } else {
      existingMarkdownAlternate?.remove();
    }

    if (!page) return;

    const url = canonicalUrl(page.path);
    document.title = page.title;
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: page.description,
    });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: page.description,
    });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: page.title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: page.description,
    });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const structuredData = document.getElementById("site-structured-data");
    if (structuredData) {
      structuredData.textContent = JSON.stringify(
        buildStructuredData({ page, siteIdentity, canonicalUrl }),
      );
    }
  }, [pathname]);

  return null;
};

export default RouteMetadata;
