import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPaymentStatus } from "../lib/api";

export default function GuestOrderStatusScreen({ route, navigation }: any) {
  const { transaksiId } = route.params;
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getPaymentStatus(transaksiId);
        setStatus(res.status);
      } catch {}
      setLoading(false);
    };
    fetch();
    const interval = setInterval(async () => {
      try {
        const res = await getPaymentStatus(transaksiId);
        setStatus(res.status);
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [transaksiId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#c9a84c" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>
          {status === "dibayar" ? "✅" : status === "batal" ? "❌" : "⏳"}
        </Text>
        <Text style={styles.title}>
          {status === "dibayar"
            ? "Pembayaran Berhasil"
            : status === "batal"
            ? "Pembayaran Dibatalkan"
            : "Menunggu Pembayaran"}
        </Text>
        <Text style={styles.sub}>Kode: {transaksiId}</Text>

        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeBtnText}>← Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", textAlign: "center" },
  sub: { color: "#9ca3af", fontSize: 16, marginTop: 8 },
  homeBtn: {
    marginTop: 40,
    backgroundColor: "#143d28",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  homeBtnText: { color: "#c9a84c", fontSize: 16 },
});