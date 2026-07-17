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
import { getMejas, toggleMejaStatus, Meja } from "../lib/api";

const STATUS_COLORS: Record<string, string> = {
  tersedia: "#1a4d33",
  dipakai: "#c9a84c",
  maintenance: "#7f1d1d",
};

export default function MejaScreen() {
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const data = await getMejas();
      setMejas(data);
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

  async function handleToggle(meja: Meja) {
    const nextStatus = meja.status === "tersedia" ? "dipakai" : "tersedia";
    try {
      await toggleMejaStatus(meja.id, nextStatus);
      await loadData();
    } catch (e) {
      alert("Gagal update meja");
    }
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
      <Text style={styles.title}>🎱 Meja Billiard</Text>
      <FlatList
        data={mejas}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 8 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c9a84c" />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.mejaCard, { borderColor: STATUS_COLORS[item.status] || "#333" }]}
            onPress={() => handleToggle(item)}
            onLongPress={() => {
              if (item.status === "maintenance") {
                toggleMejaStatus(item.id, "tersedia").then(loadData);
              } else {
                toggleMejaStatus(item.id, "maintenance").then(loadData);
              }
            }}
          >
            <Text style={styles.mejaNum}>{item.nomor_meja}</Text>
            <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || "#333" }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            {item.keterangan && (
              <Text style={styles.keterangan}>{item.keterangan}</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0d2818" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 50, marginBottom: 16 },
  mejaCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 20,
    marginBottom: 8,
    borderWidth: 2,
    alignItems: "center",
  },
  mejaNum: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600", textTransform: "capitalize" },
  keterangan: { color: "#9ca3af", fontSize: 11, marginTop: 4, textAlign: "center" },
});
