/**
 * Site chrome: sticky header, multi-page navigation, mobile menu.
 * Works with GitHub Pages base path (/reddit/) and root deploy.
 */
(function () {
  var NAV_ITEMS = [
    { id: 'services', path: 'services/', labelKey: 'navServices' },
    { id: 'work', path: 'work/', labelKey: 'navWork' },
    { id: 'about', path: 'about/', labelKey: 'navAbout' },
    { id: 'blog', path: 'blog/', labelKey: 'navBlog' },
    { id: 'contact', path: 'contact/', labelKey: 'navContact' },
  ];

  function getSiteBase() {
    var path = window.location.pathname;
    if (/^\/reddit(\/|$)/.test(path)) {
      return '/reddit/';
    }
    return '/';
  }

  function siteUrl(relativePath) {
    var base = getSiteBase();
    var path = (relativePath || '').replace(/^\//, '');
    return base + path;
  }

  function getAssetPrefix() {
    var page = document.documentElement.getAttribute('data-page');
    return page && page !== 'home' ? '../' : '';
  }

  function getCurrentPage() {
    var path = window.location.pathname.replace(/\/$/, '');
    var base = getSiteBase().replace(/\/$/, '');
    var relative = path.replace(base, '').replace(/^\//, '');

    if (!relative || relative === 'index.html') {
      return 'home';
    }

    return relative.split('/')[0];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var NAV_LABELS_UA = {
    navServices: 'Послуги',
    navWork: 'Результати роботи',
    navAbout: 'Про мене',
    navBlog: 'Блог',
    navContact: 'Контакти',
  };

  function buildNavLinks(currentPage) {
    return NAV_ITEMS.map(function (item) {
      var isActive = currentPage === item.id;
      var label = NAV_LABELS_UA[item.labelKey] || '';
      return (
        '<li class="site-nav__item">' +
        '<a href="' +
        escapeHtml(siteUrl(item.path)) +
        '" class="site-nav__link' +
        (isActive ? ' is-active' : '') +
        '" data-i18n="' +
        item.labelKey +
        '"' +
        (isActive ? ' aria-current="page"' : '') +
        '>' +
        escapeHtml(label) +
        '</a>' +
        '</li>'
      );
    }).join('');
  }

  function renderHeader() {
    var mount = document.getElementById('site-header-mount');
    if (!mount) return;

    var currentPage = getCurrentPage();
    var homeUrl = siteUrl('');
    var isHome = currentPage === 'home';

    mount.outerHTML =
      '<header class="site-header' +
      (isHome ? ' site-header--home' : '') +
      '" id="site-header">' +
      '<div class="site-header__inner container">' +
      '<a href="' +
      escapeHtml(homeUrl) +
      '" class="site-brand" data-i18n="navBrand">Anastasiia Haiduchenko</a>' +
      '<button type="button" class="site-nav-toggle" id="site-nav-toggle" aria-expanded="false" aria-controls="site-nav-panel" data-i18n-aria="navMenuToggle">' +
      '<span class="site-nav-toggle__bar" aria-hidden="true"></span>' +
      '<span class="site-nav-toggle__bar" aria-hidden="true"></span>' +
      '<span class="site-nav-toggle__bar" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="site-nav-panel" id="site-nav-panel">' +
      '<nav class="site-nav" id="site-nav" data-i18n-aria="navMenuLabel">' +
      '<ul class="site-nav__list">' +
      buildNavLinks(currentPage) +
      '</ul>' +
      '<div class="site-header__actions">' +
      '<div id="lang-switcher" class="lang-switcher" role="group" aria-label="Language">' +
      '<button type="button" id="lang-switch-ua" aria-pressed="true">UA</button>' +
      '<button type="button" id="lang-switch-en" aria-pressed="false">EN</button>' +
      '</div>' +
      '<a href="' +
      escapeHtml(siteUrl('contact/')) +
      '" class="btn btn-primary site-header__cta" data-i18n="heroCtaPrimary">Запланувати консультацію</a>' +
      '</div>' +
      '</nav>' +
      '</div>' +
      '</div>' +
      '</header>';
  }

  function renderFooter() {
    var mount = document.getElementById('site-footer-mount');
    if (!mount) return;

    mount.outerHTML =
      '<footer class="footer">' +
      '<div class="container">' +
      '<p class="footer-text" data-i18n="footerCopy">&copy; 2026 Анастасія Гайдученко. Всі права захищені.</p>' +
      '</div>' +
      '</footer>';
  }

  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var isHome = header.classList.contains('site-header--home');

    function updateHeader() {
      var scrolled = window.scrollY > 16;
      header.classList.toggle('is-scrolled', scrolled || !isHome);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function initMobileNav() {
    var toggle = document.getElementById('site-nav-toggle');
    var panel = document.getElementById('site-nav-panel');
    if (!toggle || !panel) return;

    function setOpen(open) {
      document.body.classList.toggle('site-nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('site-nav-open'));
    });

    panel.querySelectorAll('.site-nav__link, .site-header__cta').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        setOpen(false);
      }
    });
  }

  function fixSiteLinks() {
    document.querySelectorAll('[data-site-link]').forEach(function (el) {
      var path = el.getAttribute('data-site-link');
      if (path) {
        el.setAttribute('href', siteUrl(path));
      }
    });
  }

  function init() {
    renderHeader();
    renderFooter();
    fixSiteLinks();
    initHeaderScroll();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.RedditSite = {
    getSiteBase: getSiteBase,
    siteUrl: siteUrl,
    getAssetPrefix: getAssetPrefix,
    getCurrentPage: getCurrentPage,
  };
})();
