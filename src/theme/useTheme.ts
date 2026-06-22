/**
 * Resolves the active theme by combining the persisted preference with the live
 * OS color scheme, and exposes a `toggle` that flips between light and dark.
 */
import { useColorScheme } from 'react-native';
import { palettes, type ThemePalette } from './colors';
import { useThemeStore, type ThemeMode } from '../store/useThemeStore';

export type ResolvedTheme = {
  colors: ThemePalette;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  /** Flips to the opposite of whatever is currently displayed. */
  toggle: () => void;
};

export function useTheme(): ResolvedTheme {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  return {
    colors: isDark ? palettes.dark : palettes.light,
    isDark,
    mode,
    setMode,
    toggle: () => setMode(isDark ? 'light' : 'dark'),
  };
}
