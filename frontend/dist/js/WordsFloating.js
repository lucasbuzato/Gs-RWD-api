document.addEventListener("DOMContentLoaded", () => {
  console.log("✓ Script iniciado (floating-words v2)");

  /* ------------------------------------------------------------- Seleção dos elementos dentro da section correta ------------------------------------------------------------- */
  const section = document.querySelector("#flotingwords-section");
  if (!section) {
    console.error("❌ Section #flotingwords-section não encontrada.");
    return;
  }

  // elementos internos da section (evita conflitos com outros forms)
  const form = section.querySelector("form");
  const input = section.querySelector("input[placeholder='Digite uma Palavra']");
  const button = section.querySelector("button[type='button']");
  const wordBox = section.querySelector("#floating-words");

  // checagem final dos elementos
  if (!form || !input || !button || !wordBox) {
    console.error("❌ Elementos essenciais não encontrados dentro da section:");
    console.log({ form, input, button, wordBox });
    return;
  }

  /* ------------------------------------------------------------- Variáveis internas do sistema ------------------------------------------------------------- */
  const existingWords = []; // armazena posição e elemento {left,right,top,bottom,el}
  const padding = 10;       // distância mínima entre palavras
  const hasGSAP = typeof gsap !== "undefined";

  /* ------------------------------------------------------------- Área protegida (onde NÃO podem aparecer palavras) ------------------------------------------------------------- */
  function getProtectedArea() {
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;

    const protectedWidth = form.offsetWidth + 100;
    const protectedHeight = form.offsetHeight + 400;

    return {
      left: (sectionWidth - protectedWidth) / 2,
      right: (sectionWidth - protectedWidth) / 2 + protectedWidth,
      top: sectionHeight - protectedHeight - 20,
      bottom: sectionHeight - 20,
    };
  }

  /* ------------------------------------------------------------- Remove referência da palavra ao deletar ------------------------------------------------------------- */
  function removeRectForElement(el) {
    const idx = existingWords.findIndex((r) => r.el === el);
    if (idx !== -1) existingWords.splice(idx, 1);
  }

  /* ------------------------------------------------------------- Função de criar palavra flutuante ------------------------------------------------------------- */
  function addWord(text) {
    if (!text) return;

    /* ---------- Estrutura do elemento ---------- */
    const wrapper = document.createElement("div");
    wrapper.className = "word-wrapper";

    const bubble = document.createElement("span");
    bubble.className = "word-bubble text-white font-semibold shadow-lg";

    const fontSizes = ["text-lg", "text-xl", "text-2xl"];
    bubble.classList.add(fontSizes[Math.floor(Math.random() * fontSizes.length)]);

    const colors = ["bg-Roxo", "bg-Azul-Claro", "bg-Verde"];
    bubble.classList.add(colors[Math.floor(Math.random() * colors.length)]);

    bubble.textContent = text;

    /* ---------- Botão deletar ---------- */
    const del = document.createElement("div");
    del.className = "word-delete";
    del.innerHTML = "✕";

    del.addEventListener("click", (ev) => {
      ev.stopPropagation();

      if (hasGSAP) {
        gsap.to(wrapper, {
          scale: 0,
          opacity: 0,
          duration: 0.28,
          onComplete: () => {
            removeRectForElement(wrapper);
            wrapper.remove();
          },
        });
      } else {
        removeRectForElement(wrapper);
        wrapper.remove();
      }
    });

    /* ---------- Montagem no DOM ---------- */
    wrapper.appendChild(bubble);
    wrapper.appendChild(del);
    wordBox.appendChild(wrapper);

    wrapper.offsetWidth; // força cálculo do tamanho

    /* ------------------------------------------------------------- Posicionamento aleatório + prevenção de colisões ------------------------------------------------------------- */
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;

    const isMobile = window.innerWidth <= 768;

    const protectedArea = isMobile
      ? { left: 0, right: sectionWidth, top: sectionHeight * 0.4, bottom: sectionHeight }
      : getProtectedArea();

    let placed = false;
    let attempts = 0;
    let rect = null;
    const maxAttempts = 120;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      const maxX = Math.max(0, sectionWidth - wrapper.offsetWidth);
      const maxY = isMobile
        ? Math.max(0, sectionHeight * 0.4 - wrapper.offsetHeight)
        : Math.max(0, sectionHeight - wrapper.offsetHeight);

      const x = Math.random() * maxX;
      const y = Math.random() * maxY;

      wrapper.style.left = `${x}px`;
      wrapper.style.top = `${y}px`;

      rect = {
        left: x,
        right: x + wrapper.offsetWidth,
        top: y,
        bottom: y + wrapper.offsetHeight,
        el: wrapper,
      };

      const collision = existingWords.some((e) => {
        return (
          rect.left < e.right + padding &&
          rect.right > e.left - padding &&
          rect.top < e.bottom + padding &&
          rect.bottom > e.top - padding
        );
      });

      const inProtected =
        rect.left < protectedArea.right &&
        rect.right > protectedArea.left &&
        rect.top < protectedArea.bottom &&
        rect.bottom > protectedArea.top;

      if (!collision && !inProtected) {
        existingWords.push(rect);
        placed = true;
      }
    }

    if (!placed) {
      console.warn("⚠️ Palavra posicionada à força (máximo de tentativas atingido).");
      rect = rect || {
        left: 0,
        right: wrapper.offsetWidth,
        top: 0,
        bottom: wrapper.offsetHeight,
        el: wrapper,
      };
      existingWords.push(rect);
    }

    /* ------------------------------------------------------------- Animação Pop + Flutuação (GSAP) ------------------------------------------------------------- */
    if (hasGSAP) {
      gsap.from(wrapper, { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(1.7)" });

      gsap.to(wrapper, {
        x: "+=" + (Math.random() * 20 - 10),
        y: "+=" + (Math.random() * 20 - 10),
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    console.log("➕ Palavra adicionada:", text, rect);
  }

  /* ------------------------------------------------------------- Form de enviar palavra ------------------------------------------------------------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    addWord(val);
    input.value = "";
  });

  button.addEventListener("click", () => {
    const val = input.value.trim();
    if (!val) return;
    addWord(val);
    input.value = "";
  });

  /* ------------------------------------------------------------- Palavras iniciais na tela ------------------------------------------------------------- */
  ["Criatividade", "Empatia", "Ideias", "Inovação", "Curiosidade"].forEach(addWord);

  /* ------------------------------------------------------------- Funções de debugging ------------------------------------------------------------- */
  window._floatingWords = {
    existingWords,
    addWord,
    removeRectForElement,
  };

});
