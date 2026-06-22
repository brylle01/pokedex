/**
 * Full detail for a single Pokémon. Cached aggressively because the same record
 * is reused by list cards, the detail screen, and favorites — fetched once,
 * shared everywhere.
 */
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetail } from '../api/pokeapi';
import { queryKeys } from '../api/queryKeys';

export function usePokemonDetail(idOrName: string | number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pokemonDetail(idOrName),
    queryFn: ({ signal }) => fetchPokemonDetail(idOrName, signal),
    enabled: enabled && idOrName !== '' && idOrName !== undefined,
    staleTime: 1000 * 60 * 30, // 30 min — Pokémon data is effectively static.
  });
}
