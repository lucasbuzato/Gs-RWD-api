document.addEventListener("DOMContentLoaded", () => {
  console.log("✓ Script iniciado");

  const input = document.querySelector(
    "input[placeholder='Digite uma Palavra']"
  );
  const button = document.querySelector("button[type='button']");
  const wordBox = document.getElementById("floating-words");
  const section = document.querySelector("section");
  const form = document.querySelector("form");

  if (!input || !button || !wordBox || !form || !section) {
    console.error("❌ Algum elemento não foi encontrado.");
    return;
  }

  const existingWords = [];
  const padding = 10; // distância mínima entre palavras

  // Define área protegida na parte inferior, centralizada horizontalmente
  function getProtectedArea() {
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;

    const protectedWidth = form.offsetWidth + 100; // deixa 20px de cada lado
    const protectedHeight = form.offsetHeight + 400; // inclui espaço para título/subtítulo

    const left = (sectionWidth - protectedWidth) / 2;
    const right = left + protectedWidth;
    const top = sectionHeight - protectedHeight - 20; // 20px de margem do final da section
    const bottom = sectionHeight - 20;

    return { left, right, top, bottom };
  }

  // Função para adicionar palavra
  function addWord(text) {
    const word = document.createElement("span");
    word.textContent = text;

    const fontSizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
    const fontClass = fontSizes[Math.floor(Math.random() * fontSizes.length)];

    const colors = [
      "bg-purple-500",
      "bg-pink-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
    ];
    const colorClass = colors[Math.floor(Math.random() * colors.length)];

    word.className = `absolute px-4 py-2 rounded-full text-white font-semibold select-none shadow-lg ${fontClass} ${colorClass}`;
    wordBox.appendChild(word);
    word.offsetWidth; // força layout

    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;

    // Detecta se é mobile (ajuste o breakpoint conforme necessário)
    const isMobile = window.innerWidth <= 768;

    // Área protegida para colisão
    let protectedArea;
    if (isMobile) {
      // Para mobile, limitamos palavras ao topo da section (40% da altura)
      protectedArea = {
        left: 0,
        right: sectionWidth,
        top: sectionHeight * 0.4, // o "protected" inferior começa daqui
        bottom: sectionHeight,
      };
    } else {
      // Desktop mantém a área original
      protectedArea = getProtectedArea();
    }

    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      let x = Math.random() * (sectionWidth - word.offsetWidth);
      let y = Math.random() * (sectionHeight - word.offsetHeight);

      // Para mobile, forçamos y dentro da área superior
      if (isMobile) {
        y = Math.random() * (sectionHeight * 0.4 - word.offsetHeight);
      }

      word.style.left = x + "px";
      word.style.top = y + "px";

      const relativeRect = {
        left: x,
        right: x + word.offsetWidth,
        top: y,
        bottom: y + word.offsetHeight,
      };

      // colisão com palavras existentes
      let collision = existingWords.some(
        (existing) =>
          relativeRect.left < existing.right + padding &&
          relativeRect.right > existing.left - padding &&
          relativeRect.top < existing.bottom + padding &&
          relativeRect.bottom > existing.top - padding
      );

      // colisão com área protegida
      const inProtectedArea =
        relativeRect.left < protectedArea.right &&
        relativeRect.right > protectedArea.left &&
        relativeRect.top < protectedArea.bottom &&
        relativeRect.bottom > protectedArea.top;

      if (!collision && !inProtectedArea) {
        existingWords.push(relativeRect);
        placed = true;
      }
    }

    if (!placed) {
      console.warn("⚠️ Não foi possível posicionar a palavra sem colisão");
    }

    // efeito de pop
    gsap.from(word, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });

    // movimento flutuante leve
    gsap.to(word, {
      x: "+=" + (Math.random() * 20 - 10),
      y: "+=" + (Math.random() * 20 - 10),
      rotation: Math.random() * 5 - 2.5,
      duration: Math.random() * 3 + 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  // Submeter formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) addWord(text);
    input.value = "";
  });

  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) addWord(text);
    input.value = "";
  });

  // Palavras iniciais
  const initialWords = [
    "Criatividade",
    "Empatia",
    "Ideias",
    "Inovação",
    "Curiosidade",
  ];
  initialWords.forEach(addWord);
});
