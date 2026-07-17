import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { cafePos, Product } from "../lib/api";

const DEFAULT_ITEMS = [
  { id: 1, name: "Kopi Hitam", price: 12000, stock: 50, emoji: "☕" },
  { id: 2, name: "Kopi Susu", price: 15000, stock: 40, emoji: "🥛" },
  { id: 3, name: "Matcha Latte", price: 18000, stock: 30, emoji: "🍵" },
  { id: 4, name: "Air Mineral", price: 5000, stock: 100, emoji: "🧊" },
  { id: 5, name: "Jus Jeruk", price: 15000, stock: 25, emoji: "🍊" },
  { id: 6, name: "Kentang Goreng", price: 15000, stock: 20, emoji: "🍟" },
  { id: 7, name: "Ayam Goreng", price: 25000, stock: 15, emoji: "🍗" },
  { id: 8, name: "Pisang Goreng", price: 10000, stock: 20, emoji: "🍌" },
  { id: 9, name: "Nasi Goreng", price: 20000, stock: 15, emoji: "🍚" },
  { id: 10, name: "Mie Goreng", price: 15000, stock: 20, emoji: "🍜" },
  { id: 11, name: "Kentang Goreng", price: 12000, stock: 25, emoji: "🍟" },
  { id: 12, name: "Coffe Late", price: 15000, stock: 30, emoji: "☕" },
];

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

export default function CafePosScreen({ route, navigation }: any) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "qris">("qris");
  const [loading, setLoading] = useState(false);

  function addToCart(product: typeof DEFAULT_ITEMS[0]) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          emoji: product.emoji,
        },
      ];
    });
  }

  function updateQty(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (cart.length === 0) {
      Alert.alert("Keranjang kosong", "Pilih minimal satu produk");
      return;
    }
    setLoading(true);
    try {
      const items: Record<string, number> = {};
      cart.forEach((item) => {
        items[item.productId.toString()] = item.quantity;
      });
      const transaksi = await cafePos(paymentMethod, items);
      Alert.alert("Berhasil", `Transaksi ${transaksi.kode_transaksi}`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
      setCart([]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>☕ Cafe POS</Text>
      </View>

      {/* Payment Method */}
      <View style={styles.paymentRow}>
        <TouchableOpacity
          style={[styles.paymentBtn, paymentMethod === "cash" && styles.paymentActive]}
          onPress={() => setPaymentMethod("cash")}
        >
          <Text style={[styles.paymentText, paymentMethod === "cash" && styles.paymentTextActive]}>
            💵 Cash
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentBtn, paymentMethod === "qris" && styles.paymentActive]}
          onPress={() => setPaymentMethod("qris")}
        >
          <Text style={[styles.paymentText, paymentMethod === "qris" && styles.paymentTextActive]}>
            📱 QRIS
          </Text>
        </TouchableOpacity>
      </View>

      {/* Products */}
      <FlatList
        data={DEFAULT_ITEMS}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={{ gap: 6 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard} onPress={() => addToCart(item)}>
            <Text style={styles.productEmoji}>{item.emoji}</Text>
            <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.productPrice}>Rp {item.price.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={<View style={{ height: 200 }} />}
      />

      {/* Cart Bottom Sheet */}
      {cart.length > 0 && (
        <View style={styles.cartSheet}>
          <Text style={styles.cartTitle}>🛒 Pesanan ({cart.length})</Text>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId.toString()}
            style={{ maxHeight: 160 }}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.cartEmoji}>{item.emoji}</Text>
                <View style={styles.cartInfo}>
                  <Text style={styles.cartName}>{item.name}</Text>
                  <Text style={styles.cartPrice}>Rp {(item.price * item.quantity).toLocaleString()}</Text>
                </View>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.productId, -1)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.productId, 1)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.checkoutRow}>
            <Text style={styles.totalText}>Total: Rp {total.toLocaleString()}</Text>
            <TouchableOpacity
              style={[styles.checkoutBtn, loading && { opacity: 0.6 }]}
              onPress={handleCheckout}
              disabled={loading}
            >
              <Text style={styles.checkoutBtnText}>
                {loading ? "⏳" : "Bayar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  header: { marginTop: 50, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  paymentRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  paymentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#143d28",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  paymentActive: {
    backgroundColor: "#c9a84c",
    borderColor: "#c9a84c",
  },
  paymentText: { color: "#6b7280", fontSize: 14, fontWeight: "600" },
  paymentTextActive: { color: "#0d2818" },
  productGrid: { paddingBottom: 20 },
  productCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#1a4d33",
    alignItems: "center",
  },
  productEmoji: { fontSize: 28, marginBottom: 4 },
  productName: { color: "#fff", fontSize: 11, fontWeight: "600", textAlign: "center" },
  productPrice: { color: "#c9a84c", fontSize: 12, fontWeight: "bold", marginTop: 2 },
  cartSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#143d28",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a4d33",
    maxHeight: "50%",
  },
  cartTitle: { color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cartEmoji: { fontSize: 20, marginRight: 8 },
  cartInfo: { flex: 1 },
  cartName: { color: "#fff", fontSize: 14 },
  cartPrice: { color: "#c9a84c", fontSize: 12 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0d2818",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c9a84c",
  },
  qtyBtnText: { color: "#c9a84c", fontSize: 16, fontWeight: "bold" },
  qtyValue: { color: "#fff", fontSize: 14, width: 20, textAlign: "center" },
  checkoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#1a4d33",
  },
  totalText: { color: "#c9a84c", fontSize: 18, fontWeight: "bold" },
  checkoutBtn: {
    backgroundColor: "#c9a84c",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  checkoutBtnText: { color: "#0d2818", fontSize: 16, fontWeight: "bold" },
});
