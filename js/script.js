document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggle-theme");
  toggleButton.addEventListener("click", () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
  });

  const form = document.getElementById("contact-form");
  const modal = document.getElementById("modal");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    modal.style.display = "flex";
    form.reset();
  });

  window.closeModal = function () {
    modal.style.display = "none";
  };

  window.closeCatModal = function () {
    const catModal = document.getElementById("cat-modal");
    catModal.style.display = "none";
  };

  // Hidden cat modal trigger
  let tPressCount = 0;
  let tTimer = null;

  document.addEventListener("keydown", function (e) {
    const key = e.key.toLowerCase();

    if (key === "t") {
      tPressCount++;
      clearTimeout(tTimer);
      if (tPressCount === 3) {
        document.getElementById("cat-modal").style.display = "flex";
        tPressCount = 0;
      } else {
        tTimer = setTimeout(() => (tPressCount = 0), 1500);
      }
    } else {
      tPressCount = 0;
    }
  });
});
