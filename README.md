# WaterCare (TankSaaf)

Single page website for a no-entry water tank cleaning service in Gurugram. Customers pick a rooftop or underground tank, choose the capacity, see the price with GST, pick a slot, and send the booking to WhatsApp. No backend.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page, SEO meta tags and structured data (LocalBusiness, Service, FAQPage) |
| `config.js` | Brand, contact details, price slabs, GST, time slots, demo video IDs |
| `app.js` | Price calculator, booking form, WhatsApp link, lazy video embeds |
| `styles.css` | Styles, mobile first |
| `robots.txt`, `sitemap.xml` | For search engines |
| `og-image.png` | Preview image when the link is shared on WhatsApp or social media (source: `og-image.svg`) |

## Before launch

Search the repo for `PLACEHOLDER`, `9999`, `tanksaaf.in` and `Address to be added`, and replace:

1. **`config.js`**: `whatsappNumber` (digits only, e.g. `919812345678`), `phoneDisplay`, `phoneLink`, `email`, and the two YouTube video IDs.
2. **`index.html`**: the JSON-LD block in `<head>` (telephone, email, address, postal code, opening hours), the canonical and `og:` URLs, and the footer address and hours.
3. **`robots.txt`, `sitemap.xml`**: the domain.
4. **Prices**: edit the slabs in `config.js`. The calculator and price table update from it. Also update the static fallback rows in `index.html` and the `Offer` prices in the JSON-LD so search engines see the same numbers.

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
- Turn on Vercel Web Analytics (or add Google Analytics 4). The booking button already sends a `whatsapp_booking` event to either if present.
