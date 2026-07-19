export const Colors = {
  primary: "#6bfb9a",
  primaryContainer: "#4ade80",
  onPrimary: "#003919",
  secondary: "#ffb86a",
  secondaryContainer: "#9a5c00",
  onSecondary: "#492900",
  surface: "#131313",
  surfaceContainer: "#201f1f",
  surfaceContainerHigh: "#2a2a2a",
  onSurface: "#e5e2e1",
  onSurfaceVariant: "#bccabb",
  outlineVariant: "#3d4a3e",
  glassBg: "rgba(30,30,30,0.8)",
  glassBorder: "rgba(255,255,255,0.1)",
};

export const Fonts = {
  headlineLarge: {
    fontFamily: "Montserrat",
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  headlineMedium: {
    fontFamily: "Montserrat",
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  labelSmall: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.02,
    fontWeight: "500" as const,
  },
  bodyMedium: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Styles = {
  glassCard: {
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
  },
  electricGlow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};
