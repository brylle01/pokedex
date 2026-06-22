/**
 * Client-side search over the full Pokémon index. The index (just names + urls)
 * is fetched once and cached forever; filtering happens in-memory so search is
 * instant and works across every Pokémon, not just the loaded pages.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonIndex } from '../api/pokeapi';
import { queryKeys } from '../api/queryKeys';
import type { PokemonListEntry } from './usePokemonList';
import { idFromUrl } from '../utils/pokemon';

const MAX_RESULTS = 60;

export function usePokemonSearch(term: string) {
  const normalized = term.trim().toLowerCase();
  const enabled = normalized.length > 0;

  const indexQuery = useQuery({
    queryKey: queryKeys.pokemonIndex,
    queryFn: ({ signal }) => fetchPokemonIndex(signal),
    enabled,
    staleTime: Infinity,
  });

  const results: PokemonListEntry[] = useMemo(() => {
    if (!enabled || !indexQuery.data) return [];
    return indexQuery.data.results
      .filter((r) => r.name.includes(normalized))
      .slice(0, MAX_RESULTS)
      .map((r) => ({ id: idFromUrl(r.url), name: r.name }));
  }, [enabled, indexQuery.data, normalized]);

  return {
    isActive: enabled,
    results,
    isLoading: indexQuery.isLoading,
    isError: indexQuery.isError,
    error: indexQuery.error,
    refetch: indexQuery.refetch,
  };
}
