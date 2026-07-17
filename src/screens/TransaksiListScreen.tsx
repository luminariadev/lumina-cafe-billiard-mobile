import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getTransaksis, Transaksi } from "../lib/api";

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#3d2818", text: "#eab308" },
  dibayar: { bg: "#0f3322", text: "#22c55e" },
  batal: { bg: "#2a1a1a", text: "#ef4444" },
};

export default function TransaksiListScreen({ navigation }: any) {
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await getTransaksis();
      setTransaksis(data);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Transaksi</Text>
      <FlatList
        data={transaksis}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c9a84c" />}
        renderItem={({ item }) => {
          const style = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.kode}>{item.kode_transaksi}</Text>
                <View style={[styles.statusBadge, { backgroundColor: style.bg }]}>
                  <Text style={[styles.statusText, { color: style.text }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.info}>
                  🎱 {item.transaksi_type} {item.meja ? `| Meja ${item.meja.nomor_meja}` : ""}
                </Text>
                {item.payment_method && (
                  <View style={styles.paymentBadge}>
                    <Text style={styles.paymentText}>{item.payment_method.toUpperCase()}</Text>
                  </View>
                )}
                <Text style={styles.customer}>
                  {item.customer_name || item.user?.name || "Walk-in"}
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.date}>
                  {new Date(item.jam_mulai).toLocaleDateString("id-ID")}
                </Text>
                <Text style={styles.total}>
                  Rp {item.total_amount?.toLocaleString() || "0"}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada transaksi</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d2818" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 50, marginBottom: 16 },
  card: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  kode: { color: "#c9a84c", fontSize: 14, fontWeight: "600" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "600" },
  cardBody: { marginBottom: 8 },
  info: { color: "#fff", fontSize: 14, marginBottom: 4 },
  paymentBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#0d2818",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  paymentText: { color: "#c9a84c", fontSize: 10, fontWeight: "600" },
  customer: { color: "#9ca3af", fontSize: 12 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#1a4d33",
  },
  date: { color: "#6b7280", fontSize: 12 },
  total: { color: "#c9a84c", fontSize: 18, fontWeight: "bold" },
  emptyText: { color: "#6b7280", textAlign: "center", marginTop: 40 },
});
