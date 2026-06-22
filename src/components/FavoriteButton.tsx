import { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';
import { useFavoritesStore, type FavoritePokemon } from '../store/useFavoritesStore';
import { useTheme } from '../theme/useTheme';
import { USE_NATIVE_DRIVER } from '../utils/animation';

type Props = {
  pokemon: FavoritePokemon;
  size?: number;
};

/**
 * A heart toggle bound to the favorites store. Reads its own favorite state so
 * it stays in sync wherever it's rendered, and springs with a pop on tap.
 */
function FavoriteButtonComponent({ pokemon, size = 22 }: Props) {
  const { colors } = useTheme();
  const isFavorite = useFavoritesStore((s) => Boolean(s.favorites[pokemon.id]));
  const toggle = useFavoritesStore((s) => s.toggle);
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = (event?: GestureResponderEvent) => {
    // The heart is nested inside the card's Pressable. On web, clicks bubble, so
    // without this the card would also navigate. Stop it so the heart toggles only.
    event?.stopPropagation?.();
    toggle(pokemon);
    scale.setValue(0.6);
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 140,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  };

  return (
    <Pressable
      hitSlop={10}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      style={styles.button}
    >
      <Animated.Text
        style={{
          fontSize: size,
          color: isFavorite ? colors.favorite : colors.textMuted,
          transform: [{ scale }],
        }}
      >
        {isFavorite ? '♥' : '♡'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const FavoriteButton = memo(FavoriteButtonComponent);
