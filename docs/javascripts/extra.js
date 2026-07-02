// Initialize GLightbox for any elements with the class "glightbox" when the document is ready
document$.subscribe(function() {
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    moreLength: 0,
  });
});

// Update the copyright year in the footer dynamically
document.getElementById("copyright-year").textContent = new Date().getFullYear();