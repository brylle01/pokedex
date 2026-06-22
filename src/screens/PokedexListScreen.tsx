import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PokedexStackParamList } from '../navigation/types';
import { usePokemonList, type PokemonListEntry } from '../hooks/usePokemonList';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import { useTheme } from '../theme/useTheme';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonCardSkeleton } from '../components/PokemonCardSkeleton';
import { SearchBar } from '../components/SearchBar';
import { ErrorView } from '../components/ErrorView';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<PokedexStackParamList, 'PokedexList'>;

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `skeleton-${i}`);

export function PokedexListScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');

  const list = usePokemonList();
  const searchResult = usePokemonSearch(search);

  const openDetail = useCallback(
    (entry: PokemonListEntry) =>
      navigation.navigate('PokemonDetail', { id: entry.id, name: entry.name }),
    [navigation],
  );

  const renderCard = useCallback(
    ({ item, index }: { item: PokemonListEntry; index: number }) => (
      <PokemonCard entry={item} onPress={openDetail} index={index} />
    ),
    [openDetail],
  );

  const header = (
    <View style={styles.headerArea}>
      <SearchBar value={search} onChangeText={setSearch} />
    </View>
  );

  // --- Search mode: filter the full index client-side. ---
  if (searchResult.isActive) {
    let body: React.ReactNode;
    if (searchResult.isLoading) {
      body = <SkeletonGrid />;
    } else if (searchResult.isError) {
      body = <ErrorView error={searchResult.error} onRetry={searchResult.refetch} />;
    } else if (searchResult.results.length === 0) {
      body = (
        <EmptyState
          title="No Pokémon found"
          subtitle={`Nothing matches “${search}”. Try another name.`}
        />
      );
    } else {
      body = (
        <FlatList
          data={searchResult.results}
          keyExtractor={(item) => item.name}
          renderItem={renderCard}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
      );
    }
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        {header}
        {body}
      </View>
    );
  }

  // --- Browse mode: paginated infinite list. ---
  if (list.isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        {header}
        <SkeletonGrid />
      </View>
    );
  }

  if (list.isError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        {header}
        <ErrorView error={list.error} onRetry={list.refetch} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {header}
      <FlatList
        data={list.entries}
        keyExtractor={(item) => item.name}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (list.hasNextPage && !list.isFetchingNextPage) list.fetchNextPage();
        }}
        refreshControl={
          <RefreshControl
            refreshing={list.isRefetching && !list.isFetchingNextPage}
            onRefresh={list.refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListFooterComponent={
          list.isFetchingNextPage ? (
            <ActivityIndicator color={colors.primary} style={styles.footer} />
          ) : null
        }
      />
    </View>
  );
}

function SkeletonGrid() {
  return (
    <View style={styles.skeletonWrap}>
      {SKELETON_KEYS.map((key) => (
        <View key={key} style={styles.skeletonItem}>
          <PokemonCardSkeleton />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  column: {
    gap: 12,
  },
  footer: {
    paddingVertical: 20,
  },
  skeletonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  skeletonItem: {
    width: '50%',
    padding: 6,
  },
});
