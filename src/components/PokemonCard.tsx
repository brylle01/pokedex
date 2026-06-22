import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useTheme } from '../theme/useTheme';
import { typeColors, FALLBACK_TYPE_COLOR } from '../theme/colors';
import { withAlpha } from '../utils/colorContrast';
import { formatDexNumber, formatName, officialArtworkUrl } from '../utils/pokemon';
import type { PokemonListEntry } from '../hooks/usePokemonList';
import { TypeBadge } from './TypeBadge';
import { FavoriteButton } from './FavoriteButton';
import { Skeleton } from './Skeleton';
import { AnimatedAppear } from './AnimatedAppear';

type Props = {
  entry: PokemonListEntry;
  onPress: (entry: PokemonListEntry) => void;
  /** Position in the list, used to stagger the entrance animation. */
  index?: number;
};

const BLUR_HASH = 'L9AB*A~q00WB00WBofof00ay~qof';

/**
 * Grid card for a single Pokémon. Shows the artwork immediately (derived from
 * id) and lazily loads types via React Query — cached so opening the detail
 * screen is instant.
 */
function PokemonCardComponent({ entry, onPress, index = 0 }: Props) {
  const { colors } = useTheme();
  const { data, isLoading, isError } = usePokemonDetail(entry.name);

  const primaryType = data?.types[0]?.type.name;
  const accent = primaryType ? typeColors[primaryType] ?? FALLBACK_TYPE_COLOR : colors.surfaceAlt;

  // Cascade entrances within a screenful, then cap so far-down cards don't lag.
  const delay = (index % 10) * 45;

  return (
    <AnimatedAppear delay={delay} style={styles.appear}>
      <Pressable
        onPress={() => onPress(entry)}
        accessibilityRole="button"
        accessibilityLabel={`${formatName(entry.name)}, number ${entry.id}`}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
          pressed && styles.pressed,
        ]}
      >
      <View style={styles.topRow}>
        <Text style={[styles.dexNumber, { color: colors.textMuted }]}>
          {formatDexNumber(entry.id)}
        </Text>
        <FavoriteButton
          pokemon={{ id: entry.id, name: entry.name, types: data?.types.map((t) => t.type.name) ?? [] }}
          size={20}
        />
      </View>

      <View style={[styles.imageWrap, { backgroundColor: withAlpha(accent, 0.16) }]}>
        <Image
          source={{ uri: officialArtworkUrl(entry.id) }}
          style={styles.image}
          contentFit="contain"
          transition={250}
          placeholder={{ blurhash: BLUR_HASH }}
          cachePolicy="memory-disk"
        />
      </View>

      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {formatName(entry.name)}
      </Text>

        <View style={styles.typeRow}>
          {isLoading && <Skeleton width={56} height={20} borderRadius={999} />}
          {isError && <Text style={[styles.muted, { color: colors.textMuted }]}>—</Text>}
          {data?.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
          ))}
        </View>
      </Pressable>
    </AnimatedAppear>
  );
}

const styles = StyleSheet.create({
  appear: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dexNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  imageWrap: {
    borderRadius: 14,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  image: {
    width: '82%',
    height: '82%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    minHeight: 22,
  },
  muted: {
    fontSize: 13,
  },
});

export const PokemonCard = memo(PokemonCardComponent);
