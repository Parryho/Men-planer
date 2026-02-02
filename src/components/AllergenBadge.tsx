'use client';

import { ALLERGENS } from '@/lib/allergens';

export default function AllergenBadge({ codes }: { codes: string }) {
  if (!codes) return null;
  const letters = codes.split('').filter((c) => c in ALLERGENS);
  if (letters.length === 0) return null;

  return (
    <span className="text-red-600 font-semibold text-xs" title={letters.map((c) => `${c}=${ALLERGENS[c].nameDE}`).join(', ')}>
      {letters.join(',')}
    </span>
  );
}
