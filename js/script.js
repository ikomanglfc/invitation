// nav bar
const stickyTop = document.querySelector(".sticky-top");
const myOffcanvas = document.querySelector(".offcanvas");
const rootElement = document.querySelector(":root");
const audioWrapper = document.querySelector(".audio-icon-wrapper");
const song = document.querySelector("#song");
const audioIcon = document.querySelector("#audio-wrapper i");
let isPlaying = false;

myOffcanvas.addEventListener("show.bs.offcanvas", function () {
  stickyTop.style.overflow = "visible";
});

myOffcanvas.addEventListener("hidden.bs.offcanvas", function () {
  stickyTop.style.overflow = "hidden";
});

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
  window.onscroll = function () {};
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
const pronoun = urlParam.get("p") || " ";
const nama = urlParam.get("n") || "";
const namaCon = document.querySelector(".hero h4 span");
namaCon.innerText = `${pronoun} ${nama},`.replace(/ ,$/, ",");

document.querySelector("#nama").value = nama;
