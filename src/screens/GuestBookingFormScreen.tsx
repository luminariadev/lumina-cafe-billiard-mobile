import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { billiardBooking, getAppConfig } from "../lib/api";
import { Colors } from "../lib/theme";
import { formatCurrency } from "../lib/format";

const DURASI_OPTIONS = [1, 2, 3, 4, 5];
const DEFAULT_PRICE_PER_HOUR = 25000;

export default function GuestBookingFormScreen({ route, navigation }: any) {
  const { meja } = route.params;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [durasi, setDurasi] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pricePerHour, setPricePerHour] = useState(DEFAULT_PRICE_PER_HOUR);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  useEffect(() => {
    getAppConfig()
      .then((cfg) => setPricePerHour(cfg.billiard.price_per_hour))
      .catch(() => {});
  }, []);

  const total = durasi * pricePerHour;

  function validate(): boolean {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }
    const phoneClean = phone.replace(/\s/g, "");
    if (!phoneClean || phoneClean.length < 8 || phoneClean.length > 15) {
      newErrors.phone = "No. HP harus 8-15 digit";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleBooking() {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await billiardBooking({
        customer_name: name.trim(),
        customer_phone: phone.replace(/\s/g, ""),
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <MaterialIcons name="arrow-back" size={22} color={Colors.primary} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.title}>Booking Billiard</Text>

        {/* Meja info */}
        <View style={styles.mejaInfo}>
          <MaterialIcons name="sports-bar" size={24} color={Colors.primary} />
          <Text style={styles.mejaLabel}>Meja</Text>
          <Text style={styles.mejaNum}>Table 0{meja.nomor_meja}</Text>
        </View>

        {/* Nama */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={[styles.input, errors.name ? styles.inputError : null]}
            placeholder="Masukkan nama..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={name}
            onChangeText={(v) => { setName(v); if (errors.name) setErrors({...errors, name: undefined}); }}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Phone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>No. HP</Text>
          <TextInput
            style={[styles.input, errors.phone ? styles.inputError : null]}
            placeholder="08123456789"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={phone}
            onChangeText={(v) => { setPhone(v); if (errors.phone) setErrors({...errors, phone: undefined}); }}
            keyboardType="phone-pad"
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        {/* Durasi */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Durasi</Text>
          <View style={styles.durasiRow}>
            {DURASI_OPTIONS.map((h) => (
              <TouchableOpacity
                key={h}
                style={[styles.durasiBtn, durasi === h && styles.durasiActive]}
                onPress={() => setDurasi(h)}
              >
                <Text
                  style={[styles.durasiText, durasi === h && styles.durasiTextActive]}
                >
                  {h} Jam
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>

        {/* Confirm */}
        <TouchableOpacity
          style={[styles.payBtn, loading && { opacity: 0.6 }]}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.onPrimary} />
          ) : (
            <Text style={styles.payBtnText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  backBtn: { paddingHorizontal: 16, paddingTop: 16 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
    marginBottom: 20,
    marginTop: 8,
  },
  mejaInfo: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mejaLabel: { color: Colors.onSurfaceVariant, fontSize: 14 },
  mejaNum: { color: Colors.primary, fontSize: 20, fontWeight: "bold" },
  formGroup: { marginBottom: 20 },
  label: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    color: Colors.onSurface,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputError: {
    borderColor: "#ff4444",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
  },
  durasiRow: { flexDirection: "row", gap: 8 },
  durasiBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgba(30,30,30,0.8)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  durasiActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  durasiText: { color: Colors.onSurfaceVariant, fontSize: 14, fontWeight: "600" },
  durasiTextActive: { color: Colors.onPrimary },
  totalBox: {
    backgroundColor: "rgba(30,30,30,0.8)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  totalLabel: { color: Colors.onSurfaceVariant, fontSize: 18 },
  totalValue: { color: Colors.primary, fontSize: 24, fontWeight: "bold" },
  payBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },
  payBtnText: { color: Colors.onPrimary, fontSize: 18, fontWeight: "bold" },
});
