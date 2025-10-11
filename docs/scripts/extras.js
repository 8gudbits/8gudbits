// scripts/extras.js

// ##################
//  Console messages
// ##################
console.log(
  "%cPeeking under the hood huh..👀 Noman likes you.",
  "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 4px 8px; border-radius: 4px;"
);

let devToolsTimer;

function checkDevTools() {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  if (widthThreshold || heightThreshold) {
    if (!devToolsTimer) {
      devToolsTimer = setTimeout(() => {
        console.log(
          "%cAnother presence has joined you. They're quiet... for now.",
          "font-size: 18px; font-weight: bold; color: #ff3b30; background: #222; padding: 8px 12px; border-radius: 6px;"
        );
      }, 15000);
    }
  } else {
    clearTimeout(devToolsTimer);
    devToolsTimer = null;
  }
}

setInterval(checkDevTools, 1000);

// #####################
//  GitHub link tooltip
// #####################
let hoverTimer;

document
  .querySelector(".github-link")
  .addEventListener("mouseenter", function () {
    hoverTimer = setTimeout(() => {
      this.classList.add("show-tooltip");
    }, 2000);
  });

document
  .querySelector(".github-link")
  .addEventListener("mouseleave", function () {
    clearTimeout(hoverTimer);
    this.classList.remove("show-tooltip");
  });

// ############################
//  Title change on tab switch
// ############################
let originalTitle = document.title;

document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    document.title = "Oye, come back...";
  } else {
    document.title = originalTitle;
  }
});

// ####################
//  Hero section toast
// ####################
let heroTimer;
let toast = null;

function checkHeroSection() {
  const heroSection = document.querySelector(".hero-section");
  const scrollY = window.scrollY;
  const heroHeight = heroSection.offsetHeight;

  if (scrollY < heroHeight * 0.8) {
    if (!heroTimer && !toast) {
      heroTimer = setTimeout(() => {
        showToast();
      }, 15000);
    }
  } else {
    clearTimeout(heroTimer);
    heroTimer = null;
  }
}

function showToast() {
  toast = document.createElement("div");
  toast.className = "hero-toast";
  toast.textContent =
    "You have been staring at this part of the page for way too long. Come on, scroll now... :))";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
}

function hideToast() {
  if (toast && document.body.contains(toast)) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast && document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
      toast = null;
    }, 500);
  } else {
    toast = null;
  }
}

window.addEventListener("scroll", function () {
  if (toast && document.body.contains(toast)) {
    hideToast();
  }
  clearTimeout(heroTimer);
  heroTimer = null;
});

checkHeroSection();

// #####################
//  About section toast
// #####################
let aboutTimer;
let aboutToastShown = false;

function checkAboutSection() {
  if (aboutToastShown) return;

  const aboutSection = document.querySelector("#about");
  const aboutRect = aboutSection.getBoundingClientRect();

  if (
    aboutRect.top < window.innerHeight * 0.8 &&
    aboutRect.bottom > window.innerHeight * 0.2
  ) {
    if (!aboutTimer) {
      aboutTimer = setTimeout(() => {
        showAboutToast();
      }, 10000);
    }
  } else {
    clearTimeout(aboutTimer);
    aboutTimer = null;
  }
}

function showAboutToast() {
  aboutToastShown = true;
  const toast = document.createElement("div");
  toast.className = "about-toast";
  toast.textContent =
    "Hmmm, you are really into reading about me, isn't it? Keep reading... I like you. :))";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  function hideOnScroll() {
    toast.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 500);
    window.removeEventListener("scroll", hideOnScroll);
  }

  window.addEventListener("scroll", hideOnScroll);
}

window.addEventListener("scroll", checkAboutSection);
checkAboutSection();

// ##########################
//  Speed toast notification
// ##########################
let lastScrollTop = 0;
let lastScrollTime = Date.now();
let fastScrollDistance = 0;

function checkScrollSpeed() {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;
  const currentTime = Date.now();
  const timeDiff = currentTime - lastScrollTime;

  if (timeDiff > 0) {
    const scrollDistance = currentScrollTop - lastScrollTop;
    const scrollSpeed = Math.abs(scrollDistance) / timeDiff;

    // Only track when scrolling down
    if (scrollDistance > 0 && scrollSpeed > 1) {
      fastScrollDistance += scrollDistance;

      if (fastScrollDistance > 700) {
        showSpeedToast();
        fastScrollDistance = 0;
      }
    } else {
      fastScrollDistance = Math.max(0, fastScrollDistance - 100);
    }
  }

  lastScrollTop = currentScrollTop;
  lastScrollTime = currentTime;
}

function showSpeedToast() {
  const toast = document.createElement("div");
  toast.className = "speed-toast";
  toast.textContent = "Whoa there, speed demon. You missed some good stuff...";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

window.addEventListener("scroll", checkScrollSpeed);

// ######################
//  Sleep mode animation
// ######################
let sleepTimer;
let blankTimer;
let heartbeatTimer;
let overlay = null;

function initSleepMode() {
  overlay = document.createElement("div");
  overlay.className = "sleep-overlay";

  // Create heartbeat monitor HTML
  overlay.innerHTML = `
        <div class="heart-rate">
            <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="300px"
                height="146px"
                viewBox="0 0 150 73"
            >
                <polyline
                    fill="none"
                    stroke="#ff3b30"
                    stroke-width="3"
                    stroke-miterlimit="10"
                    points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
                />
            </svg>
            <div class="fade-in"></div>
            <div class="fade-out"></div>
        </div>
    `;

  document.body.appendChild(overlay);
  resetSleepTimers();

  // Reset timers on any interaction
  document.addEventListener("mousemove", wakePage);
  document.addEventListener("keydown", wakePage);
  document.addEventListener("click", wakePage);
  document.addEventListener("scroll", wakePage);
  document.addEventListener("touchstart", wakePage);
}

function resetSleepTimers() {
  clearTimeout(sleepTimer);
  clearTimeout(blankTimer);
  clearTimeout(heartbeatTimer);

  sleepTimer = setTimeout(() => {
    startSleepAnimation();
  }, 50000); // 50 seconds until sleep starts
}

function startSleepAnimation() {
  overlay.classList.add("blur");

  blankTimer = setTimeout(() => {
    overlay.classList.remove("blur");
    overlay.classList.add("blank");

    // Show heartbeat after blank screen
    heartbeatTimer = setTimeout(() => {
      overlay.classList.add("show-heartbeat");
    }, 5000); // 5 seconds after going blank
  }, 5000); // 5 seconds of blur
}

function wakePage() {
  // Remove all sleep-related classes
  overlay.classList.remove("blur", "blank", "show-heartbeat");
  overlay.classList.add("waking");

  setTimeout(() => {
    overlay.classList.remove("waking");
  }, 300);

  resetSleepTimers();
}

document.addEventListener("DOMContentLoaded", initSleepMode);

// Keep screen on for 1.5 minutes of inactivity
let wakeLock = null;
let idleTimer = null;
const idleTime = 90000;

function startIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }

  idleTimer = setTimeout(keepScreenOn, idleTime);
}

async function keepScreenOn() {
  if (!/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)) return;

  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch (err) {
    const video = document.createElement("video");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.style.display = "none";
    document.body.appendChild(video);
    video.play();
  }
}

const events = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];
events.forEach((event) => {
  document.addEventListener(event, startIdleTimer);
});

startIdleTimer();

