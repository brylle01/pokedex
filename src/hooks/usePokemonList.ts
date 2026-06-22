/**
 * Infinite-scrolling Pokémon list. Each page is one PokéAPI list request; the
 * next page param is derived from the API's `next` url. Returns flattened
 * `{ name, id }` entries ready for the grid.
 */
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokeapi';
import { queryKeys } from '../api/queryKeys';
import type { PokemonListResponse } from '../api/types';
import { idFromUrl } from '../utils/pokemon';

export const PAGE_SIZE = 24;

export type PokemonListEntry = {
  id: number;
  name: string;
};

export function usePokemonList() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.pokemonList,
    queryFn: ({ pageParam, signal }) => fetchPokemonList(PAGE_SIZE, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PokemonListResponse, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * PAGE_SIZE;
    },
  });

  const entries: PokemonListEntry[] =
    query.data?.pages.flatMap((page) =>
      page.results.map((r) => ({ id: idFromUrl(r.url), name: r.name })),
    ) ?? [];

  return { ...query, entries };
}
