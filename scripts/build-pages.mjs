// Builds the Gurugram service pages from config.js so prices and contact
// details stay in one place. Run after editing config.js:
//   node scripts/build-pages.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(join(root, "config.js"), "utf8"), sandbox);
const cfg = sandbox.window.SITE_CONFIG;

const SITE = "https://tanksaaf.in"; // PLACEHOLDER: your domain
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const lit = (n) => n.toLocaleString("en-IN");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const waLink = (text) => "https://wa.me/" + cfg.whatsappNumber + "?text=" + encodeURIComponent(text);

function slabRows(kind) {
  const slabs = cfg.pricing[kind].slabs;
  let prev = 0;
  const rows = slabs.map((s) => {
    const label = prev === 0 ? `Up to ${lit(s.upTo)} L` : `${lit(prev + 1)} to ${lit(s.upTo)} L`;
    prev = s.upTo;
    const gst = Math.round(s.price * cfg.gstRate);
    return `<tr><th scope="row">${label}</th><td data-label="Price">${inr(s.price)}</td><td data-label="With GST">${inr(s.price + gst)}</td></tr>`;
  });
  rows.push(`<tr><th scope="row">Above ${lit(prev)} L</th><td colspan="2" data-label="Price">Quote on WhatsApp</td></tr>`);
  return `<div class="table-wrap"><table class="prices rtable">
          <thead><tr><th scope="col">Tank capacity</th><th scope="col">Price</th><th scope="col">With 18% GST</th></tr></thead>
          <tbody>${rows.join("")}</tbody>
        </table></div>`;
}

const fromPrice = (kind) => cfg.pricing[kind].slabs[0].price;

const pages = [
  {
    slug: "overhead-tank-cleaning-gurugram",
    title: `Overhead Water Tank Cleaning in Gurugram from ${inr(fromPrice("rooftop"))} | TankSaaf`,
    description: `No-entry overhead and rooftop water tank cleaning in Gurugram (Gurgaon). Suction, jet wash and disinfection from ${inr(fromPrice("rooftop"))} + GST. See your price and book on WhatsApp.`,
    crumb: "Overhead tank cleaning",
    eyebrow: "Overhead and rooftop tanks",
    h1: "Overhead water tank cleaning in Gurugram",
    lead: `Plastic rooftop tanks cleaned from outside with suction, a high-pressure jet and a food-safe disinfectant. From ${inr(fromPrice("rooftop"))} + GST, price shown before you book.`,
    type: "rooftop",
    serviceName: "Overhead water tank cleaning",
    body: `
        <h2>Why rooftop tanks in Gurugram get dirty fast</h2>
        <p>Most Gurugram homes store water in black or white plastic tanks on the roof. Supply water carries fine silt that settles into a layer of mud at the bottom. Through April to June the tank sits in direct sun, and the warm water lets algae spread over the walls and under the lid. After the monsoon, muddy supply makes the sludge layer thicker again.</p>
        <p>That's why every 6 months is the common rule: once before summer and once after the monsoon.</p>

        <h2>How we clean an overhead tank, without climbing in</h2>
        <ol class="plain-steps">
          <li><strong>Inspect and photograph</strong> the tank before we start.</li>
          <li><strong>Drain</strong> leftover water, or move it to your sump if you want to keep it.</li>
          <li><strong>Suction</strong> pulls out sludge and silt from the floor of the tank.</li>
          <li><strong>Jet wash</strong> the walls, floor and lid with a high-pressure lance through the lid opening.</li>
          <li><strong>Disinfect</strong> with a food-safe solution, then flush with clean water.</li>
          <li><strong>Dry</strong> the tank and send you after photos on WhatsApp.</li>
        </ol>
        <p>Nobody steps into your drinking water, and nobody stands on a thin plastic tank floor that can crack.</p>

        <h2>Overhead tank cleaning price in Gurugram</h2>
        <p>One fixed price by tank size, the same for every sector. Each extra tank at the same address gets ${Math.round(cfg.extraTankDiscount * 100)}% off.</p>
        ${slabRows("rooftop")}
        <p class="small">Not sure of the size? The liters are printed on the side of plastic tanks. Most 2 to 3 BHK homes have 1,000 to 1,500 L.</p>`,
    faqs: [
      ["How long does overhead tank cleaning take?", "About 60 to 90 minutes for a typical 1,000 to 2,000 liter rooftop tank."],
      ["Do I need to empty the tank before you come?", "No. Turn off the inlet the night before so the level drops, and we drain the rest. We can move clean water to your sump if you want to keep it."],
      ["Can you clean a tank on a 4th floor roof with no lift?", "Yes. Our hoses and pumps are portable. Tell us the floor in the booking notes so we bring enough hose."]
    ]
  },
  {
    slug: "underground-tank-cleaning-gurugram",
    title: `Underground Tank and Sump Cleaning in Gurugram from ${inr(fromPrice("underground"))} | TankSaaf`,
    description: `No-entry underground water tank and sump cleaning in Gurugram (Gurgaon). Sludge suction, jet wash and disinfection from ${inr(fromPrice("underground"))} + GST. Book on WhatsApp.`,
    crumb: "Underground tank cleaning",
    eyebrow: "Underground sumps",
    h1: "Underground tank and sump cleaning in Gurugram",
    lead: `Concrete sumps cleaned from the manhole with a sludge pump and high-pressure jet. Nobody goes down into the tank. From ${inr(fromPrice("underground"))} + GST.`,
    type: "underground",
    serviceName: "Underground sump cleaning",
    body: `
        <h2>Why underground sumps need regular cleaning</h2>
        <p>Your underground tank is the first stop for municipal and tanker water. It collects the heaviest silt, and cracks or loose manhole covers can let in dust, insects and seepage. Because nobody can see inside, sludge builds up for years and is pumped straight up to the rooftop tank.</p>
        <p>Cleaning the sump and the rooftop tank together stops the rooftop tank getting dirty again within weeks.</p>

        <h2>Why "no entry" matters most for sumps</h2>
        <p>An underground sump is a confined space with little air. Sending a worker inside is the traditional method, and it's the riskiest part of tank cleaning. We clean from the manhole using long suction hoses and jet lances, so nobody has to go down.</p>

        <h2>How we clean an underground tank</h2>
        <ol class="plain-steps">
          <li><strong>Inspect and photograph</strong> through the manhole.</li>
          <li><strong>Pump out</strong> the remaining water.</li>
          <li><strong>Suction</strong> removes settled sludge and silt from the floor.</li>
          <li><strong>Jet wash</strong> the walls and floor with a high-pressure lance.</li>
          <li><strong>Disinfect</strong> with a food-safe solution and flush.</li>
          <li><strong>Remove rinse water</strong> and send you after photos on WhatsApp.</li>
        </ol>

        <h2>Underground tank cleaning price in Gurugram</h2>
        <p>Fixed prices by capacity. Book your rooftop tank in the same visit and the cheaper of the two gets ${Math.round(cfg.extraTankDiscount * 100)}% off.</p>
        ${slabRows("underground")}
        <p class="small">Not sure of the size? Builder floors usually have 3,000 to 5,000 L sumps; independent houses often 5,000 to 10,000 L. Send us a photo on WhatsApp and we'll estimate it.</p>`,
    faqs: [
      ["Will my water supply be off?", "Only while the sump is being cleaned, usually 90 minutes to 2 hours. Fill your rooftop tank beforehand and you won't notice."],
      ["Do you clean the rooftop tank in the same visit?", `Yes, and we recommend it. Choose "Both" when booking and the second tank gets ${Math.round(cfg.extraTankDiscount * 100)}% off.`],
      ["My sump is bigger than 10,000 liters. Can you clean it?", "Yes. Large sumps are priced after a quick look. Send a photo or the dimensions on WhatsApp for a quote."]
    ]
  },
  {
    slug: "society-tank-cleaning-gurugram",
    title: "Water Tank Cleaning for Societies and RWAs in Gurugram | TankSaaf",
    description: "Scheduled no-entry water tank cleaning for Gurugram societies, RWAs and builder floors. Bulk rates for 5+ tanks, tower-by-tower scheduling and photo reports.",
    crumb: "Societies and RWAs",
    eyebrow: "Societies, RWAs and builder floors",
    h1: "Water tank cleaning for Gurugram societies and RWAs",
    lead: "Overhead tanks and underground sumps cleaned tower by tower, with photo reports for your records and bulk rates for 5 or more tanks.",
    type: "both",
    serviceName: "Society water tank cleaning",
    societyCta: true,
    body: `
        <h2>What facility managers and RWAs get</h2>
        <ul class="ticks">
          <li>Bulk rates for 5 or more tanks</li>
          <li>Cleaning scheduled tower by tower to keep water running for residents</li>
          <li>Before and after photos of every tank, shared as a report</li>
          <li>The same no-entry method for every tank: nobody goes inside</li>
          <li>Reminders when the next 6-monthly clean is due</li>
        </ul>

        <h2>How a society cleaning works</h2>
        <ol class="plain-steps">
          <li><strong>Share the tank list</strong> on WhatsApp: number of overhead tanks and sumps, and rough sizes.</li>
          <li><strong>Get a written quote</strong> based on our published per-tank prices with a bulk discount.</li>
          <li><strong>Agree a schedule</strong> so only one block's supply is affected at a time.</li>
          <li><strong>We clean and report</strong> with photos of every tank.</li>
        </ol>

        <h2>Per-tank prices we start from</h2>
        <p>Society quotes start from the same public prices homeowners see: overhead tanks from ${inr(fromPrice("rooftop"))} and underground sumps from ${inr(fromPrice("underground"))} per tank, plus GST, before the bulk discount.</p>`,
    faqs: [
      ["Do you clean large society sumps?", "Yes. Sumps above 10,000 liters are quoted after a site look or from the dimensions."],
      ["Can you work on weekends?", "Yes, cleaning is available every day. Weekend slots fill first, so share your preferred dates early."]
    ]
  },
  {
    slug: "water-tank-cleaning-price-gurugram",
    title: "Water Tank Cleaning Price in Gurugram (2026 Price List) | TankSaaf",
    description: `Water tank cleaning cost in Gurugram by tank size: overhead tanks from ${inr(fromPrice("rooftop"))}, underground sumps from ${inr(fromPrice("underground"))}, plus GST. Full price list and what's included.`,
    crumb: "Price list",
    eyebrow: "Price list",
    h1: "Water tank cleaning price in Gurugram",
    lead: "Our full price list for overhead tanks and underground sumps, by size. The price you see here is the price you pay after the job.",
    type: "rooftop",
    serviceName: "Water tank cleaning",
    body: `
        <h2>Overhead and rooftop tank prices</h2>
        ${slabRows("rooftop")}

        <h2>Underground sump prices</h2>
        ${slabRows("underground")}

        <h2>What affects the price</h2>
        <ul>
          <li><strong>Tank size</strong> is the only thing that sets the price. Sector, floor and how dirty the tank is don't change it.</li>
          <li><strong>More than one tank</strong> at the same address: each extra tank gets ${Math.round(cfg.extraTankDiscount * 100)}% off.</li>
          <li><strong>Very large tanks</strong> above 10,000 liters are quoted on WhatsApp.</li>
        </ul>

        <h2>What's included in every clean</h2>
        <ul class="ticks">
          <li>Sludge and silt suction</li>
          <li>Jet wash of walls, floor and lid</li>
          <li>Food-safe disinfection and flush</li>
          <li>Drying the tank</li>
          <li>Before and after photos on WhatsApp</li>
          <li>Cleaning up the area after</li>
        </ul>
        <p>Not included: tank or lid repairs, and plumbing, valve or overflow work.</p>

        <h2>Why we publish our prices</h2>
        <p>Many tank cleaning services only give a price after a call or a site visit. We think you should know the cost before you pick up the phone, so every price is on this page and in the calculator on our <a href="/#book">booking form</a>.</p>`,
    faqs: [
      ["Is GST included in these prices?", "No. Prices exclude 18% GST. The booking calculator shows the GST and the final total before you send the booking."],
      ["Do I pay in advance?", "No. You pay after the job, by UPI or cash."],
      ["What if my tank is a different size than I booked?", "We check the size before starting and tell you if the price changes. Never after the job."]
    ]
  }
];

const header = `
  <header class="topbar is-scrolled">
    <div class="wrap topbar-inner">
      <a class="logo" href="/" aria-label="${cfg.brand} home">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0b6fa4"/><path d="M16 6c4 5.6 7 9.2 7 12.8a7 7 0 0 1-14 0C9 15.2 12 11.6 16 6z" fill="#fff"/><path d="M13 19.5a3 3 0 0 0 3 3" stroke="#0b6fa4" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
        <span class="wordmark"><span>Tank</span><span>Saaf</span></span>
      </a>
      <nav class="nav" aria-label="Main">
        <a href="/overhead-tank-cleaning-gurugram">Overhead tanks</a>
        <a href="/underground-tank-cleaning-gurugram">Underground sumps</a>
        <a href="/society-tank-cleaning-gurugram">Societies</a>
        <a href="/water-tank-cleaning-price-gurugram">Prices</a>
      </nav>
      <div class="topbar-cta">
        <a class="icon-btn" href="tel:${cfg.phoneLink}" aria-label="Call us">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </a>
        <a class="btn btn-small" href="/#book">Book now</a>
      </div>
    </div>
  </header>`;

const footer = `
  <footer class="footer">
    <div class="wrap footer-inner">
      <div>
        <p class="logo"><span class="wordmark"><span>Tank</span><span>Saaf</span></span></p>
        <p>No-entry water tank cleaning in Gurugram (Gurgaon).</p>
      </div>
      <nav class="footer-links" aria-label="Services">
        <a href="/overhead-tank-cleaning-gurugram">Overhead tank cleaning</a>
        <a href="/underground-tank-cleaning-gurugram">Underground tank cleaning</a>
        <a href="/society-tank-cleaning-gurugram">Societies and RWAs</a>
        <a href="/water-tank-cleaning-price-gurugram">Price list</a>
      </nav>
      <address>
        <!-- PLACEHOLDER: replace address, hours and contacts with real details -->
        <p>Address to be added, Gurugram, Haryana</p>
        <p>Open every day, 8 AM to 6 PM</p>
        <p><a href="tel:${cfg.phoneLink}">${cfg.phoneDisplay}</a></p>
        <p><a href="mailto:${cfg.email}">${cfg.email}</a></p>
      </address>
    </div>
    <p class="wrap copyright">© ${new Date().getFullYear()} ${cfg.brand}. Prices exclude 18% GST.</p>
  </footer>`;

const waIcon = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>`;

function render(p) {
  const url = `${SITE}/${p.slug}`;
  const bookHref = `/?type=${p.type}#book`;
  const societyText = "Hi TankSaaf, I'd like a quote for our society. Number of tanks: , Society: ";
  const primaryCta = p.societyCta
    ? `<a class="btn btn-lg btn-wa" href="${esc(waLink(societyText))}" target="_blank" rel="noopener">${waIcon}Get a society quote on WhatsApp</a>`
    : `<a class="btn btn-lg" href="${bookHref}">See your price and book</a>`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: p.crumb, item: url }
        ]
      },
      {
        "@type": "Service",
        name: p.serviceName,
        serviceType: "Water tank cleaning",
        url,
        provider: { "@id": SITE + "/#business" },
        areaServed: { "@type": "City", name: "Gurugram", alternateName: "Gurgaon" }
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
      }
    ]
  };
  const related = pages.filter((o) => o.slug !== p.slug)
    .map((o) => `<li><a href="/${o.slug}">${o.h1}</a></li>`).join("\n            ");

  return `<!doctype html>
<!-- Generated by scripts/build-pages.mjs from config.js. Edit the script, not this file. -->
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.description)}">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#0a2a3f">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_IN">
  <meta property="og:site_name" content="${cfg.brand}">
  <meta property="og:title" content="${esc(p.h1)} | ${cfg.brand}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="subpage">
${header}

  <main>
    <section class="page-hero">
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> <span>${p.crumb}</span></nav>
        <p class="eyebrow">${p.eyebrow}</p>
        <h1>${p.h1}</h1>
        <p class="lead">${p.lead}</p>
        <div class="hero-cta">
          ${primaryCta}
          <a class="btn btn-lg btn-ghost" href="${esc(waLink("Hi TankSaaf, I want to get my water tank cleaned. Sector/society: "))}" target="_blank" rel="noopener">${waIcon}Chat on WhatsApp</a>
        </div>
        <ul class="trust">
          <li>Nobody enters your tank</li><li>Price shown upfront</li><li>Before and after photos</li><li>Pay after the job</li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap prose">
        ${p.body.trim()}

        <h2>Questions</h2>
        <div class="faq">
          ${p.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="wrap societies">
        <div>
          <h2>Book in under a minute</h2>
          <p class="section-lead">Pick your tank and a slot, see the exact total with GST, and send it to us on WhatsApp. Nothing to pay until the job is done.</p>
        </div>
        <a class="btn btn-lg btn-light" href="${bookHref}">Get my price</a>
      </div>
    </section>

    <section class="section section-surface">
      <div class="wrap">
        <h2 class="h3">More from ${cfg.brand}</h2>
        <ul class="related">
            ${related}
        </ul>
      </div>
    </section>
  </main>
${footer}

  <div class="mbar">
    <div class="mbar-price"><small>Tank cleaning from</small><strong>${inr(fromPrice(p.type === "underground" ? "underground" : "rooftop"))} <span>+ GST</span></strong></div>
    <a class="btn" href="${bookHref}">Book now</a>
  </div>
</body>
</html>
`;
}

for (const p of pages) {
  writeFileSync(join(root, p.slug + ".html"), render(p));
  console.log("wrote", p.slug + ".html");
}

const today = new Date().toISOString().slice(0, 10);
const urls = ["/"].concat(pages.map((p) => "/" + p.slug));
writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${SITE}${u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}
</urlset>
`);
console.log("wrote sitemap.xml");
