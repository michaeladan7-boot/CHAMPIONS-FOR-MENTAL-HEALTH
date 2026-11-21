// Shared navigation and front-end form feedback
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

document.querySelectorAll(".demo-form").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = form.querySelector(".form-message");
    if (message) message.classList.add("show");
  });
});

document.querySelectorAll(".year").forEach(item => {
  item.textContent = new Date().getFullYear();
});
