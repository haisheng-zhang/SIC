/* ==========================================================================
   SIC — site behaviour
   Plain browser JS. No build step, no dependencies.
   Handles: mobile nav, active nav state, footer year, event rendering.
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

  // On touch devices the dropdown opens on tap rather than hover.
  Array.prototype.forEach.call(document.querySelectorAll(".nav-trigger"), function (btn) {
    btn.addEventListener("click", function () {
      var menu = btn.nextElementSibling;
      if (menu) menu.classList.toggle("is-open");
    });
  });

  // Mark the current page in the nav.
  var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  Array.prototype.forEach.call(document.querySelectorAll(".nav a[href]"), function (a) {
    var target = a.getAttribute("href").split("/").pop().split("#")[0].toLowerCase();
    if (target && target === here) {
      a.classList.add("is-active");
      var group = a.closest(".nav-item");
      if (group) group.classList.add("is-active");
    }
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

  // An event may belong to several focus areas: topic: "ai, blockchain".
  // Returns a clean list, ignoring unknown names and stray whitespace.
  function topicsOf(event) {
    return String(event.topic || "")
      .split(",")
      .map(function (t) { return t.trim().toLowerCase(); })
      .filter(function (t) { return Object.prototype.hasOwnProperty.call(TOPICS, t); });
  }

  function eventHtml(event, isPast) {
    var start = parseDate(event.date);
    if (!start) return "";

    var hasLink = event.link && event.link !== "#";
    var label = isPast ? "View details" : "More information";
    var action = hasLink
      ? '<a class="btn ' + (isPast ? "btn-outline" : "btn-accent") + '" href="' +
        escapeHtml(event.link) + '" target="_blank" rel="noopener">' + label + "</a>"
      : '<span class="tag tag-neutral">Link to come</span>';

    var topics = topicsOf(event);
    var tags = topics.map(function (t) {
      return '<span class="tag tag-neutral">' + escapeHtml(TOPICS[t]) + "</span>";
    }).join("");

    return '' +
      '<article class="event' + (isPast ? " is-past" : "") + '" data-topic="' +
          escapeHtml(topics.join(" ")) + '">' +
        '<div class="event-date">' +
          '<span class="m">' + MONTHS[start.getMonth()] + "</span>" +
          '<span class="d">' + start.getDate() + "</span>" +
          '<span class="y">' + start.getFullYear() + "</span>" +
        "</div>" +
        '<div class="event-body">' +
          "<h3>" + escapeHtml(event.title) + "</h3>" +
          (event.summary ? "<p>" + escapeHtml(event.summary) + "</p>" : "") +
          (tags ? '<div class="event-tags">' + tags + "</div>" : "") +
        "</div>" +
        '<div class="event-action">' + action + "</div>" +
      "</article>";
  }

  function split(topic) {
    var all = (window.sicEvents || []).filter(function (e) {
      if (!e || !parseDate(e.date)) return false;
      return topic ? topicsOf(e).indexOf(topic) !== -1 : true;
    });

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var upcoming = [], past = [];
    all.forEach(function (e) {
      (parseDate(e.date).getTime() >= today.getTime() ? upcoming : past).push(e);
    });

    upcoming.sort(function (a, b) { return parseDate(a.date) - parseDate(b.date); });
    past.sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
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

  // Homepage — next three upcoming events.
  render(document.getElementById("home-events"), split().upcoming, false, EMPTY_UPCOMING, 3);

  // Events page — everything, split into upcoming and past.
  var all = split();
  render(document.getElementById("upcoming-events"), all.upcoming, false, EMPTY_UPCOMING);
  render(document.getElementById("past-events"), all.past, true, "No past events yet.");

  // Focus-area pages — one topic only, upcoming then past in a single list.
  var topicEl = document.getElementById("topic-events");
  if (topicEl) {
    var t = split(topicEl.getAttribute("data-topic"));
    if (!t.upcoming.length && !t.past.length) {
      render(topicEl, [], false, EMPTY_UPCOMING);
    } else {
      topicEl.innerHTML =
        t.upcoming.map(function (e) { return eventHtml(e, false); }).join("") +
        t.past.map(function (e) { return eventHtml(e, true); }).join("");
    }
  }
})();
