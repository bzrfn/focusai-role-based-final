import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusAI } from './context/FocusAIContext';
import { AuthScreen } from './screens/AuthScreen';
import { MainShell } from './screens/MainShell';
import { buildTheme } from './constants/theme';

export default function App() {
  const { booting, user, settings } = useFocusAI();
  const theme = buildTheme(settings);

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  return user ? <MainShell /> : <AuthScreen />;
}
