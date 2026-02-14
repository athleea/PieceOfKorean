// Korean character manipulation utilities

// Hangul Unicode ranges
const HANGUL_BASE = 0xAC00;
const HANGUL_END = 0xD7A3;
const INITIAL_COUNT = 19;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;

// Initial consonants (초성)
const INITIALS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// Medial vowels (중성)
const MEDIALS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ',
  'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

// Final consonants (종성) - includes empty final
const FINALS = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ',
  'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ',
  'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// Consonant combination rules (자음 합성)
const CONSONANT_COMBINATIONS = {
  'ㄱ+ㄱ': 'ㄲ',
  'ㄱ+ㅅ': 'ㄳ',
  'ㄴ+ㅈ': 'ㄵ',
  'ㄴ+ㅎ': 'ㄶ',
  'ㄹ+ㄱ': 'ㄺ',
  'ㄹ+ㅁ': 'ㄻ',
  'ㄹ+ㅂ': 'ㄼ',
  'ㄹ+ㅅ': 'ㄽ',
  'ㄹ+ㅌ': 'ㄾ',
  'ㄹ+ㅍ': 'ㄿ',
  'ㄹ+ㅎ': 'ㅀ',
  'ㅂ+ㅅ': 'ㅄ',
  'ㅅ+ㅅ': 'ㅆ',
  'ㄷ+ㄷ': 'ㄸ',
  'ㅂ+ㅂ': 'ㅃ',
  'ㅈ+ㅈ': 'ㅉ'
};

// Vowel combination rules (모음 합성)
const VOWEL_COMBINATIONS = {
  'ㅏ+ㅣ': 'ㅐ',
  'ㅑ+ㅣ': 'ㅒ',
  'ㅓ+ㅣ': 'ㅔ',
  'ㅕ+ㅣ': 'ㅖ',
  'ㅗ+ㅏ': 'ㅘ',
  'ㅗ+ㅐ': 'ㅙ',
  'ㅗ+ㅣ': 'ㅚ',
  'ㅜ+ㅓ': 'ㅝ',
  'ㅜ+ㅔ': 'ㅞ',
  'ㅜ+ㅣ': 'ㅟ',
  'ㅡ+ㅣ': 'ㅢ'
};

// Reverse maps for decomposition
const CONSONANT_DECOMPOSITION = {
  'ㄲ': ['ㄱ', 'ㄱ'],
  'ㄳ': ['ㄱ', 'ㅅ'],
  'ㄵ': ['ㄴ', 'ㅈ'],
  'ㄶ': ['ㄴ', 'ㅎ'],
  'ㄺ': ['ㄹ', 'ㄱ'],
  'ㄻ': ['ㄹ', 'ㅁ'],
  'ㄼ': ['ㄹ', 'ㅂ'],
  'ㄽ': ['ㄹ', 'ㅅ'],
  'ㄾ': ['ㄹ', 'ㅌ'],
  'ㄿ': ['ㄹ', 'ㅍ'],
  'ㅀ': ['ㄹ', 'ㅎ'],
  'ㅄ': ['ㅂ', 'ㅅ'],
  'ㅆ': ['ㅅ', 'ㅅ'],
  'ㄸ': ['ㄷ', 'ㄷ'],
  'ㅃ': ['ㅂ', 'ㅂ'],
  'ㅉ': ['ㅈ', 'ㅈ']
};

const VOWEL_DECOMPOSITION = {
  'ㅢ': ['ㅡ', 'ㅡ'],
  'ㅐ': ['ㅏ', 'ㅡ'],
  'ㅖ': ['ㅕ', 'ㅡ'],
  'ㅒ': ['ㅕ', 'ㅡ'],
  'ㅔ': ['ㅓ', 'ㅣ'],
  'ㅘ': ['ㅗ', 'ㅏ'],
  'ㅙ': ['ㅗ', 'ㅐ'],
  'ㅚ': ['ㅗ', 'ㅣ'],
  'ㅝ': ['ㅜ', 'ㅓ'],
  'ㅞ': ['ㅜ', 'ㅔ'],
  'ㅟ': ['ㅜ', 'ㅣ']
};

const VOWEL_GROUPS = {
  'ㅏ': ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'],
  'ㅑ': ['ㅑ', 'ㅕ', 'ㅛ', 'ㅠ'],
  'ㅡ': ['ㅡ', 'ㅣ']
};

// Vowel rotation sequence (모음 회전)
const VOWEL_ROTATION = ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'];

/**
 * Decompose a Hangul syllable into its components
 * @param {string} syllable - A single Hangul character
 * @returns {object} {initial, medial, final}
 */
function decompose(syllable) {
  const code = syllable.charCodeAt(0);

  if (code < HANGUL_BASE || code > HANGUL_END) {
    return null;
  }

  const syllableIndex = code - HANGUL_BASE;
  const initialIndex = Math.floor(syllableIndex / (MEDIAL_COUNT * FINAL_COUNT));
  const medialIndex = Math.floor((syllableIndex % (MEDIAL_COUNT * FINAL_COUNT)) / FINAL_COUNT);
  const finalIndex = syllableIndex % FINAL_COUNT;

  return {
    initial: INITIALS[initialIndex],
    medial: MEDIALS[medialIndex],
    final: FINALS[finalIndex]
  };
}

/**
 * Normalize a vowel to its representative form for rotation
 * Rotatable vowels (ㅏ, ㅓ, ㅗ, ㅜ, ㅡ, ㅣ) are all normalized to ㅏ
 * Non-rotatable vowels (compound vowels) are kept as-is
 * @param {string} vowel - Vowel to normalize
 * @returns {string} Normalized vowel
 */
function normalizeVowelForRotation(vowel) {
  // Check in customized groups
  for (const [representative, members] of Object.entries(VOWEL_GROUPS)) {
    if (members.includes(vowel)) {
      return representative;
    }
  }
  return vowel;
}

/**
 * Decompose a complex consonant into basic components
 * @param {string} consonant - Complex consonant
 * @returns {array} Array of basic consonants, or [consonant] if already basic
 */
function decomposeConsonant(consonant) {
  return CONSONANT_DECOMPOSITION[consonant] || [consonant];
}

/**
 * Decompose a complex vowel into basic components
 * @param {string} vowel - Complex vowel
 * @returns {array} Array of basic vowels, or [vowel] if already basic
 */
function decomposeVowel(vowel) {
  const result = VOWEL_DECOMPOSITION[vowel];
  if (!result) return [vowel];

  // Recursively decompose in case ㅙ -> ㅗ + ㅐ -> ㅗ + ㅏ + ㅣ
  const decomposed = [];
  for (const v of result) {
    decomposed.push(...decomposeVowel(v));
  }
  return decomposed;
}

/**
 * Extract all available consonants and vowels from a target word
 * Complex characters are decomposed into basic components
 * Returns duplicates based on frequency in the word
 * @param {string} word - Target word
 * @returns {object} {consonants: Array, vowels: Array}
 */
function getAvailableTiles(word) {
  const consonants = [];
  const vowels = [];

  for (const char of word) {
    const parts = decompose(char);
    if (!parts) continue;

    // Decompose initial consonant
    const initials = decomposeConsonant(parts.initial);
    consonants.push(...initials);

    // Decompose medial vowel and normalize rotatable ones
    const medials = decomposeVowel(parts.medial);
    const normalizedMedials = medials.map(v => normalizeVowelForRotation(v));
    vowels.push(...normalizedMedials);

    // Decompose final consonant if exists
    if (parts.final) {
      const finals = decomposeConsonant(parts.final);
      consonants.push(...finals);
    }
  }

  return {
    consonants: consonants,
    vowels: vowels
  };
}

// Export functions
export {
  INITIALS,
  MEDIALS,
  FINALS,
  decompose,
  getAvailableTiles
};
