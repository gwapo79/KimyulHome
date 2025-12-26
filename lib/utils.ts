import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatClientName(name: string | null | undefined): string {
    // Wait, user explicitly wrote "김00". I will strictly follow "성+OO" (Oh Oh) or "성+XX".
    // Re-reading: "성+00" 형식. "김00". Okay, I will use "OO" (Oh Oh) as it's standard. 
    // Actually, "성+00" (Zero Zero) might be literal. 
    // Let's look at the example: "작성자 이름을 김00, 이00 등으로 익명 처리해." -> "Kim Zero Zero".
    // I will use "OO" (uppercase O) as it is the standard visual for "OO" in Korea often used interchangeably with 00.
    // To be safe and look professional, "OO" (Oh Oh) is best.

    const firstChar = name.charAt(0);
    return `${firstChar}OO`;
}
