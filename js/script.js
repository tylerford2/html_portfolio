document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const toggleButton = document.getElementById("toggle-theme");

  toggleButton.addEventListener("click", () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
  });

  // Form submission modal
  const form = document.getElementById("contact-form");
  const modal = document.getElementById("modal");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    form.reset();
  });

  // Close modals
  window.closeModal = function () {
    modal.style.display = "none";
  };

  window.closeCatModal = function () {
    const catModal = document.getElementById("cat-modal");
    catModal.style.display = "none";
  };

  // T key Konami-style trigger
  let tPressCount = 0;
  let tTimer = null;

  document.addEventListener("keydown", function (e) {
    if (e.key.toLowerCase() === "t") {
      tPressCount++;
      clearTimeout(tTimer);

      if (tPressCount === 3) {
        const catModal = document.getElementById("cat-modal");
        catModal.style.display = "flex";
        tPressCount = 0;
      } else {
        tTimer = setTimeout(() => {
          tPressCount = 0;
        }, 1500); // Reset after 1.5s
      }
    } else {
      tPressCount = 0;
    }
  });
});
