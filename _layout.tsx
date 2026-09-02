import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { LanguageProvider } from "./language/LanguageContext";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";

ExpoSplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { isDark, colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </LanguageProvider>
  );
}
