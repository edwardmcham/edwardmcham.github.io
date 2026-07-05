/* =============================================================================
   External link handling
   - Adds target="_blank" + rel="noopener" to any link leaving the site
     (different hostname), or any .pdf link — even a same-hostname
     relative path, since a PDF is still effectively a download.
   - Appends a small arrow icon to those links, except ones inside
     .social-icons or carrying the footer's md-social__link class —
     those stay intentionally icon-free.
   ============================================================================= */
document$.subscribe(function() {
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
});

/* =============================================================================
   GLightbox init — enables the click-to-enlarge modal for any element
   with class="glightbox" (the TWHQ certification badge in the footer).
   ============================================================================= */
document$.subscribe(function() {
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    moreLength: 0,
  });
});

/* =============================================================================
   Footer copyright year — keeps "© <year>" current with no manual edit.
   Wrapped in document$.subscribe (not run once at load) so it still
   works correctly if navigation.instant is ever added to zensical.toml —
   that feature swaps page content without a full reload, which would
   otherwise skip this line on later page views. The null check avoids
   a console error on any page where the element doesn't exist.
   ============================================================================= */
document$.subscribe(function() {
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});