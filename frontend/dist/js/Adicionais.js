/* --------------------------------------------Menu Hamburguer-------------------------------------------- */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("max-h-0");

  if (isOpen) {
    mobileMenu.classList.remove("max-h-0", "opacity-0");
    mobileMenu.classList.add("max-h-[400px]", "opacity-100");
  } else {
    mobileMenu.classList.remove("max-h-[400px]", "opacity-100");
    mobileMenu.classList.add("max-h-0", "opacity-0");
  }
});

/* -------------------------------------------- Corrige gap da scrollbar-------------------------------------------- */
function fixScrollGap() {
  const sc = document.querySelector(".scrollable");
  if (!sc) return;

  const scrollbarWidth = sc.offsetWidth - sc.clientWidth;
  sc.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
}

window.addEventListener("load", fixScrollGap);
window.addEventListener("resize", fixScrollGap);

/* -------------------------------------------- Botão Dark Mode -------------------------------------------- */
const toggle = document.getElementById("darkModeToggle");
console.log("JS carregado, toggle:", toggle);

// Garante que o site sempre inicia no modo light
document.documentElement.classList.remove("dark");

// Ajusta visualmente o checkbox
toggle.checked = document.documentElement.classList.contains("dark");

// Alternância do modo
toggle.addEventListener("change", () => {
  console.log("Toggle clicado. Estado:", toggle.checked);

  if (toggle.checked) {
    console.log("Ativando dark mode");
    document.documentElement.classList.add("dark");
  } else {
    console.log("Desativando dark mode");
    document.documentElement.classList.remove("dark");
  }
});

/* -------------------------------------------- Gsap — Animação de Scroll dos Cards -------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

  // Verifica se o GSAP existe
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP ou ScrollTrigger não encontrado.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector("#carreiras-section");
  const scrollArea = document.querySelector("#cards-scroll");

  if (!section || !scrollArea) {
    console.error("Elemento de scroll não encontrado.");
    return;
  }

  // Previne bug de stack do GSAP
  section.style.position = section.style.position || "relative";
  scrollArea.style.position = scrollArea.style.position || "relative";

  /* -------------------------------------------- Controle de animação do GSAP -------------------------------------------- */
  function initScroll() {
    // Remove animações antigas para evitar duplicação
    ScrollTrigger.getAll()
      .filter((t) => t.trigger === section)
      .forEach((t) => t.kill());
    gsap.killTweensOf(scrollArea);

    const sectionHeight = section.clientHeight;
    const areaHeight = scrollArea.scrollHeight;
    const extra = Math.max(0, areaHeight - sectionHeight);

    if (extra === 0) {
      console.log("Nenhum overflow nos cards.");
      ScrollTrigger.refresh();
      return;
    }

    gsap.to(scrollArea, {
      y: -extra,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${extra}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        markers: false,
      },
    });

    ScrollTrigger.refresh();
  }

  /* -------------------------------------------- Função que roda apartir do momento que tudo carregar -------------------------------------------- */
  function waitForLoadThenInit() {
    if (document.readyState === "complete") {
      initScroll();
    } else {
      window.addEventListener("load", () => {
        setTimeout(initScroll, 50);
      });
    }
  }

  waitForLoadThenInit();

  /* -------------------------------------------- ressincronizando o ScrollTrigger -------------------------------------------- */
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
});

/* --------------------------------------------Botão de voltar para o topo -------------------------------------------- */
console.log("✓ Script Botão Topo carregado");

// Elemento do botão
const backToTopBtn = document.getElementById("backToTop");

// Mostra/esconde baseado na rolagem
window.addEventListener("scroll", () => {
  const firstSectionHeight = document.querySelector("section").offsetHeight;

  if (window.scrollY > firstSectionHeight) {
    backToTopBtn.classList.remove("opacity-0", "pointer-events-none");
    backToTopBtn.classList.add("opacity-100");
  } else {
    backToTopBtn.classList.add("opacity-0", "pointer-events-none");
    backToTopBtn.classList.remove("opacity-100");
  }
});

// Ação: voltar ao topo
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
