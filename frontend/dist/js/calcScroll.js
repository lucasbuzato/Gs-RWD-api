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



function fixScrollGap() {
  const sc = document.querySelector(".scrollable");
  if (!sc) return;

  // largura real da scrollbar (mesmo quando escondida)
  const scrollbarWidth = sc.offsetWidth - sc.clientWidth;

  // ajusta a variável CSS usada pela classe .scroll-fill
  sc.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
}

window.addEventListener("load", fixScrollGap);
window.addEventListener("resize", fixScrollGap);

const toggle = document.getElementById("darkModeToggle");
console.log("JS carregado, toggle:", toggle);

// Forçar o site iniciar no light mode
document.documentElement.classList.remove("dark");

// Atualiza o checkbox baseado na classe dark
toggle.checked = document.documentElement.classList.contains("dark");

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

document.addEventListener("DOMContentLoaded", () => {
  console.log("✓ Script iniciado");

  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error(
      "GSAP ou ScrollTrigger não encontrado. Confere as CDNs no HTML."
    );
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector("#carreiras-section");
  const scrollArea = document.querySelector("#cards-scroll");

  if (!section || !scrollArea) {
    console.error(
      "Elemento #carreiras-section ou #cards-scroll não encontrado."
    );
    return;
  }

  // garante posição relativa/z-index
  section.style.position = section.style.position || "relative";
  scrollArea.style.position = scrollArea.style.position || "relative";

  function initScroll() {
    // remove triggers/tweens antigos só do scrollArea
    ScrollTrigger.getAll()
      .filter((t) => t.trigger === section)
      .forEach((t) => t.kill());
    gsap.killTweensOf(scrollArea);

    const sectionHeight = section.clientHeight;
    const areaHeight = scrollArea.scrollHeight;
    const viewportH = window.innerHeight;

    const extra = Math.max(0, areaHeight - sectionHeight);
    if (extra === 0) {
      console.log("Nenhum overflow nos cards — ScrollTrigger não será criado.");
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
        onEnter: () => console.log("ScrollTrigger: enter"),
        onLeave: () => console.log("ScrollTrigger: leave"),
        onEnterBack: () => console.log("ScrollTrigger: enterBack"),
        onLeaveBack: () => console.log("ScrollTrigger: leaveBack"),
        markers: false,
      },
    });

    ScrollTrigger.refresh();
  }

  // aguarda load completo e garante medidas corretas
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

  // resize só refresca triggers
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
});
