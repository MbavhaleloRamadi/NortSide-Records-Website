// Wait for full load before removing loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
    setTimeout(() => {
      loader.remove();
    }, 500); // smooth fade
  }
});

// Active navigation link logic (basic highlight)
const currentPath = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link => {
  const href = link.getAttribute("href");
  if (href === currentPath) {
    link.classList.add("active");
  }
});
