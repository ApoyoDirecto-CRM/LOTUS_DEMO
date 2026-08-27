"use strict";

/* ============================================================
   Lotus Travel — Lógica de la landing
   Módulos: DESTINOS (datos) · HeroUI · Carousel · Bookmark · Intro
   ============================================================ */

const DESTINOS = [
  {
    pais: "Cancún",
    nombre: "Cancún & Riviera Maya",
    imagen: "https://lotustravel.com.mx/wp-content/uploads/2026/06/IBEROSTAR-1.webp",
    precio: "$10,467",
    descripcion: "Hospedaje + Plan Todo Incluido + Traslados. 4 días y 3 noches para toda la familia.",
    hotels: [
      { name: "Dos Playas Faranda", price: "$10,467" },
      { name: "Grand Oasis Palm", price: "$14,591" },
      { name: "Emporio", price: "$16,403" },
      { name: "Iberostar Selection", price: "$17,792" }
    ]
  },
  {
    pais: "Los Cabos",
    nombre: "Los Cabos",
    imagen: "https://lotustravel.com.mx/wp-content/uploads/2026/06/RIU-SANTA-FE-1.webp",
    precio: "$10,910",
    descripcion: "Hospedaje + Plan Todo Incluido + Traslados. 4 días y 3 noches para toda la familia.",
    hotels: [
      { name: "Posada Real", price: "$10,910" },
      { name: "Royal Solaris", price: "$13,914" },
      { name: "RIU Santa Fe", price: "$15,355" },
      { name: "Dreams", price: "$22,676" }
    ]
  },
  {
    pais: "Huatulco",
    nombre: "Huatulco",
    imagen: "https://lotustravel.com.mx/wp-content/uploads/2026/06/LAS-BRISAS-1.webp",
    precio: "$11,105",
    descripcion: "Hospedaje + Plan Todo Incluido + Traslados. 4 días y 3 noches para toda la familia.",
    hotels: [
      { name: "Binniguenda", price: "$11,105" },
      { name: "Coral Blue", price: "$11,625" },
      { name: "Las Brisas", price: "$13,825" },
      { name: "Dreams", price: "$17,241" }
    ]
  }
];

const HeroUI = (() => {
  const refs = {
    info: document.querySelector(".hero__info"),
    country: document.querySelector(".hero__country"),
    title: document.querySelector(".hero__title"),
    description: document.querySelector(".hero__description"),
    layers: [...document.querySelectorAll(".hero__bg-layer")],
  };

  let activeLayer = 0;
  let swapTimeout = null;

  function swapBackground(url) {
    const nextLayer = refs.layers[1 - activeLayer];
    const img = new Image();

    img.onload = () => {
      nextLayer.style.backgroundImage = `url("${url}")`;
      nextLayer.classList.add("is-visible");
      refs.layers[activeLayer].classList.remove("is-visible");
      activeLayer = 1 - activeLayer;
    };
    img.src = url;
  }

  function setTexts(destino) {
    refs.country.textContent = destino.pais;
    refs.title.innerHTML = destino.nombre.replace("&", "&amp;");
    refs.description.textContent = destino.descripcion;
  }

  function update(destino) {
    refs.info.classList.add("is-updating");
    clearTimeout(swapTimeout);

    swapTimeout = setTimeout(() => {
      setTexts(destino);
      refs.info.classList.remove("is-updating");
      swapBackground(destino.imagen);
    }, 380);
  }

  return { update };
})();

const Carousel = (() => {
  let swiper;

  const refs = {
    wrapper: document.querySelector(".destination-swiper .swiper-wrapper"),
    progressFill: document.querySelector(".carousel__progress-fill"),
    counterCurrent: document.querySelector(".counter-current"),
    counterTotal: document.querySelector(".counter-total"),
    prevBtn: document.querySelector(".carousel-btn--prev"),
    nextBtn: document.querySelector(".carousel-btn--next"),
  };

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function buildCard(destino) {
    return `
      <article class="destination-card">
        <img src="${destino.imagen}" alt="${destino.nombre}" loading="lazy" draggable="false" />
        <div class="destination-card__label">
          <h4 class="destination-card__name">${destino.nombre}</h4>
          <p class="destination-card__subtitle">${destino.pais}</p>
          <p class="destination-card__price">${destino.precio}</p>
        </div>
      </article>`;
  }

  function updateProgress(instance) {
    refs.progressFill.style.transform = `scaleX(${instance.progress})`;
  }

  function tickCounter() {
    refs.counterCurrent.classList.add("is-ticking");
    setTimeout(() => refs.counterCurrent.classList.remove("is-ticking"), 220);
  }

  function createSwiper() {
    return new Swiper(".destination-swiper", {
      slidesPerView: 1.3,
      spaceBetween: 14,
      grabCursor: true,
      speed: 600,
      centeredSlides: true,
      keyboard: { enabled: true },
      virtual: { enabled: true, cache: true, addSlidesBefore: 1, addSlidesAfter: 1 },
      breakpoints: {
        520: { slidesPerView: 1.4 },
        860: { slidesPerView: 1.6 },
        1180: { slidesPerView: 1.8 },
      },
      on: {
        init(instance) {
          refs.counterTotal.textContent = pad(DESTINOS.length);
          updateProgress(instance);
        },
        slideChange(instance) {
          refs.counterCurrent.textContent = pad(instance.activeIndex + 1);
          updateProgress(instance);
          tickCounter();
          HeroUI.update(DESTINOS[instance.activeIndex]);
        },
      },
    });
  }

  function init() {
    swiper = createSwiper();
    swiper.virtual.slides = DESTINOS.map((d) => buildCard(d));
    swiper.virtual.update(true);

    refs.prevBtn.addEventListener("click", () => swiper.slidePrev());
    refs.nextBtn.addEventListener("click", () => swiper.slideNext());
  }

  return { init };
})();

const Bookmark = (() => {
  function init() {
    const btn = document.querySelector(".btn-bookmark");
    if (!btn) return;

    btn.setAttribute("aria-pressed", "false");

    btn.addEventListener("click", () => {
      const isActive = btn.classList.toggle("is-active");
      btn.setAttribute(
        "aria-label",
        isActive ? "Quitar destino de favoritos" : "Guardar destino en favoritos"
      );
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  return { init };
})();

const Intro = (() => {
  const refs = {
    overlay: document.getElementById("intro"),
    cta: document.querySelector(".intro__cta"),
    heroInfo: document.querySelector(".hero__info"),
    track: document.querySelector(".intro__track"),
    bgLayers: [
      document.getElementById("introBg0"),
      document.getElementById("introBg1"),
    ],
  };

  const CYCLE_START = 4000;
  const CYCLE_EVERY = 3500;

  let hasLeft = false;
  let cycleTimer = null;
  let bgTimer = null;
  let index = 0;
  let activeBg = 0;

  function revealHero() {
    if (refs.heroInfo) refs.heroInfo.classList.add("is-visible");
  }

  function cards() {
    return [...refs.track.children];
  }

  function crossfadeBg(url) {
    const next = refs.bgLayers[1 - activeBg];
    const current = refs.bgLayers[activeBg];
    const img = new Image();
    img.onload = () => {
      next.style.backgroundImage = `url("${url}")`;
      next.classList.add("is-visible");
      current.classList.remove("is-visible");
      activeBg = 1 - activeBg;
    };
    img.src = url;
  }

  function setActive(i) {
    const items = cards();
    if (!items.length) return;

    items.forEach((card, k) => card.classList.toggle("is-active", k === i));

    const style = getComputedStyle(refs.track);
    const step = items[0].offsetWidth + parseFloat(style.gap || "14");
    const viewport = refs.track.parentElement.offsetWidth;
    const maxShift = Math.max(0, refs.track.scrollWidth - viewport);
    const shift = Math.min(maxShift, Math.max(0, i * step - (viewport - items[0].offsetWidth) / 2));
    refs.track.style.transform = `translate3d(${-shift}px, 0, 0)`;

    crossfadeBg(DESTINOS[i].imagen);
  }

  function buildCarousel() {
    DESTINOS.forEach((destino, i) => {
      const card = document.createElement("figure");
      card.className = "intro-card";
      card.innerHTML = `
        <img src="${destino.imagen}" alt="" loading="${i < 3 ? 'eager' : 'lazy'}" draggable="false" />
        <figcaption>
          <h5>${destino.nombre}</h5>
          <span>${destino.pais}</span>
        </figcaption>`;
      refs.track.appendChild(card);
    });
    setActive(0);
  }

  function startCycle() {
    if (!refs.track) return;
    cycleTimer = setInterval(() => {
      index = (index + 1) % DESTINOS.length;
      setActive(index);
    }, CYCLE_EVERY);
  }

  function leave() {
    if (hasLeft) return;
    hasLeft = true;
    clearInterval(cycleTimer);
    clearInterval(bgTimer);

    document.body.style.overflow = "";
    revealHero();

    if (!refs.overlay) return;
    refs.overlay.classList.add("is-leaving");
    setTimeout(() => refs.overlay.remove(), 1000);
  }

  function init() {
    if (!refs.overlay) {
      revealHero();
      return;
    }

    document.body.style.overflow = "hidden";

    if (refs.track) buildCarousel();

    if (refs.cta) refs.cta.addEventListener("click", leave);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") leave();
    });

    setTimeout(startCycle, CYCLE_START);
  }

  return { init };
})();

const ScrollManager = (() => {
  const header = document.querySelector(".site-header");
  const navLinks = [...document.querySelectorAll(".site-nav__link")];
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href").replace("#", "");
      return { link, section: document.getElementById(id) };
    })
    .filter((item) => item.section);

  function onScroll() {
    const y = window.scrollY;

    if (header) {
      header.classList.toggle("is-scrolled", y > 80);
    }

    let current = sections[0];
    for (const item of sections) {
      if (item.section.getBoundingClientRect().top <= 160) {
        current = item;
      }
    }

    navLinks.forEach((link) => link.classList.remove("is-active"));
    if (current) current.link.classList.add("is-active");
  }

  function init() {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const id = link.getAttribute("href").replace("#", "");
        const target = document.getElementById(id);
        if (target) {
          const offset = header ? header.offsetHeight + 16 : 100;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }

        const nav = document.querySelector(".site-nav");
        if (nav) nav.classList.remove("is-open");
      });
    });
  }

  return { init };
})();

const MobileNav = (() => {
  function init() {
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".site-nav");
    if (!burger || !nav) return;

    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (e) => {
      if (e.target === nav) {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  return { init };
})();

const ScrollTop = (() => {
  function init() {
    const btn = document.getElementById("scrollTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Swiper === "undefined") {
    console.error("Swiper no está disponible. Revisa la conexión o el CDN.");
  } else {
    Carousel.init();
    Bookmark.init();
  }
  Intro.init();
  ScrollManager.init();
  MobileNav.init();
  ScrollTop.init();
});
