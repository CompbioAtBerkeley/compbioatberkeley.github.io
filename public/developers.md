# Developer resources for Computational Biology at Berkeley

> This page indexes the supported machine-readable resources and current technical capability boundaries for the Computational Biology at Berkeley public website.

Canonical public origin: [https://compbioatberkeley.github.io](https://compbioatberkeley.github.io/).

## Supported public resources

- [Agent guide](https://compbioatberkeley.github.io/llms.txt): Concise source index and annotated public-page links.
- [Agent instructions](https://compbioatberkeley.github.io/agent-instructions.md): Source-selection, freshness, safety, and action boundaries.
- [Sitemap](https://compbioatberkeley.github.io/sitemap.xml): Canonical inventory of public HTML pages.
- [Crawler policy](https://compbioatberkeley.github.io/robots.txt): Crawler access policy and sitemap location.
- [Website source](https://github.com/CompbioAtBerkeley/compbioatberkeley.github.io): Exact public repository that builds and publishes this static website.
- [Student project repositories](https://github.com/Compbio-at-berkeley-projects): Public project code; these repositories are not an API contract for this website.

Rendered public pages include Schema.org `Organization`, `EducationalOrganization`, `WebSite`, `WebPage`, `PostalAddress`, and `ContactPoint` JSON-LD. Event details, officer rosters, forms, and recruitment windows are mutable; re-fetch the relevant canonical page for time-sensitive answers.

## API, OpenAPI, authentication, webhook, and MCP status

This static informational website does not offer a public API. Therefore:

- **API docs and OpenAPI:** No application API or OpenAPI specification is published.
- **Authentication API:** No member accounts, API keys, OAuth clients, or authenticated developer portal are provided by this website.
- **Webhooks:** No webhook events, signing secrets, delivery guarantees, or retry semantics are offered.
- **MCP:** Computational Biology at Berkeley does not operate an MCP server for this website. There is no live MCP endpoint or manifest. Do not treat GitHub's MCP tooling, public repositories, or similarly named registry results as a service operated by this organization.
- **Markdown negotiation:** Explicit Markdown resources such as this file and `agent-instructions.md` are served as `text/markdown`. Same-URL `Accept: text/markdown` negotiation is not available on the current static GitHub Pages origin.

Do not invent API endpoints, authentication flows, webhook subscriptions, tool calls, or transactional capabilities. If an API or MCP service is launched later, this resource index and [llms.txt](https://compbioatberkeley.github.io/llms.txt) will identify the canonical endpoint, protocol version, authorization model, and operational owner.
