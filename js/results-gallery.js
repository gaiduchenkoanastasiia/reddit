/**
 * Work results: hover zoom preview + fullscreen lightbox gallery.
 */
(function () {
  if (document.documentElement.getAttribute("data-page") !== "work") return;

  var ZOOM_SIZE = 600;
  var shots = Array.from(document.querySelectorAll("[data-result-shot]"));
  if (!shots.length) return;

  var zoomPreview = document.getElementById("result-zoom-preview");
  var zoomImg = zoomPreview && zoomPreview.querySelector("img");
  var lightbox = document.getElementById("result-lightbox");
  var lightboxImg = lightbox && lightbox.querySelector(".result-lightbox__img");
  var lightboxCounter =
    lightbox && lightbox.querySelector(".result-lightbox__counter");
  var prevBtn =
    lightbox && lightbox.querySelector("[data-result-lightbox-prev]");
  var nextBtn =
    lightbox && lightbox.querySelector("[data-result-lightbox-next]");

  if (!zoomPreview || !zoomImg || !lightbox || !lightboxImg) return;

  var hoverZoomEnabled = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  var activeShot = null;
  var gallery = [];
  var galleryIndex = 0;
  var lastFocus = null;

  function getGalleryForShot(shot) {
    var galleryEl = shot.closest(".result-block__gallery");
    if (!galleryEl) return [shot];
    return Array.from(galleryEl.querySelectorAll("[data-result-shot]"));
  }

  function getShotSrc(shot) {
    return (
      shot.getAttribute("data-src") ||
      shot.querySelector("img")?.getAttribute("src") ||
      ""
    );
  }

  function getShotLabel(shot) {
    return shot.getAttribute("aria-label") || "";
  }

  function hideZoom() {
    activeShot = null;
    zoomPreview.classList.remove("is-visible");
    zoomPreview.setAttribute("aria-hidden", "true");
  }

  function positionZoom(shot) {
    var rect = shot.getBoundingClientRect();
    var size = Math.min(
      ZOOM_SIZE,
      window.innerWidth - 32,
      window.innerHeight - 32,
    );
    var gap = 14;
    var left = rect.right + gap;
    var top = rect.top + (rect.height - size) / 2;

    if (left + size > window.innerWidth - 16) {
      left = rect.left - size - gap;
    }

    if (left < 16) {
      left = Math.max(16, (window.innerWidth - size) / 2);
      top = rect.bottom + gap;
    }

    top = Math.max(16, Math.min(top, window.innerHeight - size - 16));

    zoomPreview.style.width = size + "px";
    zoomPreview.style.height = size + "px";
    zoomPreview.style.left = left + "px";
    zoomPreview.style.top = top + "px";
  }

  function showZoom(shot) {
    var src = getShotSrc(shot);
    if (!src) return;

    activeShot = shot;
    zoomImg.src = src;
    zoomImg.alt = getShotLabel(shot);
    positionZoom(shot);
    zoomPreview.classList.add("is-visible");
    zoomPreview.setAttribute("aria-hidden", "false");
  }

  function updateLightboxNav() {
    var hasMany = gallery.length > 1;
    if (prevBtn) {
      prevBtn.disabled = !hasMany;
      prevBtn.style.visibility = hasMany ? "visible" : "hidden";
    }
    if (nextBtn) {
      nextBtn.disabled = !hasMany;
      nextBtn.style.visibility = hasMany ? "visible" : "hidden";
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = hasMany
        ? galleryIndex + 1 + " / " + gallery.length
        : "";
    }
  }

  function showLightboxImage(index) {
    if (!gallery.length) return;

    galleryIndex = (index + gallery.length) % gallery.length;
    var shot = gallery[galleryIndex];
    var src = getShotSrc(shot);

    lightboxImg.src = src;
    lightboxImg.alt = getShotLabel(shot);
    updateLightboxNav();
  }

  function setLightboxOpen(open) {
    lightbox.classList.toggle("is-open", open);
    lightbox.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("result-lightbox-open", open);

    if (open) {
      lastFocus = document.activeElement;
      hideZoom();
      var closeBtn = lightbox.querySelector(".result-lightbox__close");
      if (closeBtn) closeBtn.focus();
    } else if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
      lastFocus = null;
    }
  }

  function openLightbox(shot) {
    gallery = getGalleryForShot(shot);
    galleryIndex = Math.max(0, gallery.indexOf(shot));
    showLightboxImage(galleryIndex);
    setLightboxOpen(true);
  }

  shots.forEach(function (shot) {
    if (hoverZoomEnabled) {
      shot.addEventListener("mouseenter", function () {
        showZoom(shot);
      });

      shot.addEventListener("mouseleave", function () {
        if (activeShot === shot) hideZoom();
      });
    }

    shot.addEventListener("click", function () {
      openLightbox(shot);
    });
  });

  if (hoverZoomEnabled) {
    window.addEventListener("scroll", hideZoom, { passive: true });
    window.addEventListener("resize", function () {
      if (activeShot) positionZoom(activeShot);
    });
  }

  lightbox
    .querySelectorAll("[data-result-lightbox-close]")
    .forEach(function (el) {
      el.addEventListener("click", function () {
        setLightboxOpen(false);
      });
    });

  lightbox.addEventListener("click", function (event) {
    if (!lightbox.classList.contains("is-open")) return;

    if (
      event.target.closest(".result-lightbox__img") ||
      event.target.closest(".result-lightbox__nav") ||
      event.target.closest(".result-lightbox__close") ||
      event.target.closest(".result-lightbox__counter")
    ) {
      return;
    }

    setLightboxOpen(false);
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      showLightboxImage(galleryIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      showLightboxImage(galleryIndex + 1);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      setLightboxOpen(false);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showLightboxImage(galleryIndex - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showLightboxImage(galleryIndex + 1);
    }
  });
})();
