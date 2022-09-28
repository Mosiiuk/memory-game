import { createGame } from "./game.js";

const app = document.getElementById("app");

createMenu(app);

function m(tag, classes) {
  const el = document.createElement(tag);
  if (classes != null) el.classList.add(classes);
  return el;
}

function onRestart() {
  createMenu();
}

function createMenu() {
  app.innerHTML = "";

  // Title

  const menu = m("div", "header");
  app.appendChild(menu);

  const title = m("h1", "title");
  title.innerHTML = "Hello, welcome to Memory Game.";
  menu.appendChild(title);

  const subTitle = m("h3", "subTitle");
  subTitle.innerHTML = "Select the difficulty level";
  menu.appendChild(subTitle);

  // Buttons

  const buttons = m("div", "buttonsContainer");
  menu.appendChild(buttons);

  function onDifficultySelected(e) {
    const difficulty = e.target.name;

    createGame(app, difficulty, onRestart);
  }

  const buttonEasy = m("button", "level-button");
  buttonEasy.innerHTML = "Easy";
  buttonEasy.name = "easy";
  buttonEasy.addEventListener("click", onDifficultySelected);
  buttons.appendChild(buttonEasy);

  const buttonNormal = m("button", "level-button");
  buttonNormal.innerHTML = "Normal";
  buttonNormal.name = "normal";
  buttonNormal.addEventListener("click", onDifficultySelected);
  buttons.appendChild(buttonNormal);

  const buttonHard = m("button", "level-button");
  buttonHard.innerHTML = "Hard";
  buttonHard.name = "hard";
  buttonHard.addEventListener("click", onDifficultySelected);
  buttons.appendChild(buttonHard);
}
