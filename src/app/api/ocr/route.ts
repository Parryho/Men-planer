export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Save OCR-extracted guest counts
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { date, location, meal_type, count } = body;

    if (!date || !location || !meal_type || count === undefined) {
      return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
    }

    const result = db.prepare(
      'INSERT INTO guest_counts (date, location, meal_type, count, source) VALUES (?, ?, ?, ?, ?)'
    ).run(date, location, meal_type, count, 'ocr');

    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error('POST /api/ocr error:', err);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}

// Calculate ISO week date range
function getWeekDateRange(year: number, week: number): { from: string; to: string } {
  // ISO week: week 1 contains the first Thursday of the year
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7; // Mon=1..Sun=7
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  return { from: formatDate(monday), to: formatDate(sunday) };
}

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const year = searchParams.get('year');
    const week = searchParams.get('week');

    let counts;

    // Support year/week parameters for calendar week lookup
    if (year && week) {
      const range = getWeekDateRange(parseInt(year), parseInt(week));
      counts = db.prepare(
        'SELECT * FROM guest_counts WHERE date >= ? AND date <= ? ORDER BY date, location, meal_type'
      ).all(range.from, range.to);
    } else if (from && to) {
      counts = db.prepare('SELECT * FROM guest_counts WHERE date >= ? AND date <= ? ORDER BY date, location, meal_type').all(from, to);
    } else if (date) {
      counts = db.prepare('SELECT * FROM guest_counts WHERE date = ? ORDER BY location, meal_type').all(date);
    } else {
      counts = db.prepare('SELECT * FROM guest_counts ORDER BY date DESC LIMIT 100').all();
    }
    return NextResponse.json(counts);
  } catch (err) {
    console.error('GET /api/ocr error:', err);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
