/**
 * Services toolkit — direction tabs, pricing cards, detail modals.
 */
(function () {
  var VALID_SERVICES = [
    'strategy',
    'content',
    'discussions',
    'subreddit',
    'reputation',
    'turnkey',
  ];

  var activeServiceId = 'strategy';

  var SERVICE_CATALOG = {
    strategy: {
      layout: 'single',
      titleKey: 'serviceStrategyTitle',
      descKey: 'serviceStrategyDesc',
      modalKey: 'strategy',
      packages: [
        {
          id: 'strategy-default',
          nameKey: 'serviceStrategyTitle',
          priceKey: 'serviceStrategyPrice',
          descKey: 'serviceStrategyDesc',
          featuresKey: 'serviceStrategyFeatures',
          modalKey: 'strategy',
        },
      ],
    },
    content: {
      layout: 'packages',
      titleKey: 'serviceContentTitle',
      descKey: 'serviceContentDesc',
      packages: [
        {
          id: 'content-starter',
          nameKey: 'pkgContentStarterName',
          priceKey: 'pkgContentStarterPrice',
          descKey: 'pkgContentStarterDesc',
          featuresKey: 'pkgContentStarterFeatures',
          modalKey: 'content-starter',
        },
        {
          id: 'content-growth',
          nameKey: 'pkgContentGrowthName',
          priceKey: 'pkgContentGrowthPrice',
          descKey: 'pkgContentGrowthDesc',
          featuresKey: 'pkgContentGrowthFeatures',
          modalKey: 'content-growth',
        },
        {
          id: 'content-boost',
          nameKey: 'pkgContentBoostName',
          priceKey: 'pkgContentBoostPrice',
          descKey: 'pkgContentBoostDesc',
          featuresKey: 'pkgContentBoostFeatures',
          modalKey: 'content-boost',
        },
      ],
    },
    discussions: {
      layout: 'single',
      titleKey: 'serviceDiscussionsTitle',
      descKey: 'serviceDiscussionsDesc',
      packages: [
        {
          id: 'discussions-default',
          nameKey: 'serviceDiscussionsTitle',
          priceKey: 'serviceDiscussionsPrice',
          descKey: 'serviceDiscussionsDesc',
          featuresKey: 'serviceDiscussionsFeatures',
          modalKey: 'discussions',
        },
      ],
    },
    subreddit: {
      layout: 'single',
      titleKey: 'serviceSubredditTitle',
      descKey: 'serviceSubredditDesc',
      packages: [
        {
          id: 'subreddit-default',
          nameKey: 'serviceSubredditTitle',
          priceKey: 'serviceSubredditPrice',
          descKey: 'serviceSubredditDesc',
          featuresKey: 'serviceSubredditFeatures',
          modalKey: 'subreddit',
        },
      ],
    },
    reputation: {
      layout: 'single',
      titleKey: 'serviceReputationTitle',
      descKey: 'serviceReputationDesc',
      packages: [
        {
          id: 'reputation-default',
          nameKey: 'serviceReputationTitle',
          priceKey: 'serviceReputationPrice',
          descKey: 'serviceReputationDesc',
          featuresKey: 'serviceReputationFeatures',
          modalKey: 'reputation',
        },
      ],
    },
    turnkey: {
      layout: 'packages',
      titleKey: 'serviceTurnkeyTitle',
      descKey: 'serviceTurnkeyDesc',
      packagesClass: 'services-toolkit__packages--duo',
      packages: [
        {
          id: 'turnkey-growth',
          nameKey: 'pkgTurnkeyGrowthName',
          priceKey: 'pkgTurnkeyGrowthPrice',
          descKey: 'pkgTurnkeyGrowthDesc',
          featuresKey: 'pkgTurnkeyGrowthFeatures',
          modalKey: 'turnkey-growth',
        },
        {
          id: 'turnkey-growth-subreddit',
          nameKey: 'pkgTurnkeyGrowthSubName',
          priceKey: 'pkgTurnkeyGrowthSubPrice',
          descKey: 'pkgTurnkeyGrowthSubDesc',
          featuresKey: 'pkgTurnkeyGrowthSubFeatures',
          modalKey: 'turnkey-growth-subreddit',
          featured: true,
        },
      ],
    },
  };

  var SERVICE_MODAL_CONFIG = {
    strategy: { prefix: 'm1', priceKey: 'serviceStrategyPrice', outcomeType: 'text' },
    discussions: { prefix: 'm3', priceKey: 'serviceDiscussionsPrice', outcomeType: 'list' },
    subreddit: { prefix: 'm4', priceKey: 'serviceSubredditPrice', outcomeType: 'list' },
    reputation: {
      prefix: 'smReputation',
      priceKey: 'serviceReputationPrice',
      outcomeType: 'list',
    },
  };

  var PACKAGE_MODAL_CONFIG = {
    'content-starter': {
      nameKey: 'pkgContentStarterName',
      priceKey: 'pkgContentStarterPrice',
      descKey: 'pkgContentStarterDesc',
      featuresKey: 'pkgContentStarterFeatures',
      directionPrefix: 'm2',
      directionTitleKey: 'serviceContentTitle',
    },
    'content-growth': {
      nameKey: 'pkgContentGrowthName',
      priceKey: 'pkgContentGrowthPrice',
      descKey: 'pkgContentGrowthDesc',
      featuresKey: 'pkgContentGrowthFeatures',
      directionPrefix: 'm2',
      directionTitleKey: 'serviceContentTitle',
    },
    'content-boost': {
      nameKey: 'pkgContentBoostName',
      priceKey: 'pkgContentBoostPrice',
      descKey: 'pkgContentBoostDesc',
      featuresKey: 'pkgContentBoostFeatures',
      directionPrefix: 'm2',
      directionTitleKey: 'serviceContentTitle',
    },
    'turnkey-growth': {
      nameKey: 'pkgTurnkeyGrowthName',
      priceKey: 'pkgTurnkeyGrowthPrice',
      descKey: 'pkgTurnkeyGrowthDesc',
      featuresKey: 'pkgTurnkeyGrowthFeatures',
      directionPrefix: 'smTurnkeyGrowth',
      directionTitleKey: 'serviceTurnkeyTitle',
    },
    'turnkey-growth-subreddit': {
      nameKey: 'pkgTurnkeyGrowthSubName',
      priceKey: 'pkgTurnkeyGrowthSubPrice',
      descKey: 'pkgTurnkeyGrowthSubDesc',
      featuresKey: 'pkgTurnkeyGrowthSubFeatures',
      directionPrefix: 'smTurnkeyGrowthSub',
      directionTitleKey: 'serviceTurnkeyTitle',
    },
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTranslations() {
    var lang =
      window.RedditI18n && window.RedditI18n.getLang
        ? window.RedditI18n.getLang()
        : 'ua';
    return (window.REDDIT_TRANSLATIONS && window.REDDIT_TRANSLATIONS[lang]) || {};
  }

  function getServiceFromHash() {
    var hash = window.location.hash.replace(/^#/, '');
    return VALID_SERVICES.indexOf(hash) !== -1 ? hash : 'strategy';
  }

  function renderFeatureList(items) {
    if (!Array.isArray(items) || !items.length) return '';
    return (
      '<ul class="service-package-card__features">' +
      items
        .map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        })
        .join('') +
      '</ul>'
    );
  }

  function renderPackageCard(pkg, t, isSingle) {
    var name = t[pkg.nameKey] || '';
    var price = t[pkg.priceKey] || '';
    var desc = t[pkg.descKey] || '';
    var features = t[pkg.featuresKey];
    var includesLabel = t.servicesIncludesLabel || '';
    var ctaLabel = t.servicesCtaDetails || '';

    return (
      '<article class="service-package-card' +
      (isSingle ? ' service-package-card--solo' : '') +
      (pkg.featured ? ' service-package-card--featured' : '') +
      '">' +
      '<header class="service-package-card__head">' +
      (isSingle
        ? ''
        : '<h3 class="service-package-card__name">' + escapeHtml(name) + '</h3>') +
      '<p class="service-package-card__price">' +
      escapeHtml(price) +
      '</p>' +
      '</header>' +
      '<p class="service-package-card__desc">' +
      escapeHtml(desc) +
      '</p>' +
      '<p class="service-package-card__includes-label">' +
      escapeHtml(includesLabel) +
      '</p>' +
      renderFeatureList(features) +
      '<button type="button" class="btn btn-primary service-package-card__cta" data-package-modal="' +
      escapeHtml(pkg.modalKey) +
      '">' +
      escapeHtml(ctaLabel) +
      '</button>' +
      '</article>'
    );
  }

  function renderDetailPanel(serviceId) {
    var catalog = SERVICE_CATALOG[serviceId];
    var detail = document.getElementById('services-toolkit-detail');
    if (!catalog || !detail) return;

    var t = getTranslations();
    var title = t[catalog.titleKey] || '';
    var desc = t[catalog.descKey] || '';
    var isSingle = catalog.layout === 'single';
    var packages = catalog.packages || [];

    detail.setAttribute('aria-labelledby', 'tab-' + serviceId);

    detail.innerHTML =
      '<div class="services-toolkit__detail-view is-animating">' +
      '<header class="services-toolkit__detail-head">' +
      '<h2 class="services-toolkit__detail-title">' +
      escapeHtml(title) +
      '</h2>' +
      (desc
        ? '<p class="services-toolkit__detail-lead">' + escapeHtml(desc) + '</p>'
        : '') +
      '</header>' +
      '<div class="services-toolkit__packages' +
      (isSingle ? ' services-toolkit__packages--single' : '') +
      (catalog.packagesClass ? ' ' + catalog.packagesClass : '') +
      '">' +
      packages
        .map(function (pkg) {
          return renderPackageCard(pkg, t, isSingle);
        })
        .join('') +
      '</div>' +
      '</div>';
  }

  function renderList(items) {
    if (!Array.isArray(items) || !items.length) return '';
    return (
      '<ul class="service-list">' +
      items
        .map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        })
        .join('') +
      '</ul>'
    );
  }

  function renderOutcome(prefix, outcomeType, t) {
    var outcomeTitle = t[prefix + 'OutcomeTitle'] || t.serviceModalOutcomeTitle || '';

    if (outcomeType === 'text') {
      var outcomeText = t[prefix + 'OutcomeText'];
      if (!outcomeText) return '';
      return (
        '<div class="service-section">' +
        '<h3 class="service-section-title">' +
        escapeHtml(outcomeTitle) +
        '</h3>' +
        '<div class="service-outcome-killer">' +
        '<p class="service-outcome-killer-lead">' +
        escapeHtml(outcomeText) +
        '</p>' +
        '</div>' +
        '</div>'
      );
    }

    var outcomeItems = t[prefix + 'OutcomeList'];
    if (!Array.isArray(outcomeItems) || !outcomeItems.length) return '';

    return (
      '<div class="service-section">' +
      '<h3 class="service-section-title">' +
      escapeHtml(outcomeTitle) +
      '</h3>' +
      '<div class="service-outcome-killer">' +
      '<ul class="service-outcome-killer-list">' +
      outcomeItems
        .map(function (item) {
          return '<li>' + escapeHtml(item) + '</li>';
        })
        .join('') +
      '</ul>' +
      '</div>' +
      '</div>'
    );
  }

  function renderServiceModalContent(serviceId) {
    var config = SERVICE_MODAL_CONFIG[serviceId];
    if (!config) return '';

    var t = getTranslations();
    var prefix = config.prefix;
    var title = t[prefix + 'Title'] || '';
    var subtitle = t[prefix + 'Subtitle'] || '';
    var intro = t[prefix + 'Intro'] || '';
    var price = t[config.priceKey] || '';
    var whoTitle = t[prefix + 'WhoTitle'] || t.serviceModalWhoTitle || '';
    var whatTitle = t[prefix + 'WhatTitle'] || t.serviceModalWhatTitle || '';
    var whoList = t[prefix + 'WhoList'];
    var whatList = t[prefix + 'WhatList'];

    return (
      '<div class="service-header">' +
      '<div class="service-title-wrapper">' +
      '<h2 id="service-modal-title" class="service-title">' +
      escapeHtml(title) +
      '</h2>' +
      (subtitle
        ? '<p class="service-subtitle">' + escapeHtml(subtitle) + '</p>'
        : '') +
      '</div>' +
      '<div class="service-price-main">' +
      escapeHtml(price) +
      '</div>' +
      '</div>' +
      (intro ? '<p class="modal-intro">' + escapeHtml(intro) + '</p>' : '') +
      '<div class="service-content">' +
      '<div class="service-section">' +
      '<h3 class="service-section-title">' +
      escapeHtml(whoTitle) +
      '</h3>' +
      renderList(whoList) +
      '</div>' +
      '<div class="service-section">' +
      '<h3 class="service-section-title">' +
      escapeHtml(whatTitle) +
      '</h3>' +
      renderList(whatList) +
      '</div>' +
      renderOutcome(prefix, config.outcomeType, t) +
      '</div>'
    );
  }

  function renderPackageModalContent(packageKey) {
    var config = PACKAGE_MODAL_CONFIG[packageKey];
    if (!config) return '';

    var t = getTranslations();
    var name = t[config.nameKey] || '';
    var price = t[config.priceKey] || '';
    var desc = t[config.descKey] || '';
    var features = t[config.featuresKey];
    var whatTitle = t.serviceModalWhatTitle || '';
    var directionPrefix = config.directionPrefix;
    var extra = directionPrefix
      ? '<div class="service-content">' +
        '<div class="service-section">' +
        '<h3 class="service-section-title">' +
        escapeHtml(t[directionPrefix + 'WhoTitle'] || t.serviceModalWhoTitle || '') +
        '</h3>' +
        renderList(t[directionPrefix + 'WhoList']) +
        '</div>' +
        renderOutcome(directionPrefix, 'list', t) +
        '</div>'
      : '';

    return (
      '<div class="service-header">' +
      '<div class="service-title-wrapper">' +
      '<h2 id="service-modal-title" class="service-title">' +
      escapeHtml(name) +
      '</h2>' +
      '<p class="service-subtitle">' +
      escapeHtml(t[config.directionTitleKey || 'serviceContentTitle'] || '') +
      '</p>' +
      '</div>' +
      '<div class="service-price-main">' +
      escapeHtml(price) +
      '</div>' +
      '</div>' +
      '<p class="modal-intro">' +
      escapeHtml(desc) +
      '</p>' +
      '<div class="service-section">' +
      '<h3 class="service-section-title">' +
      escapeHtml(whatTitle) +
      '</h3>' +
      renderList(features) +
      '</div>' +
      extra
    );
  }

  function getModalElements() {
    return {
      modal: document.getElementById('service-detail-modal'),
      body: document.getElementById('service-modal-body'),
    };
  }

  function openModal(modalKey) {
    var elements = getModalElements();
    if (!elements.modal || !elements.body) return;

    var html = PACKAGE_MODAL_CONFIG[modalKey]
      ? renderPackageModalContent(modalKey)
      : renderServiceModalContent(modalKey);

    if (!html) return;

    elements.body.innerHTML = html;
    elements.body.scrollTop = 0;
    elements.modal.classList.add('is-open');
    elements.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    var closeBtn = elements.modal.querySelector('[data-modal-close]');
    if (closeBtn && getTranslations().modalClose) {
      closeBtn.setAttribute('aria-label', getTranslations().modalClose);
    }
  }

  function closeServiceModal() {
    var modal = document.getElementById('service-detail-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initServiceModal() {
    var toolkit = document.getElementById('services-toolkit');
    var elements = getModalElements();
    if (!toolkit || !elements.modal) return;

    toolkit.addEventListener('click', function (event) {
      var packageTrigger = event.target.closest('[data-package-modal]');
      if (packageTrigger) {
        openModal(packageTrigger.getAttribute('data-package-modal'));
        return;
      }
    });

    elements.modal.querySelectorAll('[data-modal-close]').forEach(function (btn) {
      btn.addEventListener('click', closeServiceModal);
    });

    var overlay = elements.modal.querySelector('[data-modal-overlay]');
    if (overlay) {
      overlay.addEventListener('click', closeServiceModal);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && elements.modal.classList.contains('is-open')) {
        closeServiceModal();
      }
    });
  }

  function setActiveService(serviceId) {
    activeServiceId = serviceId;

    var tabs = document.querySelectorAll('.services-toolkit__tab');

    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute('data-service') === serviceId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderDetailPanel(serviceId);

    if (window.location.hash !== '#' + serviceId) {
      history.replaceState(null, '', '#' + serviceId);
    }

    var activeTab = document.querySelector('.services-toolkit__tab.is-active');
    if (activeTab && window.matchMedia('(max-width: 768px)').matches) {
      activeTab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }

  function initServicesToolkit() {
    var toolkit = document.getElementById('services-toolkit');
    if (!toolkit) return;

    var tabs = toolkit.querySelectorAll('.services-toolkit__tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var serviceId = tab.getAttribute('data-service');
        if (serviceId) {
          setActiveService(serviceId);
        }
      });
    });

    window.addEventListener('hashchange', function () {
      setActiveService(getServiceFromHash());
    });

    setActiveService(getServiceFromHash());
    initServiceModal();
  }

  window.RedditServicesPage = {
    refresh: function () {
      renderDetailPanel(activeServiceId);
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesToolkit);
  } else {
    initServicesToolkit();
  }
})();
