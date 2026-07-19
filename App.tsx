import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "./src/lib/theme";

import GuestHomeScreen from "./src/screens/GuestHomeScreen";
import GuestMejaPickingScreen from "./src/screens/GuestMejaPickingScreen";
import GuestBookingFormScreen from "./src/screens/GuestBookingFormScreen";
import GuestPaymentScreen from "./src/screens/GuestPaymentScreen";
import GuestCafeMenuScreen from "./src/screens/GuestCafeMenuScreen";
import GuestCartScreen from "./src/screens/GuestCartScreen";
import GuestOrderStatusScreen from "./src/screens/GuestOrderStatusScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.surface,
    card: "#2a2a2a",
    text: Colors.onSurface,
    border: "rgba(255,255,255,0.1)",
    notification: Colors.secondary,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(42,42,42,0.9)",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.1)",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          height: 72,
          paddingBottom: 12,
          paddingTop: 6,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          letterSpacing: 0.02,
          fontFamily: "Inter",
        },
        tabBarItemStyle: {
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 4,
          marginHorizontal: 4,
        },
        animation: "fade",
      }}
    >
      <Tab.Screen
        name="Home"
        component={GuestHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Book"
        component={GuestMejaPickingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="grid-view" size={size} color={color} />
          ),
          tabBarLabel: "Book",
        }}
      />
      <Tab.Screen
        name="Cafe"
        component={GuestCafeMenuScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-cafe" size={size} color={color} />
          ),
          tabBarLabel: "Cafe",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.surface },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="BookingForm" component={GuestBookingFormScreen} />
          <Stack.Screen name="Cart" component={GuestCartScreen} />
          <Stack.Screen name="Payment" component={GuestPaymentScreen} />
          <Stack.Screen name="OrderStatus" component={GuestOrderStatusScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
