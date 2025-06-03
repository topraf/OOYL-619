import { useFonts } from "expo-font";
import { Stack, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // You can add custom fonts here if needed
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <Slot />;
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: "600",
            color: colors.text,
          },
          headerTintColor: colors.primary,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "League Checker",
            headerTitleAlign: "center",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="user-photo"
          options={{
            title: "Your Photo",
            headerTitleAlign: "center",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="target-photo"
          options={{
            title: "Compare With",
            headerTitleAlign: "center",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: "Results",
            headerTitleAlign: "center",
            animation: "slide_from_right",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: "History",
            headerTitleAlign: "center",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: "Settings",
            headerTitleAlign: "center",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="celebrities"
          options={{
            title: "Celebrity Comparison",
            headerTitleAlign: "center",
            animation: "slide_from_right",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="subscription"
          options={{
            title: "Premium Subscription",
            headerTitleAlign: "center",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="roastmaster"
          options={{
            title: "AI Roastmaster",
            headerTitleAlign: "center",
            animation: "slide_from_right",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="gender-selection"
          options={{
            title: "Select Gender",
            headerTitleAlign: "center",
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="comparison-loading"
          options={{
            title: "Analyzing",
            headerTitleAlign: "center",
            animation: "slide_from_right",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            title: "Welcome",
            headerTitleAlign: "center",
            headerShown: false,
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="onboarding-features"
          options={{
            title: "Features",
            headerTitleAlign: "center",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="onboarding-more-features"
          options={{
            title: "More Features",
            headerTitleAlign: "center",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="onboarding-notifications"
          options={{
            title: "Notifications",
            headerTitleAlign: "center",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="onboarding-subscription"
          options={{
            title: "Premium",
            headerTitleAlign: "center",
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </Stack>
    </>
  );
}