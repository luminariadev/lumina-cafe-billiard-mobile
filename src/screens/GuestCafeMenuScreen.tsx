import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getProducts, Product } from "../lib/api";
import { Colors } from "../lib/theme";
import { formatCurrency } from "../lib/format";

export default function GuestCafeMenuScreen({ navigation, route }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Record<number, number>>({});

  useEffect(() => {
    getProducts()
      .then((data) => {
        const available = (data || []).filter((p) => p.active && p.stock > 0);
        setProducts(available);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (id: number) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === Number(id));
    return sum + (product ? Number(product.price) * qty : 0);
  }, 0);

  const showBack = route?.params?.showBack ?? false;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
              <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Brew Selection</Text>
            <Text style={styles.subtitle}>
              {loading ? "Memuat..." : `${products.length} menu tersedia`}
            </Text>
          </View>
          {cartCount > 0 && (
            <TouchableOpacity
              style={styles.cartBtn}
              onPress={() => navigation.navigate("Cart", { products, cart })}
            >
              <MaterialIcons name="shopping-cart" size={20} color={Colors.primary} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
                <View style={styles.productImage}>
                  {item.product_type === "minuman" ? (
                    <Ionicons name="cafe-outline" size={36} color={Colors.onSurfaceVariant} />
                  ) : (
                    <MaterialIcons name="restaurant" size={36} color={Colors.onSurfaceVariant} />
                  )}
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
                  <Text
                    style={[
                      styles.stockText,
                      item.stock <= 0 ? styles.stockOut : styles.stockOk,
                    ]}
                  >
                    {item.stock <= 0 ? "Habis" : `Sisa ${item.stock}`}
                  </Text>
                </View>
                {cart[item.id] ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cart[item.id]}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Belum ada menu tersedia</Text>
            }
          />

          {cartCount > 0 && (
            <View style={styles.cartBar}>
              <TouchableOpacity
                style={styles.cartBarBtn}
                onPress={() => navigation.navigate("Cart", { products, cart })}
              >
                <Text style={styles.cartBarText}>
                  {cartCount} item — {formatCurrency(cartTotal)}
                </Text>
                <Text style={styles.cartBarArrow}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(61,74,62,0.1)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
  },
  subtitle: { color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 4 },
  cartBtn: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(107,251,154,0.15)",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: { color: Colors.onSecondary, fontSize: 11, fontWeight: "bold" },
  grid: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  productCard: {
    flex: 1,
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    height: 100,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: { padding: 12 },
  productName: {
    color: Colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
  },
  productPrice: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },
  stockText: { fontSize: 11, marginTop: 4 },
  stockOut: { color: "#ef4444" },
  stockOk: { color: Colors.onSurfaceVariant },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: Colors.onSecondary, fontSize: 12, fontWeight: "bold" },
  cartBar: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
  },
  cartBarBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBarText: { color: Colors.onPrimary, fontSize: 16, fontWeight: "bold" },
  cartBarArrow: { color: Colors.onPrimary, fontSize: 20, fontWeight: "bold" },
  emptyText: {
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
  },
});
