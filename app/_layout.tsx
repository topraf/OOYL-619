/**
 * Root Layout - Main app structure and navigation configuration
 * 
 * This file sets up the core app architecture including:
 * - Font loading and splash screen management
 * - tRPC client configuration for type-safe API calls
 * - React Query setup for data fetching and caching
 * - Network status monitoring for offline support
 * - Stack navigation configuration for all app screens
 * - Global styling and theme application
 * 
 * Key Features:
 * - Cross-platform font loading with error handling
 * - Automatic splash screen hiding after assets load
 * - Network connectivity monitoring (mobile only)
 * - Centralized navigation configuration
 * - Dynamic color theming from user store
 * - Screen-specific options (headers, animations, etc.)
 * 
 * Navigation Structure:
 * - Stack-based navigation using Expo Router
 * - Custom header styling with theme colors
 * - Screen-specific animations (slide, fade)
 * - Conditional header visibility
 * - Centralized screen titles and options
 * 
 * The layout wraps the entire app and provides the foundation
 * for all other screens and components.
 */

import { useFonts } from "expo-font";
import { Stack, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { useUserStore } from "@/store/user-store";
import * as Network from "expo-network";

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
        <NetworkProvider>
          <RootLayoutNav />
        </NetworkProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function NetworkProvider({ children }: { children: React.ReactNode }) {
  const { setOfflineStatus } = useUserStore();
  
  useEffect(() => {
    // Monitor network status
    const checkNetworkStatus = async () => {
      if (Platform.OS !== "web") {
        try {
          const networkState = await Network.getNetworkStateAsync();
          setOfflineStatus(!networkState.isConnected);
        } catch (error) {
          console.error("Error checking network status:", error);
        }
      }
    };
    
    checkNetworkStatus();
    
    // Check network status periodically
    const interval = setInterval(checkNetworkStatus, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [setOfflineStatus]);
  
  return <>{children}</>;
}

function RootLayoutNav() {
  const { getColors } = useUserStore();
  const colors = getColors();
  
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
            headerShown: false,
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