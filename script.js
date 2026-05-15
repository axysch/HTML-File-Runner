const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const viewer = document.getElementById("viewer");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let savedGames =
  JSON.parse(localStorage.getItem("savedGames"))
  || [];

createGameList();

function loadFile(file) {

  if (!file || !file.name.endsWith(".html")) {
    alert("Please upload an HTML file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {

    const content = e.target.result;

    // BACK TO SRCDOC
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

    try {

      localStorage.setItem(
        "savedGames",
        JSON.stringify(savedGames)
      );

    } catch (e) {

      alert(
        "Storage full. Delete some saved games."
      );
    }

    createGameList();
  }
}

function createGameList() {

  let oldList =
    document.getElementById("gameList");

  if (oldList) oldList.remove();

  const list =
    document.createElement("div");

  list.id = "gameList";

  list.innerHTML = `
    <h2>Saved Games</h2>
  `;

  savedGames.forEach((game, index) => {

    const item =
      document.createElement("div");

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
      .onclick = () => {

        // BACK TO SRCDOC
        viewer.srcdoc =
          savedGames[index].content;
      };

    item.querySelector(".delete-btn")
      .onclick = () => {

        savedGames.splice(index, 1);

        localStorage.setItem(
          "savedGames",
          JSON.stringify(savedGames)
        );

        createGameList();
      };

    list.appendChild(item);
  });

  document.querySelector(".app")
    .appendChild(list);
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

  const container =
    document.getElementById("viewerContainer");

  if (container.requestFullscreen) {

    container.requestFullscreen();
  }
});
