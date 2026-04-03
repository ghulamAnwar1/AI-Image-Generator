const themeToggle = document.querySelector(".theme-toggle");
const promptForm = document.querySelector(".prompt-form");
const promptInput = document.querySelector(".prompt-input");
const promptBtn = document.querySelector(".prompt-btn");
const generateBtn = document.querySelector(".generate-btn");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");
const baseSize = 512;
const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushroom",
  "A robot painting in a sunny studio with art supplies around it",
  "A floating island with waterfalls pouring into clouds below",
  "A dragon sleeping on gold coins in crystal cave",
  "A cozy library with infinite bookshelves and floating candles",
  "Japanese temple covered in cherry blossoms during snowfall",
  "Underwater city with glass domes and colorful coral buildings",
  "Mermaid with bioluminescent scales sitting on moonlit rock",
  "Samurai warrior with armor made of autumn leaves",
  "Friendly ghost reading books in an old library",
  "Rainy street where raindrops freeze into crystal flowers",
  "Vintage typewriter writing stories that become real scenes",
  "Hot air balloons made of patchwork quilts at sunset",
  "Music notes turning into birds and flying from piano",
];

// theme
(() => {
  const savedTheme = localStorage.getItem("theme");
  const systemPreferDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const isDarkTheme =
    savedTheme === "dark" || (!savedTheme && systemPreferDark);
  document.body.classList.toggle("dark-theme", isDarkTheme);
  themeToggle.querySelector("i").className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
})();

const toggleTheme = () => {
  const isDarkTheme = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
  themeToggle.querySelector("i").className = isDarkTheme
    ? "fa-solid fa-sun"
    : "fa-solid fa-moon";
};

const getImageDimensions = (aspectRatio) => {
  const [width, height] = aspectRatio.split("/").map(Number);
  const scaleFactor = baseSize / Math.sqrt(width * height);
  let calculateWidth = Math.round(width * scaleFactor);
  let calculateHeight = Math.round(height * scaleFactor);
  calculateHeight = Math.floor(calculateHeight / 16) * 16;
  calculateWidth = Math.floor(calculateWidth / 16) * 16;
  return { width: calculateWidth, height: calculateHeight };
};

const updateImageCards = (imgIndex, imgUrl) => {
  const imgCard = document.getElementById(`img-card-${imgIndex}`);
  if (!imgCard) return;
  imgCard.classList.remove("loading");
  imgCard.innerHTML = `<img src="${imgUrl}" class="result-img" />
              <div class="img-overlay">
                <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                  <i class="fa-solid fa-download"></i>
                </a>
              </div>`;
};

const generateImages = async (
  selectModel,
  imageCount,
  aspectRatio,
  promptText,
) => {
  const { width, height } = getImageDimensions(aspectRatio);
  generateBtn.setAttribute("disabled", "true");

  const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
    try {
      // Using picsum.photos for reliable dummy images (no API key, no CORS)
      await new Promise((r) => setTimeout(r, 1500));
      const imageUrl = `https://picsum.photos/${width}/${height}?random=${Date.now() + i}`;
      updateImageCards(i, imageUrl);
    } catch (error) {
      console.log(error);
      const imgCard = document.getElementById(`img-card-${i}`);
      if (!imgCard) return;
      imgCard.classList.replace("loading", "error");
      imgCard.querySelector(".status-text").textContent = "Generation failed!";
    }
  });

  await Promise.allSettled(imagePromises);
  generateBtn.removeAttribute("disabled");
};

const createImageCards = (selectModel, imageCount, aspectRatio, promptText) => {
  gridGallery.innerHTML = "";
  for (let i = 0; i < imageCount; i++) {
    gridGallery.innerHTML += `
    <div class="img-card loading" id="img-card-${i}" style="aspect-ratio:${aspectRatio}">
      <div class="status-container">
        <div class="spinner"></div>
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p class="status-text">Generating....</p>
      </div>
    </div>`;
  }
  generateImages(selectModel, imageCount, aspectRatio, promptText);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const selectModel = modelSelect.value;
  const imageCount = parseInt(countSelect.value) || 1;
  const aspectRatio = ratioSelect.value || "1/1";
  const promptText = promptInput.value.trim();
  createImageCards(selectModel, imageCount, aspectRatio, promptText);
};

promptBtn.addEventListener("click", () => {
  const prompt =
    examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  promptInput.value = prompt;
  promptInput.focus();
});

promptForm.addEventListener("submit", handleFormSubmit);
themeToggle.addEventListener("click", toggleTheme);
