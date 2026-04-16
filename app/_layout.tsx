import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LockOverlay } from '@/components/lock-overlay';
import { KioskProvider, useKiosk } from '@/context/kiosk';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppLockOverlay() {
  const { isLocked, exitMode, unlock, onPinCreated, exitApp } = useKiosk();

  return (
    <LockOverlay
      visible={isLocked}
      exitMode={exitMode}
      onUnlocked={unlock}
      onExited={exitApp}
      onPinCreated={onPinCreated}
    />
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <KioskProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
        <AppLockOverlay />
      </ThemeProvider>
    </KioskProvider>
  );
}
