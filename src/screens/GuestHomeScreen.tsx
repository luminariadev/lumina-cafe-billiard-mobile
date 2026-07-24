import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getMejas, getProducts, getAppConfig, Meja, Product } from "../lib/api";
import { Colors, Fonts, Styles } from "../lib/theme";
import { formatCurrency } from "../lib/format";

export default function GuestHomeScreen({ navigation }: any) {
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pricePerHour, setPricePerHour] = useState(25000);

  useEffect(() => {
    Promise.all([
      getMejas().catch(() => [] as Meja[]),
      getProducts().catch(() => [] as Product[]),
      getAppConfig().catch(() => null),
    ])
      .then(([m, p, cfg]) => {
        setMejas(m || []);
        setProducts((p || []).filter((x) => x.active && x.stock > 0));
        if (cfg) setPricePerHour(cfg.billiard.price_per_hour);
      })
      .finally(() => setLoading(false));
  }, []);

  const availableTables = mejas.filter((m) => m.status === "tersedia").length;
  const totalTables = mejas.length;

  const cafeItems = products.slice(0, 10);
  const availableMenuItems = products.filter((p) => p.active && p.stock > 0).length;

  function goToBookingForm(meja: Meja) {
    navigation.navigate("BookingForm", { meja });
  }

  function goToBookTab() {
    navigation.navigate("Book");
  }

  function goToCafeMenu() {
    navigation.navigate("Cafe");
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lumina</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── WELCOME ── */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>Welcome Back</Text>
          <Text style={styles.welcomeName}>Guest</Text>
        </View>

        {/* ── PROMO BANNER ── */}
        <View style={[styles.promoCard, Styles.electricGlow]}>
          <View style={styles.promoGradientOverlay} />
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>Limited Offer</Text>
            </View>
            <Text style={styles.promoTitle}>
              20% Off Billiards{"\n"}Before 4:00 PM
            </Text>
            <Text style={styles.promoSub}>Valid Mon - Thu • Book Now</Text>
          </View>
        </View>

        {/* ── QUICK STATS ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, Styles.electricGlow]}>
            <View style={styles.statHeader}>
              <MaterialIcons name="sports-bar" size={18} color={Colors.primary} />
              <Text style={styles.statLabel}>Active Tables</Text>
            </View>
            <Text style={styles.statValue}>
              {availableTables} / {totalTables}
            </Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="cafe-outline" size={18} color={Colors.secondary} />
              <Text style={[styles.statLabel, { color: Colors.secondary }]}>Menu Items</Text>
            </View>
            <Text style={styles.statValue}>{availableMenuItems}</Text>
          </View>
        </View>

        {/* ── RESERVE A TABLE ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reserve a Table</Text>
          <TouchableOpacity onPress={goToBookTab}>
            <Text style={styles.sectionAction}>View Map</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.floorMapCard, Styles.glassCard]}>
          <View style={styles.floorGrid}>
            {mejas.slice(0, 6).map((m) => {
              const isAvailable = m.status === "tersedia";
              const isOccupied = m.status === "terpakai";
              const borderColor = isOccupied ? Colors.outlineVariant : Colors.primary;
              const bgColor = isOccupied
                ? Colors.surfaceContainerHigh
                : "rgba(107,251,154,0.2)";
              const textColor = isOccupied ? Colors.onSurfaceVariant : Colors.primary;
              const label = isOccupied ? "Occupied" : "Available";
              return (
                <TouchableOpacity
                  key={m.id}
                  style={styles.tableUnit}
                  onPress={() => (isAvailable ? goToBookingForm(m) : null)}
                  disabled={!isAvailable}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.tableBox,
                      {
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        opacity: isOccupied ? 0.4 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.tableLabel, { color: textColor }]}>
                      T-{String(m.nomor_meja).padStart(2, "0")}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.tableStatus,
                      { color: isOccupied ? Colors.onSurfaceVariant : Colors.primary },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.bookingActions}>
                      <Text style={styles.priceLabel}>Rp {pricePerHour.toLocaleString("id-ID")} / jam</Text>
                      <TouchableOpacity style={styles.confirmBtn} onPress={goToBookTab}>
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CAFE MENU FAVORITES ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Brew Selection</Text>
          <TouchableOpacity onPress={goToCafeMenu}>
            <Text style={[styles.sectionAction, { color: Colors.secondary }]}>Full Menu</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cafeScroll}
          contentContainerStyle={styles.cafeScrollContent}
        >
          {cafeItems.length === 0 && (
            <View style={styles.cafePlaceholder}>
              <MaterialIcons name="local-cafe" size={32} color={Colors.onSurfaceVariant} />
              <Text style={styles.cafePlaceholderText}>Menu belum tersedia</Text>
            </View>
          )}
          {cafeItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.cafeCard}
              onPress={goToCafeMenu}
              activeOpacity={0.8}
            >
              <View style={styles.cafeImage}>
                {item.product_type === "minuman" ? (
                  <Ionicons name="cafe-outline" size={36} color={Colors.onSurfaceVariant} />
                ) : (
                  <MaterialIcons name="restaurant" size={36} color={Colors.onSurfaceVariant} />
                )}
              </View>
              <View style={styles.cafeInfo}>
                <Text style={styles.cafeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.cafeBottom}>
                  <Text style={styles.cafePrice}>{formatCurrency(item.price)}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={goToCafeMenu}>
                    <MaterialIcons name="add" size={16} color={Colors.onSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── QUICK BOOK ── */}
        <TouchableOpacity
          style={[styles.bookNowCard, { borderLeftColor: Colors.primary }]}
          onPress={goToBookTab}
          activeOpacity={0.8}
        >
          <MaterialIcons name="sports-bar" size={28} color={Colors.primary} />
          <View style={styles.bookNowInfo}>
            <Text style={styles.bookNowTitle}>Ready to Play?</Text>
            <Text style={styles.bookNowSub}>Book a billiard table or order from the cafe menu</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(61,74,62,0.1)",
    backgroundColor: "rgba(19,19,19,0.8)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.primary,
    fontFamily: "Montserrat",
    letterSpacing: -0.5,
  },
  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  // Welcome
  welcomeSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  welcomeLabel: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    fontFamily: "Inter",
    fontWeight: "500",
    letterSpacing: 0.04,
    textTransform: "uppercase",
  },
  welcomeName: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
    marginTop: 4,
  },
  // Promo
  promoCard: {
    marginHorizontal: 16,
    height: 192,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  promoGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,19,19,0.6)",
    zIndex: 1,
  },
  promoContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 16,
    zIndex: 2,
  },
  promoBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  promoBadgeText: {
    color: Colors.onPrimary,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: -0.3,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
    lineHeight: 24,
  },
  promoSub: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.glassBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  statLabel: {
    color: Colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.02,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.onSurface,
    marginTop: 4,
  },
  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    fontFamily: "Montserrat",
    color: Colors.onSurface,
  },
  sectionAction: {
    color: Colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.02,
  },
  // Floor Map
  floorMapCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  floorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  tableUnit: {
    width: (width - 88) / 3,
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  tableBox: {
    width: "100%",
    height: 48,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  tableLabel: { fontSize: 12, fontWeight: "bold" },
  tableStatus: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase" },
  bookingActions: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceLabel: { color: Colors.primary, fontWeight: "bold", fontSize: 16 },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  confirmBtnText: {
    color: Colors.onPrimary,
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Cafe scroll
  cafeScroll: { marginLeft: 16 },
  cafeScrollContent: { paddingRight: 16, gap: 12 },
  cafePlaceholder: {
    width: 160,
    height: 128,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cafePlaceholderText: { color: Colors.onSurfaceVariant, fontSize: 13 },
  cafeCard: {
    width: 160,
    backgroundColor: Colors.glassBg,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cafeImage: {
    width: "100%",
    height: 128,
    backgroundColor: Colors.surfaceContainer,
    justifyContent: "center",
    alignItems: "center",
  },
  cafeInfo: { padding: 8 },
  cafeName: { fontWeight: "bold", fontSize: 13, color: Colors.onSurface },
  cafeBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cafePrice: { color: Colors.onSurfaceVariant, fontSize: 12 },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  // Sessions
  // sessionCard: {
  //   marginHorizontal: 16,
  //   marginTop: 12,
  //   backgroundColor: Colors.glassBg,
  //   borderRadius: 16,
  //   padding: 16,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 12,
  //   borderLeftWidth: 4,
  //   borderLeftColor: Colors.primary,
  //   borderWidth: 1,
  //   borderColor: "rgba(255,255,255,0.1)",
  // },
  // sessionPast: { opacity: 0.6, borderLeftColor: Colors.outlineVariant },
  // dateBox: {
  //   width: 56,
  //   height: 56,
  //   borderRadius: 12,
  //   backgroundColor: "rgba(107,251,154,0.1)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // dateBoxPast: { backgroundColor: Colors.surfaceContainerHigh },
  // dateDay: { fontSize: 18, fontWeight: "bold", color: Colors.primary, lineHeight: 22 },
  // dateMonth: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", color: Colors.primary },
  // sessionInfo: { flex: 1 },
  // sessionTop: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  // },
  // sessionName: { fontWeight: "bold", fontSize: 14, color: Colors.onSurface },
  // sessionBadge: {
  //   backgroundColor: "rgba(107,251,154,0.1)",
  //   paddingHorizontal: 8,
  //   paddingVertical: 2,
  //   borderRadius: 12,
  // },
  // sessionBadgePast: { backgroundColor: Colors.surfaceContainerHigh },
  // sessionBadgeText: {
  //   color: Colors.primary,
  //   fontSize: 10,
  //   fontWeight: "bold",
  //   textTransform: "uppercase",
  // },
  // sessionTime: { color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2 },
  bookNowCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: Colors.glassBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  bookNowInfo: {
    flex: 1,
  },
  bookNowTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.onSurface,
  },
  bookNowSub: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
});
