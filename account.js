// ==========================================================================
// account.js — used only by account.html
//
// Switches the page between "Sign in" and "Register".
// Open the page in a given mode with:
//   account.html?mode=signin
//   account.html?mode=register
//
// (The demo form messages and the mobile menu are handled by script.js.)
// ==========================================================================

// Text that changes with the mode
const MODES = {
  signin: {
    panelTitle: "Welcome back",
    panelText: "Sign in to access your member account.",
    pageTitle: "Sign in | Champions for Mental Health",
    socialLabel: "Or sign in with",
  },
  register: {
    panelTitle: "Join our community",
    panelText: "Create an account to join the Champions for Mental Health community.",
    pageTitle: "Register | Champions for Mental Health",
    socialLabel: "Or sign up with",
  },
};

const panelTitle = document.getElementById("panel-title");
const panelText = document.getElementById("panel-text");
const socialLabel = document.getElementById("social-label");
const socialMessage = document.getElementById("social-message");
const forms = document.querySelectorAll(".account-form");
const tabs = document.querySelectorAll(".account-tab");
const switchLines = document.querySelectorAll(".account-switch");


// Show one mode ("signin" or "register")
function setMode(mode) {
  if (!MODES[mode]) mode = "signin";
  const text = MODES[mode];

  // Left panel and page title
  panelTitle.textContent = text.panelTitle;
  panelText.textContent = text.panelText;
  socialLabel.textContent = text.socialLabel;
  document.title = text.pageTitle;

  // Only the form for this mode is visible
  forms.forEach(form => {
    form.hidden = form.id !== "form-" + mode;
  });

  // Highlight the matching tab
  tabs.forEach(tab => {
    const isActive = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", isActive);
  });

  // "Don't have an account?" / "Already have an account?" line
  switchLines.forEach(line => {
    line.hidden = line.dataset.for !== mode;
  });

  // Clear any demo messages from the other mode
  document.querySelectorAll(".form-message").forEach(message => {
    message.classList.remove("show");
  });

  // Keep the address bar in step, so the page can be shared or refreshed
  try {
    history.replaceState(null, "", "?mode=" + mode);
  } catch (error) {
    // Some browsers block this when the file is opened from disk. Safe to ignore.
  }
}


// Every button with data-mode (tabs and the "Register" / "Sign in" links) switches the mode
document.querySelectorAll("[data-mode]").forEach(button => {
  button.addEventListener("click", () => setMode(button.dataset.mode));
});


// Google / Facebook: not connected yet, so say so instead of pretending
document.querySelectorAll(".social-button").forEach(button => {
  button.addEventListener("click", () => {
    socialMessage.textContent =
      "Front-end demonstration only. " +
      button.dataset.provider +
      " sign-in has not been connected.";
    socialMessage.classList.add("show");
  });
});


// Pick the starting mode from the address: ?mode=register (or #register)
const params = new URLSearchParams(window.location.search);
const startMode = params.get("mode") || window.location.hash.replace("#", "");
setMode(startMode);
