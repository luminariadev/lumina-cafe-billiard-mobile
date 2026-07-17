import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import PosScreen from "./src/screens/PosScreen";
import CafePosScreen from "./src/screens/CafePosScreen";
import MejaScreen from "./src/screens/MejaScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import TransaksiListScreen from "./src/screens/TransaksiListScreen";
import TransaksiDetailScreen from "./src/screens/TransaksiDetailScreen";
import ReportsScreen from "./src/screens/ReportsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: "🏠",
    POS: "🛒",
    Meja: "🎱",
    Transaksi: "📋",
    Produk: "☕",
    Laporan: "📊",
  };
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>{icons[label] || "📌"}</Text>
      <Text
        style={{
          fontSize: 10,
          color: focused ? "#c9a84c" : "#6b7280",
          fontWeight: focused ? "600" : "400",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#143d28",
          borderTopColor: "#1a4d33",
          height: 65,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="POS" component={PosScreen} />
      <Tab.Screen name="Meja" component={MejaScreen} />
      <Tab.Screen name="Transaksi" component={TransaksiListScreen} />
      <Tab.Screen name="Produk" component={ProductsScreen} />
      <Tab.Screen name="Laporan" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0d2818", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 48 }}>🎱</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen
            name="CafePos"
            component={CafePosScreen}
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="TransaksiDetail"
            component={TransaksiDetailScreen}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </AuthProvider>
  );
}
