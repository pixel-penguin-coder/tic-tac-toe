const gameStartContainer = document.querySelector("#game-start");
const gameStartButton = document.querySelector("#game-start-button");
const gameBoardContainer = document.querySelector("#gameboard-container");
const gameBoardCells = [...document.querySelectorAll("[data-cell]")];
const gameOverContainer = document.querySelector("#game-over");
const gameOverText = document.querySelector("#game-over-text");
const gameOverButton = document.querySelector("#game-over-button");

let currentPlayer = "cross";
let crossWin = false;
let circleWin = false;

gameStartButton.addEventListener("click", changeToGame);
gameBoardCells.forEach((cell) =>
  cell.addEventListener("click", handleCellClick)
);
gameOverButton.addEventListener("click", resetGame);

function changeToGame() {
  gameStartContainer.classList.add("hide");
  gameBoardContainer.classList.remove("hide");
}

function handleCellClick(e) {
  if (
    crossWin ||
    circleWin ||
    gameBoardCells.every((cell) => cell.hasChildNodes())
  )
    return;
  if (currentPlayer === "cross") {
    const crossMark = document.createElement("div");
    crossMark.classList.add(currentPlayer);
    e.target.appendChild(crossMark);
    e.target.removeEventListener("click", handleCellClick);
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
  }
  winner();
  setTimeout(circleTurn, 1000);
}

function circleTurn() {
  if (currentPlayer === "cross") return;
  else if (currentPlayer === "circle") {
    const availableCellId = gameBoardCells
      .filter((cell) => !cell.hasChildNodes())
      .map((cell) => cell.id);
    const randomCellId =
      availableCellId[Math.floor(Math.random() * availableCellId.length)];
    const circleMark = document.createElement("div");
    circleMark.classList.add(currentPlayer);
    document.getElementById(randomCellId)?.appendChild(circleMark);
    document
      .getElementById(randomCellId)
      ?.removeEventListener("click", handleCellClick);
    currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
  }
  winner();
}

function winner() {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getMarkIds = (mark) =>
    [...document.querySelectorAll(`.${mark}`)].map(
      (cell) => cell.parentNode.id
    );
  const crossMarkIds = getMarkIds("cross");
  const circleMarkIds = getMarkIds("circle");

  const checkWin = (markIds) =>
    winningCombination.some((combination) =>
      combination.every((cell) => markIds.includes(cell.toString()))
    );
  crossWin = checkWin(crossMarkIds);
  circleWin = checkWin(circleMarkIds);
  setTimeout(getWinningMessage, 500);
}

function getWinningMessage() {
  if (
    crossWin ||
    circleWin ||
    gameBoardCells.every((cell) => cell.hasChildNodes())
  ) {
    if (crossWin) {
      gameOverText.textContent = "Cross Win!";
    } else if (circleWin) {
      gameOverText.textContent = "Circle Win!";
    } else {
      gameOverText.textContent = "Draw!";
    }
    gameOverContainer.classList.remove("hide");
    gameBoardContainer.classList.add("hide");
  }
}

function resetGame() {
  currentPlayer = "cross";
  crossWin = false;
  circleWin = false;
  gameBoardCells.forEach((cell) => {
    cell.innerHTML = "";
    cell.addEventListener("click", handleCellClick);
  });
  gameOverContainer.classList.add("hide");
  gameBoardContainer.classList.remove("hide");
}
