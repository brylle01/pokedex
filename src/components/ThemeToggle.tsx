import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme/useTheme';

/** Header button that toggles between light and dark themes. */
export function ThemeToggle() {
  const { isDark, toggle, colors } = useTheme();
  return (
    <Pressable
      hitSlop={10}
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={[styles.icon, { color: colors.text }]}>{isDark ? '☀️' : '🌙'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  icon: {
    fontSize: 20,
  },
  pressed: {
    opacity: 0.5,
  },
});
