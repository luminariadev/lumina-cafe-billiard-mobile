import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuestHomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🎱</Text>
        </View>
        <Text style={styles.title}>Lumina</Text>
        <Text style={styles.subtitle}>Billiard & Cafe</Text>
        <Text style={styles.tagline}>Pesan meja atau menu langsung dari sini</Text>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate("MejaPicking")}
          activeOpacity={0.8}
        >
          <Text style={styles.menuIcon}>🎱</Text>
          <Text style={styles.menuTitle}>Billiard</Text>
          <Text style={styles.menuDesc}>Pilih meja & booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate("CafeMenu")}
          activeOpacity={0.8}
        >
          <Text style={styles.menuIcon}>☕</Text>
          <Text style={styles.menuTitle}>Cafe</Text>
          <Text style={styles.menuDesc}>Pesan minuman & makanan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Bayar via QRIS atau tunai</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  hero: { alignItems: "center", paddingTop: 32, paddingBottom: 40 },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#143d28",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c9a84c",
    marginBottom: 16,
  },
  logoEmoji: { fontSize: 40 },
  title: { fontSize: 32, fontWeight: "bold", color: "#c9a84c" },
  subtitle: { fontSize: 16, color: "#9ca3af", marginTop: 4 },
  tagline: { fontSize: 14, color: "#6b7280", marginTop: 12, textAlign: "center", paddingHorizontal: 40 },
  menuGrid: { flexDirection: "row", paddingHorizontal: 20, gap: 12, flex: 1 },
  menuCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  menuIcon: { fontSize: 48, marginBottom: 12 },
  menuTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  menuDesc: { fontSize: 12, color: "#6b7280", marginTop: 4, textAlign: "center" },
  footer: { paddingVertical: 24, alignItems: "center" },
  footerText: { color: "#6b7280", fontSize: 13 },
});