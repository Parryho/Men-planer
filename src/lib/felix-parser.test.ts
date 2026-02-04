import { describe, it, expect } from 'vitest';
import { parseFelixText, confidenceLevel } from './felix-parser';
import {
  FELIX_7_COLUMNS,
  FELIX_6_COLUMNS,
  FELIX_5_COLUMNS,
  FELIX_OCR_ERRORS,
  FELIX_SUED,
  FELIX_MINIMAL,
  FELIX_NOISE,
} from '../../test/fixtures/felix-text';

describe('parseFelixText', () => {
  describe('7-column parsing', () => {
    it('parses all 5 days from 7-column data', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      expect(result.days).toHaveLength(5);
    });

    it('extracts correct values for first day', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      const mon = result.days[0];
      expect(mon.date).toBe('03.02.25');
      expect(mon.day).toBe('Mo');
      expect(mon.gesamtPax).toBe(85);
      expect(mon.fruehstueck).toBe(72);
      expect(mon.kpVorm).toBe(5);
      expect(mon.mittag).toBe(35);
      expect(mon.kpNach).toBe(0);
      expect(mon.abendE).toBe(28);
      expect(mon.abendK).toBe(12);
    });

    it('abendGesamt = abendE + abendK', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      const mon = result.days[0];
      expect(mon.abendGesamt).toBe(mon.abendE + mon.abendK);
    });

    it('days are sorted chronologically', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      for (let i = 1; i < result.days.length; i++) {
        const prevDate = result.days[i - 1].date;
        const curDate = result.days[i].date;
        // Simple string comparison works for DD.MM.YY within same month
        expect(curDate > prevDate).toBe(true);
      }
    });
  });

  describe('6-column parsing', () => {
    it('parses 3 days from 6-column data', () => {
      const result = parseFelixText(FELIX_6_COLUMNS);
      expect(result.days).toHaveLength(3);
    });

    it('sets abendE to 0 when missing', () => {
      const result = parseFelixText(FELIX_6_COLUMNS);
      const mon = result.days[0];
      expect(mon.abendE).toBe(0);
      // abendK should be the last number
      expect(mon.abendK).toBe(8);
    });
  });

  describe('5-column parsing', () => {
    it('parses 2 days from 5-column data', () => {
      const result = parseFelixText(FELIX_5_COLUMNS);
      expect(result.days).toHaveLength(2);
    });

    it('kpVorm and kpNach are 0', () => {
      const result = parseFelixText(FELIX_5_COLUMNS);
      const mon = result.days[0];
      expect(mon.kpVorm).toBe(0);
      expect(mon.kpNach).toBe(0);
    });
  });

  describe('OCR error correction', () => {
    it('fixes Er → Fr for day name', () => {
      const result = parseFelixText(FELIX_OCR_ERRORS);
      expect(result.days.length).toBeGreaterThanOrEqual(1);
      const day = result.days[0];
      expect(day.day).toBe('Fr');
    });

    it('parses numbers despite OCR artifacts', () => {
      const result = parseFelixText(FELIX_OCR_ERRORS);
      expect(result.days.length).toBeGreaterThanOrEqual(1);
      const day = result.days[0];
      expect(day.gesamtPax).toBe(95);
    });
  });

  describe('hotel detection', () => {
    it('detects city hotel', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      expect(result.hotel).toBe('city');
    });

    it('detects sued hotel', () => {
      const result = parseFelixText(FELIX_SUED);
      expect(result.hotel).toBe('sued');
    });

    it('returns empty string for unknown hotel', () => {
      const result = parseFelixText(FELIX_MINIMAL);
      expect(result.hotel).toBe('');
    });
  });

  describe('date range (zeitraum)', () => {
    it('extracts zeitraum from "von ... bis ..." line', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      expect(result.zeitraum).toContain('03.02.25');
      expect(result.zeitraum).toContain('09.02.25');
    });

    it('returns empty zeitraum when not present', () => {
      const result = parseFelixText(FELIX_MINIMAL);
      expect(result.zeitraum).toBe('');
    });
  });

  describe('date formats', () => {
    it('handles DD.MM.YY format', () => {
      const result = parseFelixText('Mo  03.02.25  Ges.  85  72  5  35  0  28  12');
      expect(result.days.length).toBeGreaterThanOrEqual(1);
      expect(result.days[0].date).toBe('03.02.25');
    });

    it('handles DD.MM.YYYY format', () => {
      const result = parseFelixText('Mo  03.02.2025  Ges.  85  72  5  35  0  28  12');
      expect(result.days.length).toBeGreaterThanOrEqual(1);
      expect(result.days[0].date).toBe('03.02.25');
    });
  });

  describe('minimal data', () => {
    it('parses 3-number rows', () => {
      const result = parseFelixText(FELIX_MINIMAL);
      expect(result.days).toHaveLength(1);
      expect(result.days[0].gesamtPax).toBe(45);
      expect(result.days[0].fruehstueck).toBe(38);
      expect(result.days[0].mittag).toBe(18);
    });
  });

  describe('noise handling', () => {
    it('returns empty days for pure noise text', () => {
      const result = parseFelixText(FELIX_NOISE);
      expect(result.days).toHaveLength(0);
    });
  });

  describe('confidence scoring', () => {
    it('7-column rows have high confidence', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      for (const day of result.days) {
        expect(day.confidence).toBeGreaterThanOrEqual(0.5);
      }
    });

    it('minimal data has lower confidence', () => {
      const result = parseFelixText(FELIX_MINIMAL);
      if (result.days.length > 0) {
        expect(result.days[0].confidence).toBeLessThan(0.9);
      }
    });
  });

  describe('rawText', () => {
    it('includes original text', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      expect(result.rawText).toBe(FELIX_7_COLUMNS);
    });
  });

  describe('header/noise filtering', () => {
    it('does not include header lines as data rows', () => {
      const result = parseFelixText(FELIX_7_COLUMNS);
      // Should not include the "von 03.02.25 bis 09.02.25" line as a day
      for (const day of result.days) {
        expect(day.date).not.toBe('');
      }
    });
  });
});

describe('confidenceLevel', () => {
  it('returns "high" for score >= 0.7', () => {
    expect(confidenceLevel(0.7)).toBe('high');
    expect(confidenceLevel(1.0)).toBe('high');
  });

  it('returns "medium" for score >= 0.4 and < 0.7', () => {
    expect(confidenceLevel(0.4)).toBe('medium');
    expect(confidenceLevel(0.69)).toBe('medium');
  });

  it('returns "low" for score < 0.4', () => {
    expect(confidenceLevel(0.0)).toBe('low');
    expect(confidenceLevel(0.39)).toBe('low');
  });
});
