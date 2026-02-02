import { getDb } from './db';

export function initializeDatabase() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('suppe','fleisch','fisch','vegetarisch','dessert','beilage')),
      allergens TEXT DEFAULT '',
      season TEXT DEFAULT 'all' CHECK(season IN ('all','summer','winter')),
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

    CREATE TABLE IF NOT EXISTS guest_counts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      location TEXT NOT NULL CHECK(location IN ('city','sued')),
      meal_type TEXT NOT NULL CHECK(meal_type IN ('mittag','abend')),
      count INTEGER NOT NULL DEFAULT 0,
      source TEXT DEFAULT 'manual' CHECK(source IN ('manual','ocr')),
      created_at TEXT DEFAULT (datetime('now'))
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
  `);

  // Migration: add new columns to ak_events if they don't exist
  const columns = db.prepare("PRAGMA table_info(ak_events)").all() as { name: string }[];
  const colNames = columns.map(c => c.name);

  const migrations: [string, string][] = [
    ['time_start', "ALTER TABLE ak_events ADD COLUMN time_start TEXT DEFAULT ''"],
    ['time_end', "ALTER TABLE ak_events ADD COLUMN time_end TEXT DEFAULT ''"],
    ['contact_person', "ALTER TABLE ak_events ADD COLUMN contact_person TEXT DEFAULT ''"],
    ['room', "ALTER TABLE ak_events ADD COLUMN room TEXT DEFAULT ''"],
    ['status', "ALTER TABLE ak_events ADD COLUMN status TEXT DEFAULT 'geplant'"],
    ['airtable_id', "ALTER TABLE ak_events ADD COLUMN airtable_id TEXT DEFAULT ''"],
  ];

  for (const [col, sql] of migrations) {
    if (!colNames.includes(col)) {
      try { db.exec(sql); } catch (e: unknown) { void e; /* column might already exist */ }
    }
  }

  // Migrate old 'time' column to 'time_start' if 'time' exists
  if (colNames.includes('time') && !colNames.includes('time_start')) {
    try { db.exec("UPDATE ak_events SET time_start = time"); } catch (e: unknown) { void e; /* ignore */ }
  }
}
