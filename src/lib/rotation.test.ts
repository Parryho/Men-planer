import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { createTestDb, seedTestDb } from '../../test/db-setup';
import { ROTATION_SEED_SQL } from '../../test/fixtures/rotations';

const dbHolder = vi.hoisted(() => {
  return { db: null as Database.Database | null };
});

vi.mock('@/lib/db', () => ({
  getDb: () => dbHolder.db!,
}));

const { getRotationWeek, getWeeklyPlan, generateWeekFromRotation } = await import('./rotation');

describe('rotation', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec(ROTATION_SEED_SQL);
  });

  describe('getRotationWeek', () => {
    it('returns correct structure', () => {
      const week = getRotationWeek(1);
      expect(week.weekNr).toBe(1);
      expect(week.days).toHaveLength(7);
    });

    it('each day has mittag and abend with city and sued', () => {
      const week = getRotationWeek(1);
      for (const day of week.days) {
        expect(day.mittag).toHaveProperty('city');
        expect(day.mittag).toHaveProperty('sued');
        expect(day.abend).toHaveProperty('city');
        expect(day.abend).toHaveProperty('sued');
      }
    });

    it('Monday city mittag has soup from seed data', () => {
      const week = getRotationWeek(1);
      const monday = week.days[1];
      expect(monday.mittag.city.soup).not.toBeNull();
      expect(monday.mittag.city.soup?.name).toBe('Gulaschsuppe');
    });

    it('includes allergens in dish details', () => {
      const week = getRotationWeek(1);
      const monday = week.days[1];
      expect(monday.mittag.city.soup?.allergens).toBe('ALG');
    });

    it('empty rotation week returns all null slots', () => {
      const week = getRotationWeek(3);
      const monday = week.days[1];
      expect(monday.mittag.city.soup).toBeNull();
      expect(monday.mittag.city.main1).toBeNull();
    });
  });

  describe('getWeeklyPlan', () => {
    it('returns null when no plan exists', () => {
      const plan = getWeeklyPlan(2025, 99);
      expect(plan).toBeNull();
    });

    it('returns plan after generation', () => {
      generateWeekFromRotation(2025, 5, 1);
      const plan = getWeeklyPlan(2025, 5);
      expect(plan).not.toBeNull();
      expect(plan!.calendarWeek).toBe(5);
      expect(plan!.year).toBe(2025);
    });
  });

  describe('generateWeekFromRotation', () => {
    it('creates plan entries from rotation', () => {
      generateWeekFromRotation(2025, 5, 1);
      const plan = getWeeklyPlan(2025, 5);
      expect(plan).not.toBeNull();
      expect(plan!.days).toHaveLength(7);
    });

    it('Monday city mittag matches rotation data', () => {
      generateWeekFromRotation(2025, 5, 1);
      const plan = getWeeklyPlan(2025, 5);
      const monday = plan!.days[1];
      expect(monday.mittag.city.soup?.name).toBe('Gulaschsuppe');
      expect(monday.mittag.city.main1?.name).toBe('Wiener Schnitzel');
    });

    it('can be called multiple times (INSERT OR REPLACE)', () => {
      generateWeekFromRotation(2025, 5, 1);
      generateWeekFromRotation(2025, 5, 1);
      const plan = getWeeklyPlan(2025, 5);
      expect(plan).not.toBeNull();
    });
  });
});
