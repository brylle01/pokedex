/**
 * Returns black or white depending on which provides better contrast against
 * the supplied hex background color. Used to keep type-badge labels legible
 * regardless of the type's accent color.
 */
export function readableTextColor(hexColor: string): '#000000' | '#FFFFFF' {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#FFFFFF';

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Relative luminance (per WCAG, simplified sRGB coefficients).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

/** Adds an alpha channel to a 6-digit hex color, e.g. withAlpha('#E62829', 0.2). */
export function withAlpha(hexColor: string, alpha: number): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return hexColor;
  const clamped = Math.max(0, Math.min(1, alpha));
  const a = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex}${a}`;
}
