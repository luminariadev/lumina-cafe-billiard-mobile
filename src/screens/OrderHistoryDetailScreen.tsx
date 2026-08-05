import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../lib/theme";
import { formatCurrency } from "../lib/format";

interface Props {
  route: { params: { order: OrderData } };
  navigation: any;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product?: { id: number; name: string };
}

interface OrderData {
  id: number;
  kode_transaksi: string;
  status: string;
  payment_method: string;
  total_amount: number;
  jam_mulai: string;
  transaksi_items?: OrderItem[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu",
  dibayar: "Dibayar",
  preparing: "Disiapkan",
  ready: "Siap",
  completed: "Selesai",
  batal: "Batal",
};

const TIMELINE = ["pending", "dibayar", "preparing", "ready", "completed"];

export default function OrderHistoryDetailScreen({ route, navigation }: Props) {
  const { order } = route.params;
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const currentIdx = TIMELINE.indexOf(order.status);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pesanan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Order header */}
        <View style={styles.card}>
          <Text style={styles.kode}>{order.kode_transaksi}</Text>
          <Text style={styles.date}>
            {new Date(order.jam_mulai).toLocaleString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: "rgba(107,251,154,0.15)" }]}>
            <Text style={styles.statusText}>{STATUS_LABEL[order.status] || order.status}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Pesanan</Text>
          {TIMELINE.map((step, idx) => {
            const done = idx <= currentIdx;
            const isLast = idx === TIMELINE.length - 1;
            return (
              <View key={step} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      done && { backgroundColor: Colors.primary, borderColor: Colors.primary },
                    ]}
                  >
                    {done && <MaterialIcons name="check" size={12} color="#131313" />}
                  </View>
                  {!isLast && (
                    <View style={[styles.timelineLine, done && { backgroundColor: Colors.primary }]} />
                  )}
                </View>
                <Text style={[styles.timelineText, done && { color: Colors.primary }]}>
                  {STATUS_LABEL[step] || step}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Item Pesanan</Text>
          {order.transaksi_items?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product?.name || `Item #${item.product_id}`}
              </Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* Payment */}
        <View style={styles.card}>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Metode Pembayaran</Text>
            <Text style={styles.payValue}>{order.payment_method || "tunai"}</Text>
          </View>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Total</Text>
            <Text style={styles.total}>{formatCurrency(order.total_amount)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: Colors.onSurface, fontFamily: "Montserrat_700Bold" },
  container: { flex: 1, padding: 16 },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(107,251,154,0.1)",
  },
  kode: { fontSize: 20, fontWeight: "800", color: Colors.primary, fontFamily: "Montserrat_800ExtraBold" },
  date: { fontSize: 12, color: "#888", marginTop: 4 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  statusText: { color: Colors.primary, fontSize: 12, fontWeight: "700" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: Colors.onSurface, marginBottom: 12 },
  timelineRow: { flexDirection: "row", alignItems: "flex-start" },
  timelineLeft: { alignItems: "center", width: 24, marginRight: 12 },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: { width: 2, flex: 1, backgroundColor: "#333", minHeight: 24 },
  timelineText: { fontSize: 14, color: "#666", paddingBottom: 16, paddingTop: 1 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  itemName: { flex: 1, color: Colors.onSurface, fontSize: 14 },
  itemQty: { color: "#888", fontSize: 13, marginRight: 12 },
  itemPrice: { color: Colors.primary, fontSize: 13, fontWeight: "600" },
  payRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  payLabel: { color: "#888", fontSize: 14 },
  payValue: { color: Colors.onSurface, fontSize: 14, textTransform: "capitalize" },
  total: { color: Colors.primary, fontSize: 18, fontWeight: "800" },
});
