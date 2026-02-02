import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format snake_case to Title Case (e.g. "passport_number" -> "Passport Number")
export const formatLabel = (key: string) => {
    return key
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Handle camelCase too
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

// Recursive object flattening (e.g. { a: { b: 1 } } -> { "a b": 1 })
export const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, unknown> => {
    return Object.keys(obj).reduce((acc: Record<string, unknown>, k) => {
        const pre = prefix.length ? prefix + ' ' : '';
        const value = obj[k];
        const newKey = pre + k;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value as Record<string, unknown>, newKey));
        } else {
            acc[newKey] = value;
        }
        return acc;
    }, {});
};

// Check if a line contains garbled text or special character patterns
// Used for sanitizing PDF and Share outputs
export const isGarbledText = (line: string): boolean => {
    if (!line) return false;

    // Check for common garbled text markers
    return (
        line.includes('Ø') ||
        line.includes('Ü') ||
        line.includes('Ë') ||
        line.includes('&V&e&r&i&f&i&c&a&t&i') ||
        (line.match(/[&]{2,}/) !== null) || // Multiple consecutive ampersands
        (line.match(/[Ø=ÜË]/) !== null) || // Special characters that cause garbling
        (line.match(/[&][a-zA-Z][&]/) !== null) || // Pattern like &V&e&r&i&f&i&c&a&t&i&o&n&
        line.includes('&V&e&r&i&f&i&c&a&t&i&o&n&') ||
        line.includes('&D&e&t&a&i&l&s') ||
        (line.match(/[&][A-Za-z][&][A-Za-z][&]/) !== null) || // More garbled patterns
        line.includes('Ø=ÜË') || // Specific pattern from user
        (line.match(/V\s+e\s+r\s+i\s+f\s+i\s+c\s+a\s+t\s+i\s+o\s+n/) !== null) || // Spaced out "Verification"
        (line.match(/D\s+e\s+t\s+a\s+i\s+l\s+s/) !== null) || // Spaced out "Details"
        (line.match(/[Ø=ÜË]\s+[A-Za-z]\s+[A-Za-z]\s+[A-Za-z]/) !== null) || // Pattern with special chars + spaced letters
        line.includes('V e r i f i c a t i o n') ||
        line.includes('D e t a i l s') || // More specific patterns
        (line.match(/Ø=ÜË.*&.*V.*&.*e.*&.*r.*&.*i.*&.*f.*&.*i.*&.*c.*&.*a.*&.*t.*&.*i.*&.*o.*&.*n/) !== null) || // Complex garbled pattern
        (line.match(/.*&.*V.*&.*e.*&.*r.*&.*i.*&.*f.*&.*i.*&.*c.*&.*a.*&.*t.*&.*i.*&.*o.*&.*n.*&.*D.*&.*e.*&.*t.*&.*a.*&.*i.*&.*l.*&.*s/) !== null) || // Full garbled pattern
        line.includes('Ø=ÜË& &V&e&r&i&f&i&c&a&t&i&o&n& &D&e&t&a&i&l&s') || // Exact pattern from image
        (line.match(/.*Ø.*=.*Ü.*Ë.*&.*&.*V.*&.*e.*&.*r.*&.*i.*&.*f.*&.*i.*&.*c.*&.*a.*&.*t.*&.*i.*&.*o.*&.*n.*&.*&.*D.*&.*e.*&.*t.*&.*a.*&.*i.*&.*l.*&.*s.*/) !== null) || // Regex for exact pattern
        (line.match(/.*[Ø=ÜË].*[&].*[V].*[&].*[e].*[&].*[r].*[&].*[i].*[&].*[f].*[&].*[i].*[&].*[c].*[&].*[a].*[&].*[t].*[&].*[i].*[&].*[o].*[&].*[n].*[&].*[D].*[&].*[e].*[&].*[t].*[&].*[a].*[&].*[i].*[&].*[l].*[&].*[s].*/) !== null) || // More comprehensive pattern
        line.includes('Ø=ÜË V e r i f i c a t i o n D e t a i l')
    );
};
