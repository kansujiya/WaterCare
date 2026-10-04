// Site settings. Edit this file to change contact details, prices, slots and videos.
// Anything marked PLACEHOLDER must be replaced before launch (also update the
// matching values in index.html: the JSON-LD block, canonical URL and footer).
window.SITE_CONFIG = {
  brand: "TankSaaf",

  // WhatsApp number in international format, digits only (91 + 10 digit mobile).
  whatsappNumber: "919999999999", // PLACEHOLDER
  phoneDisplay: "+91 99999 99999", // PLACEHOLDER
  phoneLink: "+919999999999", // PLACEHOLDER
  email: "hello@tanksaaf.in", // PLACEHOLDER

  // Tank sizes offered in the booking form, in liters. Prices are not shown on
  // the site; quotes are sent manually on WhatsApp. Sizes above the last value
  // appear as "Above ... L".
  tanks: {
    rooftop: { label: "Rooftop tank", sizes: [1000, 2000, 3000, 5000, 8000, 10000] },
    underground: { label: "Underground sump", sizes: [3000, 5000, 8000, 10000] }
  },

  timeSlots: [
    "8 AM to 10 AM",
    "10 AM to 12 PM",
    "12 PM to 2 PM",
    "2 PM to 4 PM",
    "4 PM to 6 PM"
  ],

  // Optional launch offer line shown in the hero and booking summary, e.g.
  // "Launch offer: Rs 300 off your first clean". Leave empty to hide.
  // Only set an offer you will honour.
  offerText: "",

  // Photos for the "Tanks we clean" gallery. Put the files in /images and list
  // them here; the section stays hidden while this list is empty. Use your own
  // job photos where you can. For stock photos, keep the credit and do not
  // caption them as your own work.
  // Example: { src: "/images/rooftop-before.jpg", alt: "Rooftop tank with algae before cleaning", caption: "Rooftop tank before cleaning", credit: "" }
  photos: [],

  // YouTube video IDs (the part after v= in the URL). The demo section stays
  // hidden until at least one is set.
  videos: {
    rooftop: "", // PLACEHOLDER
    underground: "" // PLACEHOLDER
  }
};
