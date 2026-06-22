/**
 * Silences known, harmless dev-only warnings coming from dependencies we can't
 * fix at the source. Keep this list tiny and specific so real warnings still
 * surface.
 *
 * - "props.pointerEvents is deprecated": React Navigation 7 and
 *   react-native-screens still pass `pointerEvents` as a prop (e.g.
 *   `<View pointerEvents="box-none">`) inside their headers, tab bar, and screen
 *   containers. react-native-web 0.21 deprecated the prop form in favour of
 *   `style.pointerEvents`, so it logs the deprecation. It's emitted by
 *   react-native-web's `warnOnce`, which is compiled out of production builds,
 *   so this only affects the dev console. Drop it until those libraries migrate.
 *
 * Imported for its side effect from the app entry, before the app renders, so
 * this wrapper sits outside Expo's LogBox console patch and intercepts first.
 */
const SILENCED_PATTERNS = ['props.pointerEvents is deprecated'];

function isSilenced(args: unknown[]): boolean {
  const first = args[0];
  return typeof first === 'string' && SILENCED_PATTERNS.some((p) => first.includes(p));
}

if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (isSilenced(args)) return;
    originalWarn(...(args as Parameters<typeof console.warn>));
  };

  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (isSilenced(args)) return;
    // TEMP DEBUG: surface the real message text LogBox hides.
    const originalLog = console.log;
    originalLog('[DEBUG console.error] arg0:', JSON.stringify(args[0]), '| arg1:', JSON.stringify(args[1]));
    originalError(...(args as Parameters<typeof console.error>));
  };
}

export {};
