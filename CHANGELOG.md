# Changelog

## v1.0.0 (2026-07-25)

### ✨ Features
- **Home Screen**: Real-time stats (today revenue, transaction count) from API
- **Booking Flow**: Select table → fill details → confirm → payment → status
- **Cafe Order**: Browse menu → add items → cart → checkout
- **Payment**: QRIS mock, payment status polling
- **Guest History**: View past transactions via phone number
- **Dynamic Pricing**: Fetch price_per_hour from `/configs` API
- **Form Validation**: Client-side name (min 2 chars) and phone (8-15 digits) validation

### 🎨 UI/UX
- Dark theme (#131313) with neon green (#6bfb9a) accents
- Glassmorphism cards with electric glow effects
- Bottom tab navigation (Home, Booking, Cafe, History)
- Admin drawer navigation
- Loading states and error handling

### 🐛 Fixes
- Placeholder data replaced with real API responses
- Hardcoded pricing replaced with dynamic config fetch

### 🧰 Technical
- React Native with Expo
- TypeScript
- SafeAreaView for all screens
