import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPaymentStatus } from "../lib/api";

export default function GuestPaymentScreen({ route, navigation }: any) {
  const { transaksi, type, meja, durasi, customerName } = route.params;
  const [status, setStatus] = useState(transaksi.status);
  const [countdown, setCountdown] = useState(300); // 5 menit
  const interval = useRef<any>(null);
  const pollInterval = useRef<any>(null);

  // Countdown timer
  useEffect(() => {
    interval.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval.current);
  }, []);

  // Poll payment status
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

  const formatCurrency = (n: number | string) =>
    `Rp ${Number(n).toLocaleString()}`;

  if (status === "dibayar") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
          <Text style={styles.successSub}>{transaksi.kode_transaksi}</Text>
          {type === "billiard" && (
            <Text style={styles.successDetail}>Meja {meja} — {durasi} jam</Text>
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
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ marginBottom: 16 }}>
          <Text style={styles.backText}>← Batal & Kembali</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Pembayaran</Text>

        {/* QRIS Display */}
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

        {/* Transaction Details */}
        <View style={styles.detailBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Kode</Text>
            <Text style={styles.detailValue}>{transaksi.kode_transaksi}</Text>
          </View>
          {type === "billiard" && (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Meja</Text>
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
            <Text style={[styles.detailLabel, { fontSize: 18, color: "#c9a84c" }]}>
              Total
            </Text>
            <Text style={[styles.detailValue, { fontSize: 20, color: "#c9a84c", fontWeight: "bold" }]}>
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

        {/* Simulate button */}
        <TouchableOpacity
          style={styles.mockBtn}
          onPress={async () => {
            try {
              const res = await (
                await fetch(
                  `http://192.168.1.105:3000/api/v1/guest_transactions/${transaksi.id}/pay`,
                  { method: "POST" }
                )
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
          <Text style={styles.mockBtnText}>💰 Simulasi Bayar (testing)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  content: { flex: 1, padding: 20 },
  backText: { color: "#c9a84c", fontSize: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  qrBox: {
    backgroundColor: "#143d28",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a4d33",
    marginBottom: 20,
  },
  qrLabel: { color: "#9ca3af", fontSize: 14, marginBottom: 16 },
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
  qrCode: { color: "#6b7280", fontSize: 10, textAlign: "center", marginTop: 4 },
  qrHint: { color: "#6b7280", fontSize: 12, textAlign: "center", lineHeight: 18 },
  detailBox: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1a4d33",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1a4d33",
  },
  detailLabel: { color: "#9ca3af", fontSize: 14 },
  detailValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  countdownBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  countdownLabel: { color: "#9ca3af", fontSize: 14, marginBottom: 8 },
  countdownValue: { fontSize: 40, fontWeight: "bold", color: "#c9a84c" },
  mockBtn: {
    backgroundColor: "#1a4d33",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c9a84c",
  },
  mockBtnText: { color: "#c9a84c", fontSize: 16, fontWeight: "600" },
  // -- Success state --
  successBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  successIcon: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: "bold", color: "#22c55e", marginBottom: 8 },
  successSub: { fontSize: 16, color: "#c9a84c", fontWeight: "600", marginBottom: 8 },
  successDetail: { fontSize: 14, color: "#9ca3af", marginBottom: 4 },
  homeBtn: {
    marginTop: 32,
    backgroundColor: "#143d28",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  homeBtnText: { color: "#c9a84c", fontSize: 16 },
});