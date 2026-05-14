const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const gameList = document.getElementById("gameList");

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
    const content = e.target.result;

    saveGame(file.name, content);
  };

  reader.readAsText(file);
}

function saveGame(name, content) {
  const exists = savedGames.find(g => g.name === name);

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
  // create blob html page
  const blob = new Blob(
    [game.content],
    { type: "text/html" }
  );

  const url = URL.createObjectURL(blob);

  window.open(url, "_blank");
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
        openGame(game);
      });

    item.querySelector(".delete-btn")
      .addEventListener("click", () => {
        deleteGame(index);
      });

    gameList.appendChild(item);
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

  const file = e.dataTransfer.files[0];

  loadFile(file);
});
