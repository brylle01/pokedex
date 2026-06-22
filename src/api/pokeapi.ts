/**
 * Thin, typed client for the PokéAPI (https://pokeapi.co).
 *
 * Every request goes through `request()` which adds a timeout, normalizes
 * failures into a single `ApiError` type, and parses JSON — so callers (and the
 * React Query hooks above them) get consistent error handling for free.
 */
import type { Pokemon, PokemonListResponse } from './types';

const BASE_URL = 'https://pokeapi.co/api/v2';
const DEFAULT_TIMEOUT_MS = 12_000;

/** Normalized error thrown by every client function on failure. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly kind: 'network' | 'timeout' | 'http' | 'parse',
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  // Forward an upstream cancellation (e.g. React Query unmount) to our controller.
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { signal: controller.signal });
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError('The request timed out. Check your connection.', 'timeout');
    }
    throw new ApiError('Network request failed. Check your connection.', 'network');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}.`,
      'http',
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError('Could not parse the server response.', 'parse');
  }
}

/** Fetches one page of the Pokémon index (names + urls only). */
export function fetchPokemonList(
  limit: number,
  offset: number,
  signal?: AbortSignal,
): Promise<PokemonListResponse> {
  return request<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`, signal);
}

/**
 * Fetches the full Pokémon index in a single request. Used to power client-side
 * search across every Pokémon (the API has no name-search endpoint).
 */
export function fetchPokemonIndex(signal?: AbortSignal): Promise<PokemonListResponse> {
  return request<PokemonListResponse>(`/pokemon?limit=20000&offset=0`, signal);
}

/** Fetches full detail for a single Pokémon by id or name. */
export function fetchPokemonDetail(
  idOrName: string | number,
  signal?: AbortSignal,
): Promise<Pokemon> {
  return request<Pokemon>(`/pokemon/${idOrName}`, signal);
}
