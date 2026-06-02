
// src/utils/helpers.ts
export const isInternalLink = (href: string): boolean => {
  return href.startsWith("/") && !href.startsWith("//") && !href.includes("://");
};