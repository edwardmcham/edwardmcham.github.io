/* =============================================================================
   extra.js — custom site behavior

   All page-load logic is defined as named functions below, then run
   from a single document$.subscribe() call at the bottom. This is a
   readability/maintainability choice, not a performance one — each
   function still runs exactly once per page view either way. Having
   one call site makes the full list of "what happens on page load"
   visible at a glance, in a clear, guaranteed order.
   ============================================================================= */

/**
 * External link handling.
 * Adds target="_blank" + rel="noopener" to any link leaving the site
 * (different hostname), or any .pdf link — even a same-hostname
 * relative path, since a PDF is still effectively a download.
 * Appends a small arrow icon to those links, except ones inside
 * .social-icons or carrying the footer's md-social__link class —
 * those stay intentionally icon-free.
 */
function initExternalLinks() {
  document.querySelectorAll(".md-content a").forEach(function(link) {
    var isSocial = link.classList.contains("md-social__link") || link.closest(".social-icons");
    var isPdf = link.href.endsWith(".pdf");
    var isExternal = link.hostname !== window.location.hostname;

    if (isExternal || isPdf) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    }

    if (isExternal && !isSocial && !link.querySelector(".external-link-icon")) {
      link.insertAdjacentHTML("beforeend",
        '<span class="external-link-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M288 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h50.7L169.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L384 141.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H288zM80 64C35.8 64 0 99.8 0 144V400c0 44.2 35.8 80 80 80H336c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h80c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg></span>'
      );
    }
  });
}

/**
 * GLightbox init — enables the click-to-enlarge modal for any element
 * with class="glightbox" (the TWHQ certification badge in the footer).
 */
function initGLightbox() {
  GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    moreLength: 0,
  });
}

/**
 * Footer copyright year — keeps "© <year>" current with no manual edit.
 * The null check avoids a console error on any page where the element
 * doesn't exist.
 */
function updateCopyrightYear() {
  var yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Job-meta separator spacing.
 * Two different HTML shapes get the same treatment:
 *   Case A — job entries: several <em> tags (company, location, dates)
 *   with bare "|" text nodes between them as siblings inside one <p>.
 *   Case B — header subtitle: one <strong> tag with "|" inside its
 *   own continuous text run.
 * Both get the "|" wrapped in <span class="job-meta-sep"> so extra.css
 * can add spacing — plain text alone can't be targeted by CSS.
 */
function initJobMetaSeparators() {
  var seen = new Set();

  document.querySelectorAll(".md-typeset em").forEach(function(em) {
    var p = em.parentElement;
    if (p.tagName !== "P" || seen.has(p)) return;
    seen.add(p);
    if (!p.textContent.includes("|")) return;

    Array.from(p.childNodes).forEach(function(node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === "|") {
        var span = document.createElement("span");
        span.className = "job-meta-sep";
        span.textContent = "|";
        node.replaceWith(span);
      }
    });
  });

  document.querySelectorAll(".md-typeset strong").forEach(function(strong) {
    if (strong.innerHTML.includes(" | ") && !strong.querySelector(".job-meta-sep")) {
      strong.innerHTML = strong.innerHTML.replace(/\s\|\s/g, ' <span class="job-meta-sep">|</span> ');
    }
  });
}

/**
 * Nav tab icons.
 * Zensical's nav tab titles render as plain text — icon shortcodes
 * placed directly in zensical.toml's nav config don't get processed
 * the way they do in page content. This fetches each icon's real SVG
 * file once and inserts it into the matching tab link by href, giving
 * the same visual result without depending on that unsupported syntax.
 */
function initNavIcons() {
  var iconMap = {
    "": "newspaper",           // Blog / home tab
    "resume/": "file-user",
    "portfolio/": "layout-grid"
  };

  document.querySelectorAll(".md-tabs__link").forEach(function(link) {
    var path = new URL(link.href).pathname.replace(/^\//, "");
    var iconName = iconMap[path];
    if (!iconName || link.querySelector(".nav-tab-icon")) return;

    fetch("/assets/icons/" + iconName + ".svg")
      .then(function(r) { return r.text(); })
      .then(function(svg) {
        link.insertAdjacentHTML("afterbegin",
          '<span class="nav-tab-icon">' + svg + '</span>');
      });
  });
}

/* -----------------------------------------------------------------------
   Single subscription — runs everything above, in order, on every
   page view.
   ----------------------------------------------------------------------- */
document$.subscribe(function() {
  initExternalLinks();
  initGLightbox();
  updateCopyrightYear();
  initJobMetaSeparators();
  initNavIcons();
});