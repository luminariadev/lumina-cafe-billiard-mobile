import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import GuestHomeScreen from "./src/screens/GuestHomeScreen";
import GuestMejaPickingScreen from "./src/screens/GuestMejaPickingScreen";
import GuestBookingFormScreen from "./src/screens/GuestBookingFormScreen";
import GuestPaymentScreen from "./src/screens/GuestPaymentScreen";
import GuestCafeMenuScreen from "./src/screens/GuestCafeMenuScreen";
import GuestCartScreen from "./src/screens/GuestCartScreen";
import GuestOrderStatusScreen from "./src/screens/GuestOrderStatusScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#131313" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="Home" component={GuestHomeScreen} />
          <Stack.Screen name="MejaPicking" component={GuestMejaPickingScreen} />
          <Stack.Screen name="BookingForm" component={GuestBookingFormScreen} />
          <Stack.Screen name="CafeMenu" component={GuestCafeMenuScreen} />
          <Stack.Screen name="Cart" component={GuestCartScreen} />
          <Stack.Screen name="Payment" component={GuestPaymentScreen} />
          <Stack.Screen name="OrderStatus" component={GuestOrderStatusScreen} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
