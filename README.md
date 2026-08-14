# Lumina Cafe Billiard — Mobile App

[![CI](https://github.com/luminariadev/lumina-cafe-billiard-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/luminariadev/lumina-cafe-billiard-mobile/actions)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits)](https://conventionalcommits.org)

Expo app untuk pelanggan (guest-only flow). Booking meja billiard, pesan makanan/minuman cafe, dan bayar via QRIS — tanpa login.

---

## Tech Stack

- **Framework:** Expo SDK 57 (blank-typescript)
- **Language:** TypeScript
- **Navigation:** @react-navigation/native-stack + @react-navigation/bottom-tabs v7
- **Icons:** @expo/vector-icons (MaterialIcons, Ionicons)
- **Gestures:** react-native-gesture-handler v3
- **Styling:** StyleSheet (dark theme, glassmorphism)

---

## Quick Start

```bash
# Clone & masuk
git clone https://github.com/luminariadev/lumina-cafe-billiard-mobile.git
cd lumina-cafe-billiard-mobile

# Install dependencies
npm install

# Start Expo
npx expo start --clear

# Scan QR code dari Expo Go (Android/iOS)
```

### Setup Emulator (Android)

```bash
# Forward port API
adb reverse tcp:3000 tcp:3000

# Forward port Metro
adb reverse tcp:8081 tcp:8081
```

> Backend API harus aktif di `http://localhost:3000/api/v1`  
> Metro bundler berjalan di port **8081**

---

## Fitur Utama

- **Home Screen:** Menampilkan statistik harian (pendapatan, jumlah transaksi) dan ketersediaan meja secara real-time.
- **Booking Billiard:** Memesan meja billiard dengan validasi nama dan nomor HP, mengambil harga per jam secara dinamis dari API.
- **Cafe Order:** Memesan makanan/minuman dari menu cafe.
- **Payment:** Proses pembayaran via QRIS mock dengan status polling.
- **Guest History:** Melihat riwayat transaksi berdasarkan nomor HP.

---

## Navigasi

```
RootStack (native-stack, slide_from_right)
├── MainTabs (bottom-tabs, fade)
│   ├── Home  → GuestHomeScreen
│   ├── Book  → GuestMejaPickingScreen
│   ├── Cafe  → GuestCafeMenuScreen
│   └── History → GuestHistoryScreen (NEW)
├── BookingForm → Form booking billiard
├── Payment → Konfirmasi & status pembayaran
└── TransactionStatus → Status transaksi (QRIS)
├── Cart        → Keranjang cafe checkout
├── Payment     → QRIS + countdown
└── OrderStatus → Status pembayaran
```

- **Bottom tabs** konsisten di ketiga screen utama
- **RootStack** untuk screen detail dengan transisi native

---

## Alur Guest (Tanpa Login)

### Billiard Booking
1. Buka tab **Book**
2. Pilih meja yang tersedia
3. Isi nama + no. HP + pilih durasi
4. Confirm → muncul QRIS untuk bayar
5. Simulasi bayar → status **dibayar**

### Cafe Order
1. Buka tab **Cafe**
2. Pilih menu (makanan/minuman) → tambah ke keranjang
3. Buka **Cart** → isi nama + HP + pilih metode bayar
4. Checkout → QRIS / Tunai
5. Kalau QRIS → scan / simulasi bayar

---

## Screens

| Screen | File | Description |
|--------|------|-------------|
| **Home** | `GuestHomeScreen.tsx` | Promo banner, quick stats, floor map, cafe menu horizontal, My Sessions |
| **Book** | `GuestMejaPickingScreen.tsx` | Grid meja billiard dengan status (tersedia/terpakai) |
| **Cafe** | `GuestCafeMenuScreen.tsx` | Grid produk dengan filter type, cart badge |
| **BookingForm** | `GuestBookingFormScreen.tsx` | Form nama, HP, pilih durasi, kalkulasi harga |
| **Cart** | `GuestCartScreen.tsx` | Daftar item, quantity, pilih metode bayar, checkout |
| **Payment** | `GuestPaymentScreen.tsx` | QRIS placeholder, countdown 5 menit, polling status, simulasi bayar |
| **OrderStatus** | `GuestOrderStatusScreen.tsx` | Status transaksi (dibayar/batal/pending) dengan icon dinamis |

---

## Project Structure

```
src/
├── screens/
│   ├── GuestHomeScreen.tsx
│   ├── GuestMejaPickingScreen.tsx
│   ├── GuestCafeMenuScreen.tsx
│   ├── GuestBookingFormScreen.tsx
│   ├── GuestCartScreen.tsx
│   ├── GuestPaymentScreen.tsx
│   └── GuestOrderStatusScreen.tsx
└── lib/
    ├── api.ts       # API client (getProducts, getMejas, billiardBooking, cafeOrder, getPaymentStatus)
    ├── theme.ts     # Colors + Styles constants (dark theme, neon green, glass)
    └── format.ts    # formatCurrency helper
```

---

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://192.168.101.5:3000/api/v1` | Base URL API backend |

> Ubah `EXPO_PUBLIC_API_URL` jika backend berjalan di IP/subnet berbeda, atau set via `.env` file:
> ```
> EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
> ```

---

## API Client

File: `src/lib/api.ts`

| Function | Method | Endpoint |
|----------|--------|----------|
| `getProducts()` | GET | `/products` |
| `getMejas()` | GET | `/mejas` |
| `billiardBooking(data)` | POST | `/guest_transactions/billiard` |
| `cafeOrder(data)` | POST | `/guest_transactions/cafe` |
| `getPaymentStatus(id)` | GET | `/guest_transactions/:id/status` |

Semua endpoint bersifat **public** (tidak perlu token).

---

## Tema

```typescript
// src/lib/theme.ts
export const Colors = {
  primary:    "#6bfb9a",     // Neon green
  surface:    "#131313",     // Dark background
  onSurface:  "#ffffff",     // White text
  ...                         // Glass card styles
};
```

- Background: `#131313` solid
- Primary: `#6bfb9a` neon green
- Cards: `rgba(30,30,30,0.8)` with `rgba(255,255,255,0.1)` border (glassmorphism)
- Font: Montserrat (headings) + system (body)

---

## Catatan Pengembangan

- **Tidak menggunakan `react-native-reanimated`** — tidak kompatibel dengan Hermes di Expo Go (SIGSEGV)
- **Navigation stack: `@react-navigation/native-stack`** — lebih stabil daripada `@react-navigation/stack` (hindari PanGestureHandler crash)
- **Guest-only flow** — tidak ada login, tidak ada auth token. Semua data guest dikelola via API tanpa auth.
- Untuk menjalankan di perangkat fisik, pastikan perangkat dan laptop dalam 1 jaringan WiFi yang sama (atau gunakan `adb reverse` untuk emulator).
2026-07-29 19:42
# Last synced: 2026-07-30 17:41:02 WIB
# Manual sync: 2026-07-30 17:45:19 WIB
# Daily sync: 2026-07-31 17:30:07 WIB
# Re-sync (31 July): 2026-07-31 17:39:37 WIB
# sync: 2026-07-31 18:23:20
# sync: 2026-07-31 18:23:21
# sync: 2026-07-31 18:23:23
# Last synced: 2026-07-31 18:23:43 SEAST
# sync: 2026-08-01 09:16:41
# sync: 2026-08-01 09:16:43
# sync: 2026-08-01 09:16:44
# sync: 2026-08-03 23:25:12
# sync: 2026-08-03 23:25:13
# sync: 2026-08-03 23:25:14
# sync: 2026-08-08 19:59:06
# sync: 2026-08-08 19:59:07
# sync: 2026-08-08 19:59:08
# sync: 2026-08-11 19:29:13
# sync: 2026-08-11 19:29:13
# sync: 2026-08-11 19:29:13
# sync: 2026-08-12 16:53:56
# sync: 2026-08-12 16:53:56
# sync: 2026-08-12 16:53:57
# sync: 2026-08-14 17:40:07
# sync: 2026-08-14 17:40:08
