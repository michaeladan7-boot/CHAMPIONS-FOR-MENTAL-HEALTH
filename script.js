// ==========================================================================
// Champions for Mental Health — script.js
//
// 1. Mobile navigation (hamburger menu)
// 2. Demo form messages (front-end only, no data is sent anywhere)
// 3. Footer year
// 4. Programmes slider on the homepage
// ==========================================================================


// --------------------------------------------------------------------------
// 1. Mobile navigation
// --------------------------------------------------------------------------
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", false);
    });
  });
}


// --------------------------------------------------------------------------
// 2. Forms
//    .netlify-form  Contact and volunteer forms. On the live Netlify site they send
//                   a real submission. On your own computer (localhost or a file)
//                   they only show the message, so nothing is sent while testing.
//    .demo-form     Other forms that still only show the thank-you message.
// --------------------------------------------------------------------------
const isLiveSite = ["http:", "https:"].includes(location.protocol)
  && !["localhost", "127.0.0.1"].includes(location.hostname);

document.querySelectorAll(".netlify-form").forEach(form => {
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    message.classList.remove("is-error");

    if (isLiveSite) {
      try {
        const response = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!response.ok) throw new Error("Form not sent");
      } catch (error) {
        message.textContent = "Sorry, your message could not be sent. Please try again or email us.";
        message.classList.add("is-error", "show");
        return;
      }
    }

    message.classList.add("show");
    form.reset();
  });
});

document.querySelectorAll(".demo-form").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    if (message) message.classList.add("show");
  });
});


// --------------------------------------------------------------------------
// 3. Footer year
// --------------------------------------------------------------------------
document.querySelectorAll(".year").forEach(item => {
  item.textContent = new Date().getFullYear();
});


// --------------------------------------------------------------------------
// 4. Programmes slider (homepage)
//    The four .programme-slide divs sit side by side inside .programme-track.
//    Every SLIDE_DELAY milliseconds the track slides one step to the left.
// --------------------------------------------------------------------------
const SLIDE_DELAY = 4000; // time between slides, in milliseconds (4000 = 4 seconds)

const slider = document.querySelector(".programme-slider");

if (slider) {
  const track = slider.querySelector(".programme-track");
  const slides = slider.querySelectorAll(".programme-slide");
  const dotsBox = document.querySelector(".programme-dots");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;
  let timer = null;
  const dots = [];

  // Show one slide: move the track and update the dots
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = "translateX(-" + current * 100 + "%)";

    slides.forEach((slide, i) => {
      slide.inert = i !== current; // keeps hidden slides out of keyboard reach
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === current);
      dot.setAttribute("aria-current", i === current);
    });
  }

  // Start / stop the automatic sliding
  function startAutoplay() {
    if (reduceMotion || timer) return; // respect "reduce motion" settings
    timer = setInterval(() => showSlide(current + 1), SLIDE_DELAY);
  }

  function stopAutoplay() {
    clearInterval(timer);
    timer = null;
  }

  // Build one dot per slide
  slides.forEach((slide, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "programme-dot";
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", () => {
      showSlide(i);
      stopAutoplay();
      startAutoplay(); // restart the timer so the slide is not skipped straight away
    });
    dotsBox.appendChild(dot);
    dots.push(dot);
  });

  // Pause while the visitor hovers over or focuses the slider
  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);
  slider.addEventListener("focusin", stopAutoplay);
  slider.addEventListener("focusout", startAutoplay);

  // Swipe left / right on touch screens
  let touchStartX = 0;
  slider.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", event => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showSlide(current + (distance < 0 ? 1 : -1));
  });

  showSlide(0);
  startAutoplay();
}


// --------------------------------------------------------------------------
// 4. Signed-in members: "Join" turns into "My profile"
// Supabase keeps the login in localStorage under a key like sb-xxxx-auth-token.
// If one is found, replace the Join / Create account links with My profile.
// --------------------------------------------------------------------------
function isSignedIn() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!/^sb-.+-auth-token$/.test(key)) continue;
      const login = JSON.parse(localStorage.getItem(key));
      if (login && login.access_token) return true;
    }
  } catch (error) {
    // Storage can be blocked (private mode, file://). Treat as signed out.
  }
  return false;
}

if (isSignedIn()) {
  // Header button
  document.querySelectorAll(".nav-join").forEach(link => {
    link.textContent = "My profile";
    link.href = "profile.html";
  });

  // Other "Join us" / "Create an account" links are no longer needed
  document.querySelectorAll('a[href*="mode=register"]:not(.nav-join)').forEach(link => {
    link.hidden = true;
  });

  // "Member login" becomes "My profile"
  document.querySelectorAll('a[href*="mode=signin"]').forEach(link => {
    link.textContent = "My profile";
    link.href = "profile.html";
  });
}
