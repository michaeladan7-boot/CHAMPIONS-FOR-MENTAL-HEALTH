// ==========================================================================
// member.js — used only by profile.html
//
// 1. Checks that someone is signed in (otherwise sends them to the sign-in page)
// 2. Fills in the profile from their account
// 3. Saves a new name, changes the password, and signs out
//
// The Supabase address and key come from supabase-config.js.
// ==========================================================================

const isConfigured = typeof SUPABASE_KEY === "string" && !SUPABASE_KEY.startsWith("PASTE");
const db = isConfigured && window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const content = document.getElementById("member-content");
const status = document.getElementById("member-status");
const detailsForm = document.getElementById("member-details-form");
const passwordForm = document.getElementById("member-password-form");


// Show a message under a form (isError = red text)
function showMessage(form, text, isError) {
  const message = form.querySelector(".form-message");
  message.textContent = text;
  message.classList.toggle("is-error", Boolean(isError));
  message.classList.add("show");
}


// Put the person's details on the page
function fillProfile(user) {
  const name = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || "";
  const shownName = name || "Member";

  document.getElementById("member-avatar").textContent = shownName.charAt(0).toUpperCase();
  document.getElementById("member-name").textContent = shownName;
  document.getElementById("member-email").textContent = user.email;
  document.getElementById("member-email-field").value = user.email;
  document.getElementById("member-fullname").value = name;

  const joined = new Date(user.created_at).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  });
  document.getElementById("member-since").textContent = "Member since " + joined;
}


// Start: is anyone signed in?
async function start() {
  if (!db) {
    status.innerHTML =
      "<p>Sign-in is not connected yet. Add the Supabase key in supabase-config.js.</p>";
    return;
  }

  const { data } = await db.auth.getSession();
  if (!data.session) {
    status.innerHTML =
      '<p>Please sign in to see your profile.</p><p><a class="button" href="account.html?mode=signin">Sign in</a></p>';
    return;
  }

  fillProfile(data.session.user);
  status.hidden = true;
  content.hidden = false;
}


// Save a new name
detailsForm.addEventListener("submit", async event => {
  event.preventDefault();
  const fullName = document.getElementById("member-fullname").value.trim();

  const { data, error } = await db.auth.updateUser({ data: { full_name: fullName } });
  if (error) return showMessage(detailsForm, error.message, true);

  fillProfile(data.user);
  showMessage(detailsForm, "Your details have been saved.");
});


// Change password
passwordForm.addEventListener("submit", async event => {
  event.preventDefault();
  const password = document.getElementById("member-password").value;
  const confirm = document.getElementById("member-password-confirm").value;

  if (password !== confirm) return showMessage(passwordForm, "The two passwords do not match.", true);

  const { error } = await db.auth.updateUser({ password });
  if (error) return showMessage(passwordForm, error.message, true);

  passwordForm.reset();
  showMessage(passwordForm, "Your password has been updated.");
});


// Sign out, then go to the home page
document.getElementById("member-signout").addEventListener("click", async () => {
  await db.auth.signOut();
  window.location.href = "index.html";
});


start();
