import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';

function createFreshDb(): Database.Database {
  const db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  return db;
}

function applySchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('suppe','fleisch','fisch','vegetarisch','dessert','beilage')),
      allergens TEXT DEFAULT '',
      season TEXT DEFAULT 'all' CHECK(season IN ('all','summer','winter')),
      prep_instructions TEXT DEFAULT '',
      prep_time_minutes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS rotation_weeks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_nr INTEGER NOT NULL CHECK(week_nr BETWEEN 1 AND 6),
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      meal TEXT NOT NULL CHECK(meal IN ('mittag','abend')),
      location TEXT NOT NULL CHECK(location IN ('city','sued')),
      soup_id INTEGER REFERENCES dishes(id),
      main1_id INTEGER REFERENCES dishes(id),
      side1a_id INTEGER REFERENCES dishes(id),
      side1b_id INTEGER REFERENCES dishes(id),
      main2_id INTEGER REFERENCES dishes(id),
      side2a_id INTEGER REFERENCES dishes(id),
      side2b_id INTEGER REFERENCES dishes(id),
      dessert_id INTEGER REFERENCES dishes(id),
      UNIQUE(week_nr, day_of_week, meal, location)
    );
    CREATE TABLE IF NOT EXISTS weekly_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      calendar_week INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      meal TEXT NOT NULL CHECK(meal IN ('mittag','abend')),
      location TEXT NOT NULL CHECK(location IN ('city','sued')),
      soup_id INTEGER REFERENCES dishes(id),
      main1_id INTEGER REFERENCES dishes(id),
      side1a_id INTEGER REFERENCES dishes(id),
      side1b_id INTEGER REFERENCES dishes(id),
      main2_id INTEGER REFERENCES dishes(id),
      side2a_id INTEGER REFERENCES dishes(id),
      side2b_id INTEGER REFERENCES dishes(id),
      dessert_id INTEGER REFERENCES dishes(id),
      rotation_week_nr INTEGER,
      UNIQUE(year, calendar_week, day_of_week, meal, location)
    );
    CREATE TABLE IF NOT EXISTS temperature_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id INTEGER REFERENCES weekly_plans(id),
      dish_slot TEXT NOT NULL,
      temp_core TEXT DEFAULT '',
      temp_serving TEXT DEFAULT '',
      recorded_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ak_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      event_type TEXT NOT NULL CHECK(event_type IN ('brunch','ball','buffet','bankett','empfang','seminar','sonstiges')),
      pax INTEGER DEFAULT 0,
      time_start TEXT DEFAULT '',
      time_end TEXT DEFAULT '',
      contact_person TEXT DEFAULT '',
      room TEXT DEFAULT '',
      description TEXT DEFAULT '',
      menu_notes TEXT DEFAULT '',
      status TEXT DEFAULT 'geplant' CHECK(status IN ('geplant','bestaetigt','abgesagt','abgeschlossen')),
      airtable_id TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS ak_event_menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL REFERENCES ak_events(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK(category IN ('vorspeise','suppe','hauptgang','beilage','dessert','getrank','sonstiges')),
      dish_id INTEGER REFERENCES dishes(id),
      custom_name TEXT DEFAULT '',
      custom_allergens TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      notes TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL CHECK(category IN (
        'fleisch','fisch','gemuese','milchprodukte','trockenwaren',
        'gewuerze','eier_fette','obst','tiefkuehl','sonstiges'
      )),
      unit TEXT NOT NULL CHECK(unit IN ('g','kg','ml','l','stueck')),
      price_per_unit REAL DEFAULT 0,
      price_unit TEXT NOT NULL DEFAULT 'kg' CHECK(price_unit IN ('g','kg','ml','l','stueck')),
      supplier TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS recipe_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_id INTEGER NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
      ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL CHECK(unit IN ('g','kg','ml','l','stueck')),
      preparation_note TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      UNIQUE(dish_id, ingredient_id)
    );
    CREATE TABLE IF NOT EXISTS guest_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      location TEXT NOT NULL CHECK(location IN ('city','sued')),
      meal_type TEXT NOT NULL CHECK(meal_type IN ('mittag','abend')),
      count INTEGER NOT NULL DEFAULT 0,
      source TEXT DEFAULT 'manual' CHECK(source IN ('manual','ocr')),
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

describe('Database Schema', () => {
  it('creates all expected tables', () => {
    const db = createFreshDb();
    applySchema(db);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
    const names = tables.map(t => t.name);
    expect(names).toContain('dishes');
    expect(names).toContain('rotation_weeks');
    expect(names).toContain('weekly_plans');
    expect(names).toContain('temperature_logs');
    expect(names).toContain('ak_events');
    expect(names).toContain('ak_event_menu_items');
    expect(names).toContain('ingredients');
    expect(names).toContain('recipe_items');
    expect(names).toContain('guest_counts');
    db.close();
  });

  it('rejects invalid dish category', () => {
    const db = createFreshDb();
    applySchema(db);
    expect(() => {
      db.prepare("INSERT INTO dishes (name, category) VALUES ('test', 'invalid')").run();
    }).toThrow();
    db.close();
  });

  it('rejects invalid season', () => {
    const db = createFreshDb();
    applySchema(db);
    expect(() => {
      db.prepare("INSERT INTO dishes (name, category, season) VALUES ('test', 'suppe', 'spring')").run();
    }).toThrow();
    db.close();
  });

  it('enforces UNIQUE on rotation_weeks', () => {
    const db = createFreshDb();
    applySchema(db);
    db.prepare("INSERT INTO dishes (id, name, category) VALUES (1, 'Suppe', 'suppe')").run();
    db.prepare("INSERT INTO rotation_weeks (week_nr, day_of_week, meal, location, soup_id) VALUES (1, 1, 'mittag', 'city', 1)").run();
    expect(() => {
      db.prepare("INSERT INTO rotation_weeks (week_nr, day_of_week, meal, location, soup_id) VALUES (1, 1, 'mittag', 'city', 1)").run();
    }).toThrow();
    db.close();
  });

  it('enforces UNIQUE on weekly_plans', () => {
    const db = createFreshDb();
    applySchema(db);
    db.prepare("INSERT INTO weekly_plans (year, calendar_week, day_of_week, meal, location) VALUES (2025, 5, 1, 'mittag', 'city')").run();
    expect(() => {
      db.prepare("INSERT INTO weekly_plans (year, calendar_week, day_of_week, meal, location) VALUES (2025, 5, 1, 'mittag', 'city')").run();
    }).toThrow();
    db.close();
  });

  it('rejects invalid event type', () => {
    const db = createFreshDb();
    applySchema(db);
    expect(() => {
      db.prepare("INSERT INTO ak_events (date, event_type) VALUES ('2025-02-01', 'party')").run();
    }).toThrow();
    db.close();
  });

  it('rejects invalid event status', () => {
    const db = createFreshDb();
    applySchema(db);
    expect(() => {
      db.prepare("INSERT INTO ak_events (date, event_type, status) VALUES ('2025-02-01', 'brunch', 'invalid')").run();
    }).toThrow();
    db.close();
  });

  it('can be run idempotently (IF NOT EXISTS)', () => {
    const db = createFreshDb();
    applySchema(db);
    applySchema(db); // second time should not throw
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[];
    expect(tables.length).toBeGreaterThan(0);
    db.close();
  });
});
