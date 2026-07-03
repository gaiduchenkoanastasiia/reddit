/**
 * Service card accordions on the services page.
 */
(function () {
  function initAccordions() {
    var cards = document.querySelectorAll('.svc-accordion');
    if (!cards.length) return;

    cards.forEach(function (card) {
      var toggle = card.querySelector('.svc-accordion__toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function () {
        var isOpen = card.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordions);
  } else {
    initAccordions();
  }
})();
