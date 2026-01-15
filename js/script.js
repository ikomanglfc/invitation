const rootElement = document.querySelector(":root");
const audioWrapper = document.querySelector(".audio-icon-wrapper");
const song = document.querySelector("#song");
const audioIcon = document.querySelector("#audio-wrapper i");
let isPlaying = false;

// fitur waktu mundur
simplyCountdown(".simply-countdown", {
  year: 2024, // required
  month: 4, // required
  day: 11, // required
  hours: 12, // Default is 0 [0-23] integer
  words: {
    //words displayed into the countdown
    days: { singular: "Hari", plural: "Hari" },
    hours: { singular: "Jam", plural: "Jam" },
    minutes: { singular: "Menit", plural: "Menit" },
    seconds: { singular: "Detik", plural: "Detik" },
  },
});

function disableScroll() {
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollTop, scrollLeft);
  };

  rootElement.style.scrollBehavior = "auto";
}

function enableScroll() {
  window.onscroll = function () { };
  rootElement.style.scrollBehavior = "smooth";
  playAudio();
}

function playAudio() {
  song.volume = 0.1;
  song.play();
  audioWrapper.style.display = "flex";
  isPlaying = true;
}

audioWrapper.onclick = function () {
  if (isPlaying) {
    song.pause();
    audioIcon.classList.remove("bi-disc");
    audioIcon.classList.add("bi-pause-circle");
  } else {
    song.play();
    audioIcon.classList.add("bi-disc");
    audioIcon.classList.remove("bi-pause-circle");
  }
  isPlaying = !isPlaying;
};

disableScroll();

window.addEventListener("load", function () {
  const form = document.getElementById("my-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    fetch(action, {
      method: "POST",
      body: data,
    }).then(() => {
      alert("Konfirmasi kehadiran berhasil tersimpan, Terima kasih!");
    });
  });
});

// fitur get nama
const urlParam = new URLSearchParams(window.location.search);
const nama = urlParam.get("n") || "";
const pronoun = urlParam.get("p") || "Bapk/Ibu/Saudara/i";
const to = urlParam.get("to") || "";

const namaCon = document.querySelector(".hero h4 span");

// If 'to' matches 'n' or just 'n' exists or just 'to' exists.
// Logic: If 'to' exists, we use it. If not, we use 'n' and 'p'.
if (to) {
  namaCon.innerText = to;
} else {
  namaCon.innerText = `${pronoun} ${nama},`.replace(/ ,$/, ",");
}

document.querySelector("#nama").value = nama;


// WISHES FORM HANDLER
window.addEventListener("load", function () {
  const wishForm = document.getElementById("my-wish-form");
  const wishesContainer = document.getElementById("wishes-container");
  const loading = document.getElementById("loading-wishes");

  // URL of your Google Apps Script
  const scriptURL = 'https://script.google.com/macros/s/AKfycbz6RTvRKk5QisSuGdZPk-2fL2oCMnrvskq2YXx1-4Zv4ODBZFCkaJRYxtKrmqBoD5Ymfg/exec';

  // Load Wishes on Entry
  loadWishes();

  function loadWishes() {
    if (!loading || !wishesContainer) return;

    loading.classList.remove("d-none");
    // Use a unique param to avoid caching
    fetch(scriptURL + "?action=getWishes&t=" + new Date().getTime())
      .then(response => response.json())
      .then(data => {
        loading.classList.add("d-none");
        if (data.status === 'success' && data.wishes) {
          wishesContainer.innerHTML = '';
          wishesContainer.appendChild(loading); // Keep spinner for next time

          data.wishes.forEach(wish => {
            const div = document.createElement("div");
            div.className = "wish-item p-3 mb-3 border rounded bg-white shadow-sm text-start";
            div.innerHTML = `
                    <h6 class="mb-1 fw-bold" style="color: var(--pastel-rose);">${wish.nama}</h6>
                    <p class="mb-0 text-muted small">${wish.ucapan}</p>
                    <small class="text-secondary" style="font-size: 0.7em;">${wish.waktu || ''}</small>
                  `;
            wishesContainer.appendChild(div);
          });
        }
      })
      .catch(error => {
        console.log('Backend not ready for getWishes yet. This is expected until GAS is updated.');
        loading.classList.add("d-none");
        // Static Example when no backend available yet
        /*
        const div = document.createElement("div");
        div.className = "wish-item p-3 mb-3 border rounded bg-white shadow-sm text-start";
        div.innerHTML = `
          <h6 class="mb-1 fw-bold" style="color: var(--pastel-rose);">Admin</h6>
          <p class="mb-0 text-muted small">Fitur ini memerlukan update pada Google Apps Script Anda agar berfungsi online sepenuhnya.</p>
        `;
        wishesContainer.appendChild(div);
        */
      });
  }

  if (wishForm) {
    wishForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = wishForm.querySelector("button");
      const originalText = btn.innerText;
      btn.disabled = true;
      btn.innerText = "Mengirim...";

      const data = new FormData(wishForm);
      data.append('action', 'sendWish');

      fetch(scriptURL, {
        method: "POST",
        body: data,
      })
        .then((response) => {
          alert("Terima kasih atas ucapan dan doanya!");
          wishForm.reset();
          // For UX, manually add the wish immediately so they see it
          const nameVal = data.get('nama');
          const msgVal = data.get('ucapan');

          const div = document.createElement("div");
          div.className = "wish-item p-3 mb-3 border rounded bg-white shadow-sm text-start";
          div.innerHTML = `
                <h6 class="mb-1 fw-bold" style="color: var(--pastel-rose);">${nameVal}</h6>
                <p class="mb-0 text-muted small">${msgVal}</p>
                <small class="text-secondary" style="font-size: 0.7em;">Baru saja</small>
              `;
          // Insert after loading spinner
          if (wishesContainer.children.length > 0) {
            wishesContainer.insertBefore(div, wishesContainer.children[1]);
          } else {
            wishesContainer.appendChild(div);
          }

        })
        .catch((error) => {
          console.error("Error!", error.message);
          alert("Gagal mengirim ucapan. Coba lagi.");
        })
        .finally(() => {
          btn.disabled = false;
          btn.innerText = originalText;
        });
    });
  }
});
