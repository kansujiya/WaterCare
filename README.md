# WaterCare (TankSaaf)

Single page website for a no-entry water tank cleaning service in Gurugram. Customers pick a rooftop or underground tank, choose the capacity and a slot, and send a quote request to WhatsApp. Prices are not shown on the site; quotes are sent manually. No backend.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page, SEO meta tags and structured data (LocalBusiness, Service, FAQPage) |
| `config.js` | Brand, contact details, tank sizes, time slots, optional launch offer, photos, demo video IDs |
| `app.js` | Quote request form, WhatsApp link, gallery, lazy video embeds |
| `styles.css` | Styles, mobile first |
| `*-gurugram.html` | Service pages: overhead tanks, underground sumps, societies, pricing and quotes. Generated, don't edit by hand |
| `scripts/build-pages.mjs` | Builds the service pages (English and `/hi/` Hindi) and `sitemap.xml` from `config.js` |
| `scripts/build-hi.mjs` | Builds the Hindi homepage `hi/index.html` from `index.html` with an English-to-Hindi string list |
| `robots.txt`, `sitemap.xml` | For search engines |
| `og-image.jpg` | Preview image when the link is shared on WhatsApp or social media (source: `og-image.svg`) |

## Before launch

Search the repo for `PLACEHOLDER`, `9999`, `tanksaaf.in` and `Address to be added`, and replace:

1. **`config.js`**: `whatsappNumber` (digits only, e.g. `919812345678`), `phoneDisplay`, `phoneLink`, `email`, and the two YouTube video IDs. The demo video section stays hidden until a video ID is set. `offerText` shows a launch offer line; only set one you will honour.
2. **`index.html`**: add `telephone`, `email` and the full street address to the JSON-LD block in `<head>` (left out until real), check opening hours, the canonical and `og:` URLs, and the footer address and hours.
3. **`robots.txt`, `sitemap.xml`**: the domain.
4. **Tank sizes**: edit `tanks` in `config.js`. To show prices again later, the price calculator and price tables are in the git history before this change.
5. **Photos**: put your images in `images/` (JPG or WebP, about 1200px wide, under 200 KB each) and list them in `photos` in `config.js`. The "Tanks we clean" section appears once the list has entries. Real before and after shots of your own jobs work best; if you use stock photos (Unsplash, Pexels), add the photographer credit and don't caption them as your work.
6. **Hero illustration**: swap for a real crew photo when you have one (see the `PHOTO SLOT` comment).

After any change to `config.js` (tank sizes, phone, WhatsApp, email), run `node scripts/build-pages.mjs` so the service pages and sitemap pick it up, then commit the result. After any change to `index.html`, run `node scripts/build-hi.mjs`; it stops with an error if an English sentence it translates has changed, so add or update that sentence's Hindi in the script. The domain for those pages is the `SITE` constant at the top of that script.

If you pick a different brand name, change `brand` in `config.js` and the name in `index.html` (title, meta tags, JSON-LD).

## Run locally

Any static server works:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repo.
2. Framework preset: **Other**. No build command, no output directory.
3. Deploy, then add your domain under **Settings → Domains**.

## After launch

- Create a Google Business Profile for Gurugram with the same name, phone and address as the site. It matters more than the website for "near me" searches.
- Submit `sitemap.xml` in Google Search Console.
- Turn on Vercel Web Analytics (or add Google Analytics 4). The quote button already sends a `whatsapp_quote_request` event to either if present.
