/** Centralized React Query key factory to keep cache keys consistent. */
export const queryKeys = {
  pokemonList: ['pokemon', 'list'] as const,
  pokemonIndex: ['pokemon', 'index'] as const,
  pokemonDetail: (idOrName: string | number) =>
    ['pokemon', 'detail', String(idOrName).toLowerCase()] as const,
};
