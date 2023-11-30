`use strict`;

// Variabler för de classer som vi vill hämta in
const inputNamePlayerOne = document.querySelector(`.input-name-player-one`);
const namePlayer1Data = document.querySelector(`.name-player-1-data`);
const inputNamePlayerTwo = document.querySelector(`.input-name-player-two`);
const playerOne = document.querySelector(`.player-one`);
const playerTwo = document.querySelector(`.player-two`);

const playPvpBtn = document.querySelector(`.play-game-btn`);
const playPveBtn = document.querySelector(`.Starta`);
const btnOneVsOne = document.querySelector('.btn-one-vs-one');
const btnVsComputer = document.querySelector('.btn-vs-computer');
const pvpPage = document.querySelector(`.PVP`);
const gamePage = document.querySelector(`.memory-game`);
const sectionMeny = document.querySelector('.section-meny');
const sectionData = document.querySelector('.section-data');

const img = document.querySelector(`.hidden1`);

// När man klickar på knappen 1vs1 så kommer man till skriva in namn delen för spel mot varandra
btnOneVsOne.addEventListener('click', function () {
    sectionMeny.classList.add('hidden-meny');
    pvpPage.classList.remove('hidden-pvp');
});
// När man klickar på knappen dator så kommer man till skriva in namn delen för spel mot dator
btnVsComputer.addEventListener('click', function () {
    sectionMeny.classList.add('hidden-meny');
    sectionData.classList.remove('hidden-data');
});
// När man klickar på knappen starta spelet så kommer man till spelet, i den här functionen skriver man också in namen på spelarna
playPvpBtn.addEventListener(`click`, function () {
    if (inputNamePlayerOne.value.trim() !== '') {
        // Om den inte är tom får jag inpiut value, om den är tom får jag html value.
        playerOne.textContent = inputNamePlayerOne.value;
    }
    if (inputNamePlayerTwo.value.trim() !== '') {
        // Om den inte är tom får jag inpiut value, om den är tom får jag html value.
        playerTwo.textContent = inputNamePlayerTwo.value;
    }
    pvpPage.classList.add(`hidden-pvp`);
    gamePage.classList.remove(`hidden-game`);
});
// När man klickar på knappen starta spelet så kommer man till spelet, i den här functionen skriver man också in namen på spelarna samt väljer svårehetsgrad på datorn
playPveBtn.addEventListener(`click`, function () {
    if (namePlayer1Data.value.trim() !== '') {
        // Om den inte är tom får jag inpiut value, om den är tom får jag html value.
        playerOne.textContent = namePlayer1Data.value;
    }
    playerTwo.textContent = `Dator`;
    sectionData.classList.add(`hidden-data`);
    gamePage.classList.remove(`hidden-game`);
});

// function som gör så att datorn väljer två kort när det är datorns tur
function computerMove() {
    const unflippedCards = Array.from(cards).filter(card => !card.classList.contains('is-flipped'));
    setTimeout(() => {
        for (let i = 0; i < 1000; i++) {
            const cs = Math.floor(Math.random() * unflippedCards.length);
            cardClicker(unflippedCards[cs]);
        }
    }, 700);
}

// Bilderna till memoryt
let images = [
    `assets/Bowser_Jr.png`,
    `assets/Bowser.png`,
    `assets/Daisy.png`,
    `assets/DiddyReturns.png`,
    `assets/Donkey_Kong.png`,
    `assets/Luigi.png`,
    `assets/Mario.png`,
    `assets/Princess_Peach.png`,
    `assets/Toad.png`,
    `assets/Waluigi.png`,
    `assets/Wario.png`,
    `assets/Yoshi.png`,
];

// En tom array där de shufflade bilderna läggs i
let deck = [];

// Blandar bilderna och gör de 12 kort * 2
function shuffleCards() {
    deck = images.concat(images);
    for (let i = 0; i < deck.length; i++) {
        let k = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[k];
        deck[k] = temp;
    }
}
shuffleCards();

// Den här funktionen tar "deck" och delar ut random på enskild card
function spreadCards(card) {
    let randomIndex = Math.floor(Math.random() * deck.length);
    let faceBackImg = card.querySelector('.card-face--front img');
    faceBackImg.src = deck[randomIndex];
    deck.splice(randomIndex, 1);
}
// Variabel varje kort
let cards = document.querySelectorAll(`.cards`);

// Tar varje kort så man kan klicka på dem
for (let i = 0; i < cards.length; i++) {
    spreadCards(cards[i]);

    cards[i].addEventListener(`click`, e => {
        cardClicker(cards[i]);
    });
}

//Variabel tom array för de kort som är öppna
let openCards = [];

//Functionen kollar om det är 2 öppna kort så kallar de på functionen "cardsmatch"
function cardClicker(card) {
    if (openCards.length < 2 && !card.classList.contains('is-flipped')) {
        card.classList.toggle(`is-flipped`);
        openCards.push(card);
        if (openCards.length === 2) {
            setTimeout(cardsMatch, 1300);
        }
    }
}
// Tom array för de kort som är vända och lika
let pairCards = [];

// Functionen kollar om de 2 kort som är öppna är lika eller inte, om de är lika kallar de på functionen "updateScore" att det ska uppdatera score, lägga de korten i "pairCards". om de inte är lika vänds de tillbaka och functionen "switchplayer" kallas
function cardsMatch() {
    let card1 = openCards[0].querySelector('.card-face--front > img');
    let card2 = openCards[1].querySelector('.card-face--front > img');
    if (card1.src === card2.src) {
        tooglecards(openCards);
        pairCards.push(card1, card2);
        updateScore(currentPlayer);
        endGame();
        openCards = [];
        if (playerTwo.textContent === `Dator` && currentPlayer === 1) {
            computerMove();
        }
    } else {
        openCards[0].classList.toggle(`is-flipped`);
        openCards[1].classList.toggle(`is-flipped`);
        openCards = [];
        switchPlayer();
    }
}
// Denna functionen är till för när paren är lika så vänds korten inte tillbaka.
function tooglecards(card) {
    card[0].querySelector('.card-face--front > img').classList.add(`hidden`);
    card[1].querySelector('.card-face--front > img').classList.add(`hidden`);
    card[0].style.pointerEvents = 'none';
    card[1].style.pointerEvents = 'none';
}
// Variabler för att uppdatera score
let scorePlayerOne = document.querySelector(`.score-player-one`);
let scorePlayerTwo = document.querySelector(`.score-player-two`);
let currentPlayer = 1;
let score = [0, 0];

// Uppdaterar score ut ifrån vilken spelare som fått det
function updateScore(player) {
    score[player]++;
    renderscore();
}
// Uppdatera textcontent för score
function renderscore() {
    scorePlayerOne.textContent = `Score: ${score[0]}`;
    scorePlayerTwo.textContent = `Score: ${score[1]}`;
}

// Denna function gör så det byts spelare, när det byts spelare så byts färgen till grön på den aktiva spelaren
function switchPlayer() {
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    if (currentPlayer === 0) {
        playerOne.style.color = '#2a9d8f';
        playerTwo.style.color = '';
        scorePlayerOne.style.color = '#2a9d8f';
        scorePlayerTwo.style.color = '';
    } else if (currentPlayer === 1) {
        playerOne.style.color = '';
        scorePlayerOne.style.color = '';
        playerTwo.style.color = '#2a9d8f';
        scorePlayerTwo.style.color = '#2a9d8f';
        if (playerTwo.textContent === `Dator`) {
            computerMove();
        }
    }
}
switchPlayer();
// Variabler, kalla på class, för reset av spelet.
const resetBtn = document.querySelector('.resetgame');
const closeBtn = document.querySelector('.closebtn');
const alert = document.querySelector('.alert');

// Denna function bestämmer när en spelare har vunnit/inte vunnit spelet och vad som händer då.
function endGame() {
    if (pairCards.length === cards.length) {
        if (score[0] > score[1]) {
            alert.classList.remove('hidden-winner');
            if (inputNamePlayerOne.value === ``) {
                closeBtn.textContent = `Player 1 vann!!`;
            } else {
                closeBtn.textContent = `${inputNamePlayerOne.value} vann!!`;
            }
        } else if (score[0] < score[1]) {
            alert.classList.remove('hidden-winner');
            if (inputNamePlayerTwo.value === ``) {
                closeBtn.textContent = `Player 2 vann!!`;
            } else {
                closeBtn.textContent = `${inputNamePlayerTwo.value} vann!!`;
            }
        } else {
            alert.classList.remove('hidden-winner');
            closeBtn.textContent = 'Det blev lika';
        }
    }
}

// Vid klick av "newgame" spelet startar om från menyn
document.querySelector('.newgame').addEventListener('click', function () {
    document.location.reload();
});

// Vänder tillbaka korten och sprider ut nya random kort
function removetoogle() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove(`is-flipped`);
        cards[i].style.pointerEvents = 'auto';
        setTimeout(() => {
            cards[i].querySelector('.card-face--front > img').classList.remove(`hidden`);
            spreadCards(cards[i]);
        }, 1000);
    }
}

// Reset av spelet function
function resetGame() {
    pairCards = []; // hämtar array clickedCards för reset av det

    openCards = []; // hämtar array openCards för reset av det

    deck = []; // hämtar array deck för reset av det

    score = [0, 0]; // hämtar array score för reset av det

    renderscore(); // hämtar function renderscore för reset av det

    shuffleCards(); // hämtar function shuffleCards för reset av det

    removetoogle(); // hämtar function removetoggle för reset av det

    endGame(); // hämtar function endGame för reset av det
}
// Reset av spelet när klick, spela igen när en spelare vunnit
closeBtn.addEventListener('click', function () {
    resetGame();
    alert.classList.add('hidden-winner');
});

resetBtn.addEventListener('click', resetGame); // reset av spelet när man klickar på knappen reset
