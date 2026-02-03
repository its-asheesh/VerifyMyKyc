export const DIAL_CODES = [
    { code: "91", label: "+91 (IN)" },
    { code: "1", label: "+1 (US)" },
    { code: "44", label: "+44 (UK)" },
    { code: "61", label: "+61 (AU)" },
    { code: "65", label: "+65 (SG)" },
    { code: "971", label: "+971 (AE)" },
];

export const formatToE164 = (raw: string, countryCode = "91"): string => {
    const input = (raw || "").trim();
    if (input.startsWith("+")) return input;
    let digits = input.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");
    // Heuristic: if 10-digit local number, prefix selected country code
    if (digits.length === 10) {
        return `+${countryCode}${digits}`;
    }
    // If user typed country code already and then the local number
    if (digits.startsWith(countryCode) && digits.length > countryCode.length) {
        // Collapse duplicated country code if present (e.g., 9191...)
        while (digits.startsWith(countryCode + countryCode)) {
            digits = digits.slice(countryCode.length);
        }
        return `+${digits}`;
    }
    return `+${countryCode}${digits}`;
};

export const isPhoneLike = (identifier: string): boolean => {
    const val = (identifier || "").trim();
    // Basic check: contains digits, maybe +, -, space, but NO @
    return /^\+?\d[\d\s-]*$/.test(val) && !val.includes("@") && val.length > 0;
};
