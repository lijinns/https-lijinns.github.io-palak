const cardEmojis = ['🪐', '🛸', '🌌', '👽', '☄️', '🚀', '🔭', '🛰️'];
let cards = []; // Will hold doubled pairs
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameActive = false;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const bestScoreEl = document.getElementById('best-score');
const restartBtn = document.getElementById('restart-btn');
const modalRestartBtn = document.getElementById('modal-restart');
const victoryModal = document.getElementById('victory-modal');
const finalMovesEl = document.getElementById('final-moves');
const finalTimeEl = document.getElementById('final-time');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadBestScore();
    startGame();
});

restartBtn.addEventListener('click', startGame);
modalRestartBtn.addEventListener('click', startGame);

function startGame() {
    // Reset State
    gameActive = true;
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    updateStats();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    victoryModal.classList.add('hidden');

    // Create Deck
    const deck = [...cardEmojis, ...cardEmojis];
    shuffle(deck);

    // Render Board
    gameBoard.innerHTML = '';
    deck.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        gameBoard.appendChild(card);
    });
}

function createCard(emoji, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;

    card.innerHTML = `
        <div class="card-face card-front">${emoji}</div>
        <div class="card-face card-back"></div>
    `;

    card.addEventListener('click', () => handleCardClick(card));
    return card;
}

function handleCardClick(card) {
    // Invalid clicks
    if (
        !gameActive || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched') ||
        flippedCards.length >= 2
    ) {
        return;
    }

    // Flip Card
    card.classList.add('flipped');
    flippedCards.push(card);

    // Check Match if 2 cards
    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.emoji === card2.dataset.emoji;

    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];

        if (matchedPairs === cardEmojis.length) {
            endGame();
        }
    } else {
        // No match - delay unflip
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function updateTimer() {
    timer++;
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    timeEl.textContent = `${minutes}:${seconds}`;
}

function updateStats() {
    movesEl.textContent = moves;
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    // Save Best Score
    const currentBest = localStorage.getItem('cosmicInfoBest');
    if (!currentBest || moves < parseInt(currentBest)) {
        localStorage.setItem('cosmicInfoBest', moves);
        loadBestScore(); // Update display
    }

    // Show Modal
    finalMovesEl.textContent = moves;
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    finalTimeEl.textContent = `${minutes}:${seconds}`;
    
    setTimeout(() => {
        victoryModal.classList.remove('hidden');
    }, 500);
}

function loadBestScore() {
    const best = localStorage.getItem('cosmicInfoBest');
    bestScoreEl.textContent = best ? best : '-';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
