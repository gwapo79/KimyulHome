import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatClientName(name: string | null | undefined): string {
    if (!name || name.trim() === '') return '의뢰인'; // Safe fallback for empty data
    if (name.includes('익명') || name.includes('비공개')) return '김OO'; // Normalize hardcoded anonymous

    // If strict 1 char limit, return name.
    if (name.length < 2) return name;

    const firstChar = name.charAt(0);
    return `${firstChar}OO`;
}
