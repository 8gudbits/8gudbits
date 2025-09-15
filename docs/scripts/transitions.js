// scripts/transitions.js

function initScrollDirectionalFade() {
  const elements = document.querySelectorAll(".scroll-fade");

  function updateScrollAnimations() {
    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();

      // Default scroll window
      let start = viewportHeight * 0.75;
      let end = viewportHeight * 0.55;

      // Special case for last item
      if (el.id === "last-item") {
        start = viewportHeight * 0.95;
        end = viewportHeight * 0.85;
      }

      const progress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, progress));

      el.style.opacity = clamped.toFixed(2);

      if (el.classList.contains("fade-up")) {
        el.style.transform = `translateY(${(1 - clamped) * 30}px)`;
      } else if (el.classList.contains("fade-down")) {
        el.style.transform = `translateY(${(clamped - 1) * 30}px)`;
      } else if (el.classList.contains("fade-left")) {
        el.style.transform = `translateX(${(1 - clamped) * 30}px)`;
      } else if (el.classList.contains("fade-right")) {
        el.style.transform = `translateX(${(clamped - 1) * 30}px)`;
      }
    });
  }

  window.addEventListener("scroll", updateScrollAnimations);
  window.addEventListener("resize", updateScrollAnimations);
  updateScrollAnimations();
}

function initScrollZoom() {
  const elements = document.querySelectorAll(".scroll-zoom");

  function updateZoomAnimations() {
    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const start = viewportHeight * 0.75;
      const end = viewportHeight * 0.55;

      const progress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, progress));

      const scale = 0.8 + clamped * 0.2;
      el.style.opacity = clamped.toFixed(2);
      el.style.transform = `scale(${scale.toFixed(3)})`;
    });
  }

  window.addEventListener("scroll", updateZoomAnimations);
  window.addEventListener("resize", updateZoomAnimations);
  updateZoomAnimations();
}

function initScrollBlur() {
  const elements = document.querySelectorAll(".scroll-blur");

  function updateBlurAnimations() {
    const viewportHeight = window.innerHeight;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const start = viewportHeight * 0.75;
      const end = viewportHeight * 0.55;

      const progress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, progress));

      const blur = 8 * (1 - clamped); // from 8px to 0px
      el.style.opacity = clamped.toFixed(2);
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
    });
  }

  window.addEventListener("scroll", updateBlurAnimations);
  window.addEventListener("resize", updateBlurAnimations);
  updateBlurAnimations();
}

function initScrollOrbit() {
  const items = document.querySelectorAll(".tech-item.scroll-orbit");

  function updateOrbitAnimations() {
    const viewportHeight = window.innerHeight;

    items.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const start = viewportHeight * 0.8;
      const end = viewportHeight * 0.6;

      const progress = (start - rect.top) / (start - end);
      const clamped = Math.max(0, Math.min(1, progress));

      // Orbit effect: rotate + translate + scale
      const rotate = -15 + clamped * 15; // -15deg to 0deg
      const translateX = 60 * (1 - clamped); // from 60px to 0
      const scale = 0.9 + clamped * 0.1; // from 0.9 to 1.0

      el.style.opacity = clamped.toFixed(2);
      el.style.transform = `rotate(${rotate.toFixed(
        1
      )}deg) translateX(${translateX.toFixed(1)}px) scale(${scale.toFixed(3)})`;
    });
  }

  window.addEventListener("scroll", updateOrbitAnimations);
  window.addEventListener("resize", updateOrbitAnimations);
  updateOrbitAnimations();
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollDirectionalFade();
  initScrollZoom();
  initScrollBlur();
  initScrollOrbit();
});

