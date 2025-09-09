// Cheeky console message
console.log(
  "%cYou're peeking under the hood.. I like you. 🔍👀",
  "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 4px 8px; border-radius: 4px;"
);

// Custom cursor
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
    "a, button, .project-card, .tech-item, .nav-btn, .mobile-nav-btn, .back-to-top"
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

// Particle effect on click
function initParticleEffect() {
  document.addEventListener("click", (e) => {
    // Don't create particles on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

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
      color = "#ff3b30"; // red
    } else if (colorValue < 0.66) {
      color = "#ff6257"; // light red
    } else {
      color = "#d70015"; // dark red
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

// Handle scroll indicator visibility
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

document.addEventListener("DOMContentLoaded", function () {
  // Initialize custom cursor effects
  initCustomCursor();
  initParticleEffect();
  initScrollIndicator();

  const sections = document.querySelectorAll("section");
  const timelineItems = document.querySelectorAll(".timeline-item");
  const techItems = document.querySelectorAll(".tech-item");
  const aboutPanel = document.querySelector(".about");
  const disclaimerPanel = document.querySelector(".disclaimer");
  const footer = document.querySelector("footer");
  const projectCards = document.querySelectorAll(".project-card");
  const navButtons = document.querySelectorAll(".nav-btn");
  const mobileNavButtons = document.querySelectorAll(".mobile-nav-btn");
  const navContainer = document.getElementById("navContainer");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIcon = mobileMenuBtn.querySelector("i");
  const backToTop = document.getElementById("backToTop");
  const scrollProgress = document.getElementById("scrollProgress");
  const lastTimelineItem = document.getElementById("last-timeline-item");

  // Track which elements are currently visible
  const elementVisibility = new Map();

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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Initialize visibility tracking
  function initVisibilityTracking() {
    // Sections
    sections.forEach((section) => {
      elementVisibility.set(section, false);
    });

    // Timeline items
    timelineItems.forEach((item) => {
      elementVisibility.set(item, false);
    });

    // Tech items
    techItems.forEach((item) => {
      elementVisibility.set(item, false);
    });

    // Project cards
    projectCards.forEach((card) => {
      elementVisibility.set(card, false);
    });

    // Other individual elements
    if (aboutPanel) elementVisibility.set(aboutPanel, false);
    if (disclaimerPanel) elementVisibility.set(disclaimerPanel, false);
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

  // Check if element is in viewport with custom offset
  function isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) *
          offset &&
      rect.bottom >= 0 &&
      rect.left <=
        (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
  }

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
    // Animate sections
    sections.forEach((section) => {
      const isVisible = isInViewport(section, 0.85);
      const wasVisible = elementVisibility.get(section);

      if (isVisible !== wasVisible) {
        elementVisibility.set(section, isVisible);
        if (isVisible) {
          section.classList.add("visible");
        } else {
          section.classList.remove("visible");
        }
      }
    });

    // Animate project cards with staggered delay
    projectCards.forEach((card, index) => {
      const isVisible = isInViewport(card, 0.85);
      const wasVisible = elementVisibility.get(card);

      if (isVisible !== wasVisible) {
        elementVisibility.set(card, isVisible);
        if (isVisible) {
          setTimeout(() => {
            card.classList.add("visible");
          }, index * 100); // Staggered animation
        } else {
          card.classList.remove("visible");
        }
      }
    });

    // Animate timeline items with earlier trigger
    timelineItems.forEach((item) => {
      const isVisible = isInViewport(item, 0.7);
      const wasVisible = elementVisibility.get(item);

      if (isVisible !== wasVisible) {
        elementVisibility.set(item, isVisible);
        if (isVisible) {
          item.classList.add("visible");

          // If this is the last timeline item, show the footer too
          if (item.id === "last-timeline-item") {
            footer.classList.add("visible");
          }
        } else {
          item.classList.remove("visible");

          // If this is the last timeline item, hide the footer too
          if (item.id === "last-timeline-item") {
            footer.classList.remove("visible");
          }
        }
      }
    });

    // Animate tech items with staggered delay
    techItems.forEach((item, index) => {
      const isVisible = isInViewport(item, 0.85);
      const wasVisible = elementVisibility.get(item);

      if (isVisible !== wasVisible) {
        elementVisibility.set(item, isVisible);
        if (isVisible) {
          setTimeout(() => {
            item.classList.add("visible");
          }, index * 50); // Staggered animation
        } else {
          item.classList.remove("visible");
        }
      }
    });

    // Animate about panel
    if (aboutPanel) {
      const isVisible = isInViewport(aboutPanel, 0.85);
      const wasVisible = elementVisibility.get(aboutPanel);

      if (isVisible !== wasVisible) {
        elementVisibility.set(aboutPanel, isVisible);
        if (isVisible) {
          aboutPanel.classList.add("visible");
        } else {
          aboutPanel.classList.remove("visible");
        }
      }
    }

    // Animate disclaimer panel
    if (disclaimerPanel) {
      const isVisible = isInViewport(disclaimerPanel, 0.85);
      const wasVisible = elementVisibility.get(disclaimerPanel);

      if (isVisible !== wasVisible) {
        elementVisibility.set(disclaimerPanel, isVisible);
        if (isVisible) {
          disclaimerPanel.classList.add("visible");
        } else {
          disclaimerPanel.classList.remove("visible");
        }
      }
    }

    updateActiveNav();
  }

  // Initialize and set up scroll listener
  initVisibilityTracking();
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

  // Add hover effects to project cards
  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const colors = [
        "rgba(255, 59, 48, 0.1)",
        "rgba(255, 98, 87, 0.1)",
        "rgba(215, 0, 21, 0.1)",
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      card.style.background = randomColor;
    });

    card.addEventListener("mouseleave", () => {
      card.style.background = "rgba(255, 255, 255, 0.05)";
    });
  });
});

