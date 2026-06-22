/**
 * Color system for the Pokedex app.
 *
 * - `palettes` holds the semantic light/dark theme tokens consumed across the UI.
 * - `typeColors` maps a Pokémon elemental type to its signature accent color,
 *   used for badges and the detail-screen header.
 */

export type ThemePalette = {
  /** App background behind all content. */
  background: string;
  /** Surface color for cards, headers, and sheets. */
  surface: string;
  /** Slightly raised surface (e.g. skeleton blocks, pressed states). */
  surfaceAlt: string;
  /** Primary text color. */
  text: string;
  /** Secondary / muted text color. */
  textMuted: string;
  /** Brand accent (Pokedex red). */
  primary: string;
  /** Text/icon color rendered on top of the primary accent. */
  onPrimary: string;
  /** Hairline borders and dividers. */
  border: string;
  /** Destructive / error accent. */
  danger: string;
  /** Favorite (heart) accent. */
  favorite: string;
};

export const palettes: Record<'light' | 'dark', ThemePalette> = {
  light: {
    background: '#F2F4F7',
    surface: '#FFFFFF',
    surfaceAlt: '#E9ECF2',
    text: '#11181C',
    textMuted: '#5B6770',
    primary: '#E3350D',
    onPrimary: '#FFFFFF',
    border: '#E2E6EC',
    danger: '#D32F2F',
    favorite: '#FF375F',
  },
  dark: {
    background: '#0E1116',
    surface: '#171C23',
    surfaceAlt: '#222933',
    text: '#ECEFF4',
    textMuted: '#9BA6B2',
    primary: '#FF5436',
    onPrimary: '#FFFFFF',
    border: '#2A323D',
    danger: '#FF6B6B',
    favorite: '#FF5C8A',
  },
};

/** Canonical accent color per Pokémon elemental type. */
export const typeColors: Record<string, string> = {
  normal: '#9FA19F',
  fire: '#E62829',
  water: '#2980EF',
  electric: '#FAC000',
  grass: '#3FA129',
  ice: '#3DCEF3',
  fighting: '#FF8000',
  poison: '#9141CB',
  ground: '#915121',
  flying: '#81B9EF',
  psychic: '#EF4179',
  bug: '#91A119',
  rock: '#AFA981',
  ghost: '#704170',
  dragon: '#5060E1',
  dark: '#50413F',
  steel: '#60A1B8',
  fairy: '#EF70EF',
  stellar: '#40B5A5',
  unknown: '#68A090',
};

/** Fallback accent when a type is missing from the map. */
export const FALLBACK_TYPE_COLOR = typeColors.normal;
