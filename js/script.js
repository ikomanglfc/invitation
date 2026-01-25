const rootElement = document.querySelector(":root");
const audioWrapper = document.querySelector(".audio-icon-wrapper");
const song = document.querySelector("#song");
const audioIcon = document.querySelector("#audio-wrapper i");
let isPlaying = false;

// fitur waktu mundur
simplyCountdown(".simply-countdown", {
  year: 2027, // required
  month: 7, // required
  day: 2, // required
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
  // RSVP logic removed
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




// WISHES FORM HANDLER
window.addEventListener("load", function () {
  const wishForm = document.getElementById("my-wish-form");
  const wishesContainer = document.getElementById("wishes-container");
  const loading = document.getElementById("loading-wishes");

  // URL of your Google Apps Script
  const scriptURL = 'https://script.google.com/macros/s/AKfycbw80kvNWuiKNvrSh_VTtrqPXlrW7jUTNGM5BtnUb23HhsOYBsP5b5bGwqerWLuKlihz/exec';

  // Load Wishes on Entry
  loadWishes();

  function loadWishes() {
    if (!loading || !wishesContainer) return;

    loading.classList.remove("d-none");

    // Kita panggil dengan parameter action=getWishes
    fetch(scriptURL + "?action=getWishes&t=" + new Date().getTime())
      .then(response => response.json())
      .then(data => {
        loading.classList.add("d-none");
        if (data.status === 'success' && data.wishes) {
          // Bersihkan kontainer tapi sisakan loading spinner (tersembunyi)
          wishesContainer.innerHTML = '';
          wishesContainer.appendChild(loading);

          data.wishes.forEach(wish => {
            const div = document.createElement("div");
            div.className = "wish-item p-3 mb-3 border rounded bg-white shadow-sm text-start";
            div.innerHTML = `
                    <h6 class="mb-1">${wish.nama}</h6>
                    <p class="mb-0">${wish.ucapan}</p>
                    <small>${wish.waktu ? new Date(wish.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</small>
                  `;
            wishesContainer.appendChild(div);
          });
        }
      })
      .catch(error => {
        console.warn('Gagal mengambil data ucapan. Pastikan Google Apps Script sudah dideploy sebagai Public.');
        loading.classList.add("d-none");

        // Tampilkan pesan jika data kosong/error
        if (wishesContainer.children.length <= 1) {
          wishesContainer.innerHTML += '<p class="text-center text-muted small">Belum ada ucapan saat ini.</p>';
        }
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
        mode: 'no-cors' // Penting untuk Google Apps Script
      })
        .then((response) => {
          // Karena menggunakan no-cors, kita tidak bisa membaca isi response,
          // tapi jika eksekusi sampai di sini berarti request terkirim.
          alert("Terima kasih atas ucapan dan doanya!");
          wishForm.reset();

          // Tambahkan ucapan secara manual ke tampilan (Optimistic UI)
          const nameVal = data.get('nama');
          const msgVal = data.get('ucapan');

          const div = document.createElement("div");
          div.className = "wish-item p-3 mb-3 border rounded bg-white shadow-sm text-start";
          div.innerHTML = `
                <h6 class="mb-1">${nameVal}</h6>
                <p class="mb-0">${msgVal}</p>
                <small>Baru saja</small>
              `;

          if (wishesContainer) {
            // Masukkan setelah spinner (anak pertama) atau di paling atas
            const firstChild = wishesContainer.children[1]; // children[0] adalah spinner
            if (firstChild) {
              wishesContainer.insertBefore(div, firstChild);
            } else {
              wishesContainer.appendChild(div);
            }
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
