import { ALL_EMOJIS } from "./emoji.js";

function removeChildren(container) {
  container.innerHTML = "";
}

function getFieldSize(difficulty) {
  switch (difficulty) {
    case "easy":
      return { w: 2, h: 2 };
    case "normal":
      return { w: 3, h: 3 };
    case "hard":
      return { w: 5, h: 5 };
    default:
      throw Error(`Incorrect difficutly: ${difficulty}`);
  }
}

function shuffle(arr) {
  const result = [...arr];
  result.sort((a, b) => 0.5 - Math.random());
  return result;
}

function generateCards(amount) {
  const cards = [];

  const emojis = shuffle([...ALL_EMOJIS]);
  for (let i = 0; i < amount; i++) {
    const emoji = emojis.shift();
    cards.push(emoji);
    cards.push(emoji);
  }

  return shuffle(cards);
}

function getCardCoordsString(card) {
  return card.dataset.x + ":" + card.dataset.y;
}

function getCard(coords) {
  const [x, y] = coords.split(":");
  const card = document.querySelector(`.card[data-x='${x}'][data-y='${y}']`);
  return card;
}

function getCardContent(coords) {
  return getCard(coords).dataset.content;
}

function win(onRestart) {
  const app = document.getElementById("app");
  const victory = document.createElement("div");
  victory.classList.add("victory");
  app.appendChild(victory);

  const titleVictory = document.createElement("div");
  titleVictory.classList.add("titleVictory");
  titleVictory.innerHTML = "Ви виграли";
  victory.appendChild(titleVictory);

  const btnVictory = document.createElement("button");
  btnVictory.classList.add("btnVictory");
  btnVictory.innerHTML = "Рестарт";
  btnVictory.addEventListener("click", onRestart);
  victory.appendChild(btnVictory);
}

function restart() {}

function createGameField(app, game, onCardClicked) {
  const gameTable = document.createElement("div");
  gameTable.classList.add("gameTable");
  app.appendChild(gameTable);

  const allCards = generateCards((game.w * game.h) / 2);

  function nextContent() {
    return allCards.pop();
  }

  for (let y = 0; y < game.h; y++) {
    const row = document.createElement("div");
    row.classList.add("row");
    gameTable.appendChild(row);

    for (let x = 0; x < game.w; x++) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-x", x);
      card.setAttribute("data-y", y);
      card.setAttribute("data-content", nextContent());
      card.addEventListener("click", onCardClicked);
      row.appendChild(card);
    }
  }
}

export function createGame(app, difficulty, onRestart) {
  // очистити все у app
  removeChildren(app);

  // визначити розміри поля за difficulty
  const field = getFieldSize(difficulty);
  const game = {
    ...field,
    openCards: [],
    permanentOpenCardsAmount: 0,
    attempts: 0,
  };

  function isCardOpen(card) {
    const coords = getCardCoordsString(card);

    return game.openCards.includes(coords);
  }

  function hasTwoOpenCards() {
    return game.openCards.length == 2;
  }

  function openCard(card) {
    const coords = getCardCoordsString(card);
    game.openCards.push(coords);

    card.classList.add("open");
    card.innerHTML = card.dataset.content;
  }

  function openCardsForForever() {
    game.openCards.forEach(function (coords) {
      const card = getCard(coords);
      card.removeEventListener("click", openCard);
    });

    game.openCards.splice(0);
    game.permanentOpenCardsAmount += 2;
  }

  function closeAllCards() {
    game.openCards.forEach(function (coords) {
      const closeCard = getCard(coords);
      closeCard.innerHTML = "";
      closeCard.classList.remove("open");
    });
    game.openCards.splice(0);
  }

  function checkWinConditions() {
    const gameSize = game.w * game.h;

    if (game.permanentOpenCardsAmount == gameSize) {
      // TODO виводити поверх ігрового поля <h1>Ви перемогли... і кнопка "повторити"
      win(onRestart);
    }
  }

  function checkOpenCardsAreTheSame() {
    if (!hasTwoOpenCards()) return;

    game.attempts += 1;

    const content1 = getCardContent(game.openCards[0]);
    const content2 = getCardContent(game.openCards[1]);

    if (content1 == content2) {
      // відкриваємо карти назавжди
      openCardsForForever();

      // перевіряємо чи ми виграли
      checkWinConditions();
    }
  }

  function onCardClicked(event) {
    const card = event.target;

    if (isCardOpen(card)) return;

    // перевіряємо чи відкрито дві карти - не даємо відкрити третю
    if (hasTwoOpenCards()) {
      closeAllCards();
    }

    // відкриваємо карту
    openCard(card);

    // перевірити чи дві карти співпадають
    checkOpenCardsAreTheSame();
  }

  // створити поле за розміром
  // додати поле в app
  createGameField(app, game, onCardClicked);
}
