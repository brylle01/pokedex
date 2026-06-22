import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  FavoritesStackParamList,
  PokedexStackParamList,
  RootTabParamList,
} from './types';
import { PokedexListScreen } from '../screens/PokedexListScreen';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../theme/useTheme';
import { USE_NATIVE_DRIVER } from '../utils/animation';

const PokedexStack = createNativeStackNavigator<PokedexStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function useStackScreenOptions() {
  const { colors } = useTheme();
  return {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '800' as const },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.background },
  };
}

function PokedexStackNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <PokedexStack.Navigator screenOptions={screenOptions}>
      <PokedexStack.Screen
        name="PokedexList"
        component={PokedexListScreen}
        options={{ title: 'Pokedex', headerRight: () => <ThemeToggle /> }}
      />
      <PokedexStack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={{ headerShown: false }}
      />
    </PokedexStack.Navigator>
  );
}

function FavoritesStackNavigator() {
  const screenOptions = useStackScreenOptions();
  return (
    <FavoritesStack.Navigator screenOptions={screenOptions}>
      <FavoritesStack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ title: 'Favorites', headerRight: () => <ThemeToggle /> }}
      />
      <FavoritesStack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={{ headerShown: false }}
      />
    </FavoritesStack.Navigator>
  );
}

/** Tab icon that springs up and brightens when its tab becomes focused. */
function AnimatedTabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.85)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.18 : 0.9,
      friction: 5,
      tension: 160,
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }, [focused, scale]);

  return (
    <Animated.Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45, transform: [{ scale }] }}>
      {emoji}
    </Animated.Text>
  );
}

function tabIcon(emoji: string) {
  return ({ focused }: { focused: boolean }) => <AnimatedTabIcon emoji={emoji} focused={focused} />;
}

export function RootNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="PokedexTab"
        component={PokedexStackNavigator}
        options={{ title: 'Pokedex', tabBarIcon: tabIcon('🔴') }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{ title: 'Favorites', tabBarIcon: tabIcon('❤️') }}
      />
    </Tab.Navigator>
  );
}
