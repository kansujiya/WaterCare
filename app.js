(function () {
  "use strict";

  var cfg = window.SITE_CONFIG;
  var form = document.getElementById("booking-form");
  var capacitySel = document.getElementById("capacity");
  var capacity2Sel = document.getElementById("capacity2");
  var countSel = document.getElementById("count");
  var slotSel = document.getElementById("slot");
  var dateInput = document.getElementById("date");
  var errorBox = document.getElementById("form-error");

  var liters = new Intl.NumberFormat("en-IN");

  // Words the script writes into the page and the WhatsApp message, in the
  // page's language (<html lang="hi-IN"> on the Hindi pages).
  var HI = /^hi/i.test(document.documentElement.lang);
  var T = HI ? {
    upTo: function (n) { return n + " L तक"; },
    range: function (a, b) { return a + " से " + b + " L"; },
    above: function (n) { return n + " L से ज़्यादा"; },
    unsure: "पता नहीं",
    unsureShort: "साइज़ पता नहीं",
    tank: { rooftop: "छत की टंकी", underground: "अंडरग्राउंड सम्प" },
    both: function (a, b) { return "छत की टंकी (" + a + ") + अंडरग्राउंड सम्प (" + b + ")"; },
    capBoth: "छत की टंकी की क्षमता",
    cap: "टंकी की क्षमता",
    need: { name: "अपना नाम", address: "सोसाइटी या सेक्टर", date: "तारीख" },
    please: function (list) { return "कृपया " + list + " भरें।"; },
    hello: "नमस्ते " + cfg.brand + ", मुझे टंकी की सफ़ाई का कोटेशन भेजें।",
    lines: { tank: "टंकी: ", name: "नाम: ", address: "पता: ", slot: "पसंदीदा स्लॉट: ", notes: "नोट: ", offer: "ऑफ़र: " },
    chat: "नमस्ते " + cfg.brand + ", मुझे अपनी पानी की टंकी साफ़ करवानी है। सेक्टर/सोसाइटी: ",
    locale: "hi-IN"
  } : {
    upTo: function (n) { return "Up to " + n + " L"; },
    range: function (a, b) { return a + " to " + b + " L"; },
    above: function (n) { return "Above " + n + " L"; },
    unsure: "Not sure",
    unsureShort: "size not sure",
    tank: { rooftop: cfg.tanks.rooftop.label, underground: cfg.tanks.underground.label },
    both: function (a, b) { return "Rooftop tank (" + a + ") + underground sump (" + b + ")"; },
    capBoth: "Rooftop tank capacity",
    cap: "Tank capacity",
    need: { name: "your name", address: "your society or sector", date: "a date" },
    please: function (list) { return "Please add " + list + "."; },
    hello: "Hi " + cfg.brand + ", please send me a quote for tank cleaning.",
    lines: { tank: "Tank: ", name: "Name: ", address: "Address: ", slot: "Preferred slot: ", notes: "Notes: ", offer: "Offer: " },
    chat: "Hi " + cfg.brand + ", I want to get my water tank cleaned. Sector/society: ",
    locale: "en-IN"
  };

  function waUrl(text) {
    var url = "https://wa.me/" + cfg.whatsappNumber;
    return text ? url + "?text=" + encodeURIComponent(text) : url;
  }

  function rangeLabel(lo, hi) {
    return lo === 0 ? T.upTo(liters.format(hi)) : T.range(liters.format(lo + 1), liters.format(hi));
  }

  function selectedType() {
    return form.querySelector('input[name="type"]:checked').value;
  }

  // Shared contact details and links from the config.
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.textContent = cfg.phoneDisplay; });
  document.querySelectorAll("[data-phone-link]").forEach(function (el) { el.href = "tel:" + cfg.phoneLink; });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = cfg.email; });
  document.querySelectorAll("[data-email-link]").forEach(function (el) { el.href = "mailto:" + cfg.email; });
  document.querySelectorAll("[data-wa-link]").forEach(function (el) {
    el.href = waUrl(el.getAttribute("data-wa-text") || T.chat);
  });
  if (cfg.offerText) {
    document.querySelectorAll("[data-offer]").forEach(function (el) { el.textContent = cfg.offerText; el.hidden = false; });
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  function fillCapacity(sel, sizes) {
    var prev = sel.value;
    sel.innerHTML = "";
    sizes.forEach(function (size, i) {
      sel.add(new Option(rangeLabel(i === 0 ? 0 : sizes[i - 1], size), String(i)));
    });
    sel.add(new Option(T.above(liters.format(sizes[sizes.length - 1])), "large"));
    sel.add(new Option(T.unsure, "unsure"));
    if (prev && sel.querySelector('option[value="' + prev + '"]')) sel.value = prev;
  }

  function syncTypeFields() {
    var type = selectedType();
    var both = type === "both";
    fillCapacity(capacitySel, cfg.tanks[both ? "rooftop" : type].sizes);
    if (both) fillCapacity(capacity2Sel, cfg.tanks.underground.sizes);
    form.querySelector("[data-cap-label]").textContent = both ? T.capBoth : T.cap;
    form.querySelector("[data-cap2-wrap]").hidden = !both;
    form.querySelector("[data-count-wrap]").hidden = both;
  }

  function selText(sel) {
    return sel.options[sel.selectedIndex].text;
  }

  // A plain-language summary of the selected tanks, used on the page and in
  // the WhatsApp message.
  function describe() {
    var type = selectedType();
    if (type === "both") {
      return T.both(selText(capacitySel), selText(capacity2Sel));
    }
    var n = parseInt(countSel.value, 10) || 1;
    var size = capacitySel.value === "unsure" ? T.unsureShort : selText(capacitySel);
    if (HI) return n + " × " + T.tank[type] + ", " + size;
    var label = T.tank[type].toLowerCase() + (n > 1 ? "s" : "");
    return n + " × " + label + ", " + size.replace(/^Up to/, "up to");
  }

  function renderSummary() {
    var el = document.querySelector('[data-q="summary"]');
    if (el) el.textContent = describe();
  }

  // Time slots and earliest date (tomorrow, local time).
  cfg.timeSlots.forEach(function (s) { slotSel.add(new Option(HI ? s.replace(" to ", " से ") : s, s)); });
  (function setMinDate() {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    var iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    dateInput.min = iso;
    dateInput.value = iso;
  })();

  function friendlyDate(iso) {
    var p = String(iso).split("-");
    if (p.length !== 3) return iso;
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(T.locale, { weekday: "short", day: "numeric", month: "short" });
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "type") syncTypeFields();
    renderSummary();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var missing = [];
    if (!String(data.get("name") || "").trim()) missing.push(T.need.name);
    if (!String(data.get("address") || "").trim()) missing.push(T.need.address);
    if (!data.get("date")) missing.push(T.need.date);
    if (missing.length) {
      errorBox.textContent = T.please(missing.join(", "));
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    var type = selectedType();
    var lines = [
      T.hello,
      "",
      T.lines.tank + describe(),
      T.lines.name + String(data.get("name")).trim(),
      T.lines.address + String(data.get("address")).trim(),
      T.lines.slot + friendlyDate(data.get("date")) + ", " + selText(slotSel)
    ];
    var notes = String(data.get("notes") || "").trim();
    if (notes) lines.push(T.lines.notes + notes);
    if (cfg.offerText) lines.push(T.lines.offer + cfg.offerText);

    if (typeof window.gtag === "function") window.gtag("event", "whatsapp_quote_request", { service: type });
    if (typeof window.va === "function") window.va("event", { name: "whatsapp_quote_request", data: { service: type } });

    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
  });

  // Demo videos: the section stays hidden until a video ID is configured, and
  // the YouTube player loads only when clicked, to keep the page fast.
  var hasVideo = false;
  document.querySelectorAll("[data-video]").forEach(function (fig) {
    var id = cfg.videos[fig.getAttribute("data-video")];
    if (!id) { fig.hidden = true; return; }
    hasVideo = true;
    var btn = fig.querySelector(".video-play");
    btn.style.backgroundImage = "url(https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg)";
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      iframe.title = fig.querySelector("figcaption").textContent;
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });
  if (hasVideo) {
    document.getElementById("videos").hidden = false;
    document.querySelector("[data-video-nav]").hidden = false;
  }

  // Photo gallery, built from the config and hidden while it is empty.
  if (cfg.photos && cfg.photos.length) {
    var gallery = document.getElementById("gallery");
    cfg.photos.forEach(function (ph) {
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = ph.src;
      img.alt = ph.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      fig.appendChild(img);
      if (ph.caption || ph.credit) {
        var cap = document.createElement("figcaption");
        cap.textContent = ph.caption || "";
        if (ph.credit) {
          var cr = document.createElement("small");
          cr.textContent = ph.credit;
          cap.appendChild(cr);
        }
        fig.appendChild(cap);
      }
      gallery.appendChild(fig);
    });
    document.getElementById("photos").hidden = false;
  }

  // Header shadow once the page scrolls.
  var topbar = document.getElementById("topbar");
  function onScroll() { topbar.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hide the mobile booking bar while the booking form is on screen.
  var mbar = document.getElementById("mbar");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      mbar.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.15 }).observe(document.getElementById("book"));
  }

  // Preselect the tank type when linked from a service page (/?type=underground#book).
  var typeParam = new URLSearchParams(window.location.search).get("type");
  var typeInput = typeParam && form.querySelector('input[name="type"][value="' + typeParam.replace(/[^a-z]/g, "") + '"]');
  if (typeInput) typeInput.checked = true;

  syncTypeFields();
  renderSummary();
})();
