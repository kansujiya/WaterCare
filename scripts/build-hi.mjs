// Builds the Hindi homepage (hi/index.html) from index.html, so layout and
// markup changes only need making once. Run after editing index.html:
//   node scripts/build-hi.mjs
// Every English string below must still exist in index.html; the script stops
// with an error if one is missing, so a changed sentence is never left in
// English by accident. Pairs run in order, so longer strings come before any
// shorter string they contain.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const pairs = [
  // Page setup, links and language switch
  ['<html lang="en-IN">', '<html lang="hi-IN">'],
  ['<link rel="canonical" href="https://tanksaaf.in/">', '<link rel="canonical" href="https://tanksaaf.in/hi/">'],
  ['<meta property="og:url" content="https://tanksaaf.in/">', '<meta property="og:url" content="https://tanksaaf.in/hi/">'],
  ['<meta property="og:locale" content="en_IN">\n  <meta property="og:locale:alternate" content="hi_IN">', '<meta property="og:locale" content="hi_IN">\n  <meta property="og:locale:alternate" content="en_IN">'],
  ['<a class="lang-switch" href="/hi/" hreflang="hi" lang="hi">हिंदी</a>', '<a class="lang-switch" href="/" hreflang="en" lang="en">English</a>'],
  ['<a class="logo" href="/" aria-label="TankSaaf home">', '<a class="logo" href="/hi/" aria-label="TankSaaf होम">'],
  ['href="/overhead-tank-cleaning-gurugram"', 'href="/hi/overhead-tank-cleaning-gurugram"'],
  ['href="/underground-tank-cleaning-gurugram"', 'href="/hi/underground-tank-cleaning-gurugram"'],
  ['href="/society-tank-cleaning-gurugram"', 'href="/hi/society-tank-cleaning-gurugram"'],
  ['href="/water-tank-cleaning-price-gurugram"', 'href="/hi/water-tank-cleaning-price-gurugram"'],
  ['<link rel="stylesheet" href="/styles.css">', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" media="print" onload="this.media=\'all\'">\n  <link rel="stylesheet" href="/styles.css">'],

  // Head text
  ['<title>Water Tank Cleaning in Gurugram (Gurgaon) | Non-Invasive | TankSaaf</title>', '<title>पानी की टंकी की सफ़ाई गुरुग्राम (गुड़गांव) | बिना अंदर उतरे | TankSaaf</title>'],
  ['Non-invasive water tank cleaning in Gurugram (Gurgaon) for overhead and underground tanks. Suction, jet wash and disinfection. Free quote on WhatsApp, pay after the job.', 'गुरुग्राम (गुड़गांव) में छत और अंडरग्राउंड पानी की टंकी की सफ़ाई, बिना किसी के अंदर उतरे। सक्शन, जेट वॉश और कीटाणुनाशन। व्हाट्सऐप पर मुफ़्त कोटेशन, काम के बाद भुगतान।'],
  ['Jet wash, sludge suction and disinfection for overhead and underground tanks. Free quote on WhatsApp, pay after the job.', 'छत और अंडरग्राउंड टंकियों के लिए जेट वॉश, कीचड़ का सक्शन और कीटाणुनाशन। व्हाट्सऐप पर मुफ़्त कोटेशन, काम के बाद भुगतान।'],
  ['TankSaaf: no-entry water tank cleaning in Gurugram', 'TankSaaf: गुरुग्राम में बिना अंदर उतरे पानी की टंकी की सफ़ाई'],
  ['No-entry water tank cleaning for overhead and underground tanks in Gurugram.', 'गुरुग्राम में छत और अंडरग्राउंड टंकियों की बिना अंदर उतरे सफ़ाई।'],
  ['No-entry water tank cleaning in Gurugram (Gurgaon).', 'गुरुग्राम (गुड़गांव) में बिना अंदर उतरे पानी की टंकी की सफ़ाई।'],
  ['No-entry water tank cleaning in Gurugram | TankSaaf', 'गुरुग्राम में बिना अंदर उतरे पानी की टंकी की सफ़ाई | TankSaaf'],

  // Header
  ['>Skip to booking<', '>बुकिंग पर जाएं<'],
  ['>How it works</a>', '>कैसे होता है</a>'],
  ['>Demo</a>', '>डेमो</a>'],
  ['<a href="#pricing">Pricing</a>', '<a href="#pricing">कीमत</a>'],
  ['<a href="#societies">Societies</a>', '<a href="#societies">सोसाइटी</a>'],
  ['<a href="#faq">FAQ</a>', '<a href="#faq">सवाल-जवाब</a>'],
  ['aria-label="Call us"', 'aria-label="हमें कॉल करें"'],
  ['>Free quote</a>', '>मुफ़्त कोटेशन</a>'],

  // Hero
  ['Gurugram · Overhead and underground tanks', 'गुरुग्राम · छत और अंडरग्राउंड टंकियां'],
  ['<h1>No-entry water tank cleaning in Gurugram</h1>', '<h1>गुरुग्राम में पानी की टंकी की सफ़ाई, बिना अंदर उतरे</h1>'],
  ['Non-invasive tank cleaning with sludge suction, a high-pressure jet and food-safe disinfection, all from outside. Get a free quote on WhatsApp in under a minute.', 'कीचड़ के सक्शन, हाई-प्रेशर जेट और फ़ूड-सेफ़ कीटाणुनाशक से टंकी की सफ़ाई, सब कुछ बाहर से। व्हाट्सऐप पर एक मिनट से कम में मुफ़्त कोटेशन पाएं।'],
  ['<span class="price-chip">Overhead tanks</span>', '<span class="price-chip">छत की टंकी</span>'],
  ['<span class="price-chip">Underground sumps</span>', '<span class="price-chip">अंडरग्राउंड सम्प</span>'],
  ['<span class="price-chip">Societies and RWAs</span>', '<span class="price-chip">सोसाइटी और RWA</span>'],
  ['>Get a free quote</a>', '>मुफ़्त कोटेशन लें</a>'],
  ['Chat on WhatsApp', 'व्हाट्सऐप पर बात करें'],
  ['aria-label="What you get with every clean"', 'aria-label="हर सफ़ाई में आपको क्या मिलता है"'],
  ['Nobody enters your tank', 'आपकी टंकी में कोई नहीं उतरता'],
  ['Food-safe disinfectant, then a flush', 'फ़ूड-सेफ़ कीटाणुनाशक, फिर फ़्लश'],
  ['Food-safe disinfectant</li>', 'फ़ूड-सेफ़ कीटाणुनाशक</li>'],
  ['Before and after photos on WhatsApp', 'व्हाट्सऐप पर पहले और बाद की फ़ोटो'],
  ['Before and after photos', 'सफ़ाई से पहले और बाद की फ़ोटो'],
  ['Pay after the job · No advance', 'काम के बाद भुगतान · कोई एडवांस नहीं'],
  ['Pay after the job', 'काम के बाद भुगतान'],
  ['Illustration: a jet lance and a suction hose clean a water tank from outside while nobody is inside', 'चित्र: जेट लांस और सक्शन पाइप टंकी को बाहर से साफ़ कर रहे हैं, अंदर कोई नहीं है'],
  ['>SUCTION</text>', '>सक्शन</text>'],
  ['>Nobody inside</text>', '>अंदर कोई नहीं</text>'],

  // Stats
  ['aria-label="At a glance"', 'aria-label="एक नज़र में"'],
  ['<span>people inside your tank</span>', '<span>लोग आपकी टंकी के अंदर</span>'],
  ['<strong>7-step</strong><span>clean, every time</span>', '<strong>7 स्टेप</strong><span>में सफ़ाई, हर बार</span>'],
  ['<strong>60–90 min</strong><span>per tank</span>', '<strong>60–90 मिनट</strong><span>हर टंकी</span>'],
  ['<strong>No</strong><span>advance payment</span>', '<strong>कोई</strong><span>एडवांस नहीं</span>'],

  // Why
  ['>Why it matters</p>', '>क्यों ज़रूरी है</p>'],
  ['Why clean your tank every 6 months?', 'हर 6 महीने में टंकी क्यों साफ़ करवाएं?'],
  ['<strong>Silt settles as sludge.</strong> Gurugram supply water carries fine silt that builds up as a layer of mud at the bottom of every tank.', '<strong>गाद जमकर कीचड़ बनती है।</strong> गुरुग्राम के सप्लाई पानी में बारीक गाद आती है, जो हर टंकी की तली में कीचड़ की परत बनकर जम जाती है।'],
  ['<strong>Algae loves heat.</strong> Rooftop tanks bake in the summer sun, and green growth spreads on the walls and lid.', '<strong>गर्मी में काई तेज़ी से बढ़ती है।</strong> छत की टंकियां गर्मियों की धूप में तपती हैं, और दीवारों व ढक्कन पर हरी काई फैल जाती है।'],
  ["<strong>It's the water you live on.</strong> You bathe, cook and wash dishes with it, and often drink it after RO. Stagnant sediment is a place for germs to grow.", '<strong>यही पानी आप रोज़ इस्तेमाल करते हैं।</strong> इसी से नहाना, खाना बनाना और बर्तन धोना होता है, और अक्सर RO के बाद यही पिया भी जाता है। जमी हुई गंदगी में कीटाणु पनपते हैं।'],

  // How it works
  ['>The process</p>', '>प्रक्रिया</p>'],
  ['How our overhead and underground tank cleaning works', 'हम छत और अंडरग्राउंड टंकी कैसे साफ़ करते हैं'],
  ['The same seven steps for every tank, done by a trained crew with their own pumps, jet washer and hoses.', 'हर टंकी के लिए वही सात स्टेप, प्रशिक्षित टीम द्वारा, अपने पंप, जेट वॉशर और पाइप के साथ।'],
  ['>Step 0', '>स्टेप 0'],
  ['<h3>Inspect</h3><p>We check the tank and take before photos.</p>', '<h3>जांच</h3><p>हम टंकी जांचते हैं और सफ़ाई से पहले की फ़ोटो लेते हैं।</p>'],
  ['<h3>Drain</h3><p>Leftover water is drained, or moved to your other tank if you want to keep it.</p>', '<h3>पानी निकालना</h3><p>बचा हुआ पानी निकाल दिया जाता है, या आप चाहें तो आपकी दूसरी टंकी में भर दिया जाता है।</p>'],
  ['<h3>Suction</h3><p>A sludge pump pulls out silt, mud and settled dirt.</p>', '<h3>सक्शन</h3><p>स्लज पंप गाद, कीचड़ और जमी गंदगी खींच लेता है।</p>'],
  ['<h3>Jet wash</h3><p>High-pressure water strips algae, moss and scale off walls, floor and lid.</p>', '<h3>जेट वॉश</h3><p>हाई-प्रेशर पानी दीवारों, तली और ढक्कन से काई और जमी परत हटा देता है।</p>'],
  ['<h3>Disinfect</h3><p>A food-safe disinfectant rinse, then a clean water flush.</p>', '<h3>कीटाणुनाशन</h3><p>फ़ूड-सेफ़ कीटाणुनाशक से धुलाई, फिर साफ़ पानी से फ़्लश।</p>'],
  ['<h3>Dry</h3><p>Rinse water is sucked out and the tank is left clean and dry.</p>', '<h3>सुखाना</h3><p>धुलाई का पानी खींच लिया जाता है और टंकी साफ़ और सूखी छोड़ी जाती है।</p>'],
  ['<h3>Report</h3><p>After photos on WhatsApp, then you pay by UPI or cash.</p>', '<h3>रिपोर्ट</h3><p>व्हाट्सऐप पर बाद की फ़ोटो, फिर आप UPI या कैश से भुगतान करें।</p>'],

  // Photos and videos (hidden until configured)
  ['<p class="eyebrow">Photos</p>', '<p class="eyebrow">फ़ोटो</p>'],
  ['Tanks we clean in Gurugram', 'गुरुग्राम में हमारी साफ़ की हुई टंकियां'],
  ['<p class="eyebrow">Watch</p>', '<p class="eyebrow">देखें</p>'],
  ['See a tank cleaned without anyone going inside', 'देखें, बिना किसी के अंदर उतरे टंकी कैसे साफ़ होती है'],
  ['Play rooftop tank cleaning video', 'छत की टंकी की सफ़ाई का वीडियो चलाएं'],
  ['Play underground sump cleaning video', 'अंडरग्राउंड सम्प की सफ़ाई का वीडियो चलाएं'],
  ['<figcaption>Rooftop tank cleaning</figcaption>', '<figcaption>छत की टंकी की सफ़ाई</figcaption>'],
  ['<figcaption>Underground sump cleaning</figcaption>', '<figcaption>अंडरग्राउंड सम्प की सफ़ाई</figcaption>'],

  // Pricing
  ['<p class="eyebrow">Pricing</p>', '<p class="eyebrow">कीमत</p>'],
  ['Water tank cleaning cost in Gurugram', 'गुरुग्राम में पानी की टंकी की सफ़ाई का खर्च'],
  ['Every home is different, so we quote per job. Tell us your tank type, size and how many tanks, and we reply on WhatsApp with a fixed price before we come.', 'हर घर अलग होता है, इसलिए हम हर काम का अलग कोटेशन देते हैं। टंकी का प्रकार, साइज़ और संख्या बताइए, हम आने से पहले व्हाट्सऐप पर तय कीमत भेज देंगे।'],
  ['How your quote works', 'आपका कोटेशन कैसे बनता है'],
  ['<strong>Send your tank details</strong><span>Tank type, rough size and number of tanks, from the form below or a WhatsApp photo.</span>', '<strong>टंकी की जानकारी भेजें</strong><span>टंकी का प्रकार, अंदाज़न साइज़ और संख्या, नीचे दिए फ़ॉर्म से या व्हाट्सऐप पर फ़ोटो भेजकर।</span>'],
  ['<strong>Get a fixed quote</strong><span>We reply on WhatsApp with one clear price, including GST.</span>', '<strong>तय कोटेशन पाएं</strong><span>हम व्हाट्सऐप पर GST सहित एक साफ़ कीमत भेजते हैं।</span>'],
  ['<strong>Pick a slot</strong><span>We confirm the date and time in the same chat.</span>', '<strong>स्लॉट चुनें</strong><span>उसी चैट में तारीख और समय पक्का करते हैं।</span>'],
  ['<span>UPI or cash, only once the tank is clean. No advance.</span>', '<span>UPI या कैश, टंकी साफ़ होने के बाद ही। कोई एडवांस नहीं।</span>'],
  ['The quote depends on tank size, the number of tanks and access to the tank. More than one tank at the same address costs less per tank.', 'कोटेशन टंकी के साइज़, संख्या और टंकी तक पहुंच पर निर्भर करता है। एक ही पते पर एक से ज़्यादा टंकी हो तो हर टंकी का खर्च कम होता है।'],
  ["<h3>What's included</h3>", '<h3>क्या-क्या शामिल है</h3>'],
  ['Sludge and silt suction', 'कीचड़ और गाद का सक्शन'],
  ['Jet wash of walls, floor and lid', 'दीवारों, तली और ढक्कन का जेट वॉश'],
  ['Food-safe disinfection and flush', 'फ़ूड-सेफ़ कीटाणुनाशन और फ़्लश'],
  ['Drying the tank', 'टंकी को सुखाना'],
  ['Cleaning up the area after', 'बाद में आसपास की सफ़ाई'],
  ['<h3>Not included</h3>', '<h3>शामिल नहीं</h3>'],
  ['Tank or lid repairs', 'टंकी या ढक्कन की मरम्मत'],
  ['Plumbing, valve or overflow work', 'प्लंबिंग, वाल्व या ओवरफ़्लो का काम'],
  ['No hidden charges. The quote we confirm is what you pay.', 'कोई छिपा चार्ज नहीं। जो कोटेशन तय होगा, आप वही देंगे।'],

  // Booking form
  ['Free quote in 1 minute', '1 मिनट में मुफ़्त कोटेशन'],
  ['Get a free quote and pick a slot', 'मुफ़्त कोटेशन लें और स्लॉट चुनें'],
  ['Tell us about your tank and a preferred time. Your request opens in WhatsApp, and we reply with your quote and confirm the slot in the same chat.', 'अपनी टंकी और पसंदीदा समय बताइए। आपकी रिक्वेस्ट व्हाट्सऐप में खुलेगी, और हम उसी चैट में कोटेशन भेजकर स्लॉट पक्का करेंगे।'],
  ['>Your request</p>', '>आपकी रिक्वेस्ट</p>'],
  ['1 × rooftop tank, up to 1,000 L', '1 × छत की टंकी, 1,000 L तक'],
  ['We reply on WhatsApp with a fixed quote, including GST, before confirming your slot.', 'स्लॉट पक्का करने से पहले हम व्हाट्सऐप पर GST सहित तय कोटेशन भेजते हैं।'],
  ['<legend>Which tank?</legend>', '<legend>कौन-सी टंकी?</legend>'],
  ['<strong>Rooftop</strong><small>Overhead plastic tank</small>', '<strong>छत</strong><small>ऊपर रखी प्लास्टिक टंकी</small>'],
  ['<strong>Underground</strong><small>Concrete sump</small>', '<strong>अंडरग्राउंड</strong><small>कंक्रीट सम्प</small>'],
  ['<strong>Both</strong><small>Rooftop + sump</small>', '<strong>दोनों</strong><small>छत + सम्प</small>'],
  ['<span data-cap-label>Tank capacity</span>', '<span data-cap-label>टंकी की क्षमता</span>'],
  ["Hi TankSaaf, I'd like a quote for our society. Number of tanks: , Society: ", 'नमस्ते TankSaaf, मुझे हमारी सोसाइटी के लिए कोटेशन चाहिए। टंकियों की संख्या: , सोसाइटी: '],
  ['<label data-count-wrap>Number of tanks', '<label data-count-wrap>टंकियों की संख्या'],
  ['Underground sump capacity', 'अंडरग्राउंड सम्प की क्षमता'],
  ["Not sure of the size? Plastic tanks have the liters printed on the side. Most 2 to 3 BHK homes have 1,000 to 1,500 L. Pick your best guess and we'll confirm.", 'साइज़ पता नहीं? प्लास्टिक टंकी के साइड पर लीटर लिखे होते हैं। ज़्यादातर 2 से 3 BHK घरों में 1,000 से 1,500 L की टंकी होती है। अंदाज़ा चुनें, हम पुष्टि कर लेंगे।'],
  ['<label>Your name', '<label>आपका नाम'],
  ['Society or sector, tower and flat or house no.', 'सोसाइटी या सेक्टर, टावर और फ़्लैट या मकान नंबर'],
  ['placeholder="e.g. Sector 57, H-12"', 'placeholder="जैसे सेक्टर 57, H-12"'],
  ['<label>Preferred date', '<label>पसंदीदा तारीख'],
  ['<label>Preferred time', '<label>पसंदीदा समय'],
  ['Anything we should know? <span class="optional">(optional)</span>', 'कुछ और बताना है? <span class="optional">(वैकल्पिक)</span>'],
  ['placeholder="e.g. tank on 4th floor roof, lift available"', 'placeholder="जैसे टंकी चौथी मंज़िल की छत पर है, लिफ़्ट है"'],
  ['Get my free quote on WhatsApp', 'व्हाट्सऐप पर मुफ़्त कोटेशन पाएं'],
  ['Opens WhatsApp with your details filled in. Nothing is charged now.', 'आपकी जानकारी भरकर व्हाट्सऐप खुलेगा। अभी कोई पैसा नहीं लगेगा।'],

  // Comparison
  ['>The difference</p>', '>फ़र्क</p>'],
  ['<h2>How we compare</h2>', '<h2>हम आम सेवा से कैसे अलग हैं</h2>'],
  ['What you get with TankSaaf against a typical tank cleaning service.', 'आम टंकी सफ़ाई सेवा के मुकाबले TankSaaf से आपको क्या मिलता है।'],
  ['<span class="sr">Point</span>', '<span class="sr">बिंदु</span>'],
  ['<th scope="col">Typical service</th>', '<th scope="col">आम सेवा</th>'],
  ['data-label="Typical"', 'data-label="आम सेवा"'],
  ['>Booking</th>', '>बुकिंग</th>'],
  ['Phone call or enquiry form', 'फ़ोन कॉल या इंक्वायरी फ़ॉर्म'],
  ['Online in under a minute', 'एक मिनट से कम में ऑनलाइन'],
  ['Someone enters the tank', 'कोई टंकी में उतरता है'],
  ['Often, with manual cleaning', 'अक्सर, हाथ से सफ़ाई में'],
  ['>Never</td>', '>कभी नहीं</td>'],
  ['>Sludge removal</th>', '>कीचड़ निकालना</th>'],
  ['Buckets and cloth', 'बाल्टी और कपड़ा'],
  ['>Suction pump</td>', '>सक्शन पंप</td>'],
  ['>Algae and scale</th>', '>काई और जमी परत</th>'],
  ['Scrubbed by hand', 'हाथ से रगड़कर'],
  ['>High-pressure jet</td>', '>हाई-प्रेशर जेट</td>'],
  ['>Disinfection</th>', '>कीटाणुनाशन</th>'],
  ['>Varies</td>', '>तय नहीं</td>'],
  ['>Proof of work</th>', '>काम का सबूत</th>'],
  ['>Payment</th>', '>भुगतान</th>'],
  ['After the job, UPI or cash', 'काम के बाद, UPI या कैश'],
  ['>Focus</th>', '>फ़ोकस</th>'],
  ['Several cities and products', 'कई शहर और प्रोडक्ट'],
  ['Gurugram tanks only', 'सिर्फ़ गुरुग्राम की टंकियां'],

  // Societies
  ['For RWAs and facility managers', 'RWA और फ़ैसिलिटी मैनेजर के लिए'],
  ['Cleaning for societies, RWAs and builder floors', 'सोसाइटी, RWA और बिल्डर फ़्लोर के लिए सफ़ाई'],
  ['Bulk rates for 5 or more tanks, scheduled cleaning tower by tower, and a photo report for your records.', '5 या ज़्यादा टंकियों पर बल्क रेट, टावर-दर-टावर तय शेड्यूल पर सफ़ाई, और आपके रिकॉर्ड के लिए फ़ोटो रिपोर्ट।'],
  ['Get a society quote on WhatsApp', 'व्हाट्सऐप पर सोसाइटी कोटेशन लें'],

  // Services
  ['<p class="eyebrow">Services</p>', '<p class="eyebrow">सेवाएं</p>'],
  ['Water tank cleaning services in Gurugram', 'गुरुग्राम में पानी की टंकी सफ़ाई की सेवाएं'],
  ['<strong>Overhead tank cleaning</strong><span>Rooftop plastic tanks, cleaned from outside.</span>', '<strong>छत की टंकी की सफ़ाई</strong><span>छत पर रखी प्लास्टिक टंकियां, बाहर से साफ़।</span>'],
  ['<strong>Underground sump cleaning</strong><span>Concrete sumps cleaned from the manhole. Nobody goes down.</span>', '<strong>अंडरग्राउंड सम्प की सफ़ाई</strong><span>कंक्रीट सम्प मैनहोल से साफ़। कोई नीचे नहीं उतरता।</span>'],
  ['<strong>Societies and RWAs</strong><span>Tower-by-tower schedules, bulk rates, photo reports.</span>', '<strong>सोसाइटी और RWA</strong><span>टावर-दर-टावर शेड्यूल, बल्क रेट, फ़ोटो रिपोर्ट।</span>'],
  ['<strong>How pricing works</strong><span>What affects the cost and how to get a fixed quote.</span>', '<strong>कीमत कैसे तय होती है</strong><span>खर्च किन बातों पर निर्भर है और तय कोटेशन कैसे पाएं।</span>'],
  ['Learn more →', 'और जानें →'],
  ['Get a quote →', 'कोटेशन लें →'],

  // Service area
  ['>Service area</p>', '>सेवा क्षेत्र</p>'],
  ['Water tank cleaning across Gurugram (Gurgaon)', 'पूरे गुरुग्राम (गुड़गांव) में पानी की टंकी की सफ़ाई'],
  ['<li>DLF Phase 1 to 5</li><li>Golf Course Road</li><li>Golf Course Extension Road</li><li>Sohna Road</li>', '<li>DLF फ़ेज़ 1 से 5</li><li>गोल्फ़ कोर्स रोड</li><li>गोल्फ़ कोर्स एक्सटेंशन रोड</li><li>सोहना रोड</li>'],
  ['<li>South City 1 and 2</li><li>Sushant Lok</li><li>Sector 56 and 57</li><li>Nirvana Country</li><li>Palam Vihar</li>', '<li>साउथ सिटी 1 और 2</li><li>सुशांत लोक</li><li>सेक्टर 56 और 57</li><li>निर्वाणा कंट्री</li><li>पालम विहार</li>'],
  ['<li>New Gurugram (Sectors 76 to 95)</li><li>Dwarka Expressway</li><li>MG Road</li><li>Old Gurgaon</li>', '<li>न्यू गुरुग्राम (सेक्टर 76 से 95)</li><li>द्वारका एक्सप्रेसवे</li><li>एमजी रोड</li><li>पुराना गुड़गांव</li>'],
  ['Not on the list? <a', 'आपका इलाका सूची में नहीं है? <a'],
  ['Hi TankSaaf, do you cover my area? Sector/society: ', 'नमस्ते TankSaaf, क्या आप मेरे इलाके में सेवा देते हैं? सेक्टर/सोसाइटी: '],
  [">Ask us on WhatsApp</a> and we'll tell you if we cover your sector.", '>व्हाट्सऐप पर पूछें</a>, हम बता देंगे कि आपका सेक्टर कवर होता है या नहीं।'],

  // FAQ (also replaces the FAQ structured data in the head)
  ['<p class="eyebrow">FAQ</p>', '<p class="eyebrow">सवाल-जवाब</p>'],
  ['Questions people ask before booking', 'बुकिंग से पहले लोग ये सवाल पूछते हैं'],
  ["<strong>Still unsure?</strong> Send us a photo of your tank and we'll send you a quote.", '<strong>अभी भी तय नहीं कर पा रहे?</strong> अपनी टंकी की फ़ोटो भेजिए, हम कोटेशन भेज देंगे।'],
  ['Hi TankSaaf, here is a photo of my tank. What would it cost?', 'नमस्ते TankSaaf, यह मेरी टंकी की फ़ोटो है। इसका खर्च कितना होगा?'],
  ['How often should I clean my water tank?', 'पानी की टंकी कितने समय में साफ़ करवानी चाहिए?'],
  ['Every 6 months is the common rule. Gurugram supply water carries silt, so sludge and algae build up quickly, especially after summer and the monsoon.', 'आम नियम है हर 6 महीने में। गुरुग्राम के सप्लाई पानी में गाद आती है, इसलिए कीचड़ और काई जल्दी जमती है, खासकर गर्मी और मानसून के बाद।'],
  ['Does anyone go inside the tank?', 'क्या कोई टंकी के अंदर उतरता है?'],
  ['No. We clean from outside using a sludge suction pump, a high-pressure jet washer and long lances. Nobody steps into your tank.', 'नहीं। हम स्लज सक्शन पंप, हाई-प्रेशर जेट वॉशर और लंबे लांस से बाहर से सफ़ाई करते हैं। आपकी टंकी में कोई पैर नहीं रखता।'],
  ['How long does tank cleaning take?', 'टंकी की सफ़ाई में कितना समय लगता है?'],
  ['About 60 to 90 minutes per tank, depending on size and how dirty it is.', 'साइज़ और गंदगी के हिसाब से, हर टंकी में लगभग 60 से 90 मिनट।'],
  ['Will my water supply be off?', 'क्या मेरी पानी की सप्लाई बंद रहेगी?'],
  ['Only for the tank being cleaned, for the duration of the job. If you have two tanks we clean one at a time.', 'सिर्फ़ उसी टंकी की जिसकी सफ़ाई हो रही है, और सिर्फ़ काम के दौरान। दो टंकियां हों तो हम एक-एक करके साफ़ करते हैं।'],
  ['Which chemicals do you use?', 'आप कौन-से केमिकल इस्तेमाल करते हैं?'],
  ["A food-safe disinfectant meant for drinking water tanks, used at the maker's dose and followed by a clean water flush, so no residue is left behind.", 'पीने के पानी की टंकियों के लिए बना फ़ूड-सेफ़ कीटाणुनाशक, कंपनी की बताई मात्रा में, और उसके बाद साफ़ पानी से फ़्लश, ताकि कोई अवशेष न बचे।'],
  ['How do I pay?', 'भुगतान कैसे करें?'],
  ['After the job, by UPI or cash. We confirm a fixed quote on WhatsApp before we come, and that is what you pay. No surprise charges after the job.', 'काम के बाद, UPI या कैश से। आने से पहले हम व्हाट्सऐप पर तय कोटेशन पक्का करते हैं, और आप वही देते हैं। काम के बाद कोई अचानक चार्ज नहीं।'],
  ["I don't know my tank size. What should I pick?", 'मुझे टंकी का साइज़ नहीं पता। क्या चुनूं?'],
  ['Plastic tanks have the liters printed on the side. Most 2 to 3 BHK homes have a 1,000 to 1,500 liter rooftop tank. Pick your best guess and we confirm before starting.', 'प्लास्टिक टंकी के साइड पर लीटर लिखे होते हैं। ज़्यादातर 2 से 3 BHK घरों में छत पर 1,000 से 1,500 लीटर की टंकी होती है। अंदाज़ा चुनें, हम शुरू करने से पहले पुष्टि कर लेंगे।'],

  // Coming soon
  ['>Coming soon</p>', '>जल्द आ रहा है</p>'],
  ['Add-ons during your visit', 'विज़िट के दौरान अतिरिक्त सेवाएं'],
  ['<strong>Inlet water filters</strong><span>Stop silt before it reaches your tank</span>', '<strong>इनलेट वॉटर फ़िल्टर</strong><span>गाद को टंकी तक पहुंचने से पहले रोकें</span>'],
  ['<strong>Rooftop heat covers</strong><span>Cooler tank water in summer</span>', '<strong>टंकी के हीट कवर</strong><span>गर्मियों में टंकी का पानी ठंडा</span>'],
  ['<strong>Water pumps</strong><span>Pressure and booster pumps</span>', '<strong>वॉटर पंप</strong><span>प्रेशर और बूस्टर पंप</span>'],
  ['Hi TankSaaf, please notify me when inlet filters, heat covers or pumps are available.', 'नमस्ते TankSaaf, इनलेट फ़िल्टर, हीट कवर या पंप उपलब्ध होने पर मुझे बताएं।'],
  ['Notify me on WhatsApp →', 'व्हाट्सऐप पर मुझे बताएं →'],

  // Footer and mobile bar
  ['<nav class="footer-links" aria-label="Services">', '<nav class="footer-links" aria-label="सेवाएं">'],
  ['>Overhead tank cleaning</a>', '>छत की टंकी की सफ़ाई</a>'],
  ['>Underground tank cleaning</a>', '>अंडरग्राउंड टंकी की सफ़ाई</a>'],
  ['>Societies and RWAs</a>', '>सोसाइटी और RWA</a>'],
  ['>Pricing and quotes</a>', '>कीमत और कोटेशन</a>'],
  ['Address to be added, Gurugram, Haryana', 'पता जल्द जोड़ा जाएगा, गुरुग्राम, हरियाणा'],
  ['Open every day, 8 AM to 6 PM', 'रोज़ खुला, सुबह 8 से शाम 6 बजे तक'],
  ['All rights reserved.', 'सर्वाधिकार सुरक्षित।'],
  ['<small>No-entry tank cleaning</small><strong>Free quote</strong>', '<small>बिना अंदर उतरे टंकी सफ़ाई</small><strong>मुफ़्त कोटेशन</strong>'],
  ['>Get quote</a>', '>कोटेशन लें</a>']
];

let html = readFileSync(join(root, "index.html"), "utf8");
const missing = [];
for (const [en, hi] of pairs) {
  if (!html.includes(en)) { missing.push(en); continue; }
  html = html.split(en).join(hi);
}
if (missing.length) {
  console.error("These English strings were not found in index.html:\n- " + missing.join("\n- "));
  process.exit(1);
}

html = html.replace("<!doctype html>", "<!doctype html>\n<!-- Generated by scripts/build-hi.mjs from index.html. Edit index.html or the script, not this file. -->");
mkdirSync(join(root, "hi"), { recursive: true });
writeFileSync(join(root, "hi", "index.html"), html);
console.log("wrote hi/index.html");
