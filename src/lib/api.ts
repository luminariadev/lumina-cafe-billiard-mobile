const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://192.168.101.5:3000/api/v1";

export interface Meja {
  id: number;
  nomor_meja: number;
  status: "tersedia" | "terpakai" | "maintenance";
  keterangan: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  stock: number;
  product_type: string;
  active: boolean;
  category?: { id: number; name: string };
}

export interface GuestTransaksi {
  id: number;
  kode_transaksi: string;
  total_amount: number;
  qris_string: string;
  qr_expires_at: string;
  status: string;
  items?: { name: string; qty: number; price: number; subtotal: number }[];
}

export interface AppConfig {
  app_name: string;
  version: string;
  billiard: {
    price_per_hour: number;
    currency: string;
    min_duration_hour: number;
    max_duration_hour: number;
  };
  operating_hours: {
    open: string;
    close: string;
    timezone: string;
  };
  payment: {
    methods: string[];
    qris_expiry_minutes: number;
  };
}

export interface ReportData {
  date: string;
  total_billiard: number;
  total_cafe: number;
  total_all: number;
  count: number;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

/** Fetch all tables (billiard) */
export const getMejas = () => request<{ data: Meja[]; meta: any }>("/mejas").then(r => r.data);

/** Fetch all products (cafe & billiard menu items) */
export const getProducts = () => request<Product[]>("/products");

/**
 * Create a billiard booking as a guest (no login required).
 * @param data - customer name/phone, table number, and duration in hours
 */
export const billiardBooking = (data: {
  customer_name: string;
  customer_phone: string;
  nomor_meja: number;
  durasi_jam: number;
}) =>
  request<GuestTransaksi>("/guest_transactions/billiard", {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Poll QRIS payment status for a guest transaction */
export const getPaymentStatus = (id: number) =>
  request<GuestTransaksi>(`/guest_transactions/${id}/status`);

/**
 * Create a cafe order as a guest (no login required).
 * @param data - customer name/phone, items, and payment method
 */
export const cafeOrder = (data: {
  customer_name: string;
  customer_phone: string;
  items: Record<string, number>;
  payment_method: string;
}) =>
  request<GuestTransaksi>("/guest_transactions/cafe", {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Fetch app-wide config (pricing, operating hours, payment methods) */
export const getAppConfig = () =>
  request<AppConfig>("/configs");

/** Fetch today's revenue report (billiard vs cafe totals) */
export const getTodayReport = () =>
  request<ReportData>(`/transaksis/report?date=${new Date().toISOString().split("T")[0]}`);
