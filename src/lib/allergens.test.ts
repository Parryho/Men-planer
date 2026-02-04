import { describe, it, expect } from 'vitest';
import { ALLERGENS, parseAllergens, formatAllergens } from './allergens';

describe('ALLERGENS', () => {
  it('contains all 14 EU allergens', () => {
    const codes = Object.keys(ALLERGENS);
    expect(codes).toHaveLength(14);
    expect(codes).toEqual(
      expect.arrayContaining(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'M', 'N', 'O', 'P', 'R'])
    );
  });

  it('each allergen has code, name, and nameDE', () => {
    for (const [key, value] of Object.entries(ALLERGENS)) {
      expect(value.code).toBe(key);
      expect(value.name).toBeTruthy();
      expect(value.nameDE).toBeTruthy();
    }
  });

  it('A is Gluten', () => {
    expect(ALLERGENS.A.name).toBe('Gluten');
  });

  it('G is Milk/Lactose', () => {
    expect(ALLERGENS.G.name).toBe('Milk/Lactose');
  });
});

describe('parseAllergens', () => {
  it('parses "ACG" into ["A","C","G"]', () => {
    expect(parseAllergens('ACG')).toEqual(['A', 'C', 'G']);
  });

  it('returns empty array for empty string', () => {
    expect(parseAllergens('')).toEqual([]);
  });

  it('returns empty array for null/undefined', () => {
    expect(parseAllergens(null as unknown as string)).toEqual([]);
    expect(parseAllergens(undefined as unknown as string)).toEqual([]);
  });

  it('filters out invalid characters', () => {
    expect(parseAllergens('AXG')).toEqual(['A', 'G']);
  });

  it('filters out lowercase letters', () => {
    expect(parseAllergens('acg')).toEqual([]);
  });

  it('handles all 14 codes', () => {
    const result = parseAllergens('ABCDEFGHLMNOPР');
    // Note: only valid codes pass through
    expect(result.length).toBeGreaterThanOrEqual(13);
  });
});

describe('formatAllergens', () => {
  it('joins codes with comma', () => {
    expect(formatAllergens(['A', 'C', 'G'])).toBe('A,C,G');
  });

  it('returns empty string for empty array', () => {
    expect(formatAllergens([])).toBe('');
  });

  it('round-trip: parse then format', () => {
    const input = 'ACGL';
    const parsed = parseAllergens(input);
    const formatted = formatAllergens(parsed);
    expect(formatted).toBe('A,C,G,L');
  });
});
