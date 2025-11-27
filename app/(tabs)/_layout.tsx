import { Tabs } from "expo-router";
import { Activity, BarChart3, Clock } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#10B981",
                tabBarInactiveTintColor: "#9CA3AF",
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 60 + insets.bottom,
                    paddingBottom: Math.max(insets.bottom - 4, 0),
                    paddingTop: 6,
                },
                tabBarBackground: () => (
                    <View style={StyleSheet.absoluteFill}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0.90)']}
                            style={StyleSheet.absoluteFill}
                        />
                    </View>
                ),
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "700" as const,
                    marginTop: 2,
                },
                tabBarIconStyle: {
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Today",
                    tabBarIcon: ({ color, size }) => <Activity color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="weekly"
                options={{
                    title: "Weekly Stats",
                    tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
