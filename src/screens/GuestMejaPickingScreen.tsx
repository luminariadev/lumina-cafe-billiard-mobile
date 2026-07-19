import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMejas, Meja } from "../lib/api";

export default function GuestMejaPickingScreen({ navigation }: any) {
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMejas()
      .then(setMejas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const available = mejas.filter((m) => m.status === "tersedia");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎱 Pilih Meja</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#c9a84c" />
          <Text style={styles.loadingText}>Mencari meja tersedia...</Text>
        </View>
      ) : (
        <FlatList
          data={available}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mejaCard}
              onPress={() => navigation.navigate("BookingForm", { meja: item })}
              activeOpacity={0.8}
            >
              <Text style={styles.mejaNum}>{item.nomor_meja}</Text>
              <Text style={styles.mejaLabel}>Meja Billiard</Text>
              <Text style={styles.mejaPrice}>Rp 25.000 / jam</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Maaf, semua meja sedang terpakai</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  backBtn: { marginBottom: 12 },
  backText: { color: "#c9a84c", fontSize: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  grid: { paddingHorizontal: 20, paddingBottom: 20 },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9ca3af", marginTop: 12, fontSize: 14 },
  mejaCard: {
    flex: 1,
    backgroundColor: "#143d28",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  mejaNum: { fontSize: 36, fontWeight: "bold", color: "#fff" },
  mejaLabel: { color: "#9ca3af", fontSize: 12, marginTop: 4 },
  mejaPrice: { color: "#c9a84c", fontSize: 13, fontWeight: "600", marginTop: 8 },
  emptyText: { color: "#6b7280", textAlign: "center", marginTop: 60, fontSize: 16 },
});
