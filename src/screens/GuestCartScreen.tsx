import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cafeOrder } from "../lib/api";
import { Colors } from "../lib/theme";
import { formatCurrency } from "../lib/format";

export default function GuestCartScreen({ route, navigation }: any) {
  const { products, cart } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [loading, setLoading] = useState(false);

  const cartItems = Object.entries(cart as Record<string, number>)
    .map(([id, qty]) => {
      const product = (products as any[]).find((p: any) => p.id === Number(id));
      return product
        ? { productId: product.id, name: product.name, price: Number(product.price), qty }
        : null;
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Keranjang</Text>
        <Text style={styles.subtitle}>{cartItems.length} item</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item: any) => item.productId.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }: any) => (
          <View style={styles.cartItem}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartName}>{item.name}</Text>
              <Text style={styles.cartPrice}>
                {formatCurrency(item.price)} × {item.qty}
              </Text>
            </View>
            <Text style={styles.cartSubtotal}>
              {formatCurrency(item.price * item.qty)}
            </Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {/* Nama */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama..."
                placeholderTextColor={Colors.onSurfaceVariant}
                value={name}
                onChangeText={setName}
              />
            </View>
            {/* Phone */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>No. HP</Text>
              <TextInput
                style={styles.input}
                placeholder="08123456789"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            {/* Payment Method */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Metode Bayar</Text>
              <View style={styles.paymentRow}>
                <TouchableOpacity
                  style={[styles.paymentBtn, paymentMethod === "qris" && styles.paymentActive]}
                  onPress={() => setPaymentMethod("qris")}
                >
                  <Text style={[styles.paymentText, paymentMethod === "qris" && styles.paymentTextActive]}>
                    QRIS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.paymentBtn, paymentMethod === "tunai" && styles.paymentActive]}
                  onPress={() => setPaymentMethod("tunai")}
                >
                  <Text style={[styles.paymentText, paymentMethod === "tunai" && styles.paymentTextActive]}>
                    Tunai
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Total */}
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
            {/* Order */}
            <TouchableOpacity
              style={[styles.orderBtn, loading && { opacity: 0.6 }]}
              onPress={handleOrder}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
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
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(61,74,62,0.1)",
  },
  backText: { color: Colors.primary, fontSize: 22 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
  },
  subtitle: { color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 4 },
  list: { padding: 16, paddingBottom: 40 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30,30,30,0.8)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cartInfo: { flex: 1 },
  cartName: { color: Colors.onSurface, fontSize: 15, fontWeight: "600" },
  cartPrice: { color: Colors.onSurfaceVariant, fontSize: 13, marginTop: 2 },
  cartSubtotal: { color: Colors.primary, fontSize: 15, fontWeight: "bold" },
  formGroup: { marginTop: 20 },
  label: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    color: Colors.onSurface,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  paymentRow: { flexDirection: "row", gap: 8 },
  paymentBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "rgba(30,30,30,0.8)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  paymentActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  paymentText: { color: Colors.onSurfaceVariant, fontSize: 14, fontWeight: "600" },
  paymentTextActive: { color: Colors.onPrimary },
  totalBox: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  totalLabel: { color: Colors.onSurfaceVariant, fontSize: 18 },
  totalValue: { color: Colors.primary, fontSize: 24, fontWeight: "bold" },
  orderBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 20,
  },
  orderBtnText: { color: Colors.onPrimary, fontSize: 18, fontWeight: "bold" },
});
