import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getPaymentStatus } from "../lib/api";
import { Colors } from "../lib/theme";

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
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const iconName = status === "dibayar" ? "check-circle" : status === "batal" ? "cancel" : "hourglass-empty";
  const iconColor = status === "dibayar" ? Colors.primary : status === "batal" ? "#ef4444" : Colors.onSurfaceVariant;
  const titleText =
    status === "dibayar" ? "Pembayaran Berhasil" : status === "batal" ? "Pembayaran Dibatalkan" : "Menunggu Pembayaran";

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("MainTabs")} style={styles.backBtn}>
        <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
        <Text style={styles.backText}> Kembali</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <MaterialIcons name={iconName} size={64} color={iconColor} />
        <Text style={styles.title}>{titleText}</Text>
        <Text style={styles.sub}>Kode: {transaksiId}</Text>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("MainTabs")}
        >
          <MaterialIcons name="home" size={18} color={Colors.primary} />
          <Text style={styles.homeBtnText}> Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backText: { color: Colors.primary, fontSize: 18 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  title: { fontSize: 22, fontWeight: "bold", color: Colors.onSurface, textAlign: "center", marginTop: 16 },
  sub: { color: Colors.onSurfaceVariant, fontSize: 16, marginTop: 8 },
  homeBtn: {
    marginTop: 40,
    backgroundColor: "rgba(30,30,30,0.8)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
  },
  homeBtnText: { color: Colors.primary, fontSize: 16 },
});