import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

function ensureDb() {
  seedDatabase();
}

// Airtable API integration
// Configure via environment variables:
// AIRTABLE_API_KEY = your personal access token
// AIRTABLE_BASE_ID = your base ID (starts with app...)
// AIRTABLE_TABLE_NAME = table name (default: "Events")

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Events';

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// GET: Sync events from Airtable
export async function GET(request: NextRequest) {
  ensureDb();
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';

  if (action === 'status') {
    return NextResponse.json({
      configured: !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID),
      baseId: AIRTABLE_BASE_ID ? `${AIRTABLE_BASE_ID.slice(0, 6)}...` : '',
      tableName: AIRTABLE_TABLE_NAME,
    });
  }

  if (action === 'sync') {
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json({
        error: 'Airtable nicht konfiguriert. Setze AIRTABLE_API_KEY und AIRTABLE_BASE_ID in .env.local',
      }, { status: 400 });
    }

    try {
      const records = await fetchAllAirtableRecords();
      const result = syncToDatabase(records);
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({
        error: `Airtable-Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
      }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unbekannte Aktion' }, { status: 400 });
}

// POST: Manual field mapping configuration
export async function POST(request: NextRequest) {
  ensureDb();
  const body = await request.json();
  const { apiKey, baseId, tableName, fieldMapping } = body;

  // Test connection with provided credentials
  const testKey = apiKey || AIRTABLE_API_KEY;
  const testBase = baseId || AIRTABLE_BASE_ID;
  const testTable = tableName || AIRTABLE_TABLE_NAME;

  if (!testKey || !testBase) {
    return NextResponse.json({ error: 'API Key und Base ID erforderlich' }, { status: 400 });
  }

  try {
    const url = `https://api.airtable.com/v0/${testBase}/${encodeURIComponent(testTable)}?maxRecords=1`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${testKey}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: `Airtable Verbindung fehlgeschlagen: ${response.status} - ${errorText}`,
      }, { status: 400 });
    }

    const data = await response.json() as AirtableResponse;
    const sampleFields = data.records.length > 0 ? Object.keys(data.records[0].fields) : [];

    return NextResponse.json({
      ok: true,
      message: 'Verbindung erfolgreich',
      availableFields: sampleFields,
      recordCount: data.records.length,
      fieldMapping: fieldMapping || getDefaultFieldMapping(sampleFields),
    });
  } catch (err) {
    return NextResponse.json({
      error: `Verbindungsfehler: ${err instanceof Error ? err.message : 'Unbekannt'}`,
    }, { status: 500 });
  }
}

async function fetchAllAirtableRecords(): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`);
    if (offset) url.searchParams.set('offset', offset);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });

    if (!response.ok) {
      throw new Error(`Airtable API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as AirtableResponse;
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

function getDefaultFieldMapping(fields: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const fieldLower = fields.map(f => ({ original: f, lower: f.toLowerCase() }));

  const autoMap: [string, string[]][] = [
    ['date', ['datum', 'date', 'termin']],
    ['event_type', ['typ', 'type', 'event_type', 'eventtyp', 'art']],
    ['pax', ['pax', 'personen', 'guests', 'gaeste', 'anzahl']],
    ['time_start', ['von', 'start', 'beginn', 'time_start', 'uhrzeit']],
    ['time_end', ['bis', 'end', 'ende', 'time_end']],
    ['contact_person', ['kontakt', 'contact', 'ansprechperson', 'ansprechpartner']],
    ['room', ['raum', 'room', 'saal', 'location']],
    ['description', ['beschreibung', 'description', 'name', 'titel', 'title']],
    ['menu_notes', ['menu', 'menue', 'notizen', 'notes', 'menu_notes', 'bemerkung']],
    ['status', ['status', 'zustand', 'state']],
  ];

  for (const [dbField, searchTerms] of autoMap) {
    const match = fieldLower.find(f => searchTerms.some(term => f.lower.includes(term)));
    if (match) mapping[dbField] = match.original;
  }

  return mapping;
}

function syncToDatabase(records: AirtableRecord[]): { synced: number; created: number; updated: number; errors: string[] } {
  const db = getDb();
  const errors: string[] = [];
  let created = 0;
  let updated = 0;

  // Default field mapping (can be configured via POST)
  const fields = Object.keys(records[0]?.fields || {});
  const mapping = getDefaultFieldMapping(fields);

  const getField = (record: AirtableRecord, dbField: string): string => {
    const airtableField = mapping[dbField];
    if (!airtableField) return '';
    const val = record.fields[airtableField];
    if (val === null || val === undefined) return '';
    return String(val);
  };

  // Valid event types for our DB
  const VALID_TYPES = ['brunch', 'ball', 'buffet', 'bankett', 'empfang', 'seminar', 'sonstiges'];

  for (const record of records) {
    try {
      const date = getField(record, 'date');
      let eventType = getField(record, 'event_type').toLowerCase();
      const pax = parseInt(getField(record, 'pax')) || 0;

      if (!date) {
        errors.push(`Record ${record.id}: Kein Datum`);
        continue;
      }

      // Map event type to valid value
      if (!VALID_TYPES.includes(eventType)) {
        if (eventType.includes('brunch')) eventType = 'brunch';
        else if (eventType.includes('ball')) eventType = 'ball';
        else if (eventType.includes('buffet')) eventType = 'buffet';
        else if (eventType.includes('bankett')) eventType = 'bankett';
        else if (eventType.includes('empfang')) eventType = 'empfang';
        else if (eventType.includes('seminar')) eventType = 'seminar';
        else eventType = 'sonstiges';
      }

      // Check if already synced
      const existing = db.prepare('SELECT id FROM ak_events WHERE airtable_id = ?').get(record.id) as { id: number } | undefined;

      if (existing) {
        db.prepare(`
          UPDATE ak_events SET date = ?, event_type = ?, pax = ?, time_start = ?, time_end = ?,
            contact_person = ?, room = ?, description = ?, menu_notes = ?, status = ?
          WHERE id = ?
        `).run(
          date, eventType, pax,
          getField(record, 'time_start'), getField(record, 'time_end'),
          getField(record, 'contact_person'), getField(record, 'room'),
          getField(record, 'description'), getField(record, 'menu_notes'),
          getField(record, 'status') || 'geplant',
          existing.id
        );
        updated++;
      } else {
        db.prepare(`
          INSERT INTO ak_events (date, event_type, pax, time_start, time_end, contact_person, room, description, menu_notes, status, airtable_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          date, eventType, pax,
          getField(record, 'time_start'), getField(record, 'time_end'),
          getField(record, 'contact_person'), getField(record, 'room'),
          getField(record, 'description'), getField(record, 'menu_notes'),
          getField(record, 'status') || 'geplant',
          record.id
        );
        created++;
      }
    } catch (err) {
      errors.push(`Record ${record.id}: ${err instanceof Error ? err.message : 'Fehler'}`);
    }
  }

  return { synced: records.length, created, updated, errors };
}
