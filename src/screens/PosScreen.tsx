import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { getMejas, getProducts, getTransaksis, startTransaksi, Meja, Product, Transaksi } from "../lib/api";

export default function PosScreen({ navigation }: any) {
  const [tab, setTab] = useState<"billiard" | "cafe">("billiard");
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([getMejas(), getProducts()]);
      setMejas(m);
      setProducts(p);
    } catch (e) {
      // Ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleStartBilliard(meja: Meja) {
    if (meja.status !== "tersedia") return;
    try {
      const t = await startTransaksi({ meja_id: meja.id });
      navigation.navigate("TransaksiDetail", { id: t.id });
    } catch (e: any) {
      alert(e.message);
    }
  }

  const availableMejas = mejas.filter((m) => m.status === "tersedia");
  const inUseMejas = mejas.filter((m) => m.status === "dipakai");

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, tab === "billiard" && styles.tabActive]}
          onPress={() => setTab("billiard")}
        >
          <Text style={[styles.tabText, tab === "billiard" && styles.tabTextActive]}>
            🎱 Billiard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "cafe" && styles.tabActive]}
          onPress={() => setTab("cafe")}
        >
          <Text style={[styles.tabText, tab === "cafe" && styles.tabTextActive]}>
            ☕ Cafe
          </Text>
        </TouchableOpacity>
      </View>

      {tab === "billiard" ? (
        <FlatList
          data={[...availableMejas, ...inUseMejas]}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.mejaGrid}
          columnWrapperStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.mejaCard,
                item.status === "tersedia" && styles.mejaAvailable,
                item.status === "dipakai" && styles.mejaInUse,
                item.status === "maintenance" && styles.mejaMaintenance,
              ]}
              onPress={() => handleStartBilliard(item)}
              disabled={item.status !== "tersedia"}
            >
              <Text style={styles.mejaNum}>{item.nomor_meja}</Text>
              <Text style={styles.mejaStatus}>{item.status}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada meja</Text>
          }
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>
              Tersedia ({availableMejas.length}) • Dipakai ({inUseMejas.length})
            </Text>
          }
        />
      ) : (
        <FlatList
          data={products.filter((p) => p.active)}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.mejaGrid}
          columnWrapperStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() => navigation.navigate("CafePos", { product: item })}
            >
              <Text style={styles.productEmoji}>☕</Text>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                Rp {item.price.toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.stockBadge,
                  item.stock <= 0
                    ? styles.stockOut
                    : item.stock <= 5
                    ? styles.stockLow
                    : styles.stockOk,
                ]}
              >
                Stok: {item.stock}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Tidak ada produk</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d2818" },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    marginTop: 50,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: { backgroundColor: "#c9a84c" },
  tabText: { color: "#6b7280", fontSize: 16, fontWeight: "600" },
  tabTextActive: { color: "#0d2818" },
  mejaGrid: { paddingBottom: 20 },
  sectionLabel: { color: "#9ca3af", fontSize: 14, marginBottom: 12 },
  mejaCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
  },
  mejaAvailable: {
    backgroundColor: "#0f3322",
    borderColor: "#1a4d33",
  },
  mejaInUse: {
    backgroundColor: "#3d2818",
    borderColor: "#c9a84c",
  },
  mejaMaintenance: {
    backgroundColor: "#2a1a1a",
    borderColor: "#7f1d1d",
  },
  mejaNum: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  mejaStatus: { fontSize: 12, color: "#9ca3af", marginTop: 4, textTransform: "capitalize" },
  emptyText: { color: "#6b7280", textAlign: "center", marginTop: 40 },
  productCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1a4d33",
    alignItems: "center",
  },
  productEmoji: { fontSize: 36, marginBottom: 8 },
  productName: { color: "#fff", fontSize: 14, fontWeight: "600", textAlign: "center" },
  productPrice: { color: "#c9a84c", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  stockBadge: { fontSize: 12, marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: "hidden" },
  stockOut: { color: "#ef4444" },
  stockLow: { color: "#eab308" },
  stockOk: { color: "#22c55e" },
});
