// template
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HealthProvider } from "@/contexts/HealthContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
    return (
        <Stack screenOptions={{ headerBackTitle: "Back" }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="face-scan" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="food-scan" options={{ presentation: "modal", headerShown: false }} />
            <Stack.Screen name="face-results" options={{ headerShown: false, title: "Face Analysis" }} />
            <Stack.Screen name="food-details" options={{ headerShown: false, title: "Food Details" }} />
        </Stack>
    );
}

export default function RootLayout() {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <HealthProvider>
                    <RootLayoutNav />
                </HealthProvider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    );
}
