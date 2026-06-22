import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { ApiError } from '../api/pokeapi';

type Props = {
  error: unknown;
  onRetry?: () => void;
};

function messageFor(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'timeout':
        return 'That took too long. Check your connection and try again.';
      case 'network':
        return "Couldn't reach the Pokedex. Are you online?";
      case 'http':
        return error.status === 404
          ? "That Pokémon doesn't exist in the Pokedex."
          : `The server returned an error (${error.status}).`;
      default:
        return 'Something went wrong while reading the data.';
    }
  }
  return 'An unexpected error occurred.';
}

/** Full-screen error state with a contextual message and a retry action. */
export function ErrorView({ error, onRetry }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📡</Text>
      <Text style={[styles.title, { color: colors.text }]}>Oops!</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>{messageFor(error)}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.buttonLabel, { color: colors.onPrimary }]}>Try again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
