import { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/useTheme';
import { MAX_BASE_STAT } from '../utils/pokemon';

type Props = {
  label: string;
  value: number;
  /** Accent color for the filled portion (usually the primary type color). */
  color: string;
  /** Delay before the bar grows in (ms) — used to cascade a list of stats. */
  delay?: number;
};

/** A labelled bar whose fill animates from 0 to the stat's value on mount. */
function StatBarComponent({ label, value, color, delay = 0 }: Props) {
  const { colors } = useTheme();
  const pct = Math.max(4, Math.min(100, (value / MAX_BASE_STAT) * 100));
  const grow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(grow, {
      toValue: 1,
      duration: 650,
      delay,
      // Width is a layout prop, so this animation can't use the native driver.
      useNativeDriver: false,
    });
    anim.start();
    return () => anim.stop();
  }, [grow, delay, pct]);

  const width = grow.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${pct}%`],
  });

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 72,
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    width: 36,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    marginRight: 12,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export const StatBar = memo(StatBarComponent);
