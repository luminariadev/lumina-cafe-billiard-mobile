import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cafeOrder } from "../lib/api";

export default function GuestCartScreen({ route, navigation }: any) {
  const { products, cart } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [loading, setLoading] = useState(false);

  const cartItems = Object.entries(cart as Record<string, number>)
    .map(([id, qty]) => {
      const product = (products as any[]).find((p: any) => p.id === Number(id));
      return product ? { productId: product.id, name: product.name, price: product.price, qty } : null;
    })
    .filter(Boolean);

  const total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

  async function handleOrder() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Lengkapi data", "Nama dan No. HP wajib diisi");
      return;
    }
    if (cartItems.length === 0) {
      Alert.alert("Pilih item", "Minimal 1 item dipesan");
      return;
    }
    setLoading(true);
    try {
      const items: Record<string, number> = {};
      cartItems.forEach((item: any) => {
        items[item.productId.toString()] = item.qty;
      });
      const result = await cafeOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        items,
        payment_method: paymentMethod,
      });
      navigation.replace("Payment", {
        transaksi: result,
        type: "cafe",
        meja: null,
        durasi: null,
        customerName: name.trim(),
      });
    } catch (e: any) {
      Alert.alert("Gagal", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🛒 Keranjang</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item: any) => item.productId.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <View style={styles.cartItem}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartName}>{item.name}</Text>
              <Text style={styles.cartPrice}>Rp {item.price.toLocaleString()} × {item.qty}</Text>
            </View>
            <Text style={styles.cartSubtotal}>
              Rp {(item.price * item.qty).toLocaleString()}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama..."
                placeholderTextColor="#6b7280"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>No. HP</Text>
              <TextInput
                style={styles.input}
                placeholder="08123456789"
                placeholderTextColor="#6b7280"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Metode Bayar</Text>
              <View style={styles.paymentRow}>
                <TouchableOpacity
                  style={[styles.paymentBtn, paymentMethod === "qris" && styles.paymentActive]}
                  onPress={() => setPaymentMethod("qris")}
                >
                  <Text style={[styles.paymentText, paymentMethod === "qris" && styles.paymentTextActive]}>
                    📱 QRIS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.paymentBtn, paymentMethod === "tunai" && styles.paymentActive]}
                  onPress={() => setPaymentMethod("tunai")}
                >
                  <Text style={[styles.paymentText, paymentMethod === "tunai" && styles.paymentTextActive]}>
                    💵 Tunai
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rp {total.toLocaleString()}</Text>
            </View>
            <TouchableOpacity
              style={[styles.orderBtn, loading && { opacity: 0.6 }]}
              onPress={handleOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0d2818" />
              ) : (
                <Text style={styles.orderBtnText}>
                  {paymentMethod === "qris" ? "Bayar via QRIS" : "Pesan (Bayar di Kasir)"}
                </Text>
              )}
            </TouchableOpacity>
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  backText: { color: "#c9a84c", fontSize: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  list: { padding: 20, paddingBottom: 40 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#143d28",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  cartInfo: { flex: 1 },
  cartName: { color: "#fff", fontSize: 15, fontWeight: "600" },
  cartPrice: { color: "#9ca3af", fontSize: 13, marginTop: 2 },
  cartSubtotal: { color: "#c9a84c", fontSize: 15, fontWeight: "bold" },
  formGroup: { marginTop: 20 },
  label: { color: "#9ca3af", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  paymentRow: { flexDirection: "row", gap: 8 },
  paymentBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#143d28",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  paymentActive: { backgroundColor: "#c9a84c", borderColor: "#c9a84c" },
  paymentText: { color: "#6b7280", fontSize: 14, fontWeight: "600" },
  paymentTextActive: { color: "#0d2818" },
  totalBox: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  totalLabel: { color: "#9ca3af", fontSize: 18 },
  totalValue: { color: "#c9a84c", fontSize: 24, fontWeight: "bold" },
  orderBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
  orderBtnText: { color: "#0d2818", fontSize: 18, fontWeight: "bold" },
});