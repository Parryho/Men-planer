import { describe, it, expect } from 'vitest';
import { DAY_NAMES, DAY_NAMES_SHORT, INGREDIENT_CATEGORIES, UNITS } from './constants';

describe('DAY_NAMES', () => {
  it('has 7 entries', () => {
    expect(DAY_NAMES).toHaveLength(7);
  });

  it('starts with Sonntag (JS Date convention: 0=Sunday)', () => {
    expect(DAY_NAMES[0]).toBe('Sonntag');
  });

  it('ends with Samstag', () => {
    expect(DAY_NAMES[6]).toBe('Samstag');
  });

  it('contains all German day names', () => {
    expect(DAY_NAMES).toEqual([
      'Sonntag', 'Montag', 'Dienstag', 'Mittwoch',
      'Donnerstag', 'Freitag', 'Samstag',
    ]);
  });
});

describe('DAY_NAMES_SHORT', () => {
  it('has 7 entries matching DAY_NAMES', () => {
    expect(DAY_NAMES_SHORT).toHaveLength(7);
  });

  it('has 2-letter abbreviations', () => {
    for (const abbr of DAY_NAMES_SHORT) {
      expect(abbr).toHaveLength(2);
    }
  });
});

describe('INGREDIENT_CATEGORIES', () => {
  it('has 10 categories', () => {
    expect(Object.keys(INGREDIENT_CATEGORIES)).toHaveLength(10);
  });

  it('includes fleisch, fisch, gemuese', () => {
    expect(INGREDIENT_CATEGORIES.fleisch).toBeTruthy();
    expect(INGREDIENT_CATEGORIES.fisch).toBeTruthy();
    expect(INGREDIENT_CATEGORIES.gemuese).toBeTruthy();
  });

  it('values are German display names', () => {
    expect(INGREDIENT_CATEGORIES.fleisch).toBe('Fleisch & Wurst');
  });
});

describe('UNITS', () => {
  it('has 5 units', () => {
    expect(Object.keys(UNITS)).toHaveLength(5);
  });

  it('includes g, kg, ml, l, stueck', () => {
    expect(UNITS.g).toBe('Gramm');
    expect(UNITS.kg).toBe('Kilogramm');
    expect(UNITS.ml).toBe('Milliliter');
    expect(UNITS.l).toBe('Liter');
    expect(UNITS.stueck).toBeTruthy();
  });
});
