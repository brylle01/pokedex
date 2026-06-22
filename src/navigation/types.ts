/** Route param definitions shared across navigators and screens. */
import type { NavigatorScreenParams } from '@react-navigation/native';

/** Params for the detail screen, reused by both tab stacks. */
export type PokemonDetailParams = {
  id: number;
  name: string;
};

export type PokedexStackParamList = {
  PokedexList: undefined;
  PokemonDetail: PokemonDetailParams;
};

export type FavoritesStackParamList = {
  FavoritesList: undefined;
  PokemonDetail: PokemonDetailParams;
};

export type RootTabParamList = {
  PokedexTab: NavigatorScreenParams<PokedexStackParamList>;
  FavoritesTab: NavigatorScreenParams<FavoritesStackParamList>;
};
