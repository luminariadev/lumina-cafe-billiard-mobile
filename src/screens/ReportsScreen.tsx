import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const REPORTS = [
  {
    title: "Hari Ini",
    revenue: 0,
    transactions: 0,
    icon: "💰",
  },
  {
    title: "Bulan Ini",
    revenue: 0,
    transactions: 0,
    icon: "📊",
  },
];

const BEST_SELLERS = [
  { name: "Billiard - Happy Hour", quantity: 12 },
  { name: "Kopi Hitam", quantity: 8 },
  { name: "Kopi Susu", quantity: 6 },
  { name: "Kentang Goreng", quantity: 5 },
  { name: "Matcha Latte", quantity: 3 },
];

export default function ReportsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Laporan</Text>

      {REPORTS.map((report, i) => (
        <View key={i} style={styles.reportCard}>
          <Text style={styles.reportIcon}>{report.icon}</Text>
          <View>
            <Text style={styles.reportLabel}>{report.title}</Text>
            <Text style={styles.reportValue}>
              Rp {report.revenue.toLocaleString()}
            </Text>
            <Text style={styles.reportSub}>
              {report.transactions} transaksi
            </Text>
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>🏆 Best Seller</Text>
      {BEST_SELLERS.map((item, i) => (
        <View key={i} style={styles.bestSellerRow}>
          <Text style={styles.rank}>{i + 1}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.qty}>{item.quantity}x</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d2818", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 50, marginBottom: 16 },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#143d28",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1a4d33",
    gap: 16,
  },
  reportIcon: { fontSize: 36 },
  reportLabel: { color: "#9ca3af", fontSize: 14, marginBottom: 4 },
  reportValue: { color: "#c9a84c", fontSize: 24, fontWeight: "bold" },
  reportSub: { color: "#6b7280", fontSize: 12, marginTop: 2 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 12 },
  bestSellerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#143d28",
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  rank: { color: "#c9a84c", fontSize: 16, fontWeight: "bold", width: 30 },
  name: { color: "#fff", flex: 1, fontSize: 14 },
  qty: { color: "#9ca3af", fontSize: 14 },
});
