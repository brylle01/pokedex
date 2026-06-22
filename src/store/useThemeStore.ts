/**
 * Theme preference store. Persists the user's choice across launches.
 *
 * `mode` is the *preference* ('system' follows the device). The resolved palette
 * lives in the `useTheme` hook, which combines this with the live OS color scheme.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'pokedex-theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
