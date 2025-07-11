// Toggle Theme
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-theme');

  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
  });

  // Contact Form Popup
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    form.reset();
  });

  // Close Modals
  window.closeModal = function () {
    document.getElementById('modal').style.display = 'none';
  };
  window.closeCatModal = function () {
    document.getElementById('cat-modal').style.display = 'none';
  };

  // "t" key Easter Egg Trigger (3 times)
  let tPressCount = 0;
  let tTimer = null;

  document.addEventListener('keydown', function (e) {
    if (e.key.toLowerCase() === 't') {
      tPressCount++;

      // Reset after 2 seconds of inactivity
      clearTimeout(tTimer);
      tTimer = setTimeout(() => {
        tPressCount = 0;
      }, 2000);

      if (tPressCount === 3) {
        const catModal = document.getElementById('cat-modal');
        if (catModal) {
          catModal.style.display = 'block';
        }
        tPressCount = 0;
      }
    } else {
      // Any other key resets the count
      tPressCount = 0;
    }
  });
});
