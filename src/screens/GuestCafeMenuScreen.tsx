import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts, Product } from "../lib/api";

export default function GuestCafeMenuScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<number, number>>({});

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data.filter((p) => p.active)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (id: number) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product ? product.price * qty : 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header selalu tampil */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>☕ Cafe Menu</Text>
        <Text style={styles.subtitle}>
          {loading ? "Memuat menu..." : `${products.length} menu tersedia`}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#c9a84c" />
        </View>
      ) : (
        <>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => addToCart(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.productEmoji}>
                  {item.product_type === "makanan" ? "🍽️" : "☕"}
                </Text>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productPrice}>Rp {item.price.toLocaleString()}</Text>
                <Text style={[styles.stockText, item.stock <= 0 ? styles.stockOut : styles.stockOk]}>
                  {item.stock <= 0 ? "Habis" : `Sisa ${item.stock}`}
                </Text>
                {cart[item.id] && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cart[item.id]}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada menu tersedia</Text>
            }
          />

          {/* Cart bar */}
          {cartCount > 0 && (
            <View style={styles.cartBar}>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => navigation.navigate("Cart", { products, cart })}
              >
                <Text style={styles.cartBtnText}>
                  🛒 {cartCount} item — Rp {cartTotal.toLocaleString()}
                </Text>
                <Text style={styles.cartArrow}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  backText: { color: "#c9a84c", fontSize: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  subtitle: { color: "#9ca3af", fontSize: 14, marginTop: 4 },
  grid: { paddingHorizontal: 20, paddingBottom: 100 },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  productCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1a4d33",
    alignItems: "center",
    position: "relative",
  },
  productEmoji: { fontSize: 32, marginBottom: 8 },
  productName: { color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" },
  productPrice: { color: "#c9a84c", fontSize: 15, fontWeight: "bold", marginTop: 4 },
  stockText: { fontSize: 11, marginTop: 4 },
  stockOut: { color: "#ef4444" },
  stockOk: { color: "#6b7280" },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#c9a84c",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#0d2818", fontSize: 12, fontWeight: "bold" },
  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  cartBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBtnText: { color: "#0d2818", fontSize: 16, fontWeight: "bold" },
  cartArrow: { color: "#0d2818", fontSize: 20, fontWeight: "bold" },
  emptyText: { color: "#6b7280", textAlign: "center", marginTop: 60, fontSize: 16 },
});
