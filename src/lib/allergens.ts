// Österreichische Allergene nach EU-Verordnung 1169/2011
export const ALLERGENS: Record<string, { code: string; name: string; nameDE: string }> = {
  A: { code: 'A', name: 'Gluten', nameDE: 'Glutenhaltiges Getreide' },
  B: { code: 'B', name: 'Crustaceans', nameDE: 'Krebstiere' },
  C: { code: 'C', name: 'Eggs', nameDE: 'Eier' },
  D: { code: 'D', name: 'Fish', nameDE: 'Fisch' },
  E: { code: 'E', name: 'Peanuts', nameDE: 'Erdnüsse' },
  F: { code: 'F', name: 'Soy', nameDE: 'Soja' },
  G: { code: 'G', name: 'Milk/Lactose', nameDE: 'Milch/Laktose' },
  H: { code: 'H', name: 'Nuts', nameDE: 'Schalenfrüchte' },
  L: { code: 'L', name: 'Celery', nameDE: 'Sellerie' },
  M: { code: 'M', name: 'Mustard', nameDE: 'Senf' },
  N: { code: 'N', name: 'Sesame', nameDE: 'Sesam' },
  O: { code: 'O', name: 'Sulphites', nameDE: 'Sulfite/Schwefeldioxid' },
  P: { code: 'P', name: 'Lupins', nameDE: 'Lupinen' },
  R: { code: 'R', name: 'Molluscs', nameDE: 'Weichtiere' },
};

export function parseAllergens(str: string): string[] {
  if (!str) return [];
  return str.split('').filter((c) => c in ALLERGENS);
}

export function formatAllergens(codes: string[]): string {
  return codes.join(',');
}
