/**
 * Apply header/nav translations during parse — before first paint when EN is stored.
 * Depends on: lang-boot.js (data-lang). Uses a small chrome-only dict (no translations.js in head).
 */
(function () {
  var CHROME = {
    ua: {
      navBrand: 'Anastasiia Haiduchenko',
      navServices: 'Послуги',
      navWork: 'Результати роботи',
      navAbout: 'Про мене',
      navBlog: 'Блог',
      navMenuLabel: 'Головна навігація',
      navMenuToggle: 'Відкрити меню',
      heroCtaPrimary: 'Запланувати консультацію',
      langUA: 'UA',
      langEN: 'EN',
    },
    en: {
      navBrand: 'Anastasiia Haiduchenko',
      navServices: 'Services',
      navWork: 'Work results',
      navAbout: 'About me',
      navBlog: 'Blog',
      navMenuLabel: 'Main navigation',
      navMenuToggle: 'Open menu',
      heroCtaPrimary: 'Book a consultation',
      langUA: 'UA',
      langEN: 'EN',
    },
  };

  var lang = document.documentElement.getAttribute('data-lang') || 'ua';

  function getT() {
    return CHROME[lang] || CHROME.ua;
  }

  function applyTo(el) {
    var t = getT();
    var key = el.getAttribute('data-i18n');
    if (key && t[key] != null && typeof t[key] === 'string') {
      el.textContent = t[key];
    }

    key = el.getAttribute('data-i18n-aria');
    if (key && t[key]) {
      el.setAttribute('aria-label', t[key]);
    }
  }

  function applyChrome(root) {
    var scope = root || document;
    scope
      .querySelectorAll(
        '.site-header [data-i18n], .site-header [data-i18n-aria], .site-nav-panel [data-i18n], .site-nav-panel [data-i18n-aria]'
      )
      .forEach(applyTo);
    updateLangSwitcher();
  }

  function updateLangSwitcher() {
    var t = getT();
    var btnUA = document.getElementById('lang-switch-ua');
    var btnEN = document.getElementById('lang-switch-en');
    if (btnUA) {
      btnUA.textContent = t.langUA || 'UA';
      btnUA.classList.toggle('is-active', lang === 'ua');
      btnUA.setAttribute('aria-pressed', lang === 'ua' ? 'true' : 'false');
    }
    if (btnEN) {
      btnEN.textContent = t.langEN || 'EN';
      btnEN.classList.toggle('is-active', lang === 'en');
      btnEN.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    }
  }

  function onNodeAdded(node) {
    if (node.nodeType !== 1) return;

    if (node.classList && node.classList.contains('site-header')) {
      applyChrome(node);
      return;
    }

    if (node.classList && node.classList.contains('site-nav-panel')) {
      applyChrome(node);
      return;
    }

    if (
      (node.closest && node.closest('.site-header')) ||
      (node.closest && node.closest('.site-nav-panel'))
    ) {
      if (
        node.matches &&
        (node.matches('[data-i18n]') || node.matches('[data-i18n-aria]'))
      ) {
        applyTo(node);
      }
      if (node.querySelectorAll) {
        node.querySelectorAll('[data-i18n], [data-i18n-aria]').forEach(applyTo);
      }
      return;
    }

    if (node.querySelector) {
      var header = node.querySelector('.site-header');
      var panel = node.querySelector('.site-nav-panel');
      if (header) applyChrome(header);
      if (panel) applyChrome(panel);
    }
  }

  function init() {
    applyChrome(document);

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(onNodeAdded);
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    document.addEventListener('DOMContentLoaded', function () {
      applyChrome(document);
      observer.disconnect();
    });
  }

  init();
})();
