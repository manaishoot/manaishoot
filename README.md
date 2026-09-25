# Mana iShots Portfolio Website

A responsive, cinematic, data-driven portfolio site for Mana iShots.

## Deploy

Upload the whole folder to GitHub Pages, Vercel, Netlify, or another static host.

For local testing, use VS Code Live Server (or another local HTTP server). Opening `index.html` directly with `file://` can prevent the browser from loading `data.json`.

## Add videos later

You no longer need to edit `script.js`.

Open `data.json` and add an object under `videos`:

```json
{
  "id": "new-video",
  "file": "new-video.mp4",
  "title": "New Brand Video",
  "category": "brand-promotions",
  "label": "BRAND PROMOTION",
  "url": "https://res.cloudinary.com/taf01r6d/video/upload/YOUR_CLOUDINARY_PATH/new-video.mp4",
  "featured": true
}
```

The `url` can point to Cloudinary, so large video files do not need to be stored in GitHub.

## Add a new category

Add an object under `categories`:

```json
{
  "id": "fashion",
  "label": "Fashion",
  "subtitle": "Editorial / Reels"
}
```

Then set `"category": "fashion"` on videos in that category.

The Work filters and category cards are generated automatically.

## Update portfolio data

`data.json` controls:
- creator/site information
- phone and Instagram links
- hero reach figure
- categories
- Instagram performance stats
- follower/profile snapshot
- video titles, labels, categories, Cloudinary URLs and featured status

## Current videos

The supplied Cloudinary URLs are already added for:
c-1, re, mom, mom_to_be, birthday, independence_day, wedding-rally,
brand-2, brand-promotion, baby_shower, blessing, suprise_video and ir-2.

## Notes

The existing visual design and styles are preserved. The main change is the content system: future videos/data can be added through `data.json` without rewriting the JavaScript.
