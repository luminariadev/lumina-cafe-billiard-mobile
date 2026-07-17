import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getReports, getMejas, Report, Meja } from "../lib/api";

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [r, m] = await Promise.all([getReports(), getMejas()]);
      setReport(r);
      setMejas(m);
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

  const available = mejas.filter((m) => m.status === "tersedia").length;
  const inUse = mejas.filter((m) => m.status === "dipakai").length;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c9a84c" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, {user?.name}</Text>
          <Text style={styles.roleBadge}>{user?.role?.replace("_", " ")}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: "#0f3322" }]}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statLabel}>Hari Ini</Text>
          <Text style={styles.statValue}>
            Rp {report?.today_revenue?.toLocaleString() || "0"}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#0f3322" }]}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statLabel}>Bulan Ini</Text>
          <Text style={styles.statValue}>
            Rp {report?.monthly_revenue?.toLocaleString() || "0"}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#143d28" }]}>
          <Text style={styles.statIcon}>🆓</Text>
          <Text style={styles.statLabel}>Meja Tersedia</Text>
          <Text style={styles.statValue}>{available}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#143d28" }]}>
          <Text style={styles.statIcon}>🎱</Text>
          <Text style={styles.statLabel}>Meja Dipakai</Text>
          <Text style={styles.statValue}>{inUse}</Text>
        </View>
      </View>

      {/* Best Sellers */}
      {report && report.best_sellers && report.best_sellers.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Best Seller</Text>
          {report.best_sellers.map((item, i) => (
            <View key={i} style={styles.bestSellerRow}>
              <Text style={styles.bestSellerRank}>{i + 1}</Text>
              <Text style={styles.bestSellerName}>{item.name}</Text>
              <Text style={styles.bestSellerQty}>{item.quantity}x</Text>
            </View>
          ))}
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Cepat</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Pos")}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>POS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Meja")}>
            <Text style={styles.actionIcon}>🎱</Text>
            <Text style={styles.actionText}>Meja</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Products")}>
            <Text style={styles.actionIcon}>☕</Text>
            <Text style={styles.actionText}>Produk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("TransaksiList")}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Transaksi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d2818" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  greeting: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  roleBadge: {
    fontSize: 14,
    color: "#c9a84c",
    marginTop: 4,
    textTransform: "capitalize",
  },
  logoutBtn: {
    backgroundColor: "#1a4d33",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: "#ef4444", fontSize: 14 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statLabel: { color: "#9ca3af", fontSize: 12, marginBottom: 4 },
  statValue: { color: "#c9a84c", fontSize: 20, fontWeight: "bold" },
  section: { marginBottom: 20 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  bestSellerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#143d28",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  bestSellerRank: {
    color: "#c9a84c",
    fontSize: 16,
    fontWeight: "bold",
    width: 30,
  },
  bestSellerName: { color: "#fff", flex: 1, fontSize: 14 },
  bestSellerQty: { color: "#9ca3af", fontSize: 14 },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionBtn: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  actionIcon: { fontSize: 32, marginBottom: 8 },
  actionText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
