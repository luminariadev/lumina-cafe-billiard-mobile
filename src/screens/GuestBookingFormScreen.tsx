import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { billiardBooking } from "../lib/api";

const DURASI_OPTIONS = [1, 2, 3, 4, 5];
const PRICE_PER_HOUR = 25000;

export default function GuestBookingFormScreen({ route, navigation }: any) {
  const { meja } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [durasi, setDurasi] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = durasi * PRICE_PER_HOUR;

  async function handleBooking() {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Lengkapi data", "Nama dan No. HP wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const result = await billiardBooking({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        nomor_meja: meja.nomor_meja,
        durasi_jam: durasi,
      });
      navigation.replace("Payment", {
        transaksi: result,
        type: "billiard",
        meja: meja.nomor_meja,
        durasi,
        customerName: name.trim(),
      });
    } catch (e: any) {
      Alert.alert("Gagal", e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Text style={styles.backText}>← Kembali</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Booking Billiard</Text>

        <View style={styles.mejaInfo}>
          <Text style={styles.mejaLabel}>Meja</Text>
          <Text style={styles.mejaNum}>Meja {meja.nomor_meja}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama..."
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>No. HP</Text>
          <TextInput
            style={styles.input}
            placeholder="08123456789"
            placeholderTextColor="#6b7280"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Durasi</Text>
          <View style={styles.durasiRow}>
            {DURASI_OPTIONS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.durasiBtn, durasi === h && styles.durasiActive]}
                onPress={() => setDurasi(h)}
              >
                <Text style={[styles.durasiText, durasi === h && styles.durasiTextActive]}>
                  {h} Jam
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rp {total.toLocaleString()}</Text>
        </View>

        <TouchableOpacity
          style={[styles.payBtn, loading && { opacity: 0.6 }]}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0d2818" />
          ) : (
            <Text style={styles.payBtnText}>Bayar Sekarang</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818" },
  backText: { color: "#c9a84c", fontSize: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  mejaInfo: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1a4d33",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mejaLabel: { color: "#9ca3af", fontSize: 14 },
  mejaNum: { color: "#c9a84c", fontSize: 20, fontWeight: "bold" },
  formGroup: { marginBottom: 20 },
  label: { color: "#9ca3af", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  input: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  durasiRow: { flexDirection: "row", gap: 8 },
  durasiBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#143d28",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  durasiActive: { backgroundColor: "#c9a84c", borderColor: "#c9a84c" },
  durasiText: { color: "#6b7280", fontSize: 14, fontWeight: "600" },
  durasiTextActive: { color: "#0d2818" },
  totalBox: {
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#1a4d33",
  },
  totalLabel: { color: "#9ca3af", fontSize: 16 },
  totalValue: { color: "#c9a84c", fontSize: 24, fontWeight: "bold" },
  payBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  payBtnText: { color: "#0d2818", fontSize: 18, fontWeight: "bold" },
});