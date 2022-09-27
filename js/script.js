import { emoji } from "./emoji.js";

const openCards = [];
let cardsOpenAll = 0;
let attempts = 0;
let gameWhidth = 0;
let gameHeigth = 0;

function createTable(whidth, heigth) {
  gameWhidth = whidth;
  gameHeigth = heigth;
  const body = document.getElementsByTagName("body")[0];
  const gameTable = document.createElement("div");
  gameTable.classList.add("gameTable");
  body.appendChild(gameTable);

  const cardArr = [];

  for (let i = 0; i < (gameWhidth * gameHeigth) / 2; i++) {
    const randomEmoji = Math.floor(Math.random() * emoji.length);
    console.log(randomEmoji);
    cardArr.push(emoji[randomEmoji]);
    cardArr.push(emoji[randomEmoji]);
    emoji.splice(randomEmoji, 1);
  }

  cardArr.sort((a, b) => 0.5 - Math.random());

  function nextContent() {
    return cardArr.pop();
  }

  for (let i = 0; i < gameWhidth; i++) {
    let row = document.createElement("div");
    row.classList.add("row");
    gameTable.appendChild(row);

    for (let k = 0; k < gameHeigth; k++) {
      let card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-x", k);
      card.setAttribute("data-y", i);
      card.setAttribute("data-content", nextContent());
      card.addEventListener("click", openCard);
      row.appendChild(card);
    }
  }
}
// createTable();

function closeAllCards() {
  for (let i = 0; i < openCards.length; i++) {
    const elements = openCards[i].split(":");
    const x = elements[0];
    const y = elements[1];

    const closeCard = document.querySelector(
      `.card[data-x='${x}'][data-y='${y}']`
    );
    closeCard.innerHTML = "";
    console.log(closeCard);
    closeCard.classList.remove("open");
  }
  openCards.splice(0);
}

function openCard(event) {
  const div = event.target;
  const coords = {
    x: div.dataset.x,
    y: div.dataset.y,
  };
  const divCoord = coords.x + ":" + coords.y;
  if (!openCards.includes(divCoord)) {
    if (openCards.length == 2) {
      closeAllCards();
    }

    openCards.push(divCoord);
    div.classList.add("open");
    div.innerHTML = div.dataset.content;

    if (openCards.length == 2) {
      attempts += 1;
      const elements1 = openCards[0].split(":");
      const x1 = elements1[0];
      const y1 = elements1[1];

      const card1 = document.querySelector(
        `.card[data-x='${x1}'][data-y='${y1}']`
      );

      const elements2 = openCards[1].split(":");
      const x2 = elements2[0];
      const y2 = elements2[1];

      const card2 = document.querySelector(
        `.card[data-x='${x2}'][data-y='${y2}']`
      );

      const content1 = card1.dataset.content;
      const content2 = card2.dataset.content;

      if (content1 == content2) {
        card1.removeEventListener("click", openCard);
        card2.removeEventListener("click", openCard);
        openCards.splice(0);
        cardsOpenAll += 2;
        if (cardsOpenAll == gameHeigth * gameWhidth) {
          setTimeout(() => alert(`Ви перемогли через ${attempts} спроб`));
        }
      }
    }
  }
}

function startGame(w, h) {
  let element = document.querySelector(".gameTable");
  element?.remove();
  createTable(w, h);
}

const easy = document.getElementById("easy");
easy.addEventListener("click", function () {
  startGame(2, 2);
});

const normal = document.getElementById("normal");
normal.addEventListener("click", function () {
  startGame(3, 4);
});

const hard = document.getElementById("hard");
hard.addEventListener("click", function () {
  startGame(5, 6);
});
