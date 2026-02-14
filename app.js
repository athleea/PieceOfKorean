import KoreanWordGame from './game.js';

// Game instance
let game = new KoreanWordGame();

// DOM elements
const currentGuessEl = document.getElementById('currentGuess');
const consonantGridEl = document.getElementById('consonantGrid');
const vowelGridEl = document.getElementById('vowelGrid');
const player1AttemptsEl = document.getElementById('player1Attempts');
const player2AttemptsEl = document.getElementById('player2Attempts');
const player1BoardEl = document.getElementById('player1Board');
const player2BoardEl = document.getElementById('player2Board');
const playerIndicatorEl = document.getElementById('playerIndicator');
const messageAreaEl = document.getElementById('messageArea');
const gameOverOverlayEl = document.getElementById('gameOverOverlay');
const gameOverTitleEl = document.getElementById('gameOverTitle');
const gameOverMessageEl = document.getElementById('gameOverMessage');
const targetWordDisplayEl = document.getElementById('targetWordDisplay');

// Buttons
const submitBtn = document.getElementById('submitBtn');
const newGameBtn = document.getElementById('newGameBtn');

// Text input
const wordInput = document.getElementById('wordInput');

// Theme toggle
const themeToggle = document.getElementById('themeToggle');

// Initialize UI
function initUI() {
    // Create tiles dynamically based on available tiles (display only)
    renderTileGrids();

    // Initialize current guess display
    renderCurrentGuess();
    updatePlayerBoards();
    updatePlayerIndicator();

    // Focus on word input
    wordInput.maxLength = game.wordLength;
    wordInput.focus();
}

// Theme management
function initTheme() {
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Render consonant and vowel tile grids (display only, no click handlers)
function renderTileGrids() {
    // Clear existing tiles
    consonantGridEl.innerHTML = '';
    vowelGridEl.innerHTML = '';

    // Create consonant tiles - display only (sorted to group identical ones)
    const sortedConsonants = [...game.availableTiles.consonants].sort();
    sortedConsonants.forEach(consonant => {
        const tile = document.createElement('div');
        tile.className = 'w-10 h-10 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-default select-none';
        tile.textContent = consonant;
        consonantGridEl.appendChild(tile);
    });

    // Create vowel tiles - display only (sorted to group identical ones)
    const sortedVowels = [...game.availableTiles.vowels].sort();
    sortedVowels.forEach(vowel => {
        const tile = document.createElement('div');
        tile.className = 'w-10 h-10 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-default select-none';
        tile.textContent = vowel;
        vowelGridEl.appendChild(tile);
    });
}

// Render current guess cells
function renderCurrentGuess() {
    currentGuessEl.innerHTML = '';

    for (let i = 0; i < game.wordLength; i++) {
        const cell = document.createElement('div');
        // Base styling - more prominent shadow and border
        cell.className = 'w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-2xl flex items-center justify-center text-3xl font-black text-slate-800 dark:text-white transition-all duration-200 cursor-pointer select-none shadow-md hover:shadow-lg hover:-translate-y-0.5';

        // Empty but active slot styling
        if (!game.currentGuess[i]) {
            cell.classList.add('bg-slate-50/50', 'dark:bg-slate-800/50', 'border-dashed');
            cell.textContent = '';
        } else if (game.currentGuess[i] === ' ') {
            cell.classList.add('bg-slate-100/50', 'dark:bg-slate-900/40', 'border-none');
            cell.textContent = '';
        } else {
            // Filled character styling
            cell.textContent = game.currentGuess[i];
            cell.classList.replace('border-slate-200', 'border-indigo-500');
            cell.classList.replace('dark:border-slate-600', 'dark:border-indigo-400');
            cell.classList.add('ring-2', 'ring-indigo-100', 'dark:ring-indigo-900/30');
        }

        if (game.selectedTiles.includes(i)) {
            cell.classList.add('ring-4', 'ring-indigo-400', 'ring-offset-2', 'dark:ring-offset-slate-900', 'z-10');
        }
        cell.addEventListener('click', () => handleCellClick(i));
        currentGuessEl.appendChild(cell);
    }
}

// Handle cell click (toggle selection)
function handleCellClick(index) {
    game.selectTile(index);
    renderCurrentGuess();
}

// Text input handler - sync input with game state
wordInput.addEventListener('input', (e) => {
    const text = e.target.value;

    // Clear current guess
    game.clearGuess();

    // Fill in characters from input
    for (let i = 0; i < text.length && i < game.wordLength; i++) {
        const char = text[i];
        if (/[가-힣\s]/.test(char)) {
            game.setCharacter(i, char);
        }
    }

    renderCurrentGuess();
});

// Submit guess
submitBtn.addEventListener('click', () => {
    const result = game.submitGuess();

    if (!result) return;

    if (result.error) {
        showMessage(result.error, 'error');
        return;
    }

    if (result.won) {
        showMessage(`🎉 플레이어 ${game.winner}가 승리했습니다!`, 'success');
        updatePlayerBoards();
        wordInput.value = '';
        setTimeout(() => showGameOver(game.winner), 1000);
        return;
    }

    if (result.gameOver) {
        showMessage('게임이 종료되었습니다. 두 플레이어 모두 기회를 다 사용했습니다.', 'info');
        updatePlayerBoards();
        setTimeout(() => showGameOver(null), 1000);
        return;
    }

    // Update UI
    updatePlayerBoards();
    updatePlayerIndicator();
    renderCurrentGuess();

    // Clear word input
    wordInput.value = '';
    wordInput.focus();
    showMessage(`플레이어 ${game.currentPlayer}의 차례입니다.`, 'info');
});

// Update player boards
function updatePlayerBoards() {
    // Player 1
    player1AttemptsEl.innerHTML = '';
    game.attempts[0].forEach(attempt => {
        const row = document.createElement('div');
        row.className = 'flex gap-2 justify-center mb-2';

        attempt.word.split('').forEach((char, i) => {
            const cell = document.createElement('div');
            const hint = attempt.hints[i];
            let bgColor = 'bg-absent';
            if (hint === 'correct') bgColor = 'bg-correct';
            if (hint === 'present') bgColor = 'bg-present';

            cell.className = `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${bgColor}`;
            cell.textContent = char === ' ' ? '' : char;
            row.appendChild(cell);
        });

        player1AttemptsEl.appendChild(row);
    });

    // Player 2
    player2AttemptsEl.innerHTML = '';
    game.attempts[1].forEach(attempt => {
        const row = document.createElement('div');
        row.className = 'flex gap-2 justify-center mb-2';

        attempt.word.split('').forEach((char, i) => {
            const cell = document.createElement('div');
            const hint = attempt.hints[i];
            let bgColor = 'bg-absent';
            if (hint === 'correct') bgColor = 'bg-correct';
            if (hint === 'present') bgColor = 'bg-present';

            cell.className = `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${bgColor}`;
            cell.textContent = char === ' ' ? '' : char;
            row.appendChild(cell);
        });

        player2AttemptsEl.appendChild(row);
    });

    // Update active board visual state
    if (game.currentPlayer === 1) {
        player1BoardEl.classList.replace('border-transparent', 'border-indigo-400');
        player1BoardEl.classList.add('bg-indigo-50/50', 'dark:bg-indigo-950/20');
        player2BoardEl.classList.replace('border-indigo-400', 'border-transparent');
        player2BoardEl.classList.remove('bg-indigo-50/50', 'dark:bg-indigo-950/20');
    } else {
        player2BoardEl.classList.replace('border-transparent', 'border-indigo-400');
        player2BoardEl.classList.add('bg-indigo-50/50', 'dark:bg-indigo-950/20');
        player1BoardEl.classList.replace('border-indigo-400', 'border-transparent');
        player1BoardEl.classList.remove('bg-indigo-50/50', 'dark:bg-indigo-950/20');
    }
}

// Update player indicator
function updatePlayerIndicator() {
    playerIndicatorEl.textContent = `플레이어 ${game.currentPlayer}의 차례`;
}

// Show message
function showMessage(text, type = 'info') {
    let colorClass = 'text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/40';
    if (type === 'error') colorClass = 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40';
    if (type === 'success') colorClass = 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40';

    messageAreaEl.innerHTML = `
    <div class="inline-block px-6 py-2 rounded-full font-bold shadow-sm animate-bounce ${colorClass}">
      ${text}
    </div>
  `;

    setTimeout(() => {
        messageAreaEl.innerHTML = '';
    }, 3000);
}

// Show game over overlay
function showGameOver(winner) {
    targetWordDisplayEl.textContent = game.targetWord;

    if (winner) {
        gameOverTitleEl.textContent = '🎉 승리!';
        gameOverMessageEl.textContent = `플레이어 ${winner}가 단어를 맞췄습니다!`;
    } else {
        gameOverTitleEl.textContent = '게임 종료';
        gameOverMessageEl.textContent = '두 플레이어 모두 기회를 다 사용했습니다.';
    }

    gameOverOverlayEl.classList.remove('hidden');
}

// New game
newGameBtn.addEventListener('click', () => {
    game.resetGame();
    gameOverOverlayEl.classList.add('hidden');

    // Clear word input
    wordInput.value = '';

    // Re-render everything with new available tiles
    renderTileGrids();
    renderCurrentGuess();
    updatePlayerBoards();
    updatePlayerIndicator();
    wordInput.maxLength = game.wordLength;
    wordInput.focus();
    messageAreaEl.innerHTML = '';
});

// Keyboard event handler - only handle Enter key for submission
document.addEventListener('keydown', (e) => {
    if (game.gameOver) return;

    // Only handle Enter key - let text input handle everything else
    if (e.key === 'Enter' && document.activeElement !== wordInput) {
        e.preventDefault();
        submitBtn.click();
        return;
    }
});

// Handle Enter key from word input
wordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitBtn.click();
    }
});

// Initialize the game
initUI();
initTheme();
