const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const gameList = document.getElementById("gameList");

let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];

renderGames();

function loadFile(file) {
  if (!file.name.endsWith(".html")) {
    alert("Only .html files allowed");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    saveGame(file.name, e.target.result);
  };

  reader.readAsText(file);
}

function saveGame(name, content) {
  if (!savedGames.find(g => g.name === name)) {
    savedGames.push({ name, content });

    localStorage.setItem("savedGames", JSON.stringify(savedGames));

    renderGames();
  }
}

function openGame(game) {
  const win = window.open();

  win.document.open();
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${game.name}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; background: black; }
      </style>
    </head>
    <body>
      ${game.content}
    </body>
    </html>
  `);
  win.document.close();
}

function deleteGame(index) {
  const name = savedGames[index].name;

  let gameData = JSON.parse(localStorage.getItem("gameData")) || {};
  delete gameData[name];

  localStorage.setItem("gameData", JSON.stringify(gameData));

  savedGames.splice(index, 1);
  localStorage.setItem("savedGames", JSON.stringify(savedGames));

  renderGames();
}

function renderGames() {
  gameList.innerHTML = "<h2>Saved Games</h2>";

  savedGames.forEach((game, index) => {
    const div = document.createElement("div");
    div.className = "game-item";

    div.innerHTML = `
      <div class="game-name">${game.name}</div>
      <button class="open-btn">Open</button>
      <button class="delete-btn">Delete</button>
    `;

    div.querySelector(".open-btn").onclick = () => openGame(game);
    div.querySelector(".delete-btn").onclick = () => deleteGame(index);

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
