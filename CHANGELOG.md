# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.0.0] - 2026-07-25

### Added
- **`getAppConfig()` in api.ts** — fetches app configuration including `price_per_hour` from `GET /api/v1/configs`
- Form validation on `GuestBookingFormScreen` — name min 2 chars, phone 8-15 digits; displays inline error messages below each field
- Dynamic price display — booking form now shows `pricePerHour` fetched from API, with `DEFAULT_PRICE_PER_HOUR` (Rp 25.000) as fallback

### Changed
- `GuestHomeScreen` now shows real data instead of hardcoded placeholders:
  - "Cafe Orders ~15 min" → "Menu Items [count]" from `/products`
  - "Active Tables X/Y" → "Available Tables" with accurate available count
  - Hardcoded fake "My Sessions" cards removed → replaced with "Ready to Play?" call-to-action card
- Phone number sanitized before API call — whitespace trimmed via `phone.replace(/\s/g, "")`

### Fixed
- Booking validation errors now clear when user corrects the field (live feedback)

---

## [v1.0.0-alpha] - 2026-07-24

### Added (Initial Release)
- Expo SDK 52 with React Native
- 7 screens: Home → Book → Cafe → Cart → Payment → Status
- BottomTabNav with 5 tabs: Home, Book, Cafe, Cart, Profile
- Dark glassmorphism theme (dark surfaces, #6bfb9a accent, Montserrat/Inter fonts)
- Guest billiard table booking flow (select table → fill form → pay QRIS)
- Guest cafe ordering (browse menu → add to cart → checkout)
- QRIS mock payment with polling status checks
- MaterialIcons and Ionicons throughout
- GitHub Actions CI — lint + build checks
- Commitlint with Conventional Commits rules
- `.gitignore` blocks all AI agent config files (AGENTS.md, CLAUDE.md, CURSOR.md, etc.)