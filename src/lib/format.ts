export function formatCurrency(n: number | string): string {
  return `Rp ${Number(n).toLocaleString("id-ID")}`;
}

/**
 * Validate an Indonesian phone number.
 * Accepts 8-15 digits, optionally starting with "0", "+62", or "62".
 * Returns true when the number looks valid.
 */
export function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.trim().replace(/^\+/, "").replace(/^62/, "0");
  return /^0\d{8,13}$/.test(digits);
}
