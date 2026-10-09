/**
 * The Detty December example used by the transfer slips. Four real-looking bills
 * between six friends give six direct debts; simplified (taab's own method:
 * the biggest debtor pays the biggest creditor until everyone is even) they
 * become three. Amounts in naira.
 *
 *   You paid the beach club ₦60,000 for You, Gbayin and Macky   → Gbayin and Macky owe you ₦20,000 each
 *   Gbayin paid the Uber ₦30,000 for Gbayin, Ini and Femi        → Ini and Femi owe Gbayin ₦10,000 each
 *   Macky paid for suya ₦24,000 for Macky and David             → David owes Macky ₦12,000
 *   David paid concert tickets ₦24,000 for David and You        → you owe David ₦12,000
 */
export type Person = { id: string; name: string; colour: string; initial: string };
export type Debt = { from: string; to: string; amount: number };

export const PEOPLE: Person[] = [
  { id: 'you', name: 'You', colour: '#49CBCD', initial: 'Y' },
  { id: 'gbayin', name: 'Gbayin', colour: '#1859C3', initial: 'G' },
  { id: 'macky', name: 'Macky', colour: '#F4E04D', initial: 'M' },
  { id: 'ini', name: 'Ini', colour: '#FF4242', initial: 'I' },
  { id: 'femi', name: 'Femi', colour: '#029950', initial: 'F' },
  { id: 'david', name: 'David', colour: '#FFFEFA', initial: 'D' },
];

export const DIRECT: Debt[] = [
  { from: 'gbayin', to: 'you', amount: 20_000 },
  { from: 'macky', to: 'you', amount: 20_000 },
  { from: 'ini', to: 'gbayin', amount: 10_000 },
  { from: 'femi', to: 'gbayin', amount: 10_000 },
  { from: 'david', to: 'macky', amount: 12_000 },
  { from: 'you', to: 'david', amount: 12_000 },
];

/** Same balances as DIRECT, in the fewest payments. */
export function simplify(debts: Debt[]): Debt[] {
  const net = new Map<string, number>();
  for (const d of debts) {
    net.set(d.from, (net.get(d.from) ?? 0) - d.amount);
    net.set(d.to, (net.get(d.to) ?? 0) + d.amount);
  }
  const owe = [...net].filter(([, v]) => v < 0).map(([id, v]) => ({ id, amount: -v }));
  const owed = [...net].filter(([, v]) => v > 0).map(([id, v]) => ({ id, amount: v }));
  const order = (a: { id: string; amount: number }, b: { id: string; amount: number }) => b.amount - a.amount || a.id.localeCompare(b.id);
  const out: Debt[] = [];
  while (owe.length && owed.length) {
    owe.sort(order);
    owed.sort(order);
    const amount = Math.min(owe[0].amount, owed[0].amount);
    out.push({ from: owe[0].id, to: owed[0].id, amount });
    owe[0].amount -= amount;
    owed[0].amount -= amount;
    if (owe[0].amount === 0) owe.shift();
    if (owed[0].amount === 0) owed.shift();
  }
  return out;
}

export const SIMPLIFIED = simplify(DIRECT);

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;
export const personById = (id: string) => PEOPLE.find((p) => p.id === id)!;
