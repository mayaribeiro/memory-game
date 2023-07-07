const grid = document.querySelector('.grid');

// VARIÁVEIS
let firstCard = '';
let secondCard = '';
let shuffledArray = [];

const characters = [
    'aliens.webp',
    'bala.webp',
    'buzz.webp',
    'hamm.webp',
    'jessie.png',
    'rex.webp',
    'slinky.png',
    'sr-e-sra-cabeca-de-batata.webp',
    'woody.webp',
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card')

    if(disabledCards.length == shuffledArray.length) {
        setTimeout(() => {
            Swal.fire({
                title: 'Você ganhou!',
                text: 'Vá verificar sua posição no ranking.',
                imageUrl: '../images/woody-endgame.png',
                imageWidth: 122,
                imageHeight: 214,
                imageAlt: 'Woody',
            })
        }, 500);
        
    }
}

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
    if(firstCard == '') {
        target.parentNode.classList.add('reveal-card');
        firstCard = target.parentNode;
    } else if(secondCard == '') {
        target.parentNode.classList.add('reveal-card');
        secondCard = target.parentNode;
    }

    checkCards();
    
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

loadGame();