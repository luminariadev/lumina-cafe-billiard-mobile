import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuestHomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Hero section compact */}
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🎱</Text>
        </View>
        <Text style={styles.title}>Lumina</Text>
        <Text style={styles.subtitle}>Billiard & Cafe</Text>
      </View>

      {/* Card grid — fixed height, ga stretching */}
      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate("MejaPicking")}
          activeOpacity={0.8}
        >
          <Text style={styles.menuIcon}>🎱</Text>
          <Text style={styles.menuTitle}>Billiard</Text>
          <Text style={styles.menuDesc}>Booking meja billiard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate("CafeMenu")}
          activeOpacity={0.8}
        >
          <Text style={styles.menuIcon}>☕</Text>
          <Text style={styles.menuTitle}>Cafe</Text>
          <Text style={styles.menuDesc}>Pesan makanan & minuman</Text>
        </TouchableOpacity>
      </View>

      {/* Footer stay at bottom */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Bayar via QRIS atau tunai</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  hero: { alignItems: "center", paddingTop: 40, paddingBottom: 32 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#143d28",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c9a84c",
    marginBottom: 12,
  },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 28, fontWeight: "bold", color: "#c9a84c" },
  subtitle: { fontSize: 14, color: "#9ca3af", marginTop: 2 },
  menuGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    height: 180,
  },
  menuCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  menuIcon: { fontSize: 40, marginBottom: 8 },
  menuTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  menuDesc: { fontSize: 11, color: "#6b7280", marginTop: 4, textAlign: "center", paddingHorizontal: 4 },
  footer: { paddingVertical: 24, alignItems: "center" },
  footerText: { color: "#6b7280", fontSize: 13 },
});
