import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';
import { USE_NATIVE_DRIVER } from '../utils/animation';

type Props = {
  children: ReactNode;
  /** Delay before the animation starts (ms) — use to stagger siblings. */
  delay?: number;
  /** How far the content rises into place (px). */
  offsetY?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Fades and slides its children up into place on mount. Used to give lists and
 * detail sections a lively, staggered entrance.
 */
export function AnimatedAppear({
  children,
  delay = 0,
  offsetY = 14,
  duration = 380,
  style,
}: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: USE_NATIVE_DRIVER,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [offsetY, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
