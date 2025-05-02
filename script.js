const mazeElement = document.getElementById("maze");
const message = document.getElementById("message");
const levelNumber = document.getElementById("level-number");

// 5 level labirin
const levels = [
  [
    ["S",0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1],
    [1,0,1,1,0,1,0,1,0,1],
    [1,0,1,1,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,"F",1],
  ],
  [
    ["S",0,0,1,1,1,1,1,1,1],
    [1,1,0,1,0,0,0,0,0,1],
    [1,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,"F",1],
  ],
  [
    ["S",0,0,0,0,1,1,1,1,1],
    [1,1,1,1,0,1,0,0,0,1],
    [1,0,0,0,0,1,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,"F",1],
  ],
  [
    ["S",1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,"F",1],
  ],
  [
    ["S",0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,0,1,0,1],
    [1,0,1,0,0,1,0,1,0,1],
    [1,0,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,"F",1],
  ]
];

let level = 0;
let playerPos;
let enemyPos;

function setupLevel() {
  message.textContent = "";
  const layout = levels[level];
  const rows = layout.length;
  const cols = layout[0].length;

  playerPos = findPosition(layout, "S");
  enemyPos = findEmptyPosition(layout);

  mazeElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
  renderMaze(layout);
}

function findPosition(layout, target) {
  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[0].length; col++) {
      if (layout[row][col] === target) return { row, col };
    }
  }
}

function findEmptyPosition(layout) {
  while (true) {
    let row = Math.floor(Math.random() * layout.length);
    let col = Math.floor(Math.random() * layout[0].length);
    if (layout[row][col] === 0) return { row, col };
  }
}

function renderMaze(layout) {
  mazeElement.innerHTML = "";
  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[0].length; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const value = layout[row][col];
      if (value === 1) cell.classList.add("wall");
      else cell.classList.add("path");

      if (row === playerPos.row && col === playerPos.col)
        cell.classList.add("player");
      if (row === enemyPos.row && col === enemyPos.col)
        cell.classList.add("enemy");
      if (value === "F") cell.classList.add("finish");

      if (Math.abs(row - playerPos.row) <= 1 && Math.abs(col - playerPos.col) <= 1)
        cell.classList.add("visible");

      mazeElement.appendChild(cell);
    }
  }
}

function movePlayer(dir) {
  const layout = levels[level];
  const { row, col } = playerPos;
  let [r, c] = [row, col];
  if (dir === "ArrowUp") r--;
  else if (dir === "ArrowDown") r++;
  else if (dir === "ArrowLeft") c--;
  else if (dir === "ArrowRight") c++;

  if (
    r >= 0 && r < layout.length &&
    c >= 0 && c < layout[0].length &&
    layout[r][c] !== 1
  ) {
    playerPos = { row: r, col: c };

    if (r === enemyPos.row && c === enemyPos.col) {
      message.textContent = "Kamu tertangkap musuh!";
      return;
    }

    if (layout[r][c] === "F") {
      if (level < levels.length - 1) {
        level++;
        levelNumber.textContent = level + 1;
        setupLevel();
      } else {
        message.textContent = "Selamat, kamu menang semua level!";
      }
      return;
    }

    renderMaze(layout);
  }
}

function moveEnemy() {
  const layout = levels[level];
  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 }
  ];
  const shuffled = dirs.sort(() => Math.random() - 0.5);
  for (const d of shuffled) {
    const newR = enemyPos.row + d.r;
    const newC = enemyPos.col + d.c;
    if (
      newR >= 0 && newR < layout.length &&
      newC >= 0 && newC < layout[0].length &&
      layout[newR][newC] === 0
    ) {
      enemyPos = { row: newR, col: newC };

      // tangkap pemain
      if (enemyPos.row === playerPos.row && enemyPos.col === playerPos.col) {
        message.textContent = "Kamu tertangkap musuh!";
      }

      renderMaze(layout);
      break;
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    movePlayer(e.key);
  }
});

setupLevel();
setInterval(() => moveEnemy(), 700);
