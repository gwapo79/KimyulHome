
/**
 * Hangul Chosung Utility
 * Extracts initial consonants from Korean strings for search.
 */

const CHOSUNG = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Checks if a character is a Hangul character
 */
function isHangul(char: string): boolean {
    const code = char.charCodeAt(0);
    return code >= 0xAC00 && code <= 0xD7A3;
}

/**
 * Extracts Chosung from a Hangul character
 */
function getChosung(char: string): string {
    if (!isHangul(char)) return char;
    const code = char.charCodeAt(0) - 0xAC00;
    const chosungIndex = Math.floor(code / 588);
    return CHOSUNG[chosungIndex] || char;
}

/**
 * Converts a string to its Chosung representation
 * e.g., "홍길동" -> "ㅎㄱㄷ"
 */
export function toChosung(str: string): string {
    return str.split('').map(getChosung).join('');
}

/**
 * Search helper that checks if target contains query (supporting Chosung)
 */
export function searchHangul(target: string | null, query: string): boolean {
    if (!target) return false;
    const cleanTarget = target.trim();
    const cleanQuery = query.trim();

    // 1. Regular Includes (Case insensitive)
    if (cleanTarget.toLowerCase().includes(cleanQuery.toLowerCase())) return true;

    // 2. Chosung Search
    // Only attempt if query contains Hangul Jamo (Consonants) and target is Hangul
    // Simple heuristic: Convert target to Chosung and check includes
    const targetChosung = toChosung(cleanTarget);
    return targetChosung.includes(cleanQuery);
}
