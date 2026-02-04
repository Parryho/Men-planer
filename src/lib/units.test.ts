import { describe, it, expect } from 'vitest';
import { convertUnit, calculateCost, formatQuantity, formatEuro } from './units';

describe('convertUnit', () => {
  it('g to kg', () => {
    expect(convertUnit(1000, 'g', 'kg')).toBe(1);
  });

  it('kg to g', () => {
    expect(convertUnit(2, 'kg', 'g')).toBe(2000);
  });

  it('ml to l', () => {
    expect(convertUnit(500, 'ml', 'l')).toBe(0.5);
  });

  it('l to ml', () => {
    expect(convertUnit(1.5, 'l', 'ml')).toBe(1500);
  });

  it('same unit returns same quantity', () => {
    expect(convertUnit(42, 'g', 'g')).toBe(42);
    expect(convertUnit(3, 'stueck', 'stueck')).toBe(3);
  });

  it('incompatible units returns same quantity', () => {
    expect(convertUnit(100, 'g', 'ml')).toBe(100);
    expect(convertUnit(5, 'stueck', 'kg')).toBe(5);
  });
});

describe('calculateCost', () => {
  it('same units: 500g at 5€/kg = 2.5€', () => {
    expect(calculateCost(500, 'g', 5, 'kg')).toBeCloseTo(2.5);
  });

  it('returns 0 when price is 0', () => {
    expect(calculateCost(100, 'g', 0, 'kg')).toBe(0);
  });

  it('same unit: 2 stueck at 1.5€/stueck = 3€', () => {
    expect(calculateCost(2, 'stueck', 1.5, 'stueck')).toBeCloseTo(3);
  });

  it('ml to l: 250ml at 3€/l = 0.75€', () => {
    expect(calculateCost(250, 'ml', 3, 'l')).toBeCloseTo(0.75);
  });
});

describe('formatQuantity', () => {
  it('1000g → "1.00 kg"', () => {
    expect(formatQuantity(1000, 'g')).toBe('1.00 kg');
  });

  it('1500ml → "1.50 l"', () => {
    expect(formatQuantity(1500, 'ml')).toBe('1.50 l');
  });

  it('500g stays as "500 g"', () => {
    expect(formatQuantity(500, 'g')).toBe('500 g');
  });

  it('3 stueck → "3 Stk"', () => {
    expect(formatQuantity(3, 'stueck')).toBe('3 Stk');
  });

  it('fractional values get 1 decimal', () => {
    expect(formatQuantity(2.5, 'kg')).toBe('2.5 kg');
  });

  it('integer values have no decimal', () => {
    expect(formatQuantity(100, 'ml')).toBe('100 ml');
  });
});

describe('formatEuro', () => {
  it('formats in Austrian locale with € symbol', () => {
    const result = formatEuro(12.5);
    // Austrian format: "12,50 €" or "€ 12,50" depending on runtime
    expect(result).toMatch(/12[,.]50/);
    expect(result).toContain('€');
  });

  it('formats 0', () => {
    const result = formatEuro(0);
    expect(result).toContain('€');
    expect(result).toMatch(/0[,.]00/);
  });
});
