# Mobile (Expo React Native App)

Expo React Native mobile application for iOS and Android.

## Overview

This is an Expo ~54 application featuring:
- **Expo Router**: File-based navigation
- **React Native 0.81**: Cross-platform native components
- **React 19**: Latest React features
- **Tab Navigation**: Bottom tab bar with 4 screens
- **Type-Safe API**: Shared types with backend via `@repo/api`
- **Dynamic API URL**: Automatically detects correct API endpoint

## Quick Start

```bash
# Install dependencies (from monorepo root)
pnpm install

# Start development server
pnpm dev

# Then scan QR code with:
# - Expo Go app (iOS/Android)
# - Or press 'a' for Android emulator
# - Or press 'i' for iOS simulator
```

## Project Structure

```
apps/mobile/
├── app/
│   ├── _layout.tsx                    # Root layout
│   │
│   ├── (tabs)/                        # Tab navigator
│   │   ├── _layout.tsx                # Tab configuration
│   │   ├── index.tsx                  # Home screen
│   │   ├── explore.tsx                # Explore screen
│   │   ├── tasks.tsx                  # Tasks screen
│   │   └── transactions.tsx           # Transactions screen
│   │
│   └── +not-found.tsx                 # 404 page
│
├── components/
│   ├── navigation/
│   │   └── TabBarBackground.tsx
│   ├── ui/
│   │   └── IconSymbol.tsx
│   ├── HelloWave.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   └── ThemedView.tsx
│
├── services/
│   ├── tasks-api.service.ts           # Tasks API client
│   └── transactions-api.service.ts    # Transactions API client
│
├── config/
│   └── api.ts                         # Dynamic API URL configuration
│
├── constants/
│   ├── Colors.ts                      # Theme colors
│   └── theme.ts                       # Custom theme
│
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-themed-color.ts
│
├── app.json                           # Expo configuration
└── tsconfig.json                      # TypeScript configuration
```

## Available Scripts

```bash
# Development
pnpm dev              # Start Expo dev server
pnpm android          # Run on Android
pnpm ios              # Run on iOS
pnpm web              # Run in browser

# Code Quality
pnpm lint             # Expo lint
```

## Screens

### Home Screen (`/`)

Welcome screen with:
- Animated wave component
- Project introduction
- Quick links
- Step-by-step getting started guide

### Explore Screen (`/explore`)

Tutorial and documentation screen:
- Interactive guide
- Collapsible sections
- Code examples
- External links

### Tasks Screen (`/tasks`)

Task management with native UI:

**Features**:
- Task list with FlatList (virtualized)
- Create task form
- Task completion toggle
- Delete functionality
- Pull-to-refresh
- Loading states
- Empty state

**API Integration**:
```typescript
import { fetchTasks, createTask } from '@/services/tasks-api.service';

const tasks = await fetchTasks();
```

### Transactions Screen (`/transactions`)

Transaction viewing with advanced features:

**Features**:
- **Statistics Cards**:
  - Total transactions
  - Total received (amount + count)
  - Total paid (amount + count)
  - Current balance (color-coded)

- **Search**:
  - Real-time text search
  - Debounced input (500ms)
  - Searches origin, destination, message

- **Transaction List** (FlatList):
  - Infinite scroll pagination
  - Pull-to-refresh
  - Color-coded transaction cards:
    - Green border: Received
    - Orange border: Paid
  - Transaction details:
    - Type indicator (↓ received, ↑ paid)
    - Origin and destination
    - Amount (formatted)
    - Message (if present)
    - Operation date

- **Performance Optimizations**:
  - Virtualized list
  - On-end-reached pagination
  - Loading indicators
  - Empty state handling

## Navigation

### Tab Navigator

Bottom tab bar with 4 tabs:

| Tab | Icon | Screen | Route |
|-----|------|--------|-------|
| Home | house.fill | Home Screen | `/` |
| Explore | paperplane.fill | Explore Screen | `/explore` |
| Tasks | list.bullet | Tasks Screen | `/tasks` |
| Transactions | dollarsign.circle | Transactions Screen | `/transactions` |

Icons use iOS SF Symbols.

### Navigation Usage

```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate
router.push('/tasks');
router.back();
```

## API Configuration

### Dynamic URL Resolution

The app automatically determines the correct API URL based on environment:

```typescript
// config/api.ts
function getApiUrl(): string {
  // 1. Check custom URL in app config
  const customApiUrl = Constants.expoConfig?.extra?.API_URL;
  if (customApiUrl) return customApiUrl;

  // 2. For development, use debugger host IP
  if (__DEV__) {
    const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
    if (debuggerHost) {
      return `http://${debuggerHost}:3000`;  // Uses computer's IP
    }

    // 3. Android emulator fallback
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';  // Special Android emulator alias
    }

    // 4. iOS simulator fallback
    return 'http://localhost:3000';
  }

  // 5. Production
  return 'https://api.your-domain.com';
}
```

**This ensures the app works on**:
- **Physical devices**: Uses your computer's IP (from Expo debugger)
- **Android emulators**: Uses `10.0.2.2` (alias for host machine)
- **iOS simulators**: Uses `localhost`
- **Production**: Uses configured API URL

### API Services

All API calls use the centralized `apiFetch` helper:

```typescript
// services/transactions-api.service.ts
import { apiFetch } from '../config/api';

export async function getTransactions(filters?: TransactionFilters): Promise<Transaction[]> {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';

  return apiFetch<Transaction[]>(endpoint);
}
```

## Styling

### Theme System

Light and dark mode support:

```typescript
// hooks/use-color-scheme.ts
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
```

### Custom Colors

Defined in `constants/theme.ts`:
- Emerald: `#50C878` (success, received)
- Orange: `#FF7F00` (warning, paid)
- Cyan: `#00FFFF` (accent)
- Purple: `#9D00FF` (accent)

### Themed Components

```typescript
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

<ThemedView style={{ padding: 16 }}>
  <ThemedText type="title">Hello</ThemedText>
</ThemedView>
```

## Development

### Run on Physical Device

1. **Install Expo Go**:
   - iOS: App Store
   - Android: Play Store

2. **Start Dev Server**:
   ```bash
   pnpm dev
   ```

3. **Scan QR Code**:
   - iOS: Camera app
   - Android: Expo Go app

### Run on Emulator

**Android**:
```bash
# Start Android Studio emulator first
pnpm android
```

**iOS** (macOS only):
```bash
pnpm ios
```

### Clear Metro Cache

If you encounter issues:
```bash
# From root
cd apps/mobile && rm -rf .expo node_modules/.cache

# Or restart with clear
pnpm dev --clear
```

## Environment Variables

### App Configuration

Edit `app.json`:

```json
{
  "expo": {
    "extra": {
      "API_URL": "http://your-api-url.com"
    }
  }
}
```

Access in code:
```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.API_URL;
```

## Building for Production

### EAS Build

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Login**:
   ```bash
   eas login
   ```

3. **Configure**:
   ```bash
   eas build:configure
   ```

4. **Build**:
   ```bash
   # Build for both platforms
   eas build --platform all

   # Or individual platforms
   eas build --platform android
   eas build --platform ios
   ```

5. **Submit to Stores**:
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

### Local Builds

**Android APK**:
```bash
eas build --platform android --profile preview --local
```

**iOS** (requires Mac):
```bash
eas build --platform ios --profile preview --local
```

## Troubleshooting

### Network Request Failed

If transactions/tasks fail to load:

1. **Check API is running**:
   ```bash
   curl http://localhost:3000/tasks
   ```

2. **Verify API URL**:
   - Check that `apiFetch` is being used (not hardcoded URLs)
   - Check debugger console for actual URL being called

3. **Clear cache**:
   ```bash
   pnpm dev --clear
   ```

4. **For Android emulator**, ensure using `10.0.2.2`:
   ```typescript
   // Should automatically use this in config/api.ts
   return 'http://10.0.2.2:3000';
   ```

### Metro Bundler Errors

```bash
# Kill Metro process
lsof -ti:8081 | xargs kill -9

# Or on Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Restart
pnpm dev --clear
```

### Build Errors

```bash
# Clear Expo cache
rm -rf node_modules/.cache

# Clear watchman (if on Mac)
watchman watch-del-all

# Reinstall
rm -rf node_modules
pnpm install
```

## Performance Tips

1. **Use FlatList** for long lists (already implemented)
2. **Debounce search inputs** (already implemented - 500ms)
3. **Pagination** for large datasets (already implemented)
4. **Memoization** for expensive computations:
   ```typescript
   const filteredData = useMemo(() => {
     return data.filter(/* ... */);
   }, [data, filters]);
   ```

## Testing on Different Devices

### iOS

- iPhone SE (small screen)
- iPhone 14 Pro (notch)
- iPad (tablet layout)

### Android

- Pixel 5 (modern Android)
- Older devices (Android 8+)
- Different screen sizes

## Platform-Specific Code

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}

// Or use Platform.select
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 0 },
    }),
  },
});
```

## Learn More

- [Main README](../../README.md)
- [Architecture Documentation](../../ARCHITECTURE.md)
- [Expo Documentation](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [EAS Build](https://docs.expo.dev/build/introduction)
