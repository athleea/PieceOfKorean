import { getAvailableTiles } from './korean-utils.js';
import { getRandomWord } from './words.js';

class KoreanWordGame {
    constructor() {
        this.targetWord = '';
        this.currentPlayer = 1;
        this.attempts = [[], []]; // attempts[0] for player 1, attempts[1] for player 2
        this.currentGuess = [];
        this.gameOver = false;
        this.winner = null;

        this.selectedTiles = []; // Currently selected tiles for manipulation
        this.wordLength = 0;
        this.availableTiles = { consonants: [], vowels: [] }; // Available tiles based on target word

        this.initGame();
    }

    initGame() {
        // Select random target word
        this.targetWord = getRandomWord();
        this.wordLength = this.targetWord.length;
        this.currentGuess = new Array(this.wordLength).fill('');

        // Calculate available tiles from target word
        this.availableTiles = getAvailableTiles(this.targetWord);

        //console.log('Target word:', this.targetWord); // For debugging
        //console.log('Available tiles:', this.availableTiles); // For debugging
    }

    resetGame() {
        this.targetWord = '';
        this.currentPlayer = 1;
        this.attempts = [[], []];
        this.currentGuess = [];
        this.gameOver = false;
        this.winner = null;
        this.selectedTiles = [];
        this.initGame();
    }

    selectTile(index) {
        if (this.gameOver) return;

        // Toggle selection
        const tileIndex = this.selectedTiles.indexOf(index);
        if (tileIndex > -1) {
            this.selectedTiles.splice(tileIndex, 1);
        } else {
            this.selectedTiles.push(index);
        }
    }

    setCharacter(index, char) {
        if (this.gameOver || index < 0 || index >= this.wordLength) return;
        this.currentGuess[index] = char;
    }

    clearGuess() {
        this.currentGuess = new Array(this.wordLength).fill('');
        this.selectedTiles = [];
    }

    submitGuess() {
        if (this.gameOver) return null;

        const guess = this.currentGuess.join('');

        // Calculate color hints
        const hints = this.calculateHints(guess);

        // Store attempt
        const playerIndex = this.currentPlayer - 1;
        this.attempts[playerIndex].push({
            word: guess,
            hints: hints
        });

        // Check if won
        if (guess === this.targetWord) {
            this.gameOver = true;
            this.winner = this.currentPlayer;
            return { won: true, hints: hints };
        }

        // Switch player
        this.switchPlayer();

        // Clear current guess
        this.clearGuess();

        return { hints: hints };
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    calculateHints(guess) {
        const hints = [];
        const targetChars = this.targetWord.split('');
        const guessChars = guess.split('');
        const used = new Array(targetChars.length).fill(false);

        // First pass: mark exact matches (green)
        for (let i = 0; i < guessChars.length; i++) {
            if (guessChars[i] === targetChars[i]) {
                hints[i] = 'correct'; // Green
                used[i] = true;
            } else {
                hints[i] = 'absent'; // Default to red
            }
        }

        // Second pass: mark present but wrong position (yellow)
        for (let i = 0; i < guessChars.length; i++) {
            if (hints[i] === 'correct') continue;

            for (let j = 0; j < targetChars.length; j++) {
                if (!used[j] && guessChars[i] === targetChars[j]) {
                    hints[i] = 'present'; // Yellow
                    used[j] = true;
                    break;
                }
            }
        }

        return hints;
    }
}

export default KoreanWordGame;
