# Officer Data Fetch Scripts

This directory contains scripts to fetch officer data at build time.

## Scripts

### `fetch-officers-fa25.js`
Fetches Fall 2025 officer data from a Google Sheets CSV export.

**Output:** `/public/fetched/officers/fa25/officers-fa25.json`

**Usage:**
```bash
npm run fetch-fa25
# or with force rebuild
node scripts/fetch-officers-fa25.js --force
```

### `fetch-officers-notion.js`
Fetches current semester officer data from a Notion database.

**Output:** `/public/fetched/officers/officers.json`

**Environment Variables Required:**
- `NOTION_API_KEY` - Your Notion integration API key
- `NOTION_OFFICERS_DB_ID` - The database ID of your officers database

**Usage:**
```bash
npm run fetch-notion
# or with force rebuild
node scripts/fetch-officers-notion.js --force
```

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Notion credentials in `.env`:
   - Create a Notion integration at https://www.notion.so/my-integrations
   - Copy the Internal Integration Token to `NOTION_API_KEY`
   - Share your officers database with the integration
   - Copy the database ID from the database URL to `NOTION_OFFICERS_DB_ID`

3. Install dependencies:
   ```bash
   npm install
   ```

## Notion Database Schema

The Notion database should have the following properties:

- **Name** (Title) - Full name of the officer
- **Preferred Name** (Text) - Name to display (optional, falls back to Full Name)
- **Role** (Text) - Officer position/role
- **headshot** (Files) - Profile photo
- **linkedin** (URL) - LinkedIn profile URL
- **personal website** (URL) - Personal website URL
- **interests / Bio** (Text) - Biography or interests (currently not displayed)

## Build Process

Both scripts run automatically during the build process via the `prebuild` script:

```bash
npm run build
```

This runs `fetch-data` which executes both fetch scripts in sequence.

## Image Processing

Both scripts automatically:
- Download images from their sources
- Compress images larger than 50KB
- Convert PNGs to WebP for better compression
- Resize images to a maximum width of 600px
- Save images alongside the JSON data

## Hash Tracking

Each script tracks a hash of the source data to avoid unnecessary rebuilds:
- FA25: `.sheet-hash` in the FA25 directory
- Notion: `.notion-hash` in the officers directory

Use the `--force` or `-f` flag to force a rebuild regardless of hash changes.
