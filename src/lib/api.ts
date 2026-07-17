// API types
export interface User {
  id: number;
  name: string;
  username: string;
  role: "admin" | "kasir_billiard" | "kasir_cafe";
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  category?: Category;
  product_type: string;
  active: boolean;
}

export interface Meja {
  id: number;
  nomor_meja: string;
  status: "tersedia" | "dipakai" | "maintenance";
  keterangan?: string;
}

export interface Transaksi {
  id: number;
  kode_transaksi: string;
  user_id: number;
  meja_id?: number;
  meja?: Meja;
  transaksi_type: "billiard" | "cafe";
  total_amount: number;
  status: "pending" | "dibayar" | "batal";
  payment_method?: string;
  customer_name?: string;
  jam_mulai: string;
  jam_selesai?: string;
  transaksi_items: TransaksiItem[];
  user?: User;
}

export interface TransaksiItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Report {
  today_revenue: number;
  monthly_revenue: number;
  best_sellers: { name: string; quantity: number }[];
  today_transactions: number;
  monthly_transactions: number;
}

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.105:3000/api/v1";

let token: string | null = null;

export function getToken(): string | null {
  return token;
}

export function setToken(t: string | null) {
  token = t;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Auth
export const login = (username: string, password: string) =>
  request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// Categories
export const getCategories = () => request<Category[]>("/categories");
export const createCategory = (data: Partial<Category>) =>
  request<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const deleteCategory = (id: number) =>
  request<void>(`/categories/${id}`, { method: "DELETE" });

// Products
export const getProducts = () => request<Product[]>("/products");
export const createProduct = (data: Partial<Product>) =>
  request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const deleteProduct = (id: number) =>
  request<void>(`/products/${id}`, { method: "DELETE" });

// Meja
export const getMejas = () => request<Meja[]>("/mejas");
export const toggleMejaStatus = (id: number, status: string) =>
  request<Meja>(`/mejas/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// Transaksi
export const getTransaksis = () => request<Transaksi[]>("/transaksis");
export const startTransaksi = (data: { meja_id: number }) =>
  request<Transaksi>("/transaksis", {
    method: "POST",
    body: JSON.stringify({ transaksi: data }),
  });
export const payTransaksi = (id: number, payment_method: string) =>
  request<Transaksi>(`/transaksis/${id}/pay`, {
    method: "POST",
    body: JSON.stringify({ payment_method }),
  });
export const cafePos = (payment_method: string, items: Record<string, number>) =>
  request<Transaksi>("/transaksis/cafe_pos", {
    method: "POST",
    body: JSON.stringify({ payment_method, items }),
  });

// Reports
export const getReports = () => request<Report>("/reports");
