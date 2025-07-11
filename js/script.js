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

  const uploadPassword = "superstar";
  const uploadModal = document.getElementById("upload-modal");
  let deleteMode = false;

  let tPressCount = 0;
  let pPressCount = 0;
  let dPressCount = 0;
  let tTimer, pTimer, dTimer;

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
    } else if (key === "p") {
      pPressCount++;
      clearTimeout(pTimer);
      if (pPressCount === 3) {
        uploadModal.style.display = "flex";
        pPressCount = 0;
      } else {
        pTimer = setTimeout(() => (pPressCount = 0), 1500);
      }
    } else if (key === "d") {
      dPressCount++;
      clearTimeout(dTimer);
      if (dPressCount === 3) {
        deleteMode = !deleteMode;
        loadPhotos();
        dPressCount = 0;
      } else {
        dTimer = setTimeout(() => (dPressCount = 0), 1500);
      }
    } else {
      tPressCount = 0;
      pPressCount = 0;
      dPressCount = 0;
    }
  });

  window.closeUploadModal = function () {
    uploadModal.style.display = "none";
    document.getElementById("upload-password").value = "";
    document.getElementById("photo-file").value = "";
    document.getElementById("photo-caption").value = "";
  };

  window.submitPhoto = function () {
    const password = document.getElementById("upload-password").value;
    const file = document.getElementById("photo-file").files[0];
    const caption = document.getElementById("photo-caption").value;

    if (password !== uploadPassword) return alert("Incorrect password.");
    if (!file || !caption) return alert("Please select a photo and write a caption.");

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("caption", caption);
    formData.append("password", password);

    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return alert(data.error);
        loadPhotos();
        closeUploadModal();
      })
      .catch(() => alert("Upload failed."));
  };

  function loadPhotos() {
    fetch("http://localhost:3000/photos")
      .then((res) => res.json())
      .then((photos) => {
        const gallery = document.getElementById("photo-gallery");
        gallery.innerHTML = "";

        photos.forEach((photo) => {
          const card = document.createElement("div");
          card.className = "photo-card";
          card.innerHTML = `
            <img src="http://localhost:3000/uploads/${photo.filename}" alt="Uploaded photo" />
            <p>${photo.caption}</p>
          `;

          if (deleteMode) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-button";
            deleteBtn.onclick = function () {
              const entered = prompt("Enter password to delete:");
              if (entered === uploadPassword) {
                fetch("http://localhost:3000/delete", {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    password: entered,
                    filename: photo.filename,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.message) {
                      loadPhotos();
                    } else {
                      alert(data.error || "Failed to delete.");
                    }
                  });
              } else {
                alert("Incorrect password.");
              }
            };
            card.appendChild(deleteBtn);
          }

          gallery.appendChild(card);
        });
      });
  }

  loadPhotos();
});
