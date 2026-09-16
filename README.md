# Computational Biology at Berkeley

The public website for Computational Biology at Berkeley, built with Vite, React, TypeScript, shadcn/ui, and Tailwind CSS.

## Local development

```sh
npm ci
npm test
npm run dev
```

Run `npm run build` for the same credential-free production build used by GitHub Pages. The build validates officer data before compiling the site.

## Officer data

Fall 2026 deliberately separates approved roster decisions from submitted public profile content:

- `src/data/officersFa26Roster.json` owns cohort membership, roles, order, stable IDs, and reviewed fallback public content, including submissions received outside Notion.
- `src/data/officerProfilesFa26.json` is a reviewed, public-only snapshot of in-window officer form responses.
- `scripts/lib/officer-profile-cohorts.js` owns operational file paths and the explicit intake window; upstream database identifiers stay in protected environment secrets and out of the client bundle.
- `src/data/compileOfficerDirectory.js` matches responses to the roster, keeps the newest nonblank public fields, normalizes links, and ignores unmatched people.
- `public/officers/fa26/` stores stable headshot assets.
- `public/officers/archive/` stores immutable Fall 2025 and Spring 2026 snapshots so historical tabs work in a clean checkout.

Notion is private intake, not a publishing system. Maintainers use the controlled
`officers:notion:dry-run`, `officers:notion:check`, and
`officers:notion:write` commands described in `scripts/README.md` to prepare a
sanitized working-tree change. The `write` command does not commit, push,
deploy, or write anything back to Notion. A human must review the Git diff and
the staging site before promotion.

Each profile record in the public snapshot is limited to provenance ID,
submission time, full and preferred names, headshot path, bio, personal
website, LinkedIn, GitHub, and ORCID. Never copy email, phone number, birthday,
scheduling data, another private form field, or an upstream database identifier
into the snapshot or roster. A manually reviewed submission received outside
Notion may populate only those same publishable content fields on the matching
approved roster entry; it must not use a fabricated Notion provenance ID. Run:

```sh
npm test
npm run validate:officers
```

The validator reports unmatched responses, invalid public links, missing assets, and officers still waiting for a current profile response. See `scripts/README.md` for the update workflow and `.agents/skills/pre-production-checklist/SKILL.md` before a production promotion.

## Search and static routes

- `src/data/siteIdentity.json` and `src/data/sitePages.json` are the shared registries for the public identity, indexable routes, page titles, and descriptions.
- `src/data/siteIdentity.json` also stores the public Google Search Console verification token that the build emits as a metadata tag.
- `npm run build` creates rendered HTML at each route directory, then generates and validates `dist/sitemap.xml` and `dist/robots.txt`.
- `src/components/RouteMetadata.tsx` keeps metadata synchronized during client-side navigation.
- Production builds are indexable by default. Staging sets `VITE_NOINDEX=true` and a staging `VITE_SITE_ORIGIN`, which marks every page `noindex, nofollow` and suppresses the sitemap. Its robots file allows fetching so crawlers can observe the page-level directive.
- `public/404.html` is always `noindex`; internal `/concepts` review routes are intentionally absent from the sitemap and static route output.

## Deployment

- Pushes to `dev` deploy the staging GitHub Pages site from the `Hilo-Hilo` staging repository.
- Pushes to `main` deploy production from `CompbioAtBerkeley/compbioatberkeley.github.io`.

Before every staging or production deployment, review changed public facts,
links, route descriptions, and capability claims against `public/llms.txt`.
Update `llms.txt` in the same change whenever it indexes or summarizes the
affected information. Review `public/agent-instructions.md` and
`public/developers.md` at the same time when source-selection guidance or
technical capabilities change. `npm test` and `npm run build` enforce the
machine-readable facts that can be checked automatically; after deployment,
verify the live `/llms.txt` from the same commit as the HTML site.

Neither build reads Notion or Google Sheets credentials. Form intake is
reviewed and versioned before publication, so the same commit produces the same
site in local, staging, and production environments. The separate weekly/manual
drift workflow may read Notion with a read-only integration, but it cannot
modify repository contents or publish candidate data.
