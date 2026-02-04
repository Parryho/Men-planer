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

describe('GET /api/dishes', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
  });

  it('returns all dishes', async () => {
    const res = await GET(makeRequest('http://localhost/api/dishes') as any);
    const data = await res.json();
    expect(data).toHaveLength(10);
  });

  it('filters by category', async () => {
    const res = await GET(makeRequest('http://localhost/api/dishes?category=suppe') as any);
    const data = await res.json();
    expect(data).toHaveLength(2);
    for (const d of data) {
      expect(d.category).toBe('suppe');
    }
  });

  it('returns single dish for fisch category', async () => {
    const res = await GET(makeRequest('http://localhost/api/dishes?category=fisch') as any);
    const data = await res.json();
    expect(data).toHaveLength(1);
  });
});

describe('POST /api/dishes', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
  });

  it('creates a new dish', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/dishes', {
        method: 'POST',
        body: JSON.stringify({ name: 'Neues Gericht', category: 'fleisch', allergens: 'AG' }),
      }) as any
    );
    const data = await res.json();
    expect(data.name).toBe('Neues Gericht');
    expect(data.id).toBeTruthy();
  });

  it('returns 400 without name', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/dishes', {
        method: 'POST',
        body: JSON.stringify({ category: 'fleisch' }),
      }) as any
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 without category', async () => {
    const res = await POST(
      makeRequest('http://localhost/api/dishes', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      }) as any
    );
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/dishes', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
  });

  it('updates an existing dish', async () => {
    const res = await PUT(
      makeRequest('http://localhost/api/dishes', {
        method: 'PUT',
        body: JSON.stringify({ id: 1, name: 'Updated Suppe', category: 'suppe', allergens: 'A' }),
      }) as any
    );
    const data = await res.json();
    expect(data.name).toBe('Updated Suppe');

    const dish = dbHolder.db!.prepare('SELECT name FROM dishes WHERE id = 1').get() as { name: string };
    expect(dish.name).toBe('Updated Suppe');
  });

  it('returns 400 without id', async () => {
    const res = await PUT(
      makeRequest('http://localhost/api/dishes', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Test', category: 'suppe' }),
      }) as any
    );
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/dishes', () => {
  beforeEach(() => {
    dbHolder.db = createTestDb();
    seedTestDb(dbHolder.db);
  });

  it('deletes a dish', async () => {
    const res = await DELETE_HANDLER(makeRequest('http://localhost/api/dishes?id=1') as any);
    const data = await res.json();
    expect(data.ok).toBe(true);

    const dish = dbHolder.db!.prepare('SELECT * FROM dishes WHERE id = 1').get();
    expect(dish).toBeUndefined();
  });

  it('returns 400 without id', async () => {
    const res = await DELETE_HANDLER(makeRequest('http://localhost/api/dishes') as any);
    expect(res.status).toBe(400);
  });
});
