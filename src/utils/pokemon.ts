/** Helpers for normalizing and formatting PokéAPI data for display. */

/** Extracts the numeric id from a PokéAPI resource url, e.g. ".../pokemon/25/" -> 25. */
export function idFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Formats a Pokémon id as a zero-padded dex number, e.g. 25 -> "#0025". */
export function formatDexNumber(id: number): string {
  return `#${id.toString().padStart(4, '0')}`;
}

/** Capitalizes and de-hyphenates an API name, e.g. "mr-mime" -> "Mr Mime". */
export function formatName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Official-artwork sprite URL derived purely from the id, so list cards can show
 * a high-quality image without first fetching full detail.
 */
export function officialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/** Decimetres -> metres string, e.g. 7 -> "0.7 m". */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`;
}

/** Hectograms -> kilograms string, e.g. 60 -> "6.0 kg". */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

/** Human-friendly stat labels for the API's stat slugs. */
export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

/** Max value used to scale stat bars; 255 is the highest possible base stat. */
export const MAX_BASE_STAT = 255;
