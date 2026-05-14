const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const gameList = document.getElementById("gameList");
const viewer = document.getElementById("viewer");
const fullscreenBtn =
  document.getElementById("fullscreenBtn");

const viewerContainer =
  document.getElementById("viewerContainer");

let savedGames =
  JSON.parse(localStorage.getItem("savedGames")) || [];

renderGames();

function loadFile(file) {
  if (!file.name.endsWith(".html")) {
    alert("Only .html files allowed");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    saveGame(file.name, e.target.result);

    openGame({
      name: file.name,
      content: e.target.result
    });
  };

  reader.readAsText(file);
}

function saveGame(name, content) {
  const exists =
    savedGames.find(g => g.name === name);

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

function openGame(game) {
  viewer.srcdoc = game.content;

  setTimeout(() => {
    viewer.contentWindow.focus();
  }, 500);
}

function deleteGame(index) {
  savedGames.splice(index, 1);

  localStorage.setItem(
    "savedGames",
    JSON.stringify(savedGames)
  );

  renderGames();
}

function renderGames() {
  gameList.innerHTML =
    "<h2>Saved Games</h2>";

  savedGames.forEach((game, index) => {

    const div = document.createElement("div");

    div.className = "game-item";

    div.innerHTML = `
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

    div.querySelector(".open-btn")
      .onclick = () => openGame(game);

    div.querySelector(".delete-btn")
      .onclick = () => deleteGame(index);

    gameList.appendChild(div);
  });
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

  loadFile(e.dataTransfer.files[0]);
});

fullscreenBtn.addEventListener("click", () => {

  if (viewerContainer.requestFullscreen) {
    viewerContainer.requestFullscreen();
  }

  setTimeout(() => {
    viewer.contentWindow.focus();
  }, 500);
});
