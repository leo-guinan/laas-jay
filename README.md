# laas-jay landing page

A zero-build static landing page for the Jay Yang → Leo as a Service experiment. It is designed to deploy directly with GitHub Pages.

## Files

- `index.html` — page content
- `styles.css` — responsive styling
- `config.js` — checkout URL, trailer YouTube ID, optional event endpoint, BiPU URL
- `script.js` — preserves query parameters, records CTA events, optionally forwards events to your endpoint

## Configure

Edit `config.js`:

```js
window.LAAS_CONFIG = {
  checkoutUrl: "https://YOUR-CHECKOUT-URL",
  trailerYoutubeId: "YOUTUBE_VIDEO_ID",
  eventEndpoint: "", // optional POST endpoint
  bipuUrl: "https://buildinpublicuniversity.com"
};
```

Query parameters on the landing-page URL are carried forward to the checkout and BiPU URLs. This lets campaign/placement tracking survive the handoff.

The page also stores the last 100 page/CTA events locally under `laas_events`. If `eventEndpoint` is configured, the same events are POSTed there.

## GitHub Pages

Simplest deployment:

1. Put these files at the repository root on `main`.
2. In GitHub: **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.

No build step or dependencies are required.

## Design intent

This is the Jay-specific bridge page. Acquisition context is "The Homework", but the underlying offer is Leo as a Service:

- $1,000 initial calibration
- measurable leverage = time back + revenue in
- $250/month continuation after calibration if both sides want to continue
- Marvin stays backstage
