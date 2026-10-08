// Builds the Gurugram service pages from config.js so contact details stay
// in one place, in English and Hindi (/hi/). Run after editing config.js:
//   node scripts/build-pages.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

function sizeList(kind, lang = "en") {
  const sizes = cfg.tanks[kind].sizes;
  const last = lit(sizes[sizes.length - 1]);
  if (lang === "hi") {
    return sizes.map((v, i) => (i === 0 ? `${lit(v)} L तक` : `${lit(sizes[i - 1] + 1)} से ${lit(v)} L`)).join(", ") + `, और ${last} L से ज़्यादा`;
  }
  return sizes.map((v, i) => (i === 0 ? `up to ${lit(v)} L` : `${lit(sizes[i - 1] + 1)} to ${lit(v)} L`)).join(", ") + `, and above ${last} L`;
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

// Hindi versions of the pages above, written to /hi/<slug>.html. Keys match
// the English page slugs; anything not set here (type, societyCta) comes from
// the English page.
const hindi = {
  "overhead-tank-cleaning-gurugram": {
    title: "छत की पानी की टंकी की सफ़ाई गुरुग्राम | बिना अंदर उतरे | TankSaaf",
    description: "गुरुग्राम (गुड़गांव) में छत और ओवरहेड पानी की टंकी की सफ़ाई, बिना अंदर उतरे। सक्शन, जेट वॉश और फ़ूड-सेफ़ कीटाणुनाशन। व्हाट्सऐप पर मुफ़्त कोटेशन, काम के बाद भुगतान।",
    crumb: "छत की टंकी की सफ़ाई",
    eyebrow: "छत और ओवरहेड टंकियां",
    h1: "गुरुग्राम में छत की पानी की टंकी की सफ़ाई",
    lead: "प्लास्टिक की छत वाली टंकियां बाहर से साफ़, सक्शन, हाई-प्रेशर जेट और फ़ूड-सेफ़ कीटाणुनाशक से। व्हाट्सऐप पर एक मिनट से कम में मुफ़्त कोटेशन पाएं।",
    body: `
        <h2>गुरुग्राम में छत की टंकियां जल्दी गंदी क्यों होती हैं</h2>
        <p>गुरुग्राम के ज़्यादातर घरों में पानी छत पर रखी काली या सफ़ेद प्लास्टिक टंकियों में भरा जाता है। सप्लाई पानी में बारीक गाद आती है, जो तली में कीचड़ की परत बनकर जम जाती है। अप्रैल से जून तक टंकी सीधी धूप में रहती है, और गर्म पानी में दीवारों और ढक्कन के नीचे काई फैल जाती है। मानसून के बाद गंदा सप्लाई पानी कीचड़ की परत फिर मोटी कर देता है।</p>
        <p>इसीलिए आम नियम है हर 6 महीने में सफ़ाई: एक बार गर्मी से पहले और एक बार मानसून के बाद।</p>

        <h2>हम छत की टंकी कैसे साफ़ करते हैं, बिना अंदर उतरे</h2>
        <ol class="plain-steps">
          <li><strong>जांच और फ़ोटो</strong> काम शुरू करने से पहले।</li>
          <li><strong>पानी निकालना:</strong> बचा पानी निकालते हैं, या आप चाहें तो सम्प में भर देते हैं।</li>
          <li><strong>सक्शन</strong> से टंकी की तली का कीचड़ और गाद खींच लेते हैं।</li>
          <li><strong>जेट वॉश:</strong> ढक्कन के रास्ते हाई-प्रेशर लांस से दीवारें, तली और ढक्कन धोते हैं।</li>
          <li><strong>कीटाणुनाशन</strong> फ़ूड-सेफ़ घोल से, फिर साफ़ पानी से फ़्लश।</li>
          <li><strong>सुखाना</strong> और व्हाट्सऐप पर बाद की फ़ोटो भेजना।</li>
        </ol>
        <p>आपके पीने के पानी में कोई पैर नहीं रखता, और प्लास्टिक टंकी की पतली तली पर कोई खड़ा नहीं होता जिससे वह चटक सकती है।</p>

        <h2>गुरुग्राम में छत की टंकी की सफ़ाई का खर्च</h2>
        <p>हम टंकी के साइज़ और संख्या के हिसाब से कोटेशन देते हैं। अपनी जानकारी भेजिए, हम आने से पहले व्हाट्सऐप पर GST सहित तय कीमत भेज देंगे। एक ही पते पर एक से ज़्यादा टंकी हो तो हर टंकी का खर्च कम होता है।</p>
        <p>छत की टंकी के साइज़ जो हम साफ़ करते हैं: ${sizeList("rooftop", "hi")}।</p>
        <p class="small">साइज़ पता नहीं? प्लास्टिक टंकी के साइड पर लीटर लिखे होते हैं। ज़्यादातर 2 से 3 BHK घरों में 1,000 से 1,500 L की टंकी होती है।</p>`,
    faqs: [
      ["छत की टंकी की सफ़ाई में कितना समय लगता है?", "आम 1,000 से 2,000 लीटर की छत वाली टंकी में लगभग 60 से 90 मिनट।"],
      ["क्या आपके आने से पहले टंकी खाली करनी होगी?", "नहीं। एक रात पहले इनलेट बंद कर दें ताकि पानी कम हो जाए, बाकी हम निकाल देंगे। आप चाहें तो साफ़ पानी हम सम्प में भर सकते हैं।"],
      ["चौथी मंज़िल की छत पर टंकी है और लिफ़्ट नहीं है। क्या आप साफ़ कर सकते हैं?", "हां। हमारे पाइप और पंप पोर्टेबल हैं। बुकिंग नोट में मंज़िल बता दें ताकि हम पूरा पाइप लेकर आएं।"]
    ]
  },
  "underground-tank-cleaning-gurugram": {
    title: "अंडरग्राउंड टंकी और सम्प की सफ़ाई गुरुग्राम | TankSaaf",
    description: "गुरुग्राम (गुड़गांव) में अंडरग्राउंड पानी की टंकी और सम्प की सफ़ाई, बिना अंदर उतरे। कीचड़ का सक्शन, जेट वॉश और कीटाणुनाशन। व्हाट्सऐप पर मुफ़्त कोटेशन, काम के बाद भुगतान।",
    crumb: "अंडरग्राउंड टंकी की सफ़ाई",
    eyebrow: "अंडरग्राउंड सम्प",
    h1: "गुरुग्राम में अंडरग्राउंड टंकी और सम्प की सफ़ाई",
    lead: "कंक्रीट सम्प मैनहोल से साफ़, स्लज पंप और हाई-प्रेशर जेट से। टंकी में कोई नीचे नहीं उतरता। व्हाट्सऐप पर मुफ़्त कोटेशन।",
    body: `
        <h2>अंडरग्राउंड सम्प की नियमित सफ़ाई क्यों ज़रूरी है</h2>
        <p>नगर निगम और टैंकर का पानी सबसे पहले आपकी अंडरग्राउंड टंकी में आता है। इसमें सबसे भारी गाद जमती है, और दरारों या ढीले मैनहोल कवर से धूल, कीड़े और रिसाव का पानी अंदर जा सकता है। अंदर कोई देख नहीं पाता, इसलिए सालों तक कीचड़ जमता रहता है और सीधे छत की टंकी तक पंप होता है।</p>
        <p>सम्प और छत की टंकी एक साथ साफ़ करवाने से छत की टंकी कुछ ही हफ़्तों में फिर गंदी नहीं होती।</p>

        <h2>सम्प के लिए "बिना अंदर उतरे" सफ़ाई सबसे ज़रूरी क्यों है</h2>
        <p>अंडरग्राउंड सम्प एक बंद जगह है जहां हवा कम होती है। मज़दूर को अंदर उतारना पुराना तरीका है, और टंकी सफ़ाई का सबसे जोखिम भरा हिस्सा यही है। हम लंबे सक्शन पाइप और जेट लांस से मैनहोल से ही सफ़ाई करते हैं, ताकि किसी को नीचे न उतरना पड़े।</p>

        <h2>हम अंडरग्राउंड टंकी कैसे साफ़ करते हैं</h2>
        <ol class="plain-steps">
          <li><strong>जांच और फ़ोटो</strong> मैनहोल से।</li>
          <li><strong>पंप से</strong> बचा पानी निकालते हैं।</li>
          <li><strong>सक्शन</strong> से तली में जमा कीचड़ और गाद हटाते हैं।</li>
          <li><strong>जेट वॉश:</strong> हाई-प्रेशर लांस से दीवारें और तली धोते हैं।</li>
          <li><strong>कीटाणुनाशन</strong> फ़ूड-सेफ़ घोल से, फिर फ़्लश।</li>
          <li><strong>धुलाई का पानी निकालकर</strong> व्हाट्सऐप पर बाद की फ़ोटो भेजते हैं।</li>
        </ol>

        <h2>गुरुग्राम में अंडरग्राउंड टंकी की सफ़ाई का खर्च</h2>
        <p>हम सम्प के साइज़ और पहुंच के हिसाब से कोटेशन देते हैं। अपनी जानकारी भेजिए, हम आने से पहले व्हाट्सऐप पर GST सहित तय कीमत भेज देंगे। उसी विज़िट में छत की टंकी भी साफ़ करवाना दो अलग विज़िट से सस्ता पड़ता है।</p>
        <p>सम्प के साइज़ जो हम साफ़ करते हैं: ${sizeList("underground", "hi")}।</p>
        <p class="small">साइज़ पता नहीं? बिल्डर फ़्लोर में आमतौर पर 3,000 से 5,000 L के सम्प होते हैं, और अलग मकानों में अक्सर 5,000 से 10,000 L। व्हाट्सऐप पर फ़ोटो भेजिए, हम अंदाज़ा बता देंगे।</p>`,
    faqs: [
      ["क्या मेरी पानी की सप्लाई बंद रहेगी?", "सिर्फ़ सम्प की सफ़ाई के दौरान, आमतौर पर 90 मिनट से 2 घंटे। पहले से छत की टंकी भर लें तो पता भी नहीं चलेगा।"],
      ["क्या उसी विज़िट में छत की टंकी भी साफ़ करते हैं?", "हां, और हम यही सलाह देते हैं। कोटेशन मांगते समय \"दोनों\" चुनें, दूसरी टंकी का खर्च कम लगेगा।"],
      ["मेरा सम्प 10,000 लीटर से बड़ा है। क्या आप साफ़ कर सकते हैं?", "हां। व्हाट्सऐप पर फ़ोटो या नाप भेजिए, हम उसका कोटेशन दे देंगे।"]
    ]
  },
  "society-tank-cleaning-gurugram": {
    title: "सोसाइटी और RWA के लिए पानी की टंकी की सफ़ाई गुरुग्राम | TankSaaf",
    description: "गुरुग्राम की सोसाइटी, RWA और बिल्डर फ़्लोर के लिए शेड्यूल पर बिना अंदर उतरे टंकी सफ़ाई। 5+ टंकियों पर बल्क रेट, टावर-दर-टावर शेड्यूल और फ़ोटो रिपोर्ट।",
    crumb: "सोसाइटी और RWA",
    eyebrow: "सोसाइटी, RWA और बिल्डर फ़्लोर",
    h1: "गुरुग्राम की सोसाइटी और RWA के लिए पानी की टंकी की सफ़ाई",
    lead: "छत की टंकियां और अंडरग्राउंड सम्प टावर-दर-टावर साफ़, आपके रिकॉर्ड के लिए फ़ोटो रिपोर्ट और 5 या ज़्यादा टंकियों पर बल्क रेट।",
    body: `
        <h2>फ़ैसिलिटी मैनेजर और RWA को क्या मिलता है</h2>
        <ul class="ticks">
          <li>5 या ज़्यादा टंकियों पर बल्क रेट</li>
          <li>टावर-दर-टावर शेड्यूल, ताकि निवासियों का पानी चलता रहे</li>
          <li>हर टंकी की पहले और बाद की फ़ोटो, रिपोर्ट के रूप में</li>
          <li>हर टंकी के लिए वही तरीका: कोई अंदर नहीं उतरता</li>
          <li>अगली 6-माही सफ़ाई का समय होने पर रिमाइंडर</li>
        </ul>

        <h2>सोसाइटी की सफ़ाई कैसे होती है</h2>
        <ol class="plain-steps">
          <li><strong>टंकियों की लिस्ट भेजें</strong> व्हाट्सऐप पर: छत की टंकियों और सम्प की संख्या, और अंदाज़न साइज़।</li>
          <li><strong>लिखित कोटेशन पाएं</strong> पूरी सोसाइटी के लिए बल्क रेट के साथ।</li>
          <li><strong>शेड्यूल तय करें</strong> ताकि एक समय में सिर्फ़ एक ब्लॉक की सप्लाई पर असर पड़े।</li>
          <li><strong>हम सफ़ाई करके रिपोर्ट देते हैं</strong> हर टंकी की फ़ोटो के साथ।</li>
        </ol>

        <h2>सोसाइटी की कीमत कैसे तय होती है</h2>
        <p>सोसाइटी का कोटेशन टंकियों की संख्या और साइज़ पर आधारित होता है, और टंकियां जितनी ज़्यादा, हर टंकी का खर्च उतना कम। लिखित कोटेशन के लिए व्हाट्सऐप पर अपनी टंकियों की लिस्ट भेजिए।</p>`,
    faqs: [
      ["क्या आप सोसाइटी के बड़े सम्प साफ़ करते हैं?", "हां। 10,000 लीटर से बड़े सम्प का कोटेशन साइट देखकर या नाप के आधार पर दिया जाता है।"],
      ["क्या आप वीकेंड पर काम करते हैं?", "हां, सफ़ाई हर दिन होती है। वीकेंड के स्लॉट सबसे पहले भरते हैं, इसलिए अपनी पसंदीदा तारीखें जल्दी बताएं।"]
    ]
  },
  "water-tank-cleaning-price-gurugram": {
    title: "पानी की टंकी की सफ़ाई का खर्च गुरुग्राम: कीमत कैसे तय होती है | TankSaaf",
    description: "गुरुग्राम में पानी की टंकी की सफ़ाई का खर्च किन बातों पर निर्भर है, क्या शामिल है, और छत की टंकी व अंडरग्राउंड सम्प के लिए व्हाट्सऐप पर मुफ़्त तय कोटेशन कैसे पाएं।",
    crumb: "कीमत और कोटेशन",
    eyebrow: "कीमत और कोटेशन",
    h1: "गुरुग्राम में पानी की टंकी की सफ़ाई का खर्च",
    lead: "हम हर काम का कोटेशन व्हाट्सऐप पर देते हैं, आने से पहले, GST सहित एक तय कीमत। यहां जानिए कीमत किन बातों पर निर्भर है और आपको क्या मिलता है।",
    body: `
        <h2>कीमत किन बातों पर निर्भर है</h2>
        <ul>
          <li><strong>टंकी का साइज़।</strong> बड़ी टंकी को खाली करने, साफ़ करने और सुखाने में ज़्यादा समय लगता है।</li>
          <li><strong>टंकी का प्रकार।</strong> उसी साइज़ की छत वाली टंकी से अंडरग्राउंड सम्प में ज़्यादा मेहनत लगती है।</li>
          <li><strong>टंकियों की संख्या।</strong> एक ही पते पर एक से ज़्यादा टंकी हो तो हर टंकी का खर्च कम होता है।</li>
          <li><strong>पहुंच।</strong> बहुत ऊंची छत या तंग मैनहोल के लिए ज़्यादा पाइप या समय लग सकता है।</li>
        </ul>

        <h2>कोटेशन कैसे पाएं</h2>
        <ol class="plain-steps">
          <li><strong>टंकी की जानकारी भेजें</strong> हमारे <a href="/hi/#book">कोटेशन फ़ॉर्म</a> से, या व्हाट्सऐप पर टंकी की फ़ोटो भेजकर।</li>
          <li><strong>एक तय कीमत पाएं</strong> व्हाट्सऐप पर, GST सहित।</li>
          <li><strong>स्लॉट चुनें</strong>, हम उसी चैट में पक्का करते हैं।</li>
          <li><strong>काम के बाद भुगतान</strong> UPI या कैश से। कोई एडवांस नहीं।</li>
        </ol>

        <h2>हर सफ़ाई में क्या-क्या शामिल है</h2>
        <ul class="ticks">
          <li>कीचड़ और गाद का सक्शन</li>
          <li>दीवारों, तली और ढक्कन का जेट वॉश</li>
          <li>फ़ूड-सेफ़ कीटाणुनाशन और फ़्लश</li>
          <li>टंकी को सुखाना</li>
          <li>व्हाट्सऐप पर पहले और बाद की फ़ोटो</li>
          <li>बाद में आसपास की सफ़ाई</li>
        </ul>
        <p>शामिल नहीं: टंकी या ढक्कन की मरम्मत, और प्लंबिंग, वाल्व या ओवरफ़्लो का काम।</p>

        <h2>टंकी के साइज़ जो हम साफ़ करते हैं</h2>
        <p>छत की टंकियां: ${sizeList("rooftop", "hi")}।</p>
        <p>अंडरग्राउंड सम्प: ${sizeList("underground", "hi")}।</p>`,
    faqs: [
      ["क्या कोटेशन में GST शामिल है?", "हां। व्हाट्सऐप पर भेजा गया कोटेशन GST सहित पूरी रकम है।"],
      ["क्या एडवांस देना होगा?", "नहीं। आप काम के बाद UPI या कैश से भुगतान करते हैं।"],
      ["क्या उस दिन कीमत बदल सकती है?", "सिर्फ़ तब, जब टंकी साफ़ तौर पर बताए गए साइज़ से अलग हो, और हम यह काम शुरू करने से पहले बताते हैं। काम के बाद कभी नहीं।"]
    ]
  }
};

// Words around the page content, per language.
const UI = {
  en: {
    htmlLang: "en-IN", ogLocale: "en_IN", ogAlt: "hi_IN", prefix: "",
    home: "Home", homeAria: `${cfg.brand} home`, call: "Call us", freeQuote: "Free quote",
    nav: { "overhead-tank-cleaning-gurugram": "Overhead tanks", "underground-tank-cleaning-gurugram": "Underground sumps", "society-tank-cleaning-gurugram": "Societies", "water-tank-cleaning-price-gurugram": "Pricing" },
    foot: { "overhead-tank-cleaning-gurugram": "Overhead tank cleaning", "underground-tank-cleaning-gurugram": "Underground tank cleaning", "society-tank-cleaning-gurugram": "Societies and RWAs", "water-tank-cleaning-price-gurugram": "Pricing and quotes" },
    footAria: "Services", tagline: "No-entry water tank cleaning in Gurugram (Gurgaon).",
    address: "Address to be added, Gurugram, Haryana", hours: "Open every day, 8 AM to 6 PM", rights: "All rights reserved.",
    switchHref: (slug) => `/hi/${slug}`, switchLang: "hi", switchText: "हिंदी",
    societyText: `Hi ${cfg.brand}, I'd like a quote for our society. Number of tanks: , Society: `,
    societyCta: "Get a society quote on WhatsApp", getFree: "Get a free quote",
    chatText: `Hi ${cfg.brand}, I want to get my water tank cleaned. Sector/society: `, chat: "Chat on WhatsApp",
    trust: ["Nobody enters your tank", "Free quote on WhatsApp", "Before and after photos", "Pay after the job"],
    questions: "Questions", ctaH2: "Get a free quote in under a minute",
    ctaLead: "Tell us your tank type, size and a preferred slot. We reply on WhatsApp with a fixed quote. Nothing to pay until the job is done.",
    ctaBtn: "Get my free quote", more: `More from ${cfg.brand}`,
    mbarSmall: "No-entry tank cleaning", mbarStrong: "Free quote", mbarBtn: "Get quote"
  },
  hi: {
    htmlLang: "hi-IN", ogLocale: "hi_IN", ogAlt: "en_IN", prefix: "/hi",
    home: "होम", homeAria: `${cfg.brand} होम`, call: "हमें कॉल करें", freeQuote: "मुफ़्त कोटेशन",
    nav: { "overhead-tank-cleaning-gurugram": "छत की टंकी", "underground-tank-cleaning-gurugram": "अंडरग्राउंड सम्प", "society-tank-cleaning-gurugram": "सोसाइटी", "water-tank-cleaning-price-gurugram": "कीमत" },
    foot: { "overhead-tank-cleaning-gurugram": "छत की टंकी की सफ़ाई", "underground-tank-cleaning-gurugram": "अंडरग्राउंड टंकी की सफ़ाई", "society-tank-cleaning-gurugram": "सोसाइटी और RWA", "water-tank-cleaning-price-gurugram": "कीमत और कोटेशन" },
    footAria: "सेवाएं", tagline: "गुरुग्राम (गुड़गांव) में बिना अंदर उतरे पानी की टंकी की सफ़ाई।",
    address: "पता जल्द जोड़ा जाएगा, गुरुग्राम, हरियाणा", hours: "रोज़ खुला, सुबह 8 से शाम 6 बजे तक", rights: "सर्वाधिकार सुरक्षित।",
    switchHref: (slug) => `/${slug}`, switchLang: "en", switchText: "English",
    societyText: `नमस्ते ${cfg.brand}, मुझे हमारी सोसाइटी के लिए कोटेशन चाहिए। टंकियों की संख्या: , सोसाइटी: `,
    societyCta: "व्हाट्सऐप पर सोसाइटी कोटेशन लें", getFree: "मुफ़्त कोटेशन लें",
    chatText: `नमस्ते ${cfg.brand}, मुझे अपनी पानी की टंकी साफ़ करवानी है। सेक्टर/सोसाइटी: `, chat: "व्हाट्सऐप पर बात करें",
    trust: ["आपकी टंकी में कोई नहीं उतरता", "व्हाट्सऐप पर मुफ़्त कोटेशन", "पहले और बाद की फ़ोटो", "काम के बाद भुगतान"],
    questions: "सवाल-जवाब", ctaH2: "एक मिनट से कम में मुफ़्त कोटेशन पाएं",
    ctaLead: "टंकी का प्रकार, साइज़ और पसंदीदा स्लॉट बताइए। हम व्हाट्सऐप पर तय कोटेशन भेजेंगे। काम पूरा होने तक कोई भुगतान नहीं।",
    ctaBtn: "मेरा मुफ़्त कोटेशन पाएं", more: `${cfg.brand} की और जानकारी`,
    mbarSmall: "बिना अंदर उतरे टंकी सफ़ाई", mbarStrong: "मुफ़्त कोटेशन", mbarBtn: "कोटेशन लें"
  }
};

const slugs = pages.map((p) => p.slug);

const header = (t, slug) => `
  <header class="topbar is-scrolled">
    <div class="wrap topbar-inner">
      <a class="logo" href="${t.prefix}/" aria-label="${t.homeAria}">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0d5c9e"/><path d="M16 6c4 5.6 7 9.2 7 12.8a7 7 0 0 1-14 0C9 15.2 12 11.6 16 6z" fill="#fff"/><path d="M13 19.5a3 3 0 0 0 3 3" stroke="#0d5c9e" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>
        <span class="wordmark"><span>Tank</span><span>Saaf</span></span>
      </a>
      <nav class="nav" aria-label="Main">
        ${slugs.map((s) => `<a href="${t.prefix}/${s}">${t.nav[s]}</a>`).join("\n        ")}
      </nav>
      <div class="topbar-cta">
        <a class="lang-switch" href="${t.switchHref(slug)}" hreflang="${t.switchLang}" lang="${t.switchLang}">${t.switchText}</a>
        <a class="icon-btn" href="tel:${cfg.phoneLink}" aria-label="${t.call}">
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </a>
        <a class="btn btn-small" href="${t.prefix}/#book">${t.freeQuote}</a>
      </div>
    </div>
  </header>`;

const footer = (t) => `
  <footer class="footer">
    <div class="wrap footer-inner">
      <div>
        <p class="logo"><span class="wordmark"><span>Tank</span><span>Saaf</span></span></p>
        <p>${t.tagline}</p>
      </div>
      <nav class="footer-links" aria-label="${t.footAria}">
        ${slugs.map((s) => `<a href="${t.prefix}/${s}">${t.foot[s]}</a>`).join("\n        ")}
      </nav>
      <address>
        <!-- PLACEHOLDER: replace address, hours and contacts with real details -->
        <p>${t.address}</p>
        <p>${t.hours}</p>
        <p><a href="tel:${cfg.phoneLink}">${cfg.phoneDisplay}</a></p>
        <p><a href="mailto:${cfg.email}">${cfg.email}</a></p>
      </address>
    </div>
    <p class="wrap copyright">© ${new Date().getFullYear()} ${cfg.brand}. ${t.rights}</p>
  </footer>`;

const waIcon = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>`;

function render(base, lang) {
  const t = UI[lang];
  const p = lang === "hi" ? { ...base, ...hindi[base.slug] } : base;
  const list = lang === "hi" ? pages.map((o) => ({ ...o, ...hindi[o.slug] })) : pages;
  const enUrl = `${SITE}/${p.slug}`;
  const hiUrl = `${SITE}/hi/${p.slug}`;
  const url = lang === "hi" ? hiUrl : enUrl;
  const bookHref = `${t.prefix}/?type=${p.type}#book`;
  const primaryCta = p.societyCta
    ? `<a class="btn btn-lg btn-wa" href="${esc(waLink(t.societyText))}" target="_blank" rel="noopener">${waIcon}${t.societyCta}</a>`
    : `<a class="btn btn-lg" href="${bookHref}">${t.getFree}</a>`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: SITE + t.prefix + "/" },
          { "@type": "ListItem", position: 2, name: p.crumb, item: url }
        ]
      },
      {
        "@type": "Service",
        name: base.serviceName,
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
  const related = list.filter((o) => o.slug !== p.slug)
    .map((o) => `<li><a href="${t.prefix}/${o.slug}">${o.h1}</a></li>`).join("\n            ");
  const devanagariFont = lang === "hi"
    ? `\n  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" media="print" onload="this.media='all'">`
    : "";

  return `<!doctype html>
<!-- Generated by scripts/build-pages.mjs from config.js. Edit the script, not this file. -->
<html lang="${t.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.description)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en-IN" href="${enUrl}">
  <link rel="alternate" hreflang="hi-IN" href="${hiUrl}">
  <link rel="alternate" hreflang="x-default" href="${enUrl}">
  <meta name="theme-color" content="#0b549a">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="${t.ogLocale}">
  <meta property="og:locale:alternate" content="${t.ogAlt}">
  <meta property="og:site_name" content="${cfg.brand}">
  <meta property="og:title" content="${esc(p.h1)} | ${cfg.brand}">
  <meta property="og:description" content="${esc(p.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" media="print" onload="this.media='all'">${devanagariFont}
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="subpage">
  <div class="sea-bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
${header(t, p.slug)}

  <main>
    <section class="page-hero">
      <div class="water" aria-hidden="true">
        <svg class="wave wave-1" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="M0 60 Q360 10 720 60 T1440 60 T2160 60 T2880 60 V160 H0 Z"/></svg>
        <svg class="wave wave-2" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="M0 78 Q360 34 720 78 T1440 78 T2160 78 T2880 78 V160 H0 Z"/></svg>
        <svg class="wave wave-3" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="M0 96 Q360 56 720 96 T1440 96 T2160 96 T2880 96 V160 H0 Z"/></svg>
        <svg class="wave wave-4" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="M0 114 Q360 80 720 114 T1440 114 T2160 114 T2880 114 V160 H0 Z"/></svg>
        <svg class="wave wave-5" viewBox="0 0 2880 160" preserveAspectRatio="none"><path d="M0 132 Q360 106 720 132 T1440 132 T2160 132 T2880 132 V160 H0 Z"/></svg>
      </div>
      <div class="wrap">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="${t.prefix}/">${t.home}</a> <span aria-hidden="true">/</span> <span>${p.crumb}</span></nav>
        <p class="eyebrow">${p.eyebrow}</p>
        <h1>${p.h1}</h1>
        <p class="lead">${p.lead}</p>
        <div class="hero-cta">
          ${primaryCta}
          <a class="btn btn-lg btn-ghost" href="${esc(waLink(t.chatText))}" target="_blank" rel="noopener">${waIcon}${t.chat}</a>
        </div>
        <ul class="trust">
          ${t.trust.map((x) => `<li>${x}</li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap prose">
        ${p.body.trim()}

        <h2>${t.questions}</h2>
        <div class="faq">
          ${p.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n          ")}
        </div>
      </div>
    </section>

    <section class="section section-dark">
      <div class="wrap societies">
        <div>
          <h2>${t.ctaH2}</h2>
          <p class="section-lead">${t.ctaLead}</p>
        </div>
        <a class="btn btn-lg btn-light" href="${bookHref}">${t.ctaBtn}</a>
      </div>
    </section>

    <section class="section section-surface">
      <div class="wrap">
        <h2 class="h3">${t.more}</h2>
        <ul class="related">
            ${related}
        </ul>
      </div>
    </section>
  </main>
${footer(t)}

  <div class="mbar">
    <div class="mbar-price"><small>${t.mbarSmall}</small><strong>${t.mbarStrong}</strong></div>
    <a class="btn" href="${bookHref}">${t.mbarBtn}</a>
  </div>
</body>
</html>
`;
}

mkdirSync(join(root, "hi"), { recursive: true });
for (const p of pages) {
  writeFileSync(join(root, p.slug + ".html"), render(p, "en"));
  writeFileSync(join(root, "hi", p.slug + ".html"), render(p, "hi"));
  console.log("wrote", p.slug + ".html", "and hi/" + p.slug + ".html");
}

const today = new Date().toISOString().slice(0, 10);
const paths = ["/"].concat(slugs.map((s) => "/" + s));
const alt = (path, prefix) => SITE + prefix + path;
writeFileSync(join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.flatMap((u) => ["", "/hi"].map((prefix) => `  <url>
    <loc>${alt(u, prefix)}</loc>
    <xhtml:link rel="alternate" hreflang="en-IN" href="${alt(u, "")}"/>
    <xhtml:link rel="alternate" hreflang="hi-IN" href="${alt(u, "/hi")}"/>
    <lastmod>${today}</lastmod>
  </url>`)).join("\n")}
</urlset>
`);
console.log("wrote sitemap.xml");
