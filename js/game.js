const grid = document.querySelector('.grid');
const telaRanking = document.querySelector('.telaRanking');
const playersRanking = document.querySelector('.players-ranking');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const counter = document.querySelector('.counter');
const restartGame = document.querySelector('.restart-game');
const rankingButton = document.querySelector('.ranking');
const buttonClose = document.querySelector('.buttonClose');

// VARIÁVEIS
let firstCard = '';
let secondCard = '';
let shuffledArray = [];
let count = 0;
let isTimeStarted = false;
let players = [];
let playerName = '';
let playerTime = '';
let playerCounter = '';

const characters = [
    'aliens.png',
    'bala.webp',
    'buzz.webp',
    'hamm.webp',
    'jessie.png',
    'rex.png',
    'slinky.png',
    'sr-e-sra-cabeca-de-batata.webp',
    'woody.png',
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card')

    if(disabledCards.length == shuffledArray.length) {
        clearInterval(this.loop);
        setTimeout(() => {
            Swal.fire({
                title: `${spanPlayer.innerHTML}, você ganhou!`,
                html: `Seu tempo: ${timer.innerHTML}
                <br>Suas jogadas: ${counter.innerHTML}
                <br>Vá verificar sua posição no ranking.`,
                imageUrl: '../images/woody-endgame.png',
                imageWidth: 122,
                imageHeight: 214,
                imageAlt: 'Woody',
            })
        }, 500);
        ranking();
    }
}

const ranking = () => {
    if(localStorage.rankingPlayers){
        players = JSON.parse(localStorage.getItem("rankingPlayers"));
    }
    
    const playerInfo = {
        playerName: spanPlayer.innerHTML,
        playerTime: timer.innerHTML,
        playerCounter: counter.innerHTML
    };

    players.push(playerInfo);
    localStorage.rankingPlayers = JSON.stringify(players);
}

const showRanking = () => {
    playersRanking.innerHTML = '';
    if(localStorage.rankingPlayers) {
        players = JSON.parse(localStorage.getItem("rankingPlayers"));
    }

    players.forEach(player => {
        const average = (parseFloat(player.playerTime) + parseFloat(player.playerCounter)) / 2;
        player.average = average;
    });
    
    players.sort((a, b) => a.average - b.average);

    for (let index = 0; index < players.length; index++) {
        const { playerName, playerTime, playerCounter } = players[index];
        let p = document.createElement("p");
        p.innerHTML = `<br>${playerName} <br> Tempo: ${playerTime} <br> Jogadas: ${playerCounter}`;
        playersRanking.append(p);
    }
}

rankingButton.onclick = function() {
    showRanking();
    telaRanking.showModal();
}

buttonClose.onclick = function() {
    telaRanking.close();
}

const restart = () => {
    window.location.reload();
}
restartGame.addEventListener('click', restart);

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');
    
    if(firstCharacter == secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        firstCard = '';
        secondCard = '';

        checkEndGame();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');

            firstCard = '';
            secondCard = '';
        }, 500);
        
    }
}

const revealCard = ({target}) => {
    if(target.parentNode.className.includes('reveal-card')) {
        return;
    }
    if(firstCard == '' && !target.parentNode.classList.contains("grid")) {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
        if(!isTimeStarted) {
            isTimeStarted = true;
            startTimer();
            setTimeout(() => {
                grid.classList.add('reveal-card');
                shuffledArray.forEach((card) => card.classList.add('reveal-card'));
                setTimeout(() => {
                    grid.classList.remove('reveal-card');
                    shuffledArray.forEach((card) => card.classList.remove('reveal-card'));
                }, CARD_REVEAL_TIME);
            }, CARD_HIDE_DELAY);
        }
    } else if(secondCard == '' && !target.parentNode.classList.contains("grid")) {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;
        count++;
        counter.innerHTML = count;
        checkCards();
    }
}

const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');
    

    front.style.backgroundImage = `url(../images/${character})`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-character', character);

    return card;
}

const loadGame = () => {
    const duplicateCharacters = [ ... characters, ... characters];

    shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
}

const startTimer = () => {
    this.loop = setInterval(() => {
        const currentTime = +timer.innerHTML;
        timer.innerHTML = currentTime + 1;
    }, 1000)
}

const revealAllCards = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.classList.add('reveal-card');
    });
}
  
  const hideAllCards = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => {
      card.classList.remove('reveal-card');
    });
  }

window.onload = () => {
    spanPlayer.innerHTML = localStorage.getItem('player');
    loadGame();
    hideAllCards();
    setTimeout(() => {
    revealAllCards();
    setTimeout(() => {
      hideAllCards(); 
    }, 3000);
  }, 1000);
}
