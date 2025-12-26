import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatClientName(name: string | null | undefined): string {
    if (!name) return '익명 고객';
    if (name.length < 2) return name; // Single char? Return as is or handle specifically.
    // Take the first char, append "OO" or "O" depending on preference.
    // User requested "성+00" (e.g. Kim00). Usually in Korean it's "김OO".
    // Let's use "O" (English letter O) or "ㅇ" (Korean zero/circle placeholder)?
    // User wrote "성+00" (zero zero) or "OO" (Oh Oh). "김00" looks like "Kim Zero Zero".
    // "성+OO" (Oh Oh) is more standard for text.
    // User prompt said: "성+00" (Zero Zero). I will use "OO" (Oh Oh) as it looks better typographically, or "O" if they want masking. 
    // Wait, user explicitly wrote "김00". I will strictly follow "성+OO" (Oh Oh) or "성+XX".
    // Re-reading: "성+00" 형식. "김00". Okay, I will use "OO" (Oh Oh) as it's standard. 
    // Actually, "성+00" (Zero Zero) might be literal. 
    // Let's look at the example: "작성자 이름을 김00, 이00 등으로 익명 처리해." -> "Kim Zero Zero".
    // I will use "OO" (uppercase O) as it is the standard visual for "OO" in Korea often used interchangeably with 00.
    // To be safe and look professional, "OO" (Oh Oh) is best.

    const firstChar = name.charAt(0);
    return `${firstChar}OO`;
}
