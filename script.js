const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const viewer = document.getElementById("viewer");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];

createGameList();

function loadFile(file) {
  if (!file.name.endsWith(".html")) {
    alert("Please upload an HTML file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const content = e.target.result;

    viewer.srcdoc = content;

    saveGame(file.name, content);
  };

  reader.readAsText(file);
}

function saveGame(name, content) {
  const existing = savedGames.find(game => game.name === name);

  if (!existing) {
    savedGames.push({
      name,
      content
    });

    localStorage.setItem("savedGames", JSON.stringify(savedGames));

    createGameList();
  }
}

function createGameList() {
  let oldList = document.getElementById("gameList");

  if (oldList) oldList.remove();

  const list = document.createElement("div");
  list.id = "gameList";

  list.innerHTML = `
    <h2>Saved Games</h2>
  `;

  savedGames.forEach((game, index) => {
    const item = document.createElement("div");

    item.style.marginBottom = "10px";

    item.innerHTML = `
      <button onclick="openGame(${index})">${game.name}</button>
      <button onclick="deleteGame(${index})">Delete</button>
    `;

    list.appendChild(item);
  });

  document.querySelector(".app").appendChild(list);
}

window.openGame = function (index) {
  viewer.srcdoc = savedGames[index].content;
};

window.deleteGame = function (index) {
  savedGames.splice(index, 1);

  localStorage.setItem("savedGames", JSON.stringify(savedGames));

  createGameList();
};

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
  } else if (viewer.webkitRequestFullscreen) {
    viewer.webkitRequestFullscreen();
  } else if (viewer.msRequestFullscreen) {
    viewer.msRequestFullscreen();
  }
});
