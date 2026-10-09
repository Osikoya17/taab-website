import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';

import { allocateProportionally, formatNaira } from '../lib/split';

const TOTAL = 5_000_000; // ₦50,000 in kobo
const MIN_SHARES = 1;
const MAX_SHARES = 5;
const FRIENDS = [
  { id: 'you', name: 'You', colour: '#49CBCD' },
  { id: 'gbayin', name: 'Gbayin', colour: '#1859C3' },
  { id: 'macky', name: 'Macky', colour: '#F4E04D' },
  { id: 'ini', name: 'Ini', colour: '#FF4242' },
  { id: 'femi', name: 'Femi', colour: '#029950' },
];

type Method = 'equal' | 'shares';

/** The Red Horn dinner, split with taab's own rule. Visitors choose who came and how to split. */
export default function RedHornSplit() {
  const [inIds, setIn] = useState<string[]>(FRIENDS.map((f) => f.id));
  const [method, setMethod] = useState<Method>('equal');
  const [shares, setShares] = useState<Record<string, number>>({ you: 1, gbayin: 1, macky: 2, ini: 1, femi: 1 });

  const people = FRIENDS.filter((f) => inIds.includes(f.id));
  const amounts = useMemo(
    () => allocateProportionally(TOTAL, people.map((p) => (method === 'equal' ? 1 : shares[p.id]))),
    [people, method, shares],
  );
  const sum = amounts.reduce((a, b) => a + b, 0);

  const toggle = (id: string) =>
    setIn((ids) => (ids.includes(id) ? (ids.length > 1 ? ids.filter((x) => x !== id) : ids) : FRIENDS.map((f) => f.id).filter((x) => x === id || ids.includes(x))));
  const step = (id: string, by: number) => setShares((s) => ({ ...s, [id]: Math.min(MAX_SHARES, Math.max(MIN_SHARES, s[id] + by)) }));

  return (
    <div className="rh">
      <div className="rh-head">
        <div>
          <p className="rh-taab">Red Horn dinner</p>
          <p className="rh-total">{formatNaira(TOTAL)}</p>
          <p className="rh-meta">Paid by you</p>
        </div>
        <div className="rh-methods" role="radiogroup" aria-label="How to split">
          {(['equal', 'shares'] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={method === m} className={method === m ? 'on' : ''} onClick={() => setMethod(m)}>
              {m === 'equal' ? 'Equally' : 'By shares'}
            </button>
          ))}
        </div>
      </div>

      <p className="rh-label">Who was there?</p>
      <div className="rh-chips">
        {FRIENDS.map((f) => {
          const on = inIds.includes(f.id);
          return (
            <button key={f.id} type="button" aria-pressed={on} className={on ? 'chip on' : 'chip'} onClick={() => toggle(f.id)}>
              <span className="dot" style={{ background: f.colour }} />
              {f.name}
            </button>
          );
        })}
      </div>

      <ul className="rh-rows">
        <AnimatePresence initial={false}>
          {people.map((p, i) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
              <span className="dot big" style={{ background: p.colour }} />
              <span className="name">{p.name}</span>
              {method === 'shares' ? (
                <span className="stepper">
                  <button type="button" aria-label={`Fewer shares for ${p.name}`} aria-disabled={shares[p.id] <= MIN_SHARES} onClick={() => step(p.id, -1)}>
                    −
                  </button>
                  <span className="tabular">{shares[p.id]}</span>
                  <button type="button" aria-label={`More shares for ${p.name}`} aria-disabled={shares[p.id] >= MAX_SHARES} onClick={() => step(p.id, 1)}>
                    +
                  </button>
                </span>
              ) : null}
              <motion.b key={amounts[i]} className="tabular" initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                {formatNaira(amounts[i])}
              </motion.b>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <p className="rh-check">
        <span aria-hidden="true">✓</span> Adds up to {formatNaira(sum)} exactly, down to the kobo.
      </p>
    </div>
  );
}
