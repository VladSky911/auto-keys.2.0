// Simple i18n loader
const i18n = {
  currentLang: "de",
  data: {},
};

async function loadLang(lang) {
  if (i18n.data[lang]) {
    applyTranslations(lang);
    return;
  }
  try {
    const res = await fetch(`lang/${lang}.json`);
    const json = await res.json();
    i18n.data[lang] = json;
    applyTranslations(lang);
  } catch (e) {
    console.error("i18n load error", e);
  }
}

function applyTranslations(lang) {
  i18n.currentLang = lang;
  const dict = i18n.data[lang] || {};
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = key
      .split(".")
      .reduce((acc, part) => (acc ? acc[part] : undefined), dict);
    if (typeof text === "string") {
      el.textContent = text;
    }
  });

  document
    .querySelectorAll(".lang-switcher__btn")
    .forEach((btn) =>
      btn.classList.toggle("is-active", btn.dataset.lang === lang),
    );
}

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = document.querySelector(".header")?.offsetHeight || 0;
      const top =
        target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

// Slider
function initSlider() {
  const slider = document.querySelector(".js-slider");
  if (!slider) return;
  const track = slider.querySelector(".slider__track");
  const items = Array.from(slider.querySelectorAll(".slider__item"));
  const prev = slider.querySelector(".js-slider-prev");
  const next = slider.querySelector(".js-slider-next");

  let index = 0;

  function update() {
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
  }

  function goNext() {
    index = (index + 1) % items.length;
    update();
  }

  function goPrev() {
    index = (index - 1 + items.length) % items.length;
    update();
  }

  next.addEventListener("click", goNext);
  prev.addEventListener("click", goPrev);

  // Auto-play
  setInterval(goNext, 8000);
}

// Modal
function initModal() {
  const modal = document.getElementById("callback-modal");
  if (!modal) return;
  const openButtons = document.querySelectorAll(".js-open-modal");
  const closeButtons = modal.querySelectorAll(".js-close-modal");

  function open() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function close() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  openButtons.forEach((btn) => btn.addEventListener("click", open));
  closeButtons.forEach((btn) => btn.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

// Fake form handlers
function initForms() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.classList.add("is-sent");
      const btn = form.querySelector("button[type=submit]");
      if (btn) {
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = "Gesendet";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = original;
          form.reset();
        }, 2000);
      }
    });
  });
}

// Lang switcher
function initLangSwitcher() {
  document.querySelectorAll(".lang-switcher__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      loadLang(lang);
    });
  });
}

// Current year
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initSlider();
  initModal();
  initForms();
  initLangSwitcher();
  setYear();
  loadLang("de");
});
