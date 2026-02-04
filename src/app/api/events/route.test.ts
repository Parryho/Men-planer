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

const { GET, POST, PUT, DELETE: DELETE_HANDLER } = await import('./route');

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe('POST /api/events', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
  });

  it('creates a new event', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/events', {
        method: 'POST',
        body: JSON.stringify({ date: '2025-03-15', event_type: 'brunch', pax: 50, description: 'Test' }),
      }) as any
    );
    const data = await res.json();
    expect(data.id).toBeTruthy();
  });

  it('returns 400 without date', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/events', {
        method: 'POST',
        body: JSON.stringify({ event_type: 'brunch' }),
      }) as any
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid event type', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/events', {
        method: 'POST',
        body: JSON.stringify({ date: '2025-03-15', event_type: 'party' }),
      }) as any
    );
    expect(res.status).toBe(400);
  });

  it('accepts all valid event types', async () => {
    const types = ['brunch', 'ball', 'buffet', 'bankett', 'empfang', 'seminar', 'sonstiges'];
    for (const event_type of types) {
      const res = await POST(
        makeRequest('http://localhost/api/events', {
          method: 'POST',
          body: JSON.stringify({ date: '2025-03-15', event_type }),
        }) as any
      );
      expect(res.status).toBe(200);
    }
  });
});

describe('GET /api/events', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec(`
      INSERT INTO ak_events (id, date, event_type, pax, status) VALUES
        (1, '2025-03-10', 'brunch', 40, 'geplant'),
        (2, '2025-03-15', 'ball', 200, 'bestaetigt'),
        (3, '2025-04-01', 'seminar', 30, 'geplant');
    `);
  });

  it('returns all events', async () => {
    const res = await GET(makeRequest('http://localhost/api/events') as any);
    const data = await res.json();
    expect(data).toHaveLength(3);
  });

  it('filters by date range', async () => {
    const res = await GET(makeRequest('http://localhost/api/events?from=2025-03-01&to=2025-03-31') as any);
    const data = await res.json();
    expect(data).toHaveLength(2);
  });

  it('returns single event with menu items', async () => {
    const res = await GET(makeRequest('http://localhost/api/events?id=1') as any);
    const data = await res.json();
    expect(data.id).toBe(1);
    expect(data.menu_items).toEqual([]);
  });

  it('returns 404 for non-existent event', async () => {
    const res = await GET(makeRequest('http://localhost/api/events?id=999') as any);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/events', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec("INSERT INTO ak_events (id, date, event_type, pax) VALUES (1, '2025-03-10', 'brunch', 40)");
  });

  it('updates an event', async () => {
    const res = await PUT(
      makeRequest('http://localhost/api/events', {
        method: 'PUT',
        body: JSON.stringify({ id: 1, date: '2025-03-11', event_type: 'buffet', pax: 60, status: 'bestaetigt' }),
      }) as any
    );
    const data = await res.json();
    expect(data.ok).toBe(true);

    const event = dbHolder.db!.prepare('SELECT * FROM ak_events WHERE id = 1').get() as any;
    expect(event.event_type).toBe('buffet');
    expect(event.pax).toBe(60);
  });

  it('returns 400 without id', async () => {
    const res = await PUT(
      makeRequest('http://localhost/api/events', {
        method: 'PUT',
        body: JSON.stringify({ date: '2025-03-11', event_type: 'buffet' }),
      }) as any
    );
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/events', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
    dbHolder.db.exec("INSERT INTO ak_events (id, date, event_type) VALUES (1, '2025-03-10', 'brunch')");
  });

  it('deletes an event', async () => {
    const res = await DELETE_HANDLER(makeRequest('http://localhost/api/events?id=1') as any);
    const data = await res.json();
    expect(data.ok).toBe(true);

    const event = dbHolder.db!.prepare('SELECT * FROM ak_events WHERE id = 1').get();
    expect(event).toBeUndefined();
  });
});
