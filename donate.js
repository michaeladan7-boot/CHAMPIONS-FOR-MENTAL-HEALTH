// ==========================================================================
// donate.js — used only by donate.html
// Sends the "Donate" button to the Paystack payment page set in site-config.js.
// If no link has been added yet, it shows "opening soon" instead.
// ==========================================================================
const donateButton = document.getElementById("donate-button");
const donateMessage = document.getElementById("donate-message");
const donateReady = typeof DONATE_URL === "string" && DONATE_URL.startsWith("http");

if (donateReady) {
  donateButton.href = DONATE_URL;
  donateButton.target = "_blank";
  donateButton.rel = "noopener";
} else {
  donateButton.addEventListener("click", event => {
    event.preventDefault();
    donateMessage.classList.add("show");
  });
}
