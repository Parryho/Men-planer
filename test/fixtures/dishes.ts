export const SAMPLE_DISHES = [
  { id: 1, name: 'Gulaschsuppe', category: 'suppe', allergens: 'ALG', season: 'all' },
  { id: 2, name: 'Wiener Schnitzel', category: 'fleisch', allergens: 'ACG', season: 'all' },
  { id: 3, name: 'Pommes Frites', category: 'beilage', allergens: 'A', season: 'all' },
  { id: 4, name: 'Reis', category: 'beilage', allergens: '', season: 'all' },
  { id: 5, name: 'Gemüselasagne', category: 'vegetarisch', allergens: 'ACG', season: 'all' },
  { id: 6, name: 'Gemischter Salat', category: 'beilage', allergens: 'O', season: 'all' },
  { id: 7, name: 'Topfenknödel', category: 'dessert', allergens: 'ACG', season: 'all' },
  { id: 8, name: 'Grillforelle', category: 'fisch', allergens: 'D', season: 'summer' },
  { id: 9, name: 'Kürbiscremesuppe', category: 'suppe', allergens: 'GL', season: 'winter' },
  { id: 10, name: 'Erdäpfelpüree', category: 'beilage', allergens: 'G', season: 'all' },
] as const;

export const NEW_DISH = {
  name: 'Testgericht',
  category: 'fleisch',
  allergens: 'AG',
  season: 'all',
};
