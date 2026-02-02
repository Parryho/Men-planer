import { getDb } from './db';
export { DAY_NAMES, DAY_NAMES_SHORT } from './constants';

export interface MealSlot {
  id?: number;
  soup: { id: number; name: string; allergens: string } | null;
  main1: { id: number; name: string; allergens: string } | null;
  side1a: { id: number; name: string; allergens: string } | null;
  side1b: { id: number; name: string; allergens: string } | null;
  main2: { id: number; name: string; allergens: string } | null;
  side2a: { id: number; name: string; allergens: string } | null;
  side2b: { id: number; name: string; allergens: string } | null;
  dessert: { id: number; name: string; allergens: string } | null;
}

export interface DayPlan {
  dayOfWeek: number;
  date?: string;
  mittag: { city: MealSlot; sued: MealSlot };
  abend: { city: MealSlot; sued: MealSlot };
}

export interface WeekPlan {
  weekNr: number;
  calendarWeek?: number;
  year?: number;
  days: DayPlan[];
}

function buildMealSlot(row: Record<string, unknown>): MealSlot {
  const get = (prefix: string) => {
    const id = row[`${prefix}_id`] as number | null;
    const name = row[`${prefix}_name`] as string | null;
    const allergens = row[`${prefix}_allergens`] as string | null;
    if (!id) return null;
    return { id, name: name || '', allergens: allergens || '' };
  };
  return {
    id: row.id as number | undefined,
    soup: get('soup'),
    main1: get('main1'),
    side1a: get('side1a'),
    side1b: get('side1b'),
    main2: get('main2'),
    side2a: get('side2a'),
    side2b: get('side2b'),
    dessert: get('dessert'),
  };
}

const ROTATION_QUERY = `
  SELECT r.*,
    s.name as soup_name, s.allergens as soup_allergens,
    m1.name as main1_name, m1.allergens as main1_allergens,
    s1a.name as side1a_name, s1a.allergens as side1a_allergens,
    s1b.name as side1b_name, s1b.allergens as side1b_allergens,
    m2.name as main2_name, m2.allergens as main2_allergens,
    s2a.name as side2a_name, s2a.allergens as side2a_allergens,
    s2b.name as side2b_name, s2b.allergens as side2b_allergens,
    d.name as dessert_name, d.allergens as dessert_allergens
  FROM rotation_weeks r
  LEFT JOIN dishes s ON r.soup_id = s.id
  LEFT JOIN dishes m1 ON r.main1_id = m1.id
  LEFT JOIN dishes s1a ON r.side1a_id = s1a.id
  LEFT JOIN dishes s1b ON r.side1b_id = s1b.id
  LEFT JOIN dishes m2 ON r.main2_id = m2.id
  LEFT JOIN dishes s2a ON r.side2a_id = s2a.id
  LEFT JOIN dishes s2b ON r.side2b_id = s2b.id
  LEFT JOIN dishes d ON r.dessert_id = d.id
`;

export function getRotationWeek(weekNr: number): WeekPlan {
  const db = getDb();
  const rows = db.prepare(`${ROTATION_QUERY} WHERE r.week_nr = ? ORDER BY r.day_of_week, r.meal, r.location`).all(weekNr) as Record<string, unknown>[];

  const days: DayPlan[] = [];
  const emptySlot = (): MealSlot => ({ soup: null, main1: null, side1a: null, side1b: null, main2: null, side2a: null, side2b: null, dessert: null });

  for (let dow = 0; dow <= 6; dow++) {
    const day: DayPlan = {
      dayOfWeek: dow,
      mittag: { city: emptySlot(), sued: emptySlot() },
      abend: { city: emptySlot(), sued: emptySlot() },
    };
    for (const row of rows) {
      if ((row.day_of_week as number) !== dow) continue;
      const meal = row.meal as 'mittag' | 'abend';
      const loc = row.location as 'city' | 'sued';
      day[meal][loc] = buildMealSlot(row);
    }
    days.push(day);
  }

  return { weekNr, days };
}

export function getWeeklyPlan(year: number, calendarWeek: number): WeekPlan | null {
  const db = getDb();
  const rows = db.prepare(`
    SELECT wp.*,
      s.name as soup_name, s.allergens as soup_allergens,
      m1.name as main1_name, m1.allergens as main1_allergens,
      s1a.name as side1a_name, s1a.allergens as side1a_allergens,
      s1b.name as side1b_name, s1b.allergens as side1b_allergens,
      m2.name as main2_name, m2.allergens as main2_allergens,
      s2a.name as side2a_name, s2a.allergens as side2a_allergens,
      s2b.name as side2b_name, s2b.allergens as side2b_allergens,
      d.name as dessert_name, d.allergens as dessert_allergens
    FROM weekly_plans wp
    LEFT JOIN dishes s ON wp.soup_id = s.id
    LEFT JOIN dishes m1 ON wp.main1_id = m1.id
    LEFT JOIN dishes s1a ON wp.side1a_id = s1a.id
    LEFT JOIN dishes s1b ON wp.side1b_id = s1b.id
    LEFT JOIN dishes m2 ON wp.main2_id = m2.id
    LEFT JOIN dishes s2a ON wp.side2a_id = s2a.id
    LEFT JOIN dishes s2b ON wp.side2b_id = s2b.id
    LEFT JOIN dishes d ON wp.dessert_id = d.id
    WHERE wp.year = ? AND wp.calendar_week = ?
    ORDER BY wp.day_of_week, wp.meal, wp.location
  `).all(year, calendarWeek) as Record<string, unknown>[];

  if (rows.length === 0) return null;

  const emptySlot = (): MealSlot => ({ soup: null, main1: null, side1a: null, side1b: null, main2: null, side2a: null, side2b: null, dessert: null });
  const days: DayPlan[] = [];
  for (let dow = 0; dow <= 6; dow++) {
    const day: DayPlan = {
      dayOfWeek: dow,
      mittag: { city: emptySlot(), sued: emptySlot() },
      abend: { city: emptySlot(), sued: emptySlot() },
    };
    for (const row of rows) {
      if ((row.day_of_week as number) !== dow) continue;
      const meal = row.meal as 'mittag' | 'abend';
      const loc = row.location as 'city' | 'sued';
      day[meal][loc] = buildMealSlot(row);
    }
    days.push(day);
  }

  return { weekNr: (rows[0].rotation_week_nr as number) || 0, calendarWeek, year, days };
}

export function generateWeekFromRotation(year: number, calendarWeek: number, rotationWeekNr: number) {
  const db = getDb();
  const rotation = getRotationWeek(rotationWeekNr);

  const insertPlan = db.prepare(`
    INSERT OR REPLACE INTO weekly_plans (year, calendar_week, day_of_week, meal, location, soup_id, main1_id, side1a_id, side1b_id, main2_id, side2a_id, side2b_id, dessert_id, rotation_week_nr)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const gen = db.transaction(() => {
    for (const day of rotation.days) {
      for (const meal of ['mittag', 'abend'] as const) {
        for (const loc of ['city', 'sued'] as const) {
          const slot = day[meal][loc];
          insertPlan.run(
            year, calendarWeek, day.dayOfWeek, meal, loc,
            slot.soup?.id || null,
            slot.main1?.id || null,
            slot.side1a?.id || null,
            slot.side1b?.id || null,
            slot.main2?.id || null,
            slot.side2a?.id || null,
            slot.side2b?.id || null,
            slot.dessert?.id || null,
            rotationWeekNr
          );
        }
      }
    }
  });

  gen();
}
