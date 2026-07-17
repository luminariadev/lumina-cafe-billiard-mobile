import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { getTransaksis, payTransaksi, Transaksi } from "../lib/api";

export default function TransaksiDetailScreen({ route, navigation }: any) {
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const all = await getTransaksis();
      const found = all.find((t) => t.id === route.params?.id);
      setTransaksi(found || null);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!transaksi) return;
    setPaying(true);
    try {
      const updated = await payTransaksi(transaksi.id, "tunai");
      setTransaksi(updated);
      Alert.alert("Berhasil", "Transaksi selesai");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  if (!transaksi) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Transaksi tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaksi</Text>
      <Text style={styles.kode}>{transaksi.kode_transaksi}</Text>

      <View style={styles.detailCard}>
        <Text style={styles.detailLabel}>Status</Text>
        <Text style={[styles.detailValue, transaksi.status === "pending" ? { color: "#eab308" } : { color: "#22c55e" }]}>
          {transaksi.status}
        </Text>
      </View>
      <View style={styles.detailCard}>
        <Text style={styles.detailLabel}>Tipe</Text>
        <Text style={styles.detailValue}>{transaksi.transaksi_type}</Text>
      </View>
      {transaksi.meja && (
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Meja</Text>
          <Text style={styles.detailValue}>{transaksi.meja.nomor_meja}</Text>
        </View>
      )}
      {transaksi.payment_method && (
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Pembayaran</Text>
          <Text style={styles.detailValue}>{transaksi.payment_method.toUpperCase()}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Items</Text>
      <FlatList
        data={transaksi.transaksi_items || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.product?.name || `Produk #${item.product_id}`}</Text>
            <Text style={styles.itemQty}>{item.quantity}x @Rp {item.price.toLocaleString()}</Text>
            <Text style={styles.itemSubtotal}>Rp {item.subtotal.toLocaleString()}</Text>
          </View>
        )}
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>Rp {transaksi.total_amount?.toLocaleString() || "0"}</Text>
      </View>

      {transaksi.status === "pending" && (
        <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={paying}>
          <Text style={styles.payBtnText}>{paying ? "⏳" : "💳 Bayar Sekarang"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d2818" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 50 },
  kode: { color: "#c9a84c", fontSize: 14, marginBottom: 20 },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#143d28",
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  detailLabel: { color: "#9ca3af", fontSize: 14 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#143d28",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemName: { color: "#fff", flex: 1, fontSize: 14 },
  itemQty: { color: "#9ca3af", fontSize: 12, marginRight: 8 },
  itemSubtotal: { color: "#c9a84c", fontSize: 14, fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#c9a84c",
    marginTop: 8,
  },
  totalLabel: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  totalValue: { color: "#c9a84c", fontSize: 20, fontWeight: "bold" },
  payBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  payBtnText: { color: "#0d2818", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "#ef4444", fontSize: 16 },
});
