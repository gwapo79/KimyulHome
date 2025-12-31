import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatClientName(name: string) {
    if (!name) return "";
    if (name.length <= 1) return name;
    // For 2 characters (e.g. 이산), return 이*
    if (name.length === 2) return name[0] + "*";
    // For 3+ characters (e.g. 홍길동), return 홍*동
    return name[0] + "*" + name.slice(2);
}
