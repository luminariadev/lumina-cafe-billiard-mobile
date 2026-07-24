const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://192.168.101.5:3000/api/v1";

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

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  product_type: string;
  active: boolean;
}

export interface Meja {
  id: number;
  nomor_meja: string;
  status: string;
  keterangan?: string;
}

export interface GuestTransaksi {
  id: number;
  kode_transaksi: string;
  status: string;
  total_amount: number;
  customer_name?: string;
  qris_string?: string;
  qr_expires_at?: string;
  items?: { name: string; qty: number; price: number; subtotal: number }[];
}

// ---- Guest (no-auth) endpoints ----

export const getMejas = () =>
  request<Meja[]>("/mejas");

export const getProducts = () =>
  request<Product[]>("/products");

export const billiardBooking = (data: {
  customer_name: string;
  customer_phone: string;
  nomor_meja: string;
  durasi_jam: number;
}) =>
  request<GuestTransaksi>("/guest_transactions/billiard", {
    method: "POST",
    body: JSON.stringify(data),
  });

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

export const getPaymentStatus = (id: number) =>
  request<GuestTransaksi>(`/guest_transactions/${id}/status`);

export const getAppConfig = () =>
  request<AppConfig>("/configs");

