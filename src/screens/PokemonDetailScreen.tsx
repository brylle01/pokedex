import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PokedexStackParamList } from '../navigation/types';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useTheme } from '../theme/useTheme';
import { typeColors, FALLBACK_TYPE_COLOR } from '../theme/colors';
import { readableTextColor, withAlpha } from '../utils/colorContrast';
import {
  STAT_LABELS,
  formatDexNumber,
  formatHeight,
  formatName,
  formatWeight,
  officialArtworkUrl,
} from '../utils/pokemon';
import { USE_NATIVE_DRIVER } from '../utils/animation';
import { TypeBadge } from '../components/TypeBadge';
import { StatBar } from '../components/StatBar';
import { FavoriteButton } from '../components/FavoriteButton';
import { ErrorView } from '../components/ErrorView';
import { AnimatedAppear } from '../components/AnimatedAppear';

/** Hook that drives the hero artwork's entrance (scale/fade) and a looping bob. */
function useArtworkAnimation() {
  const appear = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, {
      toValue: 1,
      duration: 460,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1700, useNativeDriver: USE_NATIVE_DRIVER }),
        Animated.timing(bob, { toValue: 0, duration: 1700, useNativeDriver: USE_NATIVE_DRIVER }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [appear, bob]);

  return {
    opacity: appear,
    transform: [
      { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) },
      { scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1] }) },
    ],
  };
}

type Props = NativeStackScreenProps<PokedexStackParamList, 'PokemonDetail'>;

export function PokemonDetailScreen({ route, navigation }: Props) {
  const { id, name } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, isLoading, isError, error, refetch } = usePokemonDetail(name);

  const primaryType = data?.types[0]?.type.name;
  const accent = primaryType ? typeColors[primaryType] ?? FALLBACK_TYPE_COLOR : colors.primary;
  const onAccent = readableTextColor(accent);
  const artworkStyle = useArtworkAnimation();

  const HeaderControls = (
    <View style={[styles.headerControls, { paddingTop: insets.top + 8 }]}>
      <Pressable
        hitSlop={12}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      >
        <Text style={[styles.backIcon, { color: onAccent }]}>‹</Text>
      </Pressable>
      <FavoriteButton
        pokemon={{ id, name, types: data?.types.map((t) => t.type.name) ?? [] }}
        size={26}
      />
    </View>
  );

  if (isError) {
    return (
      <View style={[styles.flex, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.primary, withAlpha(colors.primary, 0.7)]}>
          {HeaderControls}
        </LinearGradient>
        <ErrorView error={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Colored hero header with artwork. */}
        <LinearGradient colors={[accent, withAlpha(accent, 0.55)]} style={styles.hero}>
          {HeaderControls}
          <View style={styles.heroTitleRow}>
            <Text style={[styles.heroName, { color: onAccent }]}>{formatName(name)}</Text>
            <Text style={[styles.heroDex, { color: onAccent }]}>{formatDexNumber(id)}</Text>
          </View>
          <View style={styles.heroTypes}>
            {data?.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </View>
          <Animated.View style={[styles.heroImage, artworkStyle]}>
            <Image
              source={{ uri: officialArtworkUrl(id) }}
              style={styles.heroImageInner}
              contentFit="contain"
              transition={300}
              cachePolicy="memory-disk"
            />
          </Animated.View>
        </LinearGradient>

        {isLoading ? (
          <ActivityIndicator color={accent} size="large" style={styles.loader} />
        ) : data ? (
          <View style={styles.body}>
            {/* Physical attributes. */}
            <AnimatedAppear delay={60} style={styles.statCardRow}>
              <InfoTile label="Height" value={formatHeight(data.height)} />
              <InfoTile label="Weight" value={formatWeight(data.weight)} />
              <InfoTile label="Base XP" value={String(data.base_experience ?? '—')} />
            </AnimatedAppear>

            {/* Abilities. */}
            <AnimatedAppear delay={140}>
              <Section title="Abilities">
                <View style={styles.abilityRow}>
                  {data.abilities.map((a) => (
                    <View
                      key={a.ability.name}
                      style={[styles.abilityChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      <Text style={[styles.abilityText, { color: colors.text }]}>
                        {formatName(a.ability.name)}
                      </Text>
                      {a.is_hidden && (
                        <Text style={[styles.hiddenTag, { color: colors.textMuted }]}>hidden</Text>
                      )}
                    </View>
                  ))}
                </View>
              </Section>
            </AnimatedAppear>

            {/* Base stats. */}
            <AnimatedAppear delay={220}>
              <Section title="Base Stats">
                {data.stats.map((s, i) => (
                  <StatBar
                    key={s.stat.name}
                    label={STAT_LABELS[s.stat.name] ?? formatName(s.stat.name)}
                    value={s.base_stat}
                    color={accent}
                    delay={260 + i * 80}
                  />
                ))}
              </Section>
            </AnimatedAppear>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.infoTile, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 40,
    fontWeight: '300',
    lineHeight: 40,
    marginTop: -4,
  },
  pressed: {
    opacity: 0.6,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  heroName: {
    fontSize: 30,
    fontWeight: '800',
  },
  heroDex: {
    fontSize: 18,
    fontWeight: '700',
    opacity: 0.85,
  },
  heroTypes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  heroImage: {
    width: '70%',
    height: 200,
    alignSelf: 'center',
    marginTop: 8,
  },
  heroImageInner: {
    width: '100%',
    height: '100%',
  },
  loader: {
    marginTop: 48,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statCardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoTile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 17,
    fontWeight: '800',
  },
  infoLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  abilityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  abilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  abilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  hiddenTag: {
    fontSize: 11,
    fontStyle: 'italic',
  },
});
