import { describe, it, expect, beforeEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import { createTestDb, seedTestDb } from '../../../../test/db-setup';

const dbHolder = vi.hoisted(() => {
  return { db: null as Database.Database | null };
});

vi.mock('@/lib/db', () => ({
  getDb: () => dbHolder.db!,
}));

vi.mock('@/lib/seed', () => ({
  seedDatabase: () => {},
}));

const { GET, POST } = await import('./route');

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

function insertPlan() {
  dbHolder.db!.exec(`
    INSERT INTO weekly_plans (id, year, calendar_week, day_of_week, meal, location, soup_id)
    VALUES (1, 2025, 5, 1, 'mittag', 'city', 1);
  `);
}

describe('GET /api/temperatures', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    insertPlan();
  });

  it('returns 400 without year and week', async () => {
    const res = await GET(makeRequest('http://localhost/api/temperatures') as any);
    expect(res.status).toBe(400);
  });

  it('returns empty array when no temperatures', async () => {
    const res = await GET(makeRequest('http://localhost/api/temperatures?year=2025&week=5') as any);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it('returns temperatures after POST', async () => {
    await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          dishSlot: 'soup', tempCore: '75', tempServing: '68',
        }),
      }) as any
    );

    const res = await GET(makeRequest('http://localhost/api/temperatures?year=2025&week=5') as any);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].temp_core).toBe('75');
    expect(data[0].temp_serving).toBe('68');
  });
});

describe('POST /api/temperatures', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    insertPlan();
  });

  it('inserts a new temperature', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          dishSlot: 'soup', tempCore: '72', tempServing: '65',
        }),
      }) as any
    );
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it('updates existing temperature (upsert)', async () => {
    await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          dishSlot: 'soup', tempCore: '72', tempServing: '65',
        }),
      }) as any
    );

    await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          dishSlot: 'soup', tempCore: '78', tempServing: '70',
        }),
      }) as any
    );

    const rows = dbHolder.db!.prepare('SELECT * FROM temperature_logs').all() as any[];
    expect(rows).toHaveLength(1);
    expect(rows[0].temp_core).toBe('78');
  });

  it('returns 400 for missing fields', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({ year: 2025 }),
      }) as any
    );
    expect(res.status).toBe(400);
  });

  it('rejects invalid dishSlot', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({
          year: 2025, calendarWeek: 5, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          dishSlot: 'invalid_slot', tempCore: '72',
        }),
      }) as any
    );
    expect(res.status).toBe(400);
  });

  it('returns 404 when plan does not exist', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/temperatures', {
        method: 'POST',
        body: JSON.stringify({
          year: 2025, calendarWeek: 99, dayOfWeek: 1,
          meal: 'mittag', location: 'city',
          dishSlot: 'soup', tempCore: '72',
        }),
      }) as any
    );
    expect(res.status).toBe(404);
  });
});
