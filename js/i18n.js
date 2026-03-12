/**
 * Bilingual support: apply translations, language switcher, localStorage persistence.
 * Depends on: REDDIT_TRANSLATIONS (translations.js)
 */
(function() {
  var STORAGE_KEY = 'reddit-lang';
  var DEFAULT_LANG = 'ua';

  function getStoredLang() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return (stored === 'ua' || stored === 'en') ? stored : DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getT(lang) {
    return window.REDDIT_TRANSLATIONS && window.REDDIT_TRANSLATIONS[lang] ? window.REDDIT_TRANSLATIONS[lang] : {};
  }

  function applyText(t, key, el) {
    var val = t[key];
    if (val == null || typeof val !== 'string') return;
    el.textContent = val;
  }

  function applyList(t, key, el) {
    var val = t[key];
    if (!Array.isArray(val)) return;
    var tag = el.tagName.toLowerCase();
    if (tag === 'ul' || tag === 'ol') {
      el.innerHTML = val.map(function(item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('');
    } else if (el.classList && el.classList.contains('service-note-block')) {
      el.innerHTML = val.map(function(item) { return '<p>' + escapeHtml(item) + '</p>'; }).join('');
    }
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function applyLang(lang) {
    var t = getT(lang);
    if (!t || !document.querySelector) return;

    document.documentElement.lang = lang === 'en' ? 'en' : 'uk';

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (key && t[key] != null) {
        if (typeof t[key] === 'string') {
          el.textContent = t[key];
        }
      }
    });

    document.querySelectorAll('[data-i18n-list]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-list');
      if (key) applyList(t, key, el);
    });

    // Aria labels: all modal close buttons and any [data-i18n-aria]
    document.querySelectorAll('.modal-close').forEach(function(btn) {
      if (t.modalClose) btn.setAttribute('aria-label', t.modalClose);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key && t[key]) el.setAttribute('aria-label', t[key]);
    });

    // Modal 1: ordered list (3 steps) and outcome text
    var m1FormatOl = document.querySelector('#modal-service-1 .service-list.ordered');
    if (m1FormatOl && t.m1FormatStep1 && t.m1FormatStep2 && t.m1FormatStep3) {
      var steps = [t.m1FormatStep1, t.m1FormatStep2, t.m1FormatStep3];
      m1FormatOl.innerHTML = steps.map(function(s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('');
    }
    var m1OutcomeLead = document.querySelector('#modal-service-1 .service-outcome-killer-lead');
    if (m1OutcomeLead && t.m1OutcomeText) m1OutcomeLead.textContent = t.m1OutcomeText;

    // Modal 2: package names and details (no list, individual elements)
    var pkg1Name = document.querySelector('#modal-service-2 .pricing-package:nth-child(1) .package-name');
    var pkg1Details = document.querySelector('#modal-service-2 .pricing-package:nth-child(1) .package-details');
    var pkg2Name = document.querySelector('#modal-service-2 .pricing-package:nth-child(2) .package-name');
    var pkg2Details = document.querySelector('#modal-service-2 .pricing-package:nth-child(2) .package-details');
    var pkg3Name = document.querySelector('#modal-service-2 .pricing-package:nth-child(3) .package-name');
    var pkg3Details = document.querySelector('#modal-service-2 .pricing-package:nth-child(3) .package-details');
    if (pkg1Name && t.m2Package1) pkg1Name.textContent = t.m2Package1;
    if (pkg1Details && t.m2Package1Details) pkg1Details.textContent = t.m2Package1Details;
    if (pkg2Name && t.m2Package2) pkg2Name.textContent = t.m2Package2;
    if (pkg2Details && t.m2Package2Details) pkg2Details.textContent = t.m2Package2Details;
    if (pkg3Name && t.m2Package3) pkg3Name.textContent = t.m2Package3;
    if (pkg3Details && t.m2Package3Details) pkg3Details.textContent = t.m2Package3Details;
    var m2Extra = document.querySelector('#modal-service-2 .additional-option');
    if (m2Extra && t.m2Extra) {
      var span = m2Extra.querySelector('span');
      m2Extra.innerHTML = escapeHtml(t.m2Extra) + (span ? ' <span>' + escapeHtml(t.m2ExtraSpan || '') + '</span>' : '');
    }
    var m2Note = document.querySelector('#modal-service-2 .service-note-block');
    if (m2Note && t.m2ImportantP1 != null && t.m2ImportantP2 != null) {
      m2Note.innerHTML = '<p>' + escapeHtml(t.m2ImportantP1) + '</p><p>' + escapeHtml(t.m2ImportantP2) + '</p>';
    }

    // Modal 1 format note (single p)
    var m1Note = document.querySelector('#modal-service-1 .service-price-note');
    if (m1Note && t.m1FormatNote) m1Note.textContent = t.m1FormatNote;

    // Switcher labels and active state
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

  function setLang(lang) {
    if (lang !== 'ua' && lang !== 'en') lang = DEFAULT_LANG;
    setStoredLang(lang);
    applyLang(lang);
  }

  function initSwitcher() {
    var wrap = document.getElementById('lang-switcher');
    if (!wrap) return;
    var btnUA = document.getElementById('lang-switch-ua');
    var btnEN = document.getElementById('lang-switch-en');
    if (btnUA) btnUA.addEventListener('click', function() { setLang('ua'); });
    if (btnEN) btnEN.addEventListener('click', function() { setLang('en'); });
  }

  function init() {
    var lang = getStoredLang();
    applyLang(lang);
    initSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.RedditI18n = { setLang: setLang, getLang: getStoredLang, applyLang: applyLang };
})();
