const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const viewer = document.getElementById("viewer");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const gameList = document.getElementById("gameList");

let savedGames =
  JSON.parse(localStorage.getItem("savedGames")) || [];

renderGames();

function loadFile(file) {
  if (!file.name.endsWith(".html")) {
    alert("Please upload an HTML file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const content = e.target.result;

    viewer.srcdoc = content;

    saveGame(file.name, content);
  };

  reader.readAsText(file);
}

function saveGame(name, content) {
  const exists =
    savedGames.find(game => game.name === name);

  if (!exists) {
    savedGames.push({
      name,
      content
    });

    localStorage.setItem(
      "savedGames",
      JSON.stringify(savedGames)
    );

    renderGames();
  }
}

function renderGames() {
  gameList.innerHTML = `
    <h2>Saved Games</h2>
  `;

  savedGames.forEach((game, index) => {
    const item = document.createElement("div");

    item.className = "game-item";

    item.innerHTML = `
      <div class="game-name">
        ${game.name}
      </div>

      <button class="open-btn">
        Open
      </button>

      <button class="delete-btn">
        Delete
      </button>
    `;

    item.querySelector(".open-btn")
      .addEventListener("click", () => {
        viewer.srcdoc = game.content;
      });

    item.querySelector(".delete-btn")
      .addEventListener("click", () => {
        deleteGame(index);
      });

    gameList.appendChild(item);
  });
}

function deleteGame(index) {
  savedGames.splice(index, 1);

  localStorage.setItem(
    "savedGames",
    JSON.stringify(savedGames)
  );

  renderGames();
}

fileInput.addEventListener("change", (e) => {
  loadFile(e.target.files[0]);
});

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();

  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();

  dropArea.classList.remove("dragover");

  const file = e.dataTransfer.files[0];

  loadFile(file);
});

fullscreenBtn.addEventListener("click", () => {
  if (viewer.requestFullscreen) {
    viewer.requestFullscreen();
  }
});
