// Korean word dictionary for the game
// Words are grouped by length (3-7 characters)

const WORDS = {
    3: [
        '고양이', '강아지', '햄스터', '거북이',
        '컴퓨터', '노트북', '마우스', '키보드', '모니터',
        '선생님', '자동차', '비행기', '인터넷', '개발자',
        '매니저', '테니스', '불고기', '비빔밥', '떡볶이',
        '태블릿', '이어폰', '충전기', '케이블', '커피숍',
        '편의점', '백화점', '지하철', '소방관', '도서관',
        '요리사', '경찰관', '도시락', '종이컵', '카메라'
    ],
    4: [
        '대한민국', '자연과학', '사회현상', '경제활동', '문화생활',
        '역사기록', '철학사상', '언어학습', '문학작품', '예술활동',
        '민주주의', '자본주의', '공산주의',
    ],
    5: [
        '프로그래밍', '아이스크림',
        '아메리카노', '에스프레소', '자기계발서',
        '산업혁명사', '사회구조론', '문화인류학'
    ],
    6: [
        '데이터베이스', '자동차정비소', '국제연합기구', '세계보건기구', '환경보호운동',
        '문화재보존법', '경제발전계획', '사회복지정책',
    ],
    7: [
        '정보보안전문가', '빅데이터분석가', '사물인터넷기기',
    ]
};

/**
 * Get a random word of specified length
 * @param {number} length - Word length (3-7)
 * @returns {string} Random word
 */
function getRandomWord(length = null) {
    if (length === null) {
        // Random length between 3 and 7
        length = Math.floor(Math.random() * 5) + 3;
    }

    const wordsOfLength = WORDS[length];
    if (!wordsOfLength || wordsOfLength.length === 0) {
        return getRandomWord(); // Fallback to any random word
    }

    return wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)];
}

export { WORDS, getRandomWord };
