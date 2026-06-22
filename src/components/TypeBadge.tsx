import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typeColors, FALLBACK_TYPE_COLOR } from '../theme/colors';
import { readableTextColor } from '../utils/colorContrast';
import { formatName } from '../utils/pokemon';

type Props = {
  type: string;
  size?: 'sm' | 'md';
};

/** A pill showing a Pokémon type, colored with that type's signature accent. */
function TypeBadgeComponent({ type, size = 'md' }: Props) {
  const bg = typeColors[type] ?? FALLBACK_TYPE_COLOR;
  const color = readableTextColor(bg);
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text style={[styles.label, { color }, isSmall && styles.labelSm]}>
        {formatName(type)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeSm: {
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  label: {
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: 11,
  },
});

export const TypeBadge = memo(TypeBadgeComponent);
