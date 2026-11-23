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


// --------------------------------------------------------------------------
// Supabase connection (the URL and key live in supabase-config.js)
// --------------------------------------------------------------------------
const isConfigured = typeof SUPABASE_KEY === "string" && !SUPABASE_KEY.startsWith("PASTE");
const db = isConfigured && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Show a message under a form (isError = red text)
function showMessage(element, text, isError) {
  element.textContent = text;
  element.classList.toggle("is-error", Boolean(isError));
  element.classList.add("show");
}

// Used when the keys have not been added yet
const NOT_CONNECTED = "Sign-in is not connected yet. Add the Supabase key in supabase-config.js.";


// --------------------------------------------------------------------------
// Register
// --------------------------------------------------------------------------
document.getElementById("form-register").addEventListener("submit", async event => {
  event.preventDefault();
  const message = event.target.querySelector(".form-message");
  if (!db) return showMessage(message, NOT_CONNECTED, true);

  const { data, error } = await db.auth.signUp({
    email: document.getElementById("register-email").value,
    password: document.getElementById("register-password").value,
    options: {
      data: { full_name: document.getElementById("register-name").value },
      emailRedirectTo: window.location.origin + window.location.pathname,
    },
  });

  if (error) return showMessage(message, error.message, true);
  if (data.session) {
    window.location.href = "profile.html";
    return;
  }
  showMessage(message, "Account created. Check your email to confirm it, then sign in.");
});


// --------------------------------------------------------------------------
// Sign in
// --------------------------------------------------------------------------
document.getElementById("form-signin").addEventListener("submit", async event => {
  event.preventDefault();
  const message = event.target.querySelector(".form-message");
  if (!db) return showMessage(message, NOT_CONNECTED, true);

  const { error } = await db.auth.signInWithPassword({
    email: document.getElementById("signin-email").value,
    password: document.getElementById("signin-password").value,
  });

  if (error) return showMessage(message, error.message, true);
  window.location.href = "profile.html";
});


// --------------------------------------------------------------------------
// Google
// --------------------------------------------------------------------------
document.querySelectorAll(".social-button").forEach(button => {
  button.addEventListener("click", async () => {
    if (!db) return showMessage(socialMessage, NOT_CONNECTED, true);

    const { error } = await db.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (error) showMessage(socialMessage, error.message, true);
  });
});


// --------------------------------------------------------------------------
// Signed in? Go to the member profile page.
// (Also runs when someone returns here from the confirmation email or from Google.)
// --------------------------------------------------------------------------
async function showSession() {
  if (!db) return;
  const { data } = await db.auth.getSession();
  if (data.session) window.location.href = "profile.html";
}


// Pick the starting mode from the address: ?mode=register (or #register)
const params = new URLSearchParams(window.location.search);
const startMode = params.get("mode") || window.location.hash.replace("#", "");
setMode(startMode);
showSession();
