(function () {
  "use strict";

  var cfg = window.SITE_CONFIG;
  var form = document.getElementById("booking-form");
  var capacitySel = document.getElementById("capacity");
  var countSel = document.getElementById("count");
  var slotSel = document.getElementById("slot");
  var dateInput = document.getElementById("date");
  var errorBox = document.getElementById("form-error");

  var rupees = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
  var liters = new Intl.NumberFormat("en-IN");

  function waUrl(text) {
    var url = "https://wa.me/" + cfg.whatsappNumber;
    return text ? url + "?text=" + encodeURIComponent(text) : url;
  }

  function slabLabel(slabs, i) {
    var lo = i === 0 ? 0 : slabs[i - 1].upTo;
    if (i === 0) return "Up to " + liters.format(slabs[0].upTo) + " L";
    return liters.format(lo + 1) + " to " + liters.format(slabs[i].upTo) + " L";
  }

  function selectedType() {
    return form.querySelector('input[name="type"]:checked').value;
  }

  // Fill shared contact details, brand and links from the config.
  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = cfg.brand; });
  document.querySelectorAll("[data-phone]").forEach(function (el) { el.textContent = cfg.phoneDisplay; });
  document.querySelectorAll("[data-phone-link]").forEach(function (el) { el.href = "tel:" + cfg.phoneLink; });
  document.querySelectorAll("[data-email]").forEach(function (el) { el.textContent = cfg.email; });
  document.querySelectorAll("[data-email-link]").forEach(function (el) { el.href = "mailto:" + cfg.email; });
  document.querySelectorAll("[data-discount]").forEach(function (el) { el.textContent = Math.round(cfg.extraTankDiscount * 100) + "%"; });
  document.querySelectorAll("[data-wa-link]").forEach(function (el) {
    el.href = waUrl(el.getAttribute("data-wa-text") || "Hi " + cfg.brand + ", I want to book a water tank cleaning.");
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  // Price table, rebuilt from the config so prices are edited in one place.
  (function renderPriceTable() {
    var roof = cfg.pricing.rooftop.slabs;
    var under = cfg.pricing.underground.slabs;
    var bounds = roof.concat(under).map(function (s) { return s.upTo; })
      .filter(function (v, i, a) { return a.indexOf(v) === i; })
      .sort(function (a, b) { return a - b; });
    function priceFor(slabs, cap) {
      for (var i = 0; i < slabs.length; i++) if (cap <= slabs[i].upTo) return slabs[i].price;
      return null;
    }
    var rows = "";
    var prev = 0;
    bounds.forEach(function (b) {
      var label = prev === 0 ? "Up to " + liters.format(b) + " L" : liters.format(prev + 1) + " to " + liters.format(b) + " L";
      rows += "<tr><th scope=\"row\">" + label + "</th><td>" + rupees.format(priceFor(roof, b)) + "</td><td>" + rupees.format(priceFor(under, b)) + "</td></tr>";
      prev = b;
    });
    rows += "<tr><th scope=\"row\">Above " + liters.format(prev) + " L</th><td colspan=\"2\">Quote on WhatsApp</td></tr>";
    document.getElementById("price-rows").innerHTML = rows;
  })();

  function fillCapacity() {
    var slabs = cfg.pricing[selectedType()].slabs;
    var prev = capacitySel.value;
    capacitySel.innerHTML = "";
    slabs.forEach(function (s, i) {
      capacitySel.add(new Option(slabLabel(slabs, i), String(i)));
    });
    capacitySel.add(new Option("Above " + liters.format(slabs[slabs.length - 1].upTo) + " L (get a quote)", "quote"));
    if (prev && capacitySel.querySelector('option[value="' + prev + '"]')) capacitySel.value = prev;
  }

  function quote() {
    var type = selectedType();
    var p = cfg.pricing[type];
    var count = parseInt(countSel.value, 10) || 1;
    var capText = capacitySel.options[capacitySel.selectedIndex].text;
    if (capacitySel.value === "quote") {
      return { type: type, label: p.label, capText: capText, count: count, quote: true };
    }
    var base = p.slabs[parseInt(capacitySel.value, 10)].price;
    var extra = Math.round(base * (1 - cfg.extraTankDiscount) * (count - 1));
    var subtotal = base + extra;
    var gst = Math.round(subtotal * cfg.gstRate);
    return { type: type, label: p.label, capText: capText, count: count, base: base, extra: extra, gst: gst, total: subtotal + gst };
  }

  function setQ(key, text) {
    var el = document.querySelector('[data-q="' + key + '"]');
    if (el) el.textContent = text;
  }

  function renderQuote() {
    var q = quote();
    var extraRow = document.querySelector("[data-q-extra-row]");
    if (q.quote) {
      setQ("base", "On request");
      setQ("gst", "-");
      setQ("total", "Quote on WhatsApp");
      extraRow.hidden = true;
      setQ("note", "Large tanks are priced after a quick look. Send the booking and we will quote on WhatsApp.");
      return;
    }
    setQ("base", rupees.format(q.base));
    extraRow.hidden = q.count < 2;
    setQ("extraLabel", (q.count - 1) + " extra tank" + (q.count > 2 ? "s" : "") + " (" + Math.round(cfg.extraTankDiscount * 100) + "% off)");
    setQ("extra", rupees.format(q.extra));
    setQ("gst", rupees.format(q.gst));
    setQ("total", rupees.format(q.total));
    setQ("note", q.count + " × " + q.label.toLowerCase() + ", " + q.capText + ".");
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

  form.addEventListener("change", function (e) {
    if (e.target.name === "type") fillCapacity();
    renderQuote();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var phone = String(data.get("phone") || "").replace(/[^0-9]/g, "");
    var missing = [];
    if (!String(data.get("name") || "").trim()) missing.push("your name");
    if (phone.length < 10) missing.push("a valid mobile number");
    if (!String(data.get("address") || "").trim()) missing.push("your address");
    if (!data.get("date")) missing.push("a date");
    if (missing.length) {
      errorBox.textContent = "Please add " + missing.join(", ") + ".";
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    var q = quote();
    var lines = [
      "New tank cleaning booking (" + cfg.brand + ")",
      "",
      "Service: " + q.label,
      "Capacity: " + q.capText,
      "Tanks: " + q.count,
      q.quote ? "Price: please quote" : "Price: " + rupees.format(q.base + q.extra) + " + GST " + rupees.format(q.gst) + " = " + rupees.format(q.total),
      "",
      "Name: " + String(data.get("name")).trim(),
      "Mobile: " + String(data.get("phone")).trim(),
      "Address: " + String(data.get("address")).trim(),
      "Preferred date: " + data.get("date"),
      "Preferred time: " + data.get("slot")
    ];
    var notes = String(data.get("notes") || "").trim();
    if (notes) lines.push("Notes: " + notes);

    if (typeof window.gtag === "function") window.gtag("event", "whatsapp_booking", { service: q.type, value: q.total || 0, currency: "INR" });
    if (typeof window.va === "function") window.va("event", { name: "whatsapp_booking", data: { service: q.type } });

    window.open(waUrl(lines.join("\n")), "_blank", "noopener");
  });

  // Demo videos: load the YouTube player only when clicked, to keep the page fast.
  document.querySelectorAll("[data-video]").forEach(function (fig) {
    var id = cfg.videos[fig.getAttribute("data-video")];
    var btn = fig.querySelector(".video-play");
    if (!id) {
      btn.disabled = true;
      return;
    }
    btn.classList.add("has-video");
    btn.style.backgroundImage = "url(https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg)";
    btn.querySelector("span").textContent = "Play video";
    btn.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      iframe.title = fig.querySelector("figcaption").textContent;
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      btn.replaceWith(iframe);
    });
  });

  fillCapacity();
  renderQuote();
})();
