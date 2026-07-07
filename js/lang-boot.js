/**
 * Early language boot — runs in <head> before paint to prevent UA/EN flash.
 */
(function () {
  var STORAGE_KEY = 'reddit-lang';
  var DEFAULT = 'ua';

  function getUrlLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var lang = params.get('lang');
      return lang === 'ua' || lang === 'en' ? lang : null;
    } catch (e) {
      return null;
    }
  }

  function getLang() {
    try {
      var urlLang = getUrlLang();
      if (urlLang) return urlLang;
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'ua' || stored === 'en' ? stored : DEFAULT;
    } catch (e) {
      return DEFAULT;
    }
  }

  var lang = getLang();
  var html = document.documentElement;
  html.setAttribute('data-lang', lang);
  html.lang = lang === 'en' ? 'en' : 'uk';
})();
