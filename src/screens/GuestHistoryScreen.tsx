import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../lib/theme";
import { formatCurrency } from "../lib/format";

interface HistoryItem {
  id: number;
  kode_transaksi: string;
  transaksi_type: string;
  total_amount: number;
  status: string;
  jam_mulai: string;
  customer_name: string;
}

export default function GuestHistoryScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HistoryItem[] | null>(null);
  const [error, setError] = useState("");

  async function searchHistory() {
    if (!phone.trim() || phone.trim().length < 8) {
      setError("Masukkan nomor HP minimal 8 digit");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://192.168.101.5:3000/api/v1/guest_transactions/history?phone=${phone.trim()}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Gagal" }));
        throw new Error(err.error || "Gagal mengambil data");
      }
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardCode}>{item.kode_transaksi}</Text>
        <View style={[styles.badge, { backgroundColor: item.status === "dibayar" ? "#1b5e20" : "#e65100" }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardName}>{item.customer_name}</Text>
      <Text style={styles.cardType}>{item.transaksi_type === "billiard" ? "🎱 Billiard" : "☕ Cafe"}</Text>
      <Text style={styles.cardAmount}>{formatCurrency(item.total_amount)}</Text>
      <Text style={styles.cardDate}>{new Date(item.jam_mulai).toLocaleDateString("id-ID")}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <MaterialIcons name="history" size={24} color={Colors.primary} />
        <Text style={styles.title}>Riwayat Transaksi</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Masukkan No. HP..."
          placeholderTextColor={Colors.onSurfaceVariant}
          value={phone}
          onChangeText={(v) => { setPhone(v); setError(""); }}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={searchHistory} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.onPrimary} size="small" />
          ) : (
            <MaterialIcons name="search" size={22} color={Colors.onPrimary} />
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data && data.length === 0 && (
        <Text style={styles.empty}>Tidak ada transaksi ditemukan</Text>
      )}

      {data && data.length > 0 && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: "row", alignItems: "center", padding: 16, gap: 8 },
  title: { fontSize: 22, fontWeight: "600", color: Colors.onSurface },
  searchBox: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  input: {
    flex: 1,
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 14,
    color: Colors.onSurface,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  error: { color: "#ff4444", paddingHorizontal: 16, marginBottom: 8 },
  empty: { color: Colors.onSurfaceVariant, textAlign: "center", marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  cardCode: { color: Colors.primary, fontSize: 14, fontWeight: "600" },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  cardName: { color: Colors.onSurface, fontSize: 16, fontWeight: "500" },
  cardType: { color: Colors.onSurfaceVariant, fontSize: 13, marginTop: 2 },
  cardAmount: { color: Colors.onSurface, fontSize: 18, fontWeight: "bold", marginTop: 4 },
  cardDate: { color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 4 },
});
