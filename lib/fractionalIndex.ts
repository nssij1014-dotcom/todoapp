import { generateKeyBetween } from "fractional-indexing";

export function generateOrderKey(a: string | null, b: string | null): string {
  return generateKeyBetween(a, b);
}
