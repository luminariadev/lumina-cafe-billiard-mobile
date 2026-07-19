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
import { getMejas, getProducts, Meja, Product } from "../lib/api";
import { Colors, Fonts, Styles } from "../lib/theme";
import { formatCurrency } from "../lib/format";

type BottomTab = "home" | "book" | "cafe";

export default function GuestHomeScreen({ navigation }: any) {
  const [mejas, setMejas] = useState<Meja[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BottomTab>("home");

  useEffect(() => {
    Promise.all([
      getMejas().catch(() => [] as Meja[]),
      getProducts().catch(() => [] as Product[]),
    ])
      .then(([m, p]) => {
        setMejas(m || []);
        setProducts((p || []).filter((x) => x.active && x.stock > 0));
      })
      .finally(() => setLoading(false));
  }, []);

  const availableTables = mejas.filter((m) => m.status === "tersedia").length;
  const totalTables = mejas.length;

  const cafeItems = products.slice(0, 10);

  // ─────────────────────────────────────────────────
  // Navigator helpers
  function goToTableBooking(meja: Meja) {
    navigation.navigate("BookingForm", { meja });
  }

  function goToMejaPicking() {
    navigation.navigate("MejaPicking");
  }

  function goToCafeMenu() {
    navigation.navigate("CafeMenu");
  }

  // ─────────────────────────────────────────────────
  // Render
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── STICKY HEADER ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cue & Brew</Text>
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
          <View style={styles.promoOverlay} />
          <View style={styles.promoContent}>
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>Limited Offer</Text>
            </View>
            <Text style={styles.promoTitle}>
              20% Off Billiards{'\n'}Before 4:00 PM
            </Text>
            <Text style={styles.promoSub}>Valid Mon - Thu • Book Now</Text>
          </View>
        </View>

        {/* ── QUICK STATS ── */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, Styles.electricGlow]}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>🎱</Text>
              <Text style={styles.statLabel}>Active Tables</Text>
            </View>
            <Text style={styles.statValue}>
              {availableTables} / {totalTables}
            </Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>☕</Text>
              <Text style={styles.statLabel}>Cafe Orders</Text>
            </View>
            <Text style={styles.statValue}>~15 min</Text>
          </View>
        </View>

        {/* ── RESERVE A TABLE ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reserve a Table</Text>
          <TouchableOpacity onPress={goToMejaPicking}>
            <Text style={styles.sectionAction}>View Map</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.floorMapCard, Styles.glassCard]}>
          <View style={styles.floorGrid}>
            {mejas.slice(0, 6).map((m) => {
              const isAvailable = m.status === "tersedia";
              const isOccupied = m.status === "terpakai";
              const borderColor = isOccupied
                ? Colors.outlineVariant
                : Colors.primary;
              const bgColor = isOccupied
                ? Colors.surfaceContainerHigh
                : "rgba(107,251,154,0.2)";
              const textColor = isOccupied
                ? Colors.onSurfaceVariant
                : Colors.primary;
              const label = isOccupied ? "Occupied" : "Available";
              return (
                <TouchableOpacity
                  key={m.id}
                  style={styles.tableUnit}
                  onPress={() => (isAvailable ? goToTableBooking(m) : null)}
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
            <Text style={styles.priceLabel}>
              Rp 25.000 / jam
            </Text>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={goToMejaPicking}
            >
              <Text style={styles.confirmBtnText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── CAFE MENU FAVORITES ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Brew Selection</Text>
          <TouchableOpacity onPress={goToCafeMenu}>
            <Text style={[styles.sectionAction, { color: Colors.secondary }]}>
              Full Menu
            </Text>
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
                <Text style={styles.cafeEmoji}>
                  {item.product_type === "minuman" ? "☕" : "🍽️"}
                </Text>
              </View>
              <View style={styles.cafeInfo}>
                <Text style={styles.cafeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.cafeBottom}>
                  <Text style={styles.cafePrice}>{formatCurrency(item.price)}</Text>
                  <TouchableOpacity style={styles.addBtn} onPress={goToCafeMenu}>
                    <Text style={styles.addBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── MY SESSIONS ── */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: 16, marginTop: 24 }]}>
          My Sessions
        </Text>
        <TouchableOpacity onPress={goToMejaPicking}>
          <View style={[styles.sessionCard, { borderLeftColor: Colors.primary }]}>
            <View style={styles.dateBox}>
              <Text style={styles.dateDay}>14</Text>
              <Text style={styles.dateMonth}>OCT</Text>
            </View>
            <View style={styles.sessionInfo}>
              <View style={styles.sessionTop}>
                <Text style={styles.sessionName}>Table 08 • Billiards</Text>
                <View style={styles.sessionBadge}>
                  <Text style={styles.sessionBadgeText}>Upcoming</Text>
                </View>
              </View>
              <Text style={styles.sessionTime}>18:30 - 20:30 (2 Hours)</Text>
            </View>
            <Text style={styles.sessionArrow}>›</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.sessionCard, styles.sessionPast]}>
          <View style={[styles.dateBox, styles.dateBoxPast]}>
            <Text style={[styles.dateDay, { color: Colors.onSurfaceVariant }]}>10</Text>
            <Text style={[styles.dateMonth, { color: Colors.onSurfaceVariant }]}>OCT</Text>
          </View>
          <View style={styles.sessionInfo}>
            <View style={styles.sessionTop}>
              <Text style={styles.sessionName}>Table 03 • Billiards</Text>
              <View style={[styles.sessionBadge, styles.sessionBadgePast]}>
                <Text style={[styles.sessionBadgeText, { color: Colors.onSurfaceVariant }]}>
                  Completed
                </Text>
              </View>
            </View>
            <Text style={styles.sessionTime}>19:00 - 21:00 (2 Hours)</Text>
          </View>
          <Text style={styles.sessionArrow}>↻</Text>
        </View>
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {[
          { key: "home", icon: "🏠", label: "Home", onPress: () => {} },
          {
            key: "book",
            icon: "📋",
            label: "Book",
            onPress: goToMejaPicking,
          },
          {
            key: "cafe",
            icon: "☕",
            label: "Cafe",
            onPress: goToCafeMenu,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab.key as BottomTab);
                tab.onPress();
              }}
            >
              <Text
                style={[
                  styles.tabIcon,
                  isActive && styles.tabIconActive,
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(19,19,19,0.5)",
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
  statIcon: { fontSize: 16 },
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
  cafeEmoji: { fontSize: 40 },
  cafeInfo: { padding: 8 },
  cafeName: { fontWeight: "bold", fontSize: 13, color: Colors.onSurface },
  cafeBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cafePrice: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: Colors.onSecondary, fontSize: 16, fontWeight: "bold", lineHeight: 20 },
  // Sessions
  sessionCard: {
    marginHorizontal: 16,
    marginTop: 12,
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
  sessionPast: { opacity: 0.6, borderLeftColor: Colors.outlineVariant },
  dateBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(107,251,154,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  dateBoxPast: { backgroundColor: Colors.surfaceContainerHigh },
  dateDay: { fontSize: 18, fontWeight: "bold", color: Colors.primary, lineHeight: 22 },
  dateMonth: { fontSize: 10, fontWeight: "bold", textTransform: "uppercase", color: Colors.primary },
  sessionInfo: { flex: 1 },
  sessionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionName: { fontWeight: "bold", fontSize: 14, color: Colors.onSurface },
  sessionBadge: {
    backgroundColor: "rgba(107,251,154,0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sessionBadgePast: { backgroundColor: Colors.surfaceContainerHigh },
  sessionBadgeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sessionTime: {
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
  },
  sessionArrow: { color: Colors.onSurfaceVariant, fontSize: 22 },
  // Bottom Nav
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(42,42,42,0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingVertical: 8,
    paddingBottom: 24,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: "rgba(74,222,128,0.15)",
  },
  tabIcon: { fontSize: 20 },
  tabIconActive: {},
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    letterSpacing: 0.02,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  tabLabelActive: { color: Colors.primary },
});
