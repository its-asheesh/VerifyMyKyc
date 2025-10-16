// src/utils/validators.ts
export const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email)
export const isValidE164Phone = (phone: string) => /^\+[1-9]\d{1,14}$/.test(phone)
export const isStrongEnoughPassword = (pwd: string) => typeof pwd === 'string' && pwd.length >= 6


