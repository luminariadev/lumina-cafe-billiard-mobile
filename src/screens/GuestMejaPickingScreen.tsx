import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getMejas, Meja } from "../lib/api";
import { Colors } from "../lib/theme";

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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Book a Table</Text>
        <Text style={styles.subtitle}>{available.length} meja tersedia</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
              <View style={styles.mejaInner}>
                <MaterialIcons name="sports-bar" size={40} color={Colors.primary} />
                <Text style={styles.mejaNum}>{item.nomor_meja}</Text>
                <Text style={styles.mejaLabel}>Meja Billiard</Text>
                <Text style={styles.mejaPrice}>Rp 25.000 / jam</Text>
              </View>
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
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(61,74,62,0.1)",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
  },
  subtitle: { color: Colors.onSurfaceVariant, fontSize: 14, marginTop: 4 },
  grid: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  loadingBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  mejaCard: {
    flex: 1,
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  mejaInner: {
    padding: 20,
    alignItems: "center",
  },
  mejaNum: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.onSurface,
    marginTop: 8,
  },
  mejaLabel: { color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 4 },
  mejaPrice: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  emptyText: {
    color: Colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
  },
});
