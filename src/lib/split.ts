/**
 * taab's split rule, copied from the app (src/features/expenses/split.ts) so
 * the demo gives exactly the numbers the app would. Amounts are kobo.
 *
 * Splits `total` across `weights` so the parts are whole kobo that add up to
 * `total` exactly. Uses the largest remainder method; ties go to the earlier
 * person so results never change between runs.
 */
export function allocateProportionally(total: number, weights: number[]): number[] {
  const bigSum = weights.reduce((sum, w) => sum + BigInt(w), 0n);
  if (weights.length === 0 || bigSum === 0n) return weights.map(() => 0);
  const bigTotal = BigInt(total);
  const parts = weights.map((w, index) => {
    const numerator = bigTotal * BigInt(w);
    return { index, base: numerator / bigSum, remainder: numerator % bigSum };
  });
  let leftover = bigTotal - parts.reduce((sum, p) => sum + p.base, 0n);
  const byRemainder = [...parts].sort((a, b) => (a.remainder === b.remainder ? a.index - b.index : a.remainder > b.remainder ? -1 : 1));
  for (const part of byRemainder) {
    if (leftover <= 0n) break;
    part.base += 1n;
    leftover -= 1n;
  }
  return parts.map((p) => Number(p.base));
}

/** ₦12,500 or ₦12,500.50 when there are kobo. */
export function formatNaira(kobo: number): string {
  const naira = Math.floor(kobo / 100);
  const rest = kobo % 100;
  return `₦${naira.toLocaleString('en-NG')}${rest ? `.${String(rest).padStart(2, '0')}` : ''}`;
}
