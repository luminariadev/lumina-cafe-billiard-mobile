# Lumina Cafe Billiard — Mobile App

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

## Navigasi

```
RootStack (native-stack, slide_from_right)
├── MainTabs (bottom-tabs, fade)
│   ├── Home  → GuestHomeScreen
│   ├── Book  → GuestMejaPickingScreen
│   └── Cafe  → GuestCafeMenuScreen
├── BookingForm → Form booking billiard
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
