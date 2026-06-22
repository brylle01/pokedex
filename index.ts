import { registerRootComponent } from 'expo';

// Quiet known dev-only deprecations from dependencies (see the module). Imported
// after 'expo' so it wraps LogBox's console patch and intercepts first.
import './src/utils/silenceKnownWarnings';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
