/* ==========================================================================
   SIC — site behaviour
   Plain browser JS. No build step, no dependencies.
   Handles: mobile nav, active nav state, footer year, and events — fetched
   live from the published Google Sheet CSV named in content-config.js,
   rendered, with past-event recap panels (Google Doc, single Drive file,
   or Drive folder).

   Publishing an event is entirely a Google Sheet edit — see
   assets/events/README.md. Nothing in this file or content-config.js needs
   to change to add, edit or remove an event.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------- nav --- */

  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Mark the current page in the nav.
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll(".nav a[href]"), function (a) {
    var target = a.getAttribute("href").split("/").pop().split("#")[0].toLowerCase();
    if (target && target === here) a.classList.add("is-active");
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------- CSV --- */
  // Minimal CSV parser — handles quoted fields, commas and newlines inside
  // quotes, and "" as an escaped quote. That's what Google Sheets exports.

  function parseCsv(text) {
    var rows = [], row = [], field = "", inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n") {
        row.push(field); rows.push(row); row = []; field = "";
      } else if (c !== "\r") {
        field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // First row is the header — becomes the object keys, verbatim. That's the
  // whole contract between the sheet and this file: column name in, same
  // name out. Blank rows are skipped.
  function csvToObjects(text) {
    var rows = parseCsv(text);
    if (!rows.length) return [];
    var headers = rows[0].map(function (h) { return h.trim(); });
    return rows.slice(1)
      .filter(function (r) { return r.some(function (c) { return c.trim() !== ""; }); })
      .map(function (r) {
        var obj = {};
        headers.forEach(function (h, i) { obj[h] = (r[i] || "").trim(); });
        return obj;
      });
  }

  /* ---------------------------------------------------------- events --- */

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var TOPICS = {
    "ai": "Artificial Intelligence",
    "blockchain": "Blockchain & DeFi",
    "food-health": "Food & Health"
  };

  function parseDate(value) {
    // Build the date from parts so it lands on the intended local day.
    // new Date("2026-09-18") is parsed as UTC and can render as the 17th.
    var parts = String(value || "").split("-");
    if (parts.length !== 3) return null;
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    return isNaN(d.getTime()) ? null : d;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // An event may belong to several areas: topic: "ai, blockchain".
  // Returns a clean list, ignoring unknown names and stray whitespace.
  function topicsOf(event) {
    return String(event.topic || "")
      .split(",")
      .map(function (t) { return t.trim().toLowerCase(); })
      .filter(function (t) { return Object.prototype.hasOwnProperty.call(TOPICS, t); });
  }

  /* -------------------------------------------------- recap embedding -- */
  // Turns a normal Google share link into the matching embeddable link.
  // The sheet holds whatever link Share gives you; this does the rewriting.

  // detail_doc_url accepts a Google Doc link OR a plain Drive file link
  // (PDF, a single image, a video — anything shared as one file rather
  // than a folder). Both get rewritten to their matching embeddable preview.
  function detailDocEmbedUrl(url) {
    var s = String(url || "");
    var doc = s.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    if (doc) return "https://docs.google.com/document/d/" + doc[1] + "/preview";
    var file = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (file) return "https://drive.google.com/file/d/" + file[1] + "/preview";
    return url || "";
  }

  function driveFolderEmbedUrl(url) {
    var m = String(url || "").match(/\/folders\/([a-zA-Z0-9_-]+)/) ||
            String(url || "").match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m) return "https://drive.google.com/embeddedfolderview?id=" + m[1] + "#grid";
    return url || "";
  }

  function hasRecap(event) {
    return !!(event.detail_doc_url || event.media_folder_url);
  }

  // Builds the hidden recap panel for a past event: doc (or single Drive
  // file) takes priority, then Drive folder.
  function recapHtml(event) {
    if (event.detail_doc_url) {
      return '<div class="embed-frame">' +
        '<iframe src="' + escapeHtml(detailDocEmbedUrl(event.detail_doc_url)) + '" loading="lazy" ' +
        'title="' + escapeHtml(event.title) + ' — full write-up"></iframe></div>';
    }
    if (event.media_folder_url) {
      return '<div class="embed-frame embed-frame-drive">' +
        '<iframe src="' + escapeHtml(driveFolderEmbedUrl(event.media_folder_url)) + '" loading="lazy" ' +
        'title="' + escapeHtml(event.title) + ' — photos and videos"></iframe></div>';
    }
    return "";
  }

  function eventHtml(event, isPast) {
    var start = parseDate(event.date_start);
    if (!start) return "";
    var end = parseDate(event.date_end);

    var hasLink = event.external_url && event.external_url !== "#";
    var recap = isPast && hasRecap(event);

    var dateLabel = end && end.getTime() !== start.getTime()
      ? start.getDate() + "–" +
        (end.getMonth() !== start.getMonth() ? MONTHS[end.getMonth()] + " " : "") + end.getDate()
      : "";

    var topics = topicsOf(event);
    var tags = topics.map(function (t) {
      return '<span class="tag tag-neutral">' + escapeHtml(TOPICS[t]) + "</span>";
    }).join("");

    var actions = "";
    if (recap) {
      actions += '<button type="button" class="btn btn-outline event-toggle" ' +
        'data-open="View recap" data-close="Hide recap">View recap</button>';
    }
    if (hasLink) {
      actions += '<a class="textlink" href="' + escapeHtml(event.external_url) +
        '" target="_blank" rel="noopener">' + (recap ? "Original post" : "More information") + "</a>";
    }
    if (!recap && !hasLink) {
      actions = '<span class="tag tag-neutral">' + (isPast ? "Recap coming" : "Link to come") + "</span>";
    }

    return '' +
      '<article class="event' + (isPast ? " is-past" : "") + '" data-topic="' +
          escapeHtml(topics.join(" ")) + '">' +
        '<div class="event-date">' +
          '<span class="m">' + MONTHS[start.getMonth()] + "</span>" +
          '<span class="d">' + (dateLabel || start.getDate()) + "</span>" +
          '<span class="y">' + start.getFullYear() + "</span>" +
        "</div>" +
        '<div class="event-body">' +
          "<h3>" + escapeHtml(event.title) + "</h3>" +
          (event.summary ? "<p>" + escapeHtml(event.summary) + "</p>" : "") +
          (event.venue ? '<p class="event-meta">' + escapeHtml(event.venue) + "</p>" : "") +
          (tags ? '<div class="event-tags">' + tags + "</div>" : "") +
        "</div>" +
        '<div class="event-action">' + actions + "</div>" +
        (recap ? '<div class="event-media" hidden>' + recapHtml(event) + "</div>" : "") +
      "</article>";
  }

  // Events are always shown newest-first within each group — no manual
  // ordering column, the date is the order.
  function split(events) {
    var all = events.filter(function (e) { return e && parseDate(e.date_start); });

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var upcoming = [], past = [];
    all.forEach(function (e) {
      (parseDate(e.date_start).getTime() >= today.getTime() ? upcoming : past).push(e);
    });

    upcoming.sort(function (a, b) { return parseDate(a.date_start) - parseDate(b.date_start); });
    past.sort(function (a, b) { return parseDate(b.date_start) - parseDate(a.date_start); });
    return { upcoming: upcoming, past: past };
  }

  function render(el, list, isPast, emptyMessage, limit) {
    if (!el) return;
    var items = limit ? list.slice(0, limit) : list;
    el.innerHTML = items.length
      ? items.map(function (e) { return eventHtml(e, isPast); }).join("")
      : '<div class="empty-state">' + escapeHtml(emptyMessage) + "</div>";
  }

  var EMPTY_UPCOMING = "No events are scheduled at the moment. New sessions are announced here.";
  var EMPTY_NOT_CONFIGURED = "Events aren't connected yet — set eventsCsvUrl in assets/content-config.js.";
  var EVENT_LIST_IDS = ["home-events", "upcoming-events", "past-events"];

  function showLoading() {
    EVENT_LIST_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = '<div class="loading-state">Loading events…</div>';
    });
  }

  function renderEvents(events) {
    render(document.getElementById("home-events"), split(events).upcoming, false, EMPTY_UPCOMING, 3);
    var all = split(events);
    render(document.getElementById("upcoming-events"), all.upcoming, false, EMPTY_UPCOMING);
    render(document.getElementById("past-events"), all.past, true, "No past events yet.");
  }

  var csvUrl = (window.sicContentConfig || {}).eventsCsvUrl;
  if (!csvUrl) {
    renderEvents([]);
    if (document.getElementById("upcoming-events")) {
      render(document.getElementById("upcoming-events"), [], false, EMPTY_NOT_CONFIGURED);
    }
  } else {
    showLoading();
    fetch(csvUrl)
      .then(function (r) { return r.text(); })
      .then(function (text) { renderEvents(csvToObjects(text)); })
      .catch(function (err) {
        console.error("SIC: failed to load events from", csvUrl, err);
        renderEvents([]);
      });
  }

  /* --------------------------------------------------- recap toggling -- */
  // Delegated on document because event cards are added after this script
  // runs (they arrive once the CSV fetch resolves).

  document.addEventListener("click", function (evt) {
    var toggleBtn = evt.target.closest(".event-toggle");
    if (!toggleBtn) return;
    var article = toggleBtn.closest(".event");
    var media = article && article.querySelector(".event-media");
    if (!media) return;
    var open = article.classList.toggle("is-expanded");
    media.hidden = !open;
    toggleBtn.textContent = open ? toggleBtn.getAttribute("data-close") : toggleBtn.getAttribute("data-open");
  });
})();
