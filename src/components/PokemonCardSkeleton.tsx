import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Skeleton } from './Skeleton';

/** Placeholder card matching PokemonCard's layout, shown while a grid loads. */
export function PokemonCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Skeleton width={48} height={12} />
      <View style={styles.imageWrap}>
        <Skeleton width="100%" height="100%" borderRadius={14} />
      </View>
      <Skeleton width="70%" height={16} />
      <View style={styles.typeRow}>
        <Skeleton width={52} height={20} borderRadius={999} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  imageWrap: {
    aspectRatio: 1,
    marginVertical: 8,
  },
  typeRow: {
    marginTop: 8,
  },
});
