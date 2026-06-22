import { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FavoritesStackParamList } from '../navigation/types';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { useTheme } from '../theme/useTheme';
import { PokemonCard } from '../components/PokemonCard';
import { EmptyState } from '../components/EmptyState';
import type { PokemonListEntry } from '../hooks/usePokemonList';

type Props = NativeStackScreenProps<FavoritesStackParamList, 'FavoritesList'>;

export function FavoritesScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  // Select the stable record reference, then derive the sorted list with useMemo.
  // (Returning Object.values().sort() straight from the selector creates a new
  // array every render and sends Zustand v5 into an infinite re-render loop.)
  const favoritesMap = useFavoritesStore((s) => s.favorites);
  const favorites = useMemo(
    () => Object.values(favoritesMap).sort((a, b) => a.id - b.id),
    [favoritesMap],
  );

  const openDetail = useCallback(
    (entry: PokemonListEntry) =>
      navigation.navigate('PokemonDetail', { id: entry.id, name: entry.name }),
    [navigation],
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <EmptyState
          emoji="💛"
          title="No favorites yet"
          subtitle="Tap the heart on any Pokémon to save it here for quick access."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <PokemonCard entry={{ id: item.id, name: item.name }} onPress={openDetail} index={index} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  column: {
    gap: 12,
  },
});
