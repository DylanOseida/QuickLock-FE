import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Global gradient background */}
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#1B4764', '#1B2531']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Screen navigation */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-pass" />
        <Stack.Screen name="home" />
      </Stack>

      <StatusBar style="light" />
    </ThemeProvider>
  );
}
