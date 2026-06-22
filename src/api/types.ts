/** TypeScript models for the subset of the PokéAPI we consume. */

/** A named reference to another resource, e.g. { name: "pikachu", url: ".../25/" }. */
export type NamedAPIResource = {
  name: string;
  url: string;
};

/** Response shape of the paginated `/pokemon` list endpoint. */
export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type PokemonType = {
  slot: number;
  type: NamedAPIResource;
};

export type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
};

export type PokemonAbility = {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
};

export type PokemonSprites = {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
};

/** Response shape of the `/pokemon/{id|name}` detail endpoint (fields we use). */
export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  sprites: PokemonSprites;
};
