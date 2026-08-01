# Facebook Page Auto Posting Setup

This build contains two parts:

1. The GitHub Pages app, including **More → Facebook Auto Publisher**.
2. A secure Cloudflare Worker in `cloudflare-worker/`.

The Worker is required because a Facebook Page access token must never be stored in public GitHub code.

## Requirements

- A Facebook Page for De Mayo Bible Studies.
- A Meta developer app connected to that Page.
- A Page access token with the permissions required by Meta for Page publishing, including `pages_manage_posts` and the related Page permissions required by your app setup.
- A free Cloudflare account.

## Deploy the Worker

1. Install Node.js on your computer.
2. Open Terminal in the `cloudflare-worker` folder.
3. Run `npm install`.
4. Copy `wrangler.toml.example` to `wrangler.toml`.
5. Run `npx wrangler login`.
6. Add the secrets:

```bash
npx wrangler secret put FB_PAGE_ID
npx wrangler secret put FB_PAGE_ACCESS_TOKEN
npx wrangler secret put APP_SHARED_SECRET
```

7. Deploy:

```bash
npm run deploy
```

Cloudflare will provide a Worker URL such as:

`https://de-mayo-facebook-publisher.<your-subdomain>.workers.dev`

## Connect the Bible app

1. Open the development Bible app.
2. Go to **More → Facebook Auto Publisher**.
3. Paste the Worker URL.
4. Enter the same `APP_SHARED_SECRET` used in Cloudflare.
5. Press **Test connection**.
6. Create a verse or prayer in Social Studio and press **Approve and post now**.

## Automatic daily posting

The included Cron Trigger runs once daily. It rotates through curated Bible verses and Scripture-centred prayers, creates a 1080 × 1080 image on the Worker, and publishes the image to the connected Facebook Page.

Cloudflare Cron uses UTC. New Zealand changes between NZST and NZDT, so the UTC hour may need to be adjusted when daylight saving changes.

## Security

- Never commit `wrangler.toml` if it contains sensitive values.
- Never put `FB_PAGE_ACCESS_TOKEN` in `app.js`, `index.html`, GitHub Actions logs, or browser local storage.
- The shared secret protects the app-to-Worker publish endpoint, but the Page token remains the most sensitive credential.
- Begin with approval mode and verify every post before enabling automatic scheduling.
