/**
 * Site chrome interactivity: mobile menu, page transitions, link helpers.
 * Header/footer are static HTML in each page (no JS injection).
 */
(function () {
  var NAV_IDS = ['services', 'work', 'about', 'blog'];

  function isLocalFile() {
    return window.location.protocol === 'file:';
  }

  function getLinkPrefix() {
    var page = document.documentElement.getAttribute('data-page');
    return page && page !== 'home' ? '../' : '';
  }

  function normalizeLocalPath(relativePath) {
    if (!relativePath) return 'index.html';
    if (relativePath.charAt(relativePath.length - 1) === '/') {
      return relativePath + 'index.html';
    }
    return relativePath;
  }

  function getSiteBase() {
    if (isLocalFile()) return '';
    var path = window.location.pathname;
    if (/^\/reddit(\/|$)/.test(path)) return '/reddit/';
    return '/';
  }

  function siteUrl(relativePath) {
    var path = (relativePath || '').replace(/^\//, '');

    if (isLocalFile()) {
      var prefix = getLinkPrefix();
      if (!path) return prefix ? '../index.html' : 'index.html';
      return prefix + normalizeLocalPath(path);
    }

    return getSiteBase() + path;
  }

  function getAssetPrefix() {
    var page = document.documentElement.getAttribute('data-page');
    return page && page !== 'home' ? '../' : '';
  }

  function getCurrentPage() {
    var page = document.documentElement.getAttribute('data-page');
    if (page) return page;

    var path = window.location.pathname.replace(/\/$/, '');
    var base = getSiteBase().replace(/\/$/, '');
    var relative = path.replace(base, '').replace(/^\//, '');

    if (!relative || relative === 'index.html') return 'home';
    return relative.split('/')[0];
  }

  function markActiveNav() {
    var current = getCurrentPage();
    document.querySelectorAll('.site-nav__link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var isActive = false;

      if (current === 'home') {
        isActive = href.charAt(0) === '#';
      } else {
        isActive = href.indexOf(current) !== -1;
      }

      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
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

    panel.querySelectorAll('a, [data-contact-modal]').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  function fixSiteLinks() {
    document.querySelectorAll('[data-site-link]').forEach(function (el) {
      var path = el.getAttribute('data-site-link');
      if (path) el.setAttribute('href', siteUrl(path));
    });
  }

  var PAGE_LEAVE_MS = 240;

  function isModifiedClick(event) {
    return (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    );
  }

  function isInternalNavigationLink(anchor) {
    if (!anchor || anchor.tagName !== 'A') return false;
    if (anchor.hasAttribute('download')) return false;
    if (anchor.target && anchor.target !== '_self') return false;

    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

    try {
      var url = new URL(anchor.href, window.location.href);
      if (isLocalFile()) return url.protocol === 'file:';
      return url.origin === window.location.origin;
    } catch (error) {
      return false;
    }
  }

  function initPageTransitions() {
    var prefetched = Object.create(null);

    document.addEventListener('click', function (event) {
      var anchor = event.target.closest('a');
      if (!anchor || !isInternalNavigationLink(anchor)) return;
      if (isModifiedClick(event)) return;

      var destination = anchor.href;
      if (destination === window.location.href) {
        if (anchor.classList.contains('site-brand')) {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      event.preventDefault();
      sessionStorage.setItem('reddit-nav', '1');
      document.documentElement.classList.add('page-is-leaving');
      window.setTimeout(function () {
        window.location.assign(destination);
      }, PAGE_LEAVE_MS);
    });

    if (sessionStorage.getItem('reddit-nav')) {
      sessionStorage.removeItem('reddit-nav');
      document.documentElement.classList.add('nav-enter');
      window.scrollTo(0, 0);
    }

    window.addEventListener('pageshow', function (event) {
      document.documentElement.classList.remove('page-is-leaving');
      if (event.persisted) {
        document.documentElement.classList.add('nav-enter');
      }
    });

    document.addEventListener('mouseover', function (event) {
      var anchor = event.target.closest('a');
      if (!anchor || !isInternalNavigationLink(anchor)) return;

      var href = anchor.href;
      if (prefetched[href]) return;

      prefetched[href] = true;
      var prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = href;
      document.head.appendChild(prefetchLink);
    });
  }

  function initContactModal() {
    var modal = document.getElementById('contact-modal');
    if (!modal) return;

    var dialog = modal.querySelector('.contact-modal__dialog');
    var lastFocus = null;

    function setOpen(open) {
      modal.classList.toggle('is-open', open);
      modal.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.classList.toggle('contact-modal-open', open);

      if (open) {
        lastFocus = document.activeElement;
        var closeBtn = modal.querySelector('.contact-modal__close');
        if (closeBtn) closeBtn.focus();
      } else if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
        lastFocus = null;
      }
    }

    document.querySelectorAll('[data-contact-modal]').forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        setOpen(true);
      });
    });

    modal.querySelectorAll('[data-contact-modal-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        setOpen(false);
      }
    });

    if (dialog) {
      dialog.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    }
  }

  function init() {
    markActiveNav();
    fixSiteLinks();
    initMobileNav();
    initContactModal();
    initPageTransitions();
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
    NAV_IDS: NAV_IDS,
  };
})();
