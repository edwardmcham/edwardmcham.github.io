/* =============================================================================
   extra.js — custom site behavior

   All page-load logic is defined as named functions below, then run
   from a single document$.subscribe() call at the bottom. This is a
   readability/maintainability choice, not a performance one — each
   function still runs exactly once per page view either way.
   ============================================================================= */

/* Cached fetch of the external-link icon file — read from disk once,
   reused for every matching link on the page. Edit the icon by
   changing docs/assets/icons/external-link.svg only. */
let _externalIconPromise = null;
function getExternalIcon() {
  if (!_externalIconPromise) {
    _externalIconPromise = fetch("/assets/icons/external-link.svg").then(function(r) {
      return r.text();
    });
  }
  return _externalIconPromise;
}

/**
 * External link handling.
 * Adds target="_blank" + rel="noopener" to any link leaving the site
 * (different hostname), or any .pdf link — even a same-hostname
 * relative path, since a PDF is still effectively a download.
 * Appends the external-link icon to those links, except ones inside
 * .social-icons or carrying the footer's md-social__link class —
 * those stay intentionally icon-free.
 */
function initExternalLinks() {
  document.querySelectorAll(".md-content a").forEach(function(link) {
    var isSocial = link.classList.contains("md-social__link") || link.closest(".social-icons");
    var isPdf = link.href.endsWith(".pdf");
    var isExternal = link.hostname !== window.location.hostname || link.pathname.startsWith("/UltimateChess/");

    if (isExternal || isPdf) {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    }

    if (isExternal && !isSocial && !link.querySelector(".external-link-icon")) {
      getExternalIcon().then(function(svg) {
        link.insertAdjacentHTML("beforeend", '<span class="external-link-icon">' + svg + '</span>');
      });
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
 * Pipe separator spacing.
 * Wraps every "|" character found anywhere in the resume page's text
 * — job entries, the header subtitle, Education/Certifications lines
 * — in a <span> so extra.css can add spacing. Handles any surrounding
 * structure automatically, rather than needing a separate case for
 * each HTML shape.
 */
function initPipeSeparators() {
  var root = document.querySelector(".md-content__inner.md-typeset");
  if (!root) return;

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  var nodes = [];
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.parentElement.closest(".job-meta-sep")) continue;
    if (node.nodeValue.indexOf("|") !== -1) nodes.push(node);
  }

  nodes.forEach(function(node) {
    var parts = node.nodeValue.split("|");
    if (parts.length < 2) return;

    var frag = document.createDocumentFragment();
    parts.forEach(function(part, i) {
      frag.appendChild(document.createTextNode(part));
      if (i < parts.length - 1) {
        var span = document.createElement("span");
        span.className = "job-meta-sep";
        span.textContent = "|";
        frag.appendChild(span);
      }
    });
    node.replaceWith(frag);
  });
}

/**
 * Nav tab icons.
 * Zensical's nav tab titles render as plain text — icon shortcodes
 * placed directly in zensical.toml's nav config don't get processed
 * the way they do in page content. This fetches each icon's real SVG
 * file once and inserts it into the matching tab link by href.
 */
function initNavIcons() {
  var iconMap = {
    "": "home",
    "resume/": "file-user",
    "portfolio/": "layout-grid",
    "blog/": "newspaper"
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

/**
 * Blog page Expand All / Collapse All buttons.
 * Toggles the open attribute on every .month-group <details> element.
 * No-ops safely on any page without these buttons (e.g. every page
 * except blog.md).
 */
function initBlogControls() {
  var expandBtn = document.querySelector(".blog-expand-all");
  var collapseBtn = document.querySelector(".blog-collapse-all");
  if (!expandBtn || !collapseBtn) return;

  expandBtn.addEventListener("click", function() {
    document.querySelectorAll(".month-group").forEach(function(d) { d.open = true; });
  });
  collapseBtn.addEventListener("click", function() {
    document.querySelectorAll(".month-group").forEach(function(d) { d.open = false; });
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
  initPipeSeparators();
  initNavIcons();
  initBlogControls();
});