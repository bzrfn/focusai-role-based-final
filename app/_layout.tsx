import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FocusAIProvider } from '../src/context/FocusAIContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FocusAIProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </FocusAIProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
