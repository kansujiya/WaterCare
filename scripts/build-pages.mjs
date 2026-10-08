// Builds the Gurugram service pages from config.js so contact details stay
// in one place. Run after editing config.js:
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
const lit = (n) => n.toLocaleString("en-IN");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const waLink = (text) => "https://wa.me/" + cfg.whatsappNumber + "?text=" + encodeURIComponent(text);

function sizeList(kind) {
  const sizes = cfg.tanks[kind].sizes;
  return sizes.map((v, i) => (i === 0 ? `up to ${lit(v)} L` : `${lit(sizes[i - 1] + 1)} to ${lit(v)} L`)).join(", ") + `, and above ${lit(sizes[sizes.length - 1])} L`;
}

const pages = [
  {
    slug: "overhead-tank-cleaning-gurugram",
    title: "Overhead Water Tank Cleaning in Gurugram | No-Entry | TankSaaf",
    description: "No-entry overhead and rooftop water tank cleaning in Gurugram (Gurgaon). Suction, jet wash and food-safe disinfection. Free quote on WhatsApp, pay after the job.",
    crumb: "Overhead tank cleaning",
    eyebrow: "Overhead and rooftop tanks",
    h1: "Overhead water tank cleaning in Gurugram",
    lead: "Plastic rooftop tanks cleaned from outside with suction, a high-pressure jet and a food-safe disinfectant. Get a free quote on WhatsApp in under a minute.",
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

        <h2>Overhead tank cleaning cost in Gurugram</h2>
        <p>We quote by tank size and the number of tanks. Send your details and we reply on WhatsApp with a fixed price, including GST, before we come. More than one tank at the same address costs less per tank.</p>
        <p>Rooftop sizes we clean: ${sizeList("rooftop")}.</p>
        <p class="small">Not sure of the size? The liters are printed on the side of plastic tanks. Most 2 to 3 BHK homes have 1,000 to 1,500 L.</p>`,
    faqs: [
      ["How long does overhead tank cleaning take?", "About 60 to 90 minutes for a typical 1,000 to 2,000 liter rooftop tank."],
      ["Do I need to empty the tank before you come?", "No. Turn off the inlet the night before so the level drops, and we drain the rest. We can move clean water to your sump if you want to keep it."],
      ["Can you clean a tank on a 4th floor roof with no lift?", "Yes. Our hoses and pumps are portable. Tell us the floor in the booking notes so we bring enough hose."]
    ]
  },
  {
    slug: "underground-tank-cleaning-gurugram",
    title: "Underground Tank and Sump Cleaning in Gurugram | TankSaaf",
    description: "No-entry underground water tank and sump cleaning in Gurugram (Gurgaon). Sludge suction, jet wash and disinfection. Free quote on WhatsApp, pay after the job.",
    crumb: "Underground tank cleaning",
    eyebrow: "Underground sumps",
    h1: "Underground tank and sump cleaning in Gurugram",
    lead: `Concrete sumps cleaned from the manhole with a sludge pump and high-pressure jet. Nobody goes down into the tank. Free quote on WhatsApp.`,
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

        <h2>Underground tank cleaning cost in Gurugram</h2>
        <p>We quote by sump size and access. Send your details and we reply on WhatsApp with a fixed price, including GST, before we come. Cleaning your rooftop tank in the same visit costs less than two separate visits.</p>
        <p>Sump sizes we clean: ${sizeList("underground")}.</p>
        <p class="small">Not sure of the size? Builder floors usually have 3,000 to 5,000 L sumps; independent houses often 5,000 to 10,000 L. Send us a photo on WhatsApp and we'll estimate it.</p>`,
    faqs: [
      ["Will my water supply be off?", "Only while the sump is being cleaned, usually 90 minutes to 2 hours. Fill your rooftop tank beforehand and you won't notice."],
      ["Do you clean the rooftop tank in the same visit?", "Yes, and we recommend it. Choose \"Both\" when asking for a quote and the second tank costs less."],
      ["My sump is bigger than 10,000 liters. Can you clean it?", "Yes. Send a photo or the dimensions on WhatsApp and we'll quote for it."]
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
          <li><strong>Get a written quote</strong> with a bulk rate for the whole society.</li>
          <li><strong>Agree a schedule</strong> so only one block's supply is affected at a time.</li>
          <li><strong>We clean and report</strong> with photos of every tank.</li>
        </ol>

        <h2>How society pricing works</h2>
        <p>Society quotes are based on the number and size of tanks, and get cheaper per tank as the count goes up. Send your tank list on WhatsApp for a written quote.</p>`,
    faqs: [
      ["Do you clean large society sumps?", "Yes. Sumps above 10,000 liters are quoted after a site look or from the dimensions."],
      ["Can you work on weekends?", "Yes, cleaning is available every day. Weekend slots fill first, so share your preferred dates early."]
    ]
  },
  {
    slug: "water-tank-cleaning-price-gurugram",
    title: "Water Tank Cleaning Cost in Gurugram: How Pricing Works | TankSaaf",
    description: "What water tank cleaning costs depend on in Gurugram, what's included, and how to get a free fixed quote on WhatsApp for overhead tanks and underground sumps.",
    crumb: "Pricing and quotes",
    eyebrow: "Pricing and quotes",
    h1: "Water tank cleaning cost in Gurugram",
    lead: "We quote every job on WhatsApp with one fixed price, including GST, before we come. Here's what the price depends on and what you get.",
    type: "rooftop",
    serviceName: "Water tank cleaning",
    body: `
        <h2>What the price depends on</h2>
        <ul>
          <li><strong>Tank size.</strong> Larger tanks take longer to drain, clean and dry.</li>
          <li><strong>Tank type.</strong> Underground sumps take more work than rooftop tanks of the same size.</li>
          <li><strong>Number of tanks.</strong> Cleaning more than one tank at the same address costs less per tank.</li>
          <li><strong>Access.</strong> Very high roofs or tight manholes may need extra hose or time.</li>
        </ul>

        <h2>How to get your quote</h2>
        <ol class="plain-steps">
          <li><strong>Send your tank details</strong> from our <a href="/#book">quote form</a>, or a photo of the tank on WhatsApp.</li>
          <li><strong>Get one fixed price</strong> on WhatsApp, including GST.</li>
          <li><strong>Pick a slot</strong> and we confirm it in the same chat.</li>
          <li><strong>Pay after the job</strong> by UPI or cash. No advance.</li>
        </ol>

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

        <h2>Tank sizes we clean</h2>
        <p>Rooftop tanks: ${sizeList("rooftop")}.</p>
        <p>Underground sumps: ${sizeList("underground")}.</p>`,
    faqs: [
      ["Is GST included in the quote?", "Yes. The quote we send on WhatsApp is the full amount including GST."],
      ["Do I pay in advance?", "No. You pay after the job, by UPI or cash."],
      ["Can the price change on the day?", "Only if the tank is clearly a different size from what you told us, and we tell you before we start. Never after the job."]
    ]
  }
];

const header = `
  <header class="topbar is-scrolled">
    <div class="wrap topbar-inner">
      <a class="logo" href="/" aria-label="${cfg.brand} home">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0d5c9e"/><path d="M16 6c4 5.6 7 9.2 7 12.8a7 7 0 0 1-14 0C9 15.2 12 11.6 16 6z" fill="#fff"/><path d="M13 19.5a3 3 0 0 0 3 3" stroke="#0d5c9e" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
        <span class="wordmark"><span>Tank</span><span>Saaf</span></span>
      </a>
      <nav class="nav" aria-label="Main">
        <a href="/overhead-tank-cleaning-gurugram">Overhead tanks</a>
        <a href="/underground-tank-cleaning-gurugram">Underground sumps</a>
        <a href="/society-tank-cleaning-gurugram">Societies</a>
        <a href="/water-tank-cleaning-price-gurugram">Pricing</a>
      </nav>
      <div class="topbar-cta">
        <a class="icon-btn" href="tel:${cfg.phoneLink}" aria-label="Call us">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </a>
        <a class="btn btn-small" href="/#book">Free quote</a>
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
        <a href="/water-tank-cleaning-price-gurugram">Pricing and quotes</a>
      </nav>
      <address>
        <!-- PLACEHOLDER: replace address, hours and contacts with real details -->
        <p>Address to be added, Gurugram, Haryana</p>
        <p>Open every day, 8 AM to 6 PM</p>
        <p><a href="tel:${cfg.phoneLink}">${cfg.phoneDisplay}</a></p>
        <p><a href="mailto:${cfg.email}">${cfg.email}</a></p>
      </address>
    </div>
    <p class="wrap copyright">© ${new Date().getFullYear()} ${cfg.brand}. All rights reserved.</p>
  </footer>`;

const waIcon = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>`;

function render(p) {
  const url = `${SITE}/${p.slug}`;
  const bookHref = `/?type=${p.type}#book`;
  const societyText = "Hi TankSaaf, I'd like a quote for our society. Number of tanks: , Society: ";
  const primaryCta = p.societyCta
    ? `<a class="btn btn-lg btn-wa" href="${esc(waLink(societyText))}" target="_blank" rel="noopener">${waIcon}Get a society quote on WhatsApp</a>`
    : `<a class="btn btn-lg" href="${bookHref}">Get a free quote</a>`;
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
  <meta name="theme-color" content="#0b549a">
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
          <li>Nobody enters your tank</li><li>Free quote on WhatsApp</li><li>Before and after photos</li><li>Pay after the job</li>
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
          <h2>Get a free quote in under a minute</h2>
          <p class="section-lead">Tell us your tank type, size and a preferred slot. We reply on WhatsApp with a fixed quote. Nothing to pay until the job is done.</p>
        </div>
        <a class="btn btn-lg btn-light" href="${bookHref}">Get my free quote</a>
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
    <div class="mbar-price"><small>No-entry tank cleaning</small><strong>Free quote</strong></div>
    <a class="btn" href="${bookHref}">Get quote</a>
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
