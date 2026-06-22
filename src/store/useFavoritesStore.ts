/**
 * Favorites store. Persists a lightweight snapshot of each favorited Pokémon
 * (enough to render the Favorites grid without re-fetching) keyed by id.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoritePokemon = {
  id: number;
  name: string;
  types: string[];
};

type FavoritesState = {
  /** Map of id -> snapshot, kept as a record for cheap lookups + persistence. */
  favorites: Record<number, FavoritePokemon>;
  isFavorite: (id: number) => boolean;
  toggle: (pokemon: FavoritePokemon) => void;
  remove: (id: number) => void;
  clear: () => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: {},
      isFavorite: (id) => Boolean(get().favorites[id]),
      toggle: (pokemon) =>
        set((state) => {
          const next = { ...state.favorites };
          if (next[pokemon.id]) {
            delete next[pokemon.id];
          } else {
            next[pokemon.id] = pokemon;
          }
          return { favorites: next };
        }),
      remove: (id) =>
        set((state) => {
          const next = { ...state.favorites };
          delete next[id];
          return { favorites: next };
        }),
      clear: () => set({ favorites: {} }),
    }),
    {
      name: 'pokedex-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
