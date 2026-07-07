/**
 * Service card accordions on the services page.
 */
(function () {
  function openCard(card) {
    if (!card) return;
    var toggle = card.querySelector('.svc-accordion__toggle');
    card.classList.add('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  }

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

  function openFromHash() {
    var hash = window.location.hash;
    if (!hash || hash.indexOf('#service-') !== 0) return;

    var card = document.querySelector(hash);
    if (!card || !card.classList.contains('svc-accordion')) return;

    openCard(card);
    window.requestAnimationFrame(function () {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function init() {
    initAccordions();
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
