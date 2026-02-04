import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { createTestDb, seedTestDb } from '../../../../test/db-setup';
import { ROTATION_SEED_SQL } from '../../../../test/fixtures/rotations';

const dbHolder = vi.hoisted(() => {
  return { db: null as Database.Database | null };
});

vi.mock('@/lib/db', () => ({
  getDb: () => dbHolder.db!,
}));

vi.mock('@/lib/seed', () => ({
  seedDatabase: () => {},
}));

const { GET, PUT, POST } = await import('./route');

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe('GET /api/plans', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec(ROTATION_SEED_SQL);
  });

  it('returns rotation template when rotation param present', async () => {
    const res = await GET(makeRequest('http://localhost/api/plans?rotation=1') as any);
    const data = await res.json();
    expect(data.weekNr).toBe(1);
    expect(data.days).toHaveLength(7);
  });

  it('auto-generates plan from rotation if not existing', async () => {
    const res = await GET(makeRequest('http://localhost/api/plans?year=2025&week=1') as any);
    const data = await res.json();
    expect(data).not.toBeNull();
    expect(data.days).toHaveLength(7);
  });

  it('returns existing plan on second call', async () => {
    await GET(makeRequest('http://localhost/api/plans?year=2025&week=1') as any);
    const res = await GET(makeRequest('http://localhost/api/plans?year=2025&week=1') as any);
    const data = await res.json();
    expect(data).not.toBeNull();
  });
});

describe('PUT /api/plans', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec(ROTATION_SEED_SQL);
  });

  it('updates a slot in existing plan', async () => {
    await GET(makeRequest('http://localhost/api/plans?year=2025&week=5') as any);

    const res = await PUT(
      makeRequest('http://localhost/api/plans', {
        method: 'PUT',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city', slot: 'soup', dishId: 9,
        }),
      }) as any
    );
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it('rejects invalid slot name (SQL injection prevention)', async () => {
    await GET(makeRequest('http://localhost/api/plans?year=2025&week=5') as any);

    const res = await PUT(
      makeRequest('http://localhost/api/plans', {
        method: 'PUT',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          slot: "soup_id = 1; DROP TABLE dishes; --",
          dishId: 1,
        }),
      }) as any
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Ungültiger Slot');
  });

  it('accepts all valid slot names', async () => {
    await GET(makeRequest('http://localhost/api/plans?year=2025&week=5') as any);

    const validSlots = ['soup', 'main1', 'side1a', 'side1b', 'main2', 'side2a', 'side2b', 'dessert'];
    for (const slot of validSlots) {
      const res = await PUT(
        makeRequest('http://localhost/api/plans', {
          method: 'PUT',
          body: JSON.stringify({
            year: 2025, calendarWeek: 5, dayOfWeek: 1,
            meal: 'mittag', location: 'city', slot, dishId: 1,
          }),
        }) as any
      );
      expect(res.status).toBe(200);
    }
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await PUT(
      makeRequest('http://localhost/api/plans', {
        method: 'PUT',
        body: JSON.stringify({ year: 2025 }),
      }) as any
    );
    expect(res.status).toBe(400);
  });
});

describe('POST /api/plans', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec(ROTATION_SEED_SQL);
  });

  it('generates plan from rotation', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/plans', {
        method: 'POST',
        body: JSON.stringify({ year: 2025, calendarWeek: 5, rotationWeekNr: 1 }),
      }) as any
    );
    const data = await res.json();
    expect(data.days).toHaveLength(7);
  });

  it('returns 400 without required fields', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/plans', {
        method: 'POST',
        body: JSON.stringify({ year: 2025 }),
      }) as any
    );
    expect(res.status).toBe(400);
  });
});
