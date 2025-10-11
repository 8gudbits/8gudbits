// scripts/script.js

// #########################################
//  Particle background and parallax effect
// #########################################
(function () {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const parallaxElem = document.getElementById("parallax");

  let width, height;
  let particles = [];
  const isMobile = window.innerWidth < 480;
  const particleCount = isMobile ? 18 : 30;
  const maxDistance = 200;
  const mouse = { x: null, y: null };

  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    });
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener("mousemove", (e) => {
    if (!parallaxElem) return;
    let _w = window.innerWidth / 2;
    let _h = window.innerHeight / 2;
    let _mouseX = e.clientX;
    let _mouseY = e.clientY;
    let _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${
      50 - (_mouseY - _h) * 0.01
    }%`;
    let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${
      50 - (_mouseY - _h) * 0.02
    }%`;
    let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${
      50 - (_mouseY - _h) * 0.06
    }%`;
    let x = `${_depth3}, ${_depth2}, ${_depth1}`;
    parallaxElem.style.backgroundPosition = x;
  });

  function updateVisuals() {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection || !parallaxElem) return;

    const scrollY = window.scrollY;
    const fadeStart = heroSection.offsetHeight * 0.8;
    const fadeEnd = fadeStart + window.innerHeight;

    // Parallax opacity
    let parallaxOpacity = 0;
    if (scrollY >= fadeStart && scrollY <= fadeEnd) {
      parallaxOpacity = (scrollY - fadeStart) / (fadeEnd - fadeStart);
    } else if (scrollY > fadeEnd) {
      parallaxOpacity = 1;
    }
    parallaxElem.style.opacity = parallaxOpacity.toFixed(2);

    // Canvas fade-out
    let canvasOpacity = 1;
    const canvasFadeEnd = fadeStart + 200;
    if (scrollY >= fadeStart && scrollY <= canvasFadeEnd) {
      canvasOpacity = 1 - (scrollY - fadeStart) / (canvasFadeEnd - fadeStart);
    } else if (scrollY > canvasFadeEnd) {
      canvasOpacity = 0;
    }
    canvas.style.opacity = canvasOpacity.toFixed(2);
  }

  window.addEventListener("scroll", updateVisuals);
  window.addEventListener("resize", updateVisuals);

  function draw() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ccc";
      ctx.fill();
    });

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(200,200,200,${1 - dist / maxDistance})`;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255,255,255,${1 - dist / maxDistance})`;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();

// ###############
//  Custom cursor
// ###############
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const cursorFollower = document.getElementById("cursorFollower");

  // Hide cursor on mobile devices
  if (window.matchMedia("(pointer: coarse)").matches) {
    cursor.style.display = "none";
    cursorFollower.style.display = "none";
    return;
  }

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;
  let hasMoved = false;

  // Start with hidden cursor
  cursor.style.opacity = "0";
  cursorFollower.style.opacity = "0";

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Make cursor visible only on first movement
    if (!hasMoved) {
      hasMoved = true;
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "1";
    }

    // Position the main cursor
    cursor.style.left = `${mouseX - 10}px`;
    cursor.style.top = `${mouseY - 10}px`;
  });

  // Animate follower
  function animateFollower() {
    if (hasMoved) {
      followerX += (mouseX - followerX - 20) * 0.2;
      followerY += (mouseY - followerY - 20) * 0.2;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
    }

    requestAnimationFrame(animateFollower);
  }

  animateFollower();

  // Click effect
  document.addEventListener("mousedown", () => {
    cursor.classList.add("click");
    cursorFollower.classList.add("click");
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("click");
    cursorFollower.classList.remove("click");
  });

  // Hover effects
  const hoverElements = document.querySelectorAll(
    "a, button, .tech-item, .nav-btn, .mobile-nav-btn, .back-to-top"
  );

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      cursorFollower.classList.add("hover");
    });

    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      cursorFollower.classList.remove("hover");
    });
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    cursorFollower.style.opacity = "0";
    hasMoved = false; // Reset so it reappears on next movement
  });
}

// ##########################
//  Particle effect on click
// ##########################
function initParticleEffect() {
  document.addEventListener("click", (e) => {
    // Create 5-8 particles on each click
    const particleCount = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < particleCount; i++) {
      createParticle(e.clientX, e.clientY);
    }
  });

  function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    document.body.appendChild(particle);

    // Random size, color and animation
    const size = Math.floor(Math.random() * 10 + 5);
    const colorValue = Math.random();
    let color;

    if (colorValue < 0.33) {
      color = "#ff3b30";
    } else if (colorValue < 0.66) {
      color = "#ff6257";
    } else {
      color = "#d70015";
    }

    // Random direction and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 30;
    const duration = Math.random() * 1000 + 500;

    // Set initial styles
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.borderRadius = "50%";
    particle.style.boxShadow = `0 0 ${size / 2}px ${size / 3}px ${color}`;
    particle.style.left = `${x - size / 2}px`;
    particle.style.top = `${y - size / 2}px`;

    // Animate particle
    const animation = particle.animate(
      [
        {
          transform: `translate(0, 0) scale(1)`,
          opacity: 1,
        },
        {
          transform: `translate(${Math.cos(angle) * distance}px, ${
            Math.sin(angle) * distance
          }px) scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration: duration,
        easing: "cubic-bezier(0, 0.9, 0.57, 1)",
      }
    );

    // Remove particle after animation completes
    animation.onfinish = () => {
      particle.remove();
    };
  }
}

// ####################################
//  Handle scroll indicator visibility
// ####################################
function initScrollIndicator() {
  const scrollIndicator = document.getElementById("scrollIndicator");

  window.addEventListener("scroll", () => {
    // Hide scroll indicator when user starts scrolling
    if (window.pageYOffset > 50) {
      scrollIndicator.classList.add("hidden");
    } else {
      scrollIndicator.classList.remove("hidden");
    }
  });
}

function initMobileNavHaptics() {
  const isTouchDevice = navigator.maxTouchPoints > 0;

  if (!isTouchDevice) return; // Only apply on touch devices

  const navButtons = document.querySelectorAll(
    ".mobile-nav-btn, #mobileMenuBtn"
  );

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if ("vibrate" in navigator) {
        tapSound.currentTime = 0;
        tapSound.play();
        navigator.vibrate(95);
      }
    });
  });
}

function initTiltEffect() {
  const glassPanels = document.querySelectorAll(".glass-panel");

  glassPanels.forEach((panel) => {
    // Store original transition in dataset
    panel.dataset.originalTransition =
      panel.style.transition || "transform 0.3s ease, box-shadow 0.3s ease";

    let isFirstInteraction = true;

    panel.addEventListener("mousemove", (e) => {
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const maxTilt = 5;
      const tiltX = (percentY * -maxTilt).toFixed(2);
      const tiltY = (percentX * maxTilt).toFixed(2);

      if (isFirstInteraction) {
        panel.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
        isFirstInteraction = false;

        // Remove transition after the initial animation completes
        setTimeout(() => {
          panel.style.transition = "none";
        }, 300);
      }

      panel.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;

      const shadowX = tiltY * 2;
      const shadowY = tiltX * 2;
      panel.style.boxShadow = `
        ${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.4),
        var(--glass-shadow)
      `;
    });

    panel.addEventListener("mouseleave", () => {
      isFirstInteraction = true; // Reset for next interaction

      panel.style.transition =
        "transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.5s ease";

      panel.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
      panel.style.boxShadow = "var(--glass-shadow)";

      // Restore original transition after animation completes
      setTimeout(() => {
        panel.style.transition = panel.dataset.originalTransition;
      }, 500);
    });

    panel.addEventListener("mouseenter", () => {
      panel.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";
    });
  });
}

// =========================
// =========================
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section");
  const navButtons = document.querySelectorAll(".nav-btn");
  const mobileNavButtons = document.querySelectorAll(".mobile-nav-btn");
  const navContainer = document.getElementById("navContainer");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = mobileMenuBtn.querySelector("i");
  const backToTop = document.getElementById("backToTop");
  const scrollProgress = document.getElementById("scrollProgress");
  const tapSound = document.getElementById("tapSound");

  tapSound.volume = 0.45; // Set volume to 45%

  initCustomCursor(); // Initialize custom cursor effects
  initParticleEffect(); // Initialize particle effects on click
  initScrollIndicator(); // Initialize scroll indicator
  initMobileNavHaptics(); // Initialize mobile nav haptics
  initTiltEffect(); // Initialize tilt effect

  // Initialize scroll progress indicator
  function initScrollProgress() {
    window.addEventListener("scroll", () => {
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = scrolled + "%";
    });
  }

  // Initialize back to top button
  function initBackToTop() {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", () => {
      const isTouchDevice = navigator.maxTouchPoints > 0;

      if (isTouchDevice && "vibrate" in navigator) {
        tapSound.currentTime = 0;
        tapSound.play();
        navigator.vibrate(95);
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Handle scroll animation for navigation - smooth proportional animation
  function handleNavScroll() {
    const scrollY = window.scrollY;
    const navSelector = document.querySelector(".section-selector");

    // Calculate progress (0 to 1) based on scroll position
    const progress = Math.min(scrollY / 200, 1);

    // Apply transformations based on scroll progress
    if (progress > 0) {
      navContainer.classList.add("scrolled");

      // Apply proportional transformations
      const scale = 0.95 + 0.05 * (1 - progress);
      const borderRadius = 50 * progress;
      const marginTop = 20 * progress;

      navSelector.style.borderRadius = `${borderRadius}px`;
      navSelector.style.marginTop = `${marginTop}px`;
      navSelector.style.transform = `scale(${scale})`;

      // Adjust width proportionally
      const widthPercent = 100 - 40 * progress;
      navSelector.style.width = `${widthPercent}%`;

      // Adjust gap between icons
      const gap = 1.5 - 0.75 * progress;
      navSelector.style.gap = `${gap}rem`;
    } else {
      navContainer.classList.remove("scrolled");
      // Reset styles when at top
      navSelector.style.borderRadius = "0";
      navSelector.style.marginTop = "0";
      navSelector.style.transform = "scale(1)";
      navSelector.style.width = "100%";
      navSelector.style.gap = "1.5rem";
    }
  }

  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("open");
    if (mobileMenu.classList.contains("open")) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-times");
      mobileMenuBtn.setAttribute("aria-expanded", "true");
    } else {
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(event.target) &&
      !mobileMenuBtn.contains(event.target)
    ) {
      mobileMenu.classList.remove("open");
      menuIcon.classList.remove("fa-times");
      menuIcon.classList.add("fa-bars");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Smooth scroll to section
  function scrollToSection(targetId) {
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // Close mobile menu if open
      if (mobileMenu.classList.contains("open")) {
        mobileMenu.classList.remove("open");
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
      }

      // Smooth scroll to section
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Add event listeners to desktop nav buttons
  navButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      scrollToSection(targetId);
    });

    // Add keyboard accessibility
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const targetId = this.getAttribute("data-target");
        scrollToSection(targetId);
      }
    });
  });

  // Add event listeners to mobile nav buttons
  mobileNavButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      scrollToSection(targetId);
    });

    // Add keyboard accessibility
    button.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const targetId = this.getAttribute("data-target");
        scrollToSection(targetId);
      }
    });
  });

  // Update active navigation button based on scroll position
  function updateActiveNav() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        currentSection = section.getAttribute("id");
      }
    });

    // Update desktop nav
    navButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-target") === currentSection) {
        button.classList.add("active");
      }
    });

    // Update mobile nav
    mobileNavButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.getAttribute("data-target") === currentSection) {
        button.classList.add("active");
      }
    });
  }

  // Animate elements based on scroll position
  function animateOnScroll() {
    // Only keep the navigation update
    updateActiveNav();
  }

  // Initialize and set up scroll listener
  initScrollProgress();
  initBackToTop();
  handleNavScroll();
  animateOnScroll();

  // Use requestAnimationFrame for smoother scroll handling
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        handleNavScroll();
        animateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
});

