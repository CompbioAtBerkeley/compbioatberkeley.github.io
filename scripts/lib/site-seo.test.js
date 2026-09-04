import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  buildNotFoundHtml,
  buildPageHtml,
  buildRobotsTxt,
  buildSitemapXml,
} from "./site-seo.js";
import { buildStructuredData } from "../../src/lib/siteStructuredData.js";

const pages = [
  { path: "/", title: "Home", description: "Home page" },
  { path: "/about/", title: "About", description: "About page" },
];
const siteIdentity = {
  name: "Example Organization",
  alternateName: "Example Org",
  websiteAlternateNames: ["Example Org", "example.com"],
  description: "An example student organization.",
  googleSiteVerification: "verification-token",
  logoPath: "/logo.svg",
  sameAs: ["https://social.example.com/example"],
  address: {
    addressLocality: "Berkeley",
    addressRegion: "CA",
    postalCode: "94720",
    addressCountry: "US",
  },
  contactPoint: {
    contactType: "general inquiries",
    email: "hello@example.com",
    availableLanguage: "English",
  },
};

const htmlTemplate = `<!doctype html><html><head>
  <title>Fallback</title>
  <meta name="description" content="Fallback description" />
  <link rel="canonical" href="https://example.com/" />
  <meta property="og:title" content="Fallback" />
  <meta property="og:description" content="Fallback description" />
  <meta property="og:url" content="https://example.com/" />
  <meta name="twitter:title" content="Fallback" />
  <meta name="twitter:description" content="Fallback description" />
</head><body><div id="root"></div></body></html>`;

test("the shared public-page registry covers every indexable site route", () => {
  const registry = JSON.parse(
    fs.readFileSync(new URL("../../src/data/sitePages.json", import.meta.url), "utf8"),
  );

  assert.deepEqual(
    registry.map((page) => page.path),
    [
      "/",
      "/about/",
      "/calendar/",
      "/collaborations/",
      "/officers/",
      "/signup/",
      "/contact/",
      "/privacy/",
      "/developers/",
    ],
  );
  assert.ok(registry.every((page) => page.title && page.description));
  assert.ok(registry.every((page) => !page.path.startsWith("/concepts")));
  assert.equal(
    registry.find((page) => page.path === "/developers/")?.markdownPath,
    "/developers.md",
  );
});

test("builds a sitemap containing each canonical public URL exactly once", () => {
  const sitemap = buildSitemapXml({
    pages,
    siteOrigin: "https://example.com/",
    lastModified: "2026-07-31",
  });

  assert.match(sitemap, /<loc>https:\/\/example\.com\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/example\.com\/about\/<\/loc>/);
  assert.equal((sitemap.match(/<url>/g) ?? []).length, pages.length);
  assert.equal((sitemap.match(/https:\/\/example\.com\/about\//g) ?? []).length, 1);
  assert.match(sitemap, /<lastmod>2026-07-31<\/lastmod>/);
});

test("embeds rendered content and unique route metadata in the initial HTML", () => {
  const html = buildPageHtml({
    template: htmlTemplate,
    appHtml: "<main><h1>About us</h1></main>",
    page: { ...pages[1], markdownPath: "/developers.md" },
    siteIdentity,
    siteOrigin: "https://example.com/",
    noindex: false,
  });

  assert.match(html, /<title>About<\/title>/);
  assert.match(html, /name="description" content="About page"/);
  assert.match(html, /rel="canonical" href="https:\/\/example\.com\/about\/"/);
  assert.match(html, /property="og:url" content="https:\/\/example\.com\/about\/"/);
  assert.match(
    html,
    /<link rel="alternate" href="https:\/\/example\.com\/developers\.md" type="text\/markdown" data-route-markdown \/>/,
  );
  assert.match(html, /<main><h1>About us<\/h1><\/main>/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@type":\["Organization","EducationalOrganization"\]/);
  assert.match(html, /"@type":"PostalAddress"/);
  assert.match(html, /"@type":"ContactPoint"/);
  assert.match(html, /"contactType":"general inquiries"/);
  assert.match(html, /"email":"hello@example\.com"/);
  assert.match(html, /"url":"https:\/\/example\.com\/contact\/"/);
  assert.match(
    html,
    /<meta name="google-site-verification" content="verification-token" \/>/,
  );
  assert.doesNotMatch(html, /name="robots" content="noindex/);
});

test("publishes stable organization and website identity entities", () => {
  const graph = buildStructuredData({
    page: pages[1],
    siteIdentity,
    canonicalUrl: (pathname) => new URL(pathname, "https://example.com").href,
  });

  assert.equal(graph.length, 3);
  assert.deepEqual(graph[0]["@type"], ["Organization", "EducationalOrganization"]);
  assert.equal(graph[0]["@id"], "https://example.com/#organization");
  assert.equal("foundingDate" in graph[0], false);
  assert.equal(graph[1]["@type"], "WebSite");
  assert.equal(graph[1]["@id"], "https://example.com/#website");
  assert.equal(graph[1].name, "Example Organization");
  assert.deepEqual(graph[1].alternateName, ["Example Org", "example.com"]);
  assert.deepEqual(graph[1].publisher, { "@id": "https://example.com/#organization" });
  assert.deepEqual(graph[2].isPartOf, { "@id": "https://example.com/#website" });
});

test("publishes exact brand metadata and developer discovery links in the HTML shell", () => {
  const entry = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");
  const identity = JSON.parse(
    fs.readFileSync(new URL("../../src/data/siteIdentity.json", import.meta.url), "utf8"),
  );

  assert.equal(identity.name, "Computational Biology at Berkeley");
  assert.equal("foundingDate" in identity, false);
  assert.deepEqual(identity.websiteAlternateNames, [
    "CompBio at Berkeley",
    "compbioatberkeley.github.io",
  ]);
  assert.ok(identity.sameAs.includes("https://linktr.ee/UCB_CompBio"));
  assert.match(
    entry,
    /<meta name="application-name" content="Computational Biology at Berkeley" \/>/,
  );
  assert.match(
    entry,
    /<meta property="og:site_name" content="Computational Biology at Berkeley" \/>/,
  );
  assert.match(
    entry,
    /<link rel="help" href="\/developers\.md" type="text\/markdown" \/>/,
  );
});

test("publishes a useful no-JavaScript 404 recovery page", () => {
  const notFound = fs.readFileSync(
    new URL("../../public/404.html", import.meta.url),
    "utf8",
  );

  assert.match(notFound, /<h1[^>]*>Page not found<\/h1>/);
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /href="\/sitemap\.xml"/);
  assert.match(notFound, /href="\/llms\.txt"/);
  assert.match(notFound, /href="\/404\.md"/);
  assert.match(notFound, /rel="alternate" href="\/404\.md" type="text\/markdown"/);
  assert.match(notFound, /href="\/developers\/"/);
  assert.match(notFound, /href="\/contact\/"/);
  assert.match(notFound, /<pre class="agent-recovery" aria-label="Markdown recovery">/);
  assert.match(
    notFound,
    /# Page not found[\s\S]*- Sitemap: https:\/\/compbioatberkeley\.github\.io\/sitemap\.xml/,
  );
  assert.match(notFound, /name="robots" content="noindex, nofollow"/);
  assert.match(notFound, /routePath === "\/concepts"/);
  assert.match(notFound, /routePath\.startsWith\("\/concepts\/"\)/);
  assert.match(notFound, /window\.location\.replace\(basePath\)/);
});

test("limits SPA recovery to the known noindex concept-review routes", () => {
  const notFound = fs.readFileSync(
    new URL("../../public/404.html", import.meta.url),
    "utf8",
  );
  const entry = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");

  assert.match(notFound, /if \(routePath === "\/concepts" \|\| routePath\.startsWith/);
  assert.match(notFound, /window\.sessionStorage\.redirect = window\.location\.href/);
  assert.match(entry, /history\.replaceState\(null, null, redirect\)/);
});

test("keeps 404 recovery links inside a GitHub project-pages base path", () => {
  const notFound = fs.readFileSync(
    new URL("../../public/404.html", import.meta.url),
    "utf8",
  );
  const staged = buildNotFoundHtml({
    template: notFound,
    basePath: "/compbioatberkeley.github.io/",
    sitemapUrl: "https://compbioatberkeley.github.io/sitemap.xml",
  });

  assert.match(staged, /href="\/compbioatberkeley\.github\.io\/"/);
  assert.match(staged, /href="\/compbioatberkeley\.github\.io\/llms\.txt"/);
  assert.match(staged, /href="\/compbioatberkeley\.github\.io\/404\.md"/);
  assert.match(staged, /href="\/compbioatberkeley\.github\.io\/developers\/"/);
  assert.match(staged, /href="https:\/\/compbioatberkeley\.github\.io\/sitemap\.xml"/);
  assert.match(staged, /href="\/compbioatberkeley\.github\.io\/contact\/"/);
});

test("publishes a concise Markdown 404 recovery document", () => {
  const recovery = fs.readFileSync(
    new URL("../../public/404.md", import.meta.url),
    "utf8",
  );

  assert.match(recovery, /^# Page not found\n/);
  assert.match(recovery, /https:\/\/compbioatberkeley\.github\.io\/sitemap\.xml/);
  assert.match(recovery, /https:\/\/compbioatberkeley\.github\.io\/llms\.txt/);
  assert.match(recovery, /https:\/\/compbioatberkeley\.github\.io\/developers\.md/);
  assert.match(recovery, /https:\/\/compbioatberkeley\.github\.io\/contact\//);
});

test("llms.txt follows the agent guidance format and states capability boundaries", () => {
  const llmsText = fs.readFileSync(
    new URL("../../public/llms.txt", import.meta.url),
    "utf8",
  );

  assert.match(llmsText, /^# Computational Biology at Berkeley\n\n>/);
  assert.match(llmsText, /## When to use this site/);
  assert.match(llmsText, /## Machine-readable resources/);
  assert.match(llmsText, /https:\/\/compbioatberkeley\.github\.io\/contact\//);
  assert.match(llmsText, /https:\/\/compbioatberkeley\.github\.io\/privacy\//);
  assert.match(llmsText, /https:\/\/compbioatberkeley\.github\.io\/agent-instructions\.md/);
  assert.match(llmsText, /https:\/\/compbioatberkeley\.github\.io\/developers\//);
  assert.match(llmsText, /https:\/\/compbioatberkeley\.github\.io\/developers\.md/);
  assert.match(llmsText, /does not expose a public API or MCP server/i);
});

test("dedicated agent instructions explain when to use each source", () => {
  const instructions = fs.readFileSync(
    new URL("../../public/agent-instructions.md", import.meta.url),
    "utf8",
  );

  assert.match(instructions, /^# Agent instructions/);
  assert.match(instructions, /Use this site when/i);
  assert.match(instructions, /Do not claim/i);
  assert.match(instructions, /No public API or MCP server/i);
  assert.match(instructions, /\/sitemap\.xml/);
  assert.match(instructions, /\/developers\.md/);
});

test("developer resources are discoverable and state exact capability boundaries", () => {
  const developers = fs.readFileSync(
    new URL("../../public/developers.md", import.meta.url),
    "utf8",
  );
  const app = fs.readFileSync(new URL("../../src/App.tsx", import.meta.url), "utf8");
  const page = fs.readFileSync(
    new URL("../../src/pages/Developers.tsx", import.meta.url),
    "utf8",
  );
  const footer = fs.readFileSync(
    new URL("../../src/components/Footer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(developers, /^# Developer resources for Computational Biology at Berkeley\n/);
  assert.match(developers, /Canonical public origin/i);
  assert.match(developers, /does not offer a public API/i);
  assert.match(developers, /OpenAPI/i);
  assert.match(developers, /authentication API/i);
  assert.match(developers, /webhooks/i);
  assert.match(developers, /does not operate an MCP server/i);
  assert.match(developers, /https:\/\/compbioatberkeley\.github\.io\/llms\.txt/);
  assert.match(
    developers,
    /https:\/\/github\.com\/CompbioAtBerkeley\/compbioatberkeley\.github\.io/,
  );
  assert.match(page, /https:\/\/compbioatberkeley\.github\.io\/sitemap\.xml/);
  assert.match(
    page,
    /https:\/\/github\.com\/CompbioAtBerkeley\/compbioatberkeley\.github\.io/,
  );
  assert.match(app, /<Route path="\/developers" element={<Developers \/>} \/>/);
  assert.match(footer, /\{ name: "developers", path: "\/developers\/" \}/);
});

test("marks staging output as noindex and lets crawlers observe that directive", () => {
  const html = buildPageHtml({
    template: htmlTemplate,
    appHtml: "<main>Preview</main>",
    page: pages[0],
    siteIdentity,
    siteOrigin: "https://preview.example.com/",
    noindex: true,
  });

  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.equal(buildRobotsTxt({ noindex: true }), "User-agent: *\nAllow: /\n");
  assert.equal(
    buildRobotsTxt({ noindex: false, siteOrigin: "https://example.com/" }),
    "User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n",
  );
});
