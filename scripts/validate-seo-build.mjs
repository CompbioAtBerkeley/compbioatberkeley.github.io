import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDirectory = path.join(projectRoot, "dist");
const siteIdentity = JSON.parse(
  await fs.readFile(path.join(projectRoot, "src/data/siteIdentity.json"), "utf8"),
);
const siteOrigin = (
  process.env.VITE_SITE_ORIGIN || siteIdentity.productionOrigin
).replace(/\/$/, "");
const noindex = process.env.VITE_NOINDEX === "true";
const basePath = `/${(process.env.VITE_BASE_PATH || "/").replace(/^\/+|\/+$/g, "")}/`
  .replace("//", "/");
const pages = JSON.parse(
  await fs.readFile(path.join(projectRoot, "src/data/sitePages.json"), "utf8"),
);
const llmsText = await fs.readFile(path.join(projectRoot, "public/llms.txt"), "utf8");
const notFoundMarkdownSource = await fs.readFile(
  path.join(projectRoot, "public/404.md"),
  "utf8",
);
const developerMarkdownSource = await fs.readFile(
  path.join(projectRoot, "public/developers.md"),
  "utf8",
);

const canonicalUrl = (pathname) =>
  new URL(pathname.replace(/^\//, ""), `${siteOrigin}/`).href;
const occurrences = (text, value) => text.split(value).length - 1;
const visibleText = (html) => html
  .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi, " ")
  .replace(/\s+/g, " ")
  .trim();

for (const page of pages) {
  const routeDirectory = page.path === "/"
    ? distDirectory
    : path.join(distDirectory, page.path.replace(/^\/+|\/+$/g, ""));
  const html = await fs.readFile(path.join(routeDirectory, "index.html"), "utf8");
  const url = canonicalUrl(page.path);

  assert.match(html, /<div id="root">[\s\S]+<\/div>/, `${page.path} must contain rendered React HTML`);
  const mainHtml = html.match(/<main id="main-content"[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(mainHtml, `${page.path} must contain the rendered main landmark`);
  const headings = [...mainHtml.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));
  assert.equal(headings[0], 1, `${page.path} must begin its content hierarchy with h1`);
  assert.equal(
    headings.filter((level) => level === 1).length,
    1,
    `${page.path} must contain exactly one rendered h1`,
  );
  for (let index = 1; index < headings.length; index += 1) {
    assert.ok(
      headings[index] <= headings[index - 1] + 1,
      `${page.path} heading levels must not skip from h${headings[index - 1]} to h${headings[index]}`,
    );
  }
  assert.equal(occurrences(html, `<title>${page.title}</title>`), 1, `${page.path} must have one title`);
  assert.equal(
    occurrences(html, `<link rel="canonical" href="${url}" />`),
    1,
    `${page.path} must have one self-canonical URL`,
  );
  assert.match(html, /"@type":\["Organization","EducationalOrganization"\]/);
  assert.match(html, /"@type":"WebSite"/);
  assert.match(html, /"@id":"[^"]*\/#website"/);
  assert.match(
    html,
    /"alternateName":\["CompBio at Berkeley","compbioatberkeley\.github\.io"\]/,
  );
  assert.doesNotMatch(html, /"foundingDate":/);
  assert.match(html, /"@type":"PostalAddress"/);
  assert.match(html, /"@type":"ContactPoint"/);
  assert.match(
    html,
    new RegExp(
      `<link rel="describedby" href="${basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}llms\\.txt" type="text/markdown" \\/>`,
    ),
    `${page.path} must advertise the agent guide`,
  );
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"isPartOf":\{"@id":"[^"]*\/#website"\}/);
  assert.match(
    html,
    /<meta name="application-name" content="Computational Biology at Berkeley" \/>/,
  );
  assert.match(
    html,
    /<meta property="og:site_name" content="Computational Biology at Berkeley" \/>/,
  );
  assert.match(
    html,
    new RegExp(
      `<link rel="help" href="${basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}developers\\.md" type="text/markdown" \\/>`,
    ),
  );
  if (page.markdownPath) {
    assert.match(
      html,
      new RegExp(
        `<link rel="alternate" href="${canonicalUrl(page.markdownPath).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}" type="text/markdown" data-route-markdown \\/>`,
      ),
      `${page.path} must advertise its Markdown representation`,
    );
  } else {
    assert.doesNotMatch(html, /data-route-markdown/);
  }
  assert.equal(
    occurrences(
      html,
      `<meta name="google-site-verification" content="${siteIdentity.googleSiteVerification}" />`,
    ),
    1,
    `${page.path} must contain the Google Search Console verification token exactly once`,
  );
  assert.match(
    html,
    noindex
      ? /<meta name="robots" content="noindex, nofollow" \/>/
      : /<meta name="robots" content="index, follow" \/>/,
  );

  if (!noindex) {
    assert.ok(
      llmsText.includes(url),
      `${page.path} canonical must also be present in public/llms.txt`,
    );
  }

  const mainTextLength = visibleText(mainHtml).length;
  assert.doesNotMatch(html, /https:\/\/forms\.gle\/EQmWP1JWzDzrFji79/);
  assert.doesNotMatch(html, /https:\/\/linktr\.ee\/compbioatberkeley/);
  assert.ok(html.includes('href="https://linktr.ee/UCB_CompBio"'));
  if (page.path === "/") {
    assert.ok(mainTextLength >= 2000, `home SSR text must be substantial; received ${mainTextLength}`);
    const contentEfficiency = visibleText(html).length / html.length;
    assert.ok(
      contentEfficiency >= 0.05,
      `home visible-text efficiency must be at least 5%; received ${(contentEfficiency * 100).toFixed(2)}%`,
    );
  }
  if (["/contact/", "/privacy/", "/developers/"].includes(page.path)) {
    assert.ok(
      mainTextLength >= 500,
      `${page.path} trust content must contain at least 500 visible characters; received ${mainTextLength}`,
    );
  }
  if (page.path === "/developers/") {
    assert.match(mainHtml, /API, authentication, webhook, and MCP status/);
    assert.match(mainHtml, /no public application API or OpenAPI contract/i);
    assert.match(mainHtml, /There is no live Model Context Protocol endpoint or manifest/i);
    assert.match(mainHtml, /Same-URL Accept: text\/markdown content negotiation is not provided/i);
  }
  if (page.path === "/signup/") {
    assert.match(mainHtml, /Updated Fall 2026 recruitment timeline/);
    assert.ok(mainHtml.includes('href="https://forms.gle/4cR1nfRoLb2LGNbi7"'));
    assert.ok(
      mainHtml.includes(
        'href="https://docs.google.com/document/d/1ZGq3KV4MprEdPDUu8v7QO9AuGSpB2eEmsyVCCK9nLDU/edit?usp=sharing"',
      ),
    );
    assert.ok(mainHtml.includes('href="https://linktr.ee/UCB_CompBio"'));
    assert.match(mainHtml, /September 9/);
    assert.match(mainHtml, /VLSB 2030/);
    assert.doesNotMatch(mainHtml, /September 7/);
  }
  if (page.path === "/") {
    assert.ok(mainHtml.includes('href="https://forms.gle/4cR1nfRoLb2LGNbi7"'));
  }
  if (["/contact/", "/collaborations/"].includes(page.path)) {
    assert.ok(mainHtml.includes('href="https://linktr.ee/UCB_CompBio"'));
  }
}

assert.doesNotMatch(llmsText, /https:\/\/linktr\.ee\/compbioatberkeley/);
assert.match(llmsText, /https:\/\/linktr\.ee\/UCB_CompBio/);

const robots = await fs.readFile(path.join(distDirectory, "robots.txt"), "utf8");
const notFound = await fs.readFile(path.join(distDirectory, "404.html"), "utf8");
assert.match(notFound, /name="robots" content="noindex, nofollow"/);
assert.match(notFound, /<h1[^>]*>Page not found<\/h1>/);
assert.ok(notFound.includes(`href="${basePath}llms.txt"`));
assert.ok(notFound.includes(`href="${basePath}404.md"`));
assert.ok(notFound.includes(`href="${basePath}developers/"`));
assert.match(notFound, /rel="alternate" href="[^"]*404\.md" type="text\/markdown"/);
assert.match(notFound, /<pre class="agent-recovery" aria-label="Markdown recovery">/);
assert.match(notFound, /- Sitemap: https:\/\/compbioatberkeley\.github\.io\/sitemap\.xml/);
const expectedSitemapUrl = noindex
  ? `${siteIdentity.productionOrigin}/sitemap.xml`
  : `${basePath}sitemap.xml`;
assert.ok(notFound.includes(`href="${expectedSitemapUrl}"`));
assert.match(notFound, /routePath === "\/concepts"/);
const agentInstructions = await fs.readFile(
  path.join(distDirectory, "agent-instructions.md"),
  "utf8",
);
assert.match(agentInstructions, /No public API or MCP server/);
assert.match(agentInstructions, /\/developers\.md/);
assert.equal(
  await fs.readFile(path.join(distDirectory, "404.md"), "utf8"),
  notFoundMarkdownSource,
);
assert.equal(
  await fs.readFile(path.join(distDirectory, "developers.md"), "utf8"),
  developerMarkdownSource,
);
assert.match(developerMarkdownSource, /does not offer a public API/i);
assert.match(developerMarkdownSource, /does not operate an MCP server/i);
await assert.rejects(
  fs.access(path.join(distDirectory, "concepts", "index.html")),
  undefined,
  "Concept-review routes must not be emitted as indexable static pages",
);

if (noindex) {
  assert.equal(robots, "User-agent: *\nAllow: /\n");
  await assert.rejects(fs.access(path.join(distDirectory, "sitemap.xml")));
} else {
  assert.equal(
    robots,
    `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`,
  );
  const sitemap = await fs.readFile(path.join(distDirectory, "sitemap.xml"), "utf8");
  assert.equal(occurrences(sitemap, "<url>"), pages.length);
  for (const page of pages) {
    assert.equal(occurrences(sitemap, `<loc>${canonicalUrl(page.path)}</loc>`), 1);
  }
}

console.log(
  `SEO build valid: ${pages.length} rendered routes, ${noindex ? "staging noindex" : "production sitemap published"}`,
);
