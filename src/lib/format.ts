export function formatCurrency(n: number | string): string {
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}
