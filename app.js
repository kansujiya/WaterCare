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

  var rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  var liters = new Intl.NumberFormat("en-IN");
  var pct = Math.round(cfg.extraTankDiscount * 100) + "%";

  function waUrl(text) {
    var url = "https://wa.me/" + cfg.whatsappNumber;
    return text ? url + "?text=" + encodeURIComponent(text) : url;
  }

  function rangeLabel(lo, hi) {
    return lo === 0 ? "Up to " + liters.format(hi) + " L" : liters.format(lo + 1) + " to " + liters.format(hi) + " L";
  }

  function selectedType() {
    return form.querySelector('input[name="type"]:checked').value;
  }

  // Shared contact details and links from the config.
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.textContent = cfg.phoneDisplay; });
  document.querySelectorAll("[data-phone-link]").forEach(function (el) { el.href = "tel:" + cfg.phoneLink; });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = cfg.email; });
  document.querySelectorAll("[data-email-link]").forEach(function (el) { el.href = "mailto:" + cfg.email; });
  document.querySelectorAll("[data-discount]").forEach(function (el) { el.textContent = pct; });
  document.querySelectorAll("[data-wa-link]").forEach(function (el) {
    el.href = waUrl(el.getAttribute("data-wa-text") || "Hi " + cfg.brand + ", I want to get my water tank cleaned. Sector/society: ");
  });
  if (cfg.offerText) {
    document.querySelectorAll("[data-offer]").forEach(function (el) { el.textContent = cfg.offerText; el.hidden = false; });
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  // Price table, rebuilt from the config so prices are edited in one place.
  (function renderPriceTable() {
    var roof = cfg.pricing.rooftop.slabs;
    var under = cfg.pricing.underground.slabs;
    var bounds = roof.concat(under).map(function (s) { return s.upTo; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort(function (a, b) { return a - b; });
    function priceFor(slabs, cap) {
      for (var i = 0; i < slabs.length; i++) if (cap <= slabs[i].upTo) return rupees.format(slabs[i].price);
      return "Quote";
    }
    var rows = "";
    var prev = 0;
    bounds.forEach(function (b) {
      rows += "<tr><th scope=\"row\">" + rangeLabel(prev, b) + "</th>" +
        "<td data-label=\"Rooftop\">" + priceFor(roof, b) + "</td>" +
        "<td data-label=\"Underground\">" + priceFor(under, b) + "</td></tr>";
      prev = b;
    });
    rows += "<tr><th scope=\"row\">Above " + liters.format(prev) + " L</th><td colspan=\"2\" data-label=\"Price\">Quote on WhatsApp</td></tr>";
    document.getElementById("price-rows").innerHTML = rows;
  })();

  function fillCapacity(sel, slabs) {
    var prev = sel.value;
    sel.innerHTML = "";
    slabs.forEach(function (s, i) {
      sel.add(new Option(rangeLabel(i === 0 ? 0 : slabs[i - 1].upTo, s.upTo), String(i)));
    });
    sel.add(new Option("Above " + liters.format(slabs[slabs.length - 1].upTo) + " L (get a quote)", "quote"));
    if (prev && sel.querySelector('option[value="' + prev + '"]')) sel.value = prev;
  }

  function syncTypeFields() {
    var type = selectedType();
    var both = type === "both";
    fillCapacity(capacitySel, cfg.pricing[both ? "rooftop" : type].slabs);
    if (both) fillCapacity(capacity2Sel, cfg.pricing.underground.slabs);
    form.querySelector("[data-cap-label]").textContent = both ? "Rooftop tank capacity" : "Tank capacity";
    form.querySelector("[data-cap2-wrap]").hidden = !both;
    form.querySelector("[data-count-wrap]").hidden = both;
  }

  function selText(sel) {
    return sel.options[sel.selectedIndex].text.replace(" (get a quote)", "");
  }

  // Returns the line items for the current selection. Extra tanks (beyond the
  // most expensive one) get the configured discount.
  function quote() {
    var type = selectedType();
    var items = [];
    if (type === "both") {
      items.push({ kind: "rooftop", cap: selText(capacitySel), idx: capacitySel.value });
      items.push({ kind: "underground", cap: selText(capacity2Sel), idx: capacity2Sel.value });
    } else {
      var n = parseInt(countSel.value, 10) || 1;
      for (var i = 0; i < n; i++) items.push({ kind: type, cap: selText(capacitySel), idx: capacitySel.value });
    }
    var needsQuote = items.some(function (it) { return it.idx === "quote"; });
    var q = { type: type, items: items, quote: needsQuote };
    if (needsQuote) return q;
    var prices = items.map(function (it) { return cfg.pricing[it.kind].slabs[parseInt(it.idx, 10)].price; })
      .sort(function (a, b) { return b - a; });
    q.base = prices[0];
    q.extra = prices.slice(1).reduce(function (sum, p) { return sum + Math.round(p * (1 - cfg.extraTankDiscount)); }, 0);
    q.gst = Math.round((q.base + q.extra) * cfg.gstRate);
    q.total = q.base + q.extra + q.gst;
    return q;
  }

  function describe(q) {
    if (q.type === "both") return "Rooftop tank (" + q.items[0].cap + ") + underground sump (" + q.items[1].cap + ")";
    return q.items.length + " × " + cfg.pricing[q.type].label.toLowerCase() + ", " + q.items[0].cap;
  }

  function setQ(key, text) {
    var el = document.querySelector('[data-q="' + key + '"]');
    if (el) el.textContent = text;
  }

  function renderQuote() {
    var q = quote();
    var extraRow = document.querySelector("[data-q-extra-row]");
    var inline = document.querySelector("[data-q-inline]");
    if (q.quote) {
      setQ("base", "On request");
      setQ("gst", "–");
      setQ("total", "On WhatsApp");
      inline.textContent = "Quote on WhatsApp";
      extraRow.hidden = true;
      setQ("note", "Tanks above 10,000 L are priced after a quick look. Send the booking and we'll quote on WhatsApp.");
      return;
    }
    var extras = q.items.length - 1;
    setQ("baseLabel", extras ? "First tank" : "Cleaning charge");
    setQ("base", rupees.format(q.base));
    extraRow.hidden = extras < 1;
    setQ("extraLabel", (extras === 1 ? "Second tank" : extras + " more tanks") + " (" + pct + " off)");
    setQ("extra", rupees.format(q.extra));
    setQ("gst", rupees.format(q.gst));
    setQ("total", rupees.format(q.total));
    inline.textContent = rupees.format(q.total) + " incl. GST";
    setQ("note", describe(q) + ".");
  }

  // Time slots and earliest date (tomorrow, local time).
  cfg.timeSlots.forEach(function (s) { slotSel.add(new Option(s, s)); });
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
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "type") syncTypeFields();
    renderQuote();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var missing = [];
    if (!String(data.get("name") || "").trim()) missing.push("your name");
    if (!String(data.get("address") || "").trim()) missing.push("your society or sector");
    if (!data.get("date")) missing.push("a date");
    if (missing.length) {
      errorBox.textContent = "Please add " + missing.join(", ") + ".";
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    var q = quote();
    var lines = [
      "Hi " + cfg.brand + ", I'd like to book a tank cleaning.",
      "",
      "Tank: " + describe(q),
      q.quote ? "Price: please quote" : "Price: " + rupees.format(q.base + q.extra) + " + GST " + rupees.format(q.gst) + " = " + rupees.format(q.total),
      "Name: " + String(data.get("name")).trim(),
      "Address: " + String(data.get("address")).trim(),
      "Preferred slot: " + friendlyDate(data.get("date")) + ", " + data.get("slot")
    ];
    var notes = String(data.get("notes") || "").trim();
    if (notes) lines.push("Notes: " + notes);
    if (cfg.offerText) lines.push("Offer: " + cfg.offerText);

    if (typeof window.gtag === "function") window.gtag("event", "whatsapp_booking", { service: q.type, value: q.total || 0, currency: "INR" });
    if (typeof window.va === "function") window.va("event", { name: "whatsapp_booking", data: { service: q.type } });

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

  syncTypeFields();
  renderQuote();
})();
