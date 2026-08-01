## v1.13.0-dev — Bible Reel Creator Beta
- Social Studio is visible in the sidebar.
- Facebook Auto Publisher is hidden from the sidebar but remains available by direct route.
- Added a Reels & Shorts beta creator with editable Scripture scripts.
- Added 9:16 animated phone preview, browser voice narration, and ambient sound previews.
- Added script copy workflow for Facebook Reels, Instagram Reels, and YouTube Shorts.

# Changelog

## 1.12.3-dev — Smart Cross-Device Facebook Sharing

- Copies the caption and hashtags before sharing on every supported device.
- On iPhone and Android, sends the generated PNG to the native share menu and reminds the user to paste the copied caption.
- On Mac and Windows, downloads the PNG, copies the caption, opens Facebook, and shows the correct keyboard shortcut.
- Adds live sharing status and clearer platform-specific guidance.
- Prevents website-link previews from being used as the generated post image.


## 1.12.3-dev — Project Phoenix Performance Hardening

### Performance
- Changed the service worker to precache only the lightweight app shell.
- Large Bible and content data files now cache on demand instead of blocking every update.
- Deferred application and content scripts until HTML parsing completes.
- Moved automatic local-data snapshots into browser idle time.
- Added rendering containment for below-the-fold cards and sections.
- Added reduced-motion support for accessibility and slower devices.

### Safety
- Existing browser data keys and saved resources remain unchanged.
- No major feature workflow was rewritten in this release.

## 1.11.4-dev — Correct Facebook Image Sharing

- Removed Facebook link-sharing URLs that created the green website preview instead of attaching the generated artwork.
- Share Image now sends the generated PNG only when the phone/browser supports file sharing.
- Desktop fallback now downloads the PNG and copies the caption without opening a misleading link-share composer.
- Open Facebook now opens the normal Facebook home page so users can choose Photo/video and upload the downloaded PNG.
- Added clear phone and desktop instructions directly inside Social Studio.


## 1.12.3-dev — Social Sharing Fix
- Added a dedicated **Open Facebook** workflow for desktop browsers.
- Share now uses the native phone share sheet when supported.
- Desktop fallback downloads the PNG, copies the caption and hashtags, and opens Facebook.
- Added a live post-text preview for captions and hashtags.
- Caption and hashtag edits now update the preview immediately.

## 1.12.3-dev — Mobile-first Spiritual Auto Creator

- Optimised Social Studio for iPhone 13 Pro and other small phones.
- Added single-column mobile layout and full-width 46px touch controls.
- Prevented unwanted iPhone form zoom with mobile-safe 16px inputs.
- Made generated image previews scale cleanly without horizontal scrolling.
- Added safe-area support for modern iPhones and installed PWAs.
- Improved portrait and landscape behaviour and compact draft controls.

## 1.11.1-dev — Spiritual Auto Creator

- Added automatic Bible verse generation by spiritual theme.
- Added automatic Scripture-grounded prayer generation in English and Tagalog.
- Added Hope, Guidance, Peace, Healing, Provision, Gratitude, Family, and Worship themes.
- Added one-tap complete post creation with caption, hashtags, image layout, and random visual theme.
- Kept all automatic generation private and offline in the browser.

# Changelog

## 1.11.0-dev — Social Studio
- Added automatic Bible verse and prayer image creation.
- Added square, story, and landscape formats.
- Added six built-in visual themes, captions, hashtags, download, share, and saved drafts.
- Added duplicate draft protection and private browser-only generation.

## 1.10.1-dev — Clean Ministry Dashboard

### Added
- Action-focused home dashboard with Today, My Journey, Study & Prepare, Recently Used, and Ministry Tools sections.
- Mobile navigation for Home, Bible, Plans, Create, and More.
- Recent-page tracking stored privately in the browser.
- Shared duplicate warning for personal prayers, studies, devotionals, exhortations, sermons, and kids lessons.

### Changed
- Sidebar reorganised into Home, Read, Study, Create, Ministry, and More.
- Repository history files moved into `docs/archive`.
- Development cache bumped to 1.10.1-dev.

### Preserved
- Existing browser data keys and saved user content.
- Bible reader, creators, libraries, presentation mode, analytics, and backup tools.

## 1.10.2-dev — Development Control Centre

### Added
- Development-only dashboard in the More navigation group.
- Current sprint checklist and release-testing checklist saved privately on the current device.
- Known-issues notes area with local save and reset controls.
- Development shortcuts for the repository, GitHub Issues, Ministry Insights, and Backup & Restore.
- Build version, sprint, date, progress, and local data status cards.

### Changed
- Development cache bumped to 1.10.2-dev.
- Service-worker registration query updated to force the new build after deployment.

## 1.12.0-dev — Facebook Page Auto Publisher
- Added a Facebook Auto Publisher control centre.
- Added secure Cloudflare Worker connection and health test.
- Added approval-based publishing of the current Social Studio PNG.
- Added schedule preferences and local posting history.
- Included a Cloudflare Worker with daily Scripture/prayer generation, SVG image creation, Meta Page photo publishing, and Cron support.
- Added a complete Facebook auto-posting setup guide.

## 1.12.3-dev — Development & QA Centre Pro
- Added production readiness scoring and release gate.
- Added feature and device status tracking.
- Added local bug tracker, QA notes, and exportable QA report.
- Added critical blocker rules and mobile-friendly Mission Control layout.
