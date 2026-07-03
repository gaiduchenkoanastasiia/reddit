/**
 * Bilingual support: apply translations, language switcher, localStorage persistence.
 * Depends on: REDDIT_TRANSLATIONS (translations.js), lang-boot.js (early lang in head)
 */
(function () {
  var STORAGE_KEY = 'reddit-lang';
  var DEFAULT_LANG = 'ua';

  function getUrlLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var lang = params.get('lang');
      return lang === 'ua' || lang === 'en' ? lang : null;
    } catch (e) {
      return null;
    }
  }

  function getStoredLang() {
    try {
      var bootLang = document.documentElement.getAttribute('data-lang');
      if (bootLang === 'ua' || bootLang === 'en') return bootLang;

      var urlLang = getUrlLang();
      if (urlLang) return urlLang;

      var stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'ua' || stored === 'en' ? stored : DEFAULT_LANG;
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
    return window.REDDIT_TRANSLATIONS && window.REDDIT_TRANSLATIONS[lang]
      ? window.REDDIT_TRANSLATIONS[lang]
      : {};
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function applyList(t, key, el) {
    var val = t[key];
    if (!Array.isArray(val)) return;
    var tag = el.tagName.toLowerCase();
    if (tag === 'ul' || tag === 'ol') {
      el.innerHTML = val
        .map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        })
        .join('');
    }
  }

  function getPageKey() {
    return document.documentElement.getAttribute('data-page') || '';
  }

  function getPageTranslationKey(suffix) {
    var page = getPageKey();
    if (!page || page === 'home') return null;
    return 'page' + page.charAt(0).toUpperCase() + page.slice(1) + suffix;
  }

  function applyLang(lang) {
    var t = getT(lang);
    if (!t || !document.querySelector) return;

    document.documentElement.lang = lang === 'en' ? 'en' : 'uk';
    document.documentElement.setAttribute('data-lang', lang);

    var pageTitleKey = getPageTranslationKey('MetaTitle');
    var pageDescKey = getPageTranslationKey('MetaDescription');

    if (pageTitleKey && t[pageTitleKey]) {
      document.title = t[pageTitleKey];
    } else if (t.metaTitle) {
      document.title = t.metaTitle;
    }

    var metaDesc = document.getElementById('meta-description');
    if (metaDesc) {
      if (pageDescKey && t[pageDescKey]) {
        metaDesc.setAttribute('content', t[pageDescKey]);
      } else if (t.metaDescription) {
        metaDesc.setAttribute('content', t.metaDescription);
      }
    }

    var ogTitle = document.getElementById('og-title');
    if (ogTitle && t.ogTitle) ogTitle.setAttribute('content', t.ogTitle);

    var ogDesc = document.getElementById('og-description');
    if (ogDesc && t.ogDescription) ogDesc.setAttribute('content', t.ogDescription);

    var twitterTitle = document.getElementById('twitter-title');
    if (twitterTitle && t.ogTitle) twitterTitle.setAttribute('content', t.ogTitle);

    var twitterDesc = document.getElementById('twitter-description');
    if (twitterDesc && t.ogDescription) twitterDesc.setAttribute('content', t.ogDescription);

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (key && t[key]) el.setAttribute('alt', t[key]);
    });

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key && t[key] != null && typeof t[key] === 'string') {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-list]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-list');
      if (key) applyList(t, key, el);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key && t[key]) el.setAttribute('aria-label', t[key]);
    });

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

    document.documentElement.classList.add('i18n-ready');
  }

  function ensureI18nReady() {
    window.setTimeout(function () {
      document.documentElement.classList.add('i18n-ready');
    }, 1200);
  }

  function setLang(lang) {
    if (lang !== 'ua' && lang !== 'en') lang = DEFAULT_LANG;
    setStoredLang(lang);
    applyLang(lang);
  }

  function initSwitcher() {
    var btnUA = document.getElementById('lang-switch-ua');
    var btnEN = document.getElementById('lang-switch-en');
    if (btnUA) btnUA.addEventListener('click', function () { setLang('ua'); });
    if (btnEN) btnEN.addEventListener('click', function () { setLang('en'); });
  }

  function init() {
    ensureI18nReady();
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
