import { Platform } from 'react-native';

/**
 * Whether Animated should drive animations on the native thread.
 *
 * The native animated module only exists on iOS/Android. On web it's absent, so
 * requesting it makes React Native Web log a warning and fall back to JS-based
 * animation anyway. Gating on platform keeps web quiet while still getting the
 * native driver's benefits on device.
 */
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';
