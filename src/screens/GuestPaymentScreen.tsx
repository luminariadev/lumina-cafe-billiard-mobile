import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPaymentStatus } from "../lib/api";
import { Colors } from "../lib/theme";
import { formatCurrency } from "../lib/format";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://192.168.101.5:3000/api/v1";

export default function GuestPaymentScreen({ route, navigation }: any) {
  const { transaksi, type, meja, durasi, customerName } = route.params;
  const [status, setStatus] = useState(transaksi.status);
  const [countdown, setCountdown] = useState(300);
  const interval = useRef<any>(null);
  const pollInterval = useRef<any>(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      setCountdown((c: number) => {
        if (c <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval.current);
  }, []);

  useEffect(() => {
    pollInterval.current = setInterval(async () => {
      try {
        const res = await getPaymentStatus(transaksi.id);
        if (res.status === "dibayar") {
          setStatus("dibayar");
          clearInterval(pollInterval.current);
          clearInterval(interval.current);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(pollInterval.current);
  }, [transaksi.id]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  if (status === "dibayar") {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successSub}>{transaksi.kode_transaksi}</Text>
          {type === "billiard" && (
            <Text style={styles.successDetail}>Table {meja} — {durasi} jam</Text>
          )}
          <Text style={styles.successDetail}>{customerName}</Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeBtnText}>← Kembali ke Beranda</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.backBtn}>
        <Text style={styles.backText}>← Batal</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Pembayaran</Text>

        {/* QRIS */}
        <View style={styles.qrBox}>
          <Text style={styles.qrLabel}>Scan QRIS untuk bayar</Text>
          <View style={styles.qrFrame}>
            <Text style={styles.qrPlaceholder}>🌐</Text>
            <Text style={styles.qrCode}>{transaksi.qris_string}</Text>
          </View>
          <Text style={styles.qrHint}>
            Scan kode di atas menggunakan{'\n'}aplikasi mobile banking / e-wallet
          </Text>
        </View>

        {/* Detail */}
        <View style={styles.detailBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kode</Text>
            <Text style={styles.detailValue}>{transaksi.kode_transaksi}</Text>
          </View>
          {type === "billiard" && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Table</Text>
                <Text style={styles.detailValue}>{meja}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Durasi</Text>
                <Text style={styles.detailValue}>{durasi} jam</Text>
              </View>
            </>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nama</Text>
            <Text style={styles.detailValue}>{customerName}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.detailLabel, { fontSize: 18, color: Colors.primary }]}>
              Total
            </Text>
            <Text style={[styles.detailValue, { fontSize: 20, color: Colors.primary, fontWeight: "bold" }]}>
              {formatCurrency(transaksi.total_amount)}
            </Text>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.countdownBox}>
          <Text style={styles.countdownLabel}>Sisa waktu pembayaran</Text>
          <Text
            style={[
              styles.countdownValue,
              countdown < 60 && { color: "#ef4444" },
            ]}
          >
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </Text>
        </View>

        {/* Simulate payment */}
        <TouchableOpacity
          style={styles.mockBtn}
          onPress={async () => {
            try {
              const res = await (
                await fetch(`${API_BASE}/guest_transactions/${transaksi.id}/pay`, {
                  method: "POST",
                })
              ).json();
              if (res.status === "dibayar") {
                setStatus("dibayar");
                clearInterval(pollInterval.current);
                clearInterval(interval.current);
              }
            } catch {
              Alert.alert("Error", "Gagal simulasi pembayaran");
            }
          }}
        >
          <Text style={styles.mockBtnText}>💰 Simulasi Bayar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  backBtn: { paddingHorizontal: 16, paddingTop: 16 },
  backText: { color: Colors.primary, fontSize: 18 },
  content: { flex: 1, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
    marginBottom: 20,
    marginTop: 8,
  },
  qrBox: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  qrLabel: { color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 16 },
  qrFrame: {
    width: 180,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  qrPlaceholder: { fontSize: 60 },
  qrCode: { color: Colors.onSurfaceVariant, fontSize: 10, textAlign: "center", marginTop: 4 },
  qrHint: { color: Colors.onSurfaceVariant, fontSize: 12, textAlign: "center", lineHeight: 18 },
  detailBox: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  detailLabel: { color: Colors.onSurfaceVariant, fontSize: 14 },
  detailValue: { color: Colors.onSurface, fontSize: 14, fontWeight: "600" },
  countdownBox: { alignItems: "center", marginBottom: 24 },
  countdownLabel: { color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 8 },
  countdownValue: { fontSize: 40, fontWeight: "bold", color: Colors.primary },
  mockBtn: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  mockBtnText: { color: Colors.primary, fontSize: 16, fontWeight: "600" },
  // Success
  successBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: "bold", color: Colors.primary, marginBottom: 8 },
  successSub: { fontSize: 16, color: Colors.primary, fontWeight: "600", marginBottom: 8 },
  successDetail: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: 4 },
  homeBtn: {
    marginTop: 32,
    backgroundColor: "rgba(30,30,30,0.8)",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  homeBtnText: { color: Colors.primary, fontSize: 16 },
});
