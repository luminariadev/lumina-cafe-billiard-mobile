import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

const PRODUCTS = [
  { id: 1, name: "Happy Hour (8-10)", price: 125000, type: "Billiard" },
  { id: 2, name: "Regular Hour", price: 150000, type: "Billiard" },
  { id: 3, name: "Lapangan Billiard (per jam)", price: 75000, type: "Billiard" },
  { id: 4, name: "Sewa Alat (Stik + Kapur)", price: 25000, type: "Billiard" },
  { id: 5, name: "Kopi Hitam", price: 12000, type: "Cafe" },
  { id: 6, name: "Kopi Susu", price: 15000, type: "Cafe" },
  { id: 7, name: "Matcha Latte", price: 18000, type: "Cafe" },
  { id: 8, name: "Air Mineral", price: 5000, type: "Cafe" },
];

export default function ProductsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Produk & Layanan</Text>
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, item.type === "Billiard" ? styles.billiardBadge : styles.cafeBadge]}>
                  <Text style={styles.badgeText}>{item.type}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.price}>Rp {item.price.toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 50, marginBottom: 16 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  info: { flex: 1 },
  name: { color: "#fff", fontSize: 16, fontWeight: "600" },
  badgeRow: { flexDirection: "row", marginTop: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 4 },
  billiardBadge: { backgroundColor: "#c9a84c" },
  cafeBadge: { backgroundColor: "#1a4d33" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  price: { color: "#c9a84c", fontSize: 18, fontWeight: "bold" },
});
