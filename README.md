# De Mayo Bible Studies — Development

> 🚧 **Development build:** this repository is used for testing changes before they are released to the production application. Features may be incomplete or contain bugs.

## Sites

- **Production:** https://romerdemayo.github.io/de-mayo-bible-study/
- **Development:** https://romerdemayo.github.io/de-mayo-bible-study-dev/

## Current baseline

- Version: **1.10.0-dev**
- Based on: **De Mayo Bible Studies v110 — Data Protection**
- Owner: **Romer Sadio De Mayo**

## Repository purpose

Use this repository to:

- test new features and bug fixes;
- validate mobile, tablet and desktop behaviour;
- check offline/PWA operation;
- confirm save, edit, delete, backup and restore functions;
- prepare tested changes before moving them to production.

## GitHub Pages setup

Open **Settings → Pages** and select:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/(root)`

The development site will be available at:

`https://romerdemayo.github.io/de-mayo-bible-study-dev/`

## Testing checklist

Before promoting any update to production, test:

- Home and navigation
- English and Tagalog Bible readers
- Search, notes, highlights and favourites
- Guided reading plans
- Devotionals, Bible studies, exhortations and kids lessons
- Prayer Library
- Presentation mode
- Save, edit and delete functions
- Backup and restore
- Offline mode and app installation
- iPhone, Android, tablet and desktop layouts

## Development safeguards

This build includes:

- a visible **Development Build** banner;
- `noindex` instructions for search engines;
- a development-specific service-worker cache;
- development roadmap, changelog and issue templates.

## Copyright

Copyright © 2026 Romer Sadio De Mayo. All Rights Reserved. See [LICENSE](LICENSE).

## Facebook Page Auto Publisher (development)
Version 1.12.0-dev includes a secure Cloudflare Worker starter under `cloudflare-worker/`. See `FACEBOOK_AUTO_POSTING_SETUP.md`. Facebook credentials are deliberately not included and must be configured as Cloudflare secrets.
