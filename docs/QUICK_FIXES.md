# Quick Fixes - Sofort umsetzbar

Diese Fixes können Sie **HEUTE** implementieren (Gesamtaufwand: ~3-4 Stunden)

---

## 1. SQL-INJECTION FIX (15 Minuten) 🚨 KRITISCH

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\app\api\plans\route.ts`

**Zeile 36-59** - Ersetze die PUT-Funktion:

```typescript
export async function PUT(request: NextRequest) {
  ensureDb();
  const db = getDb();
  const body = await request.json();
  const { year, calendarWeek, dayOfWeek, meal, location, slot, dishId } = body;

  if (!year || !calendarWeek || dayOfWeek === undefined || !meal || !location || !slot) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
  }

  // ✅ WHITELIST FÜR SLOTS - VERHINDERT SQL-INJECTION
  const ALLOWED_SLOTS = ['soup', 'main1', 'side1a', 'side1b', 'main2', 'side2a', 'side2b', 'dessert'];
  if (!ALLOWED_SLOTS.includes(slot)) {
    return NextResponse.json({ error: 'Ungültiger Slot' }, { status: 400 });
  }

  // Ensure plan exists
  const plan = getWeeklyPlan(year, calendarWeek);
  if (!plan) {
    const rotWeekNr = ((calendarWeek - 1) % 6) + 1;
    generateWeekFromRotation(year, calendarWeek, rotWeekNr);
  }

  const column = `${slot}_id`;
  db.prepare(
    `UPDATE weekly_plans SET ${column} = ? WHERE year = ? AND calendar_week = ? AND day_of_week = ? AND meal = ? AND location = ?`
  ).run(dishId || null, year, calendarWeek, dayOfWeek, meal, location);

  return NextResponse.json({ ok: true });
}
```

**Was geändert wurde:**
- Hinzugefügt: `ALLOWED_SLOTS` Whitelist
- Hinzugefügt: Validierung `if (!ALLOWED_SLOTS.includes(slot))`

---

## 2. ALLERGENE KORRIGIEREN (1-2 Stunden) 🚨 RECHTLICH KRITISCH

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\lib\seed.ts`

**Zeile 10-106** - Ersetze das komplette `DISHES` Array mit dem korrigierten aus `ALLERGEN_CORRECTIONS.md`

Oder manuelle Änderungen:

```typescript
// ZEILE 17 - Nudelsuppe
{ name: 'Nudelsuppe', category: 'suppe', allergens: 'ACGL' },  // war: 'ACG'

// ZEILE 19 - Grießnockerlsuppe
{ name: 'Grießnockerlsuppe', category: 'suppe', allergens: 'ACEG' },  // war: 'ACG'

// ZEILE 29 - Rindsgeschnetzeltes
{ name: 'Rindsgeschnetzeltes', category: 'fleisch', allergens: 'AGL' },  // war: 'ACG'

// ZEILE 30 - Hühnerfilet
{ name: 'Hühnerfilet', category: 'fleisch', allergens: 'A' },  // war: 'AG'

// ZEILE 31 - Hühnerstreifen
{ name: 'Hühnerstreifen', category: 'fleisch', allergens: 'ACG' },  // war: 'AG'

// ZEILE 32 - Hühnergeschnetzeltes
{ name: 'Hühnergeschnetzeltes', category: 'fleisch', allergens: 'AGL' },  // war: 'AG'

// ZEILE 34 - Puten-Rahmgeschnetzeltes
{ name: 'Puten-Rahmgeschnetzeltes', category: 'fleisch', allergens: 'ACGL' },  // war: 'ACG'

// ZEILE 36 - Rindsgulasch
{ name: 'Rindsgulasch', category: 'fleisch', allergens: 'AL' },  // war: 'A'

// ZEILE 38 - Gemüse-Hühnercurry
{ name: 'Gemüse-Hühnercurry', category: 'fleisch', allergens: 'AGFL' },  // war: 'AGF'

// ZEILE 40 - Korma-Hühnerkeule
{ name: 'Korma-Hühnerkeule', category: 'fleisch', allergens: 'AGFHL' },  // war: 'AGH'

// ZEILE 42 - Spaghetti Bolognaise
{ name: 'Spaghetti Bolognaise', category: 'fleisch', allergens: 'ACGL' },  // war: 'ACG'

// ZEILE 66 - Kartoffelrösti
{ name: 'Kartoffelrösti', category: 'vegetarisch', allergens: 'ACG' },  // war: 'AG'

// ZEILE 67 - Bolognese vegetarisch
{ name: 'Bolognese vegetarisch', category: 'vegetarisch', allergens: 'AFL' },  // war: 'AF'

// ZEILE 91 - Bratensauce
{ name: 'Bratensauce', category: 'beilage', allergens: 'AL' },  // war: 'A'
```

**Anwenden:**
1. Datei editieren
2. Datenbank löschen: `rm C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\data\menuplan.db`
3. Server neu starten: `npm run dev`
4. Browser öffnen → Datenbank wird neu geseeded

---

## 3. INPUT-VALIDIERUNG (1 Stunde)

### A) Dishes API

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\app\api\dishes\route.ts`

**Zeile 24-39** - POST-Funktion mit Validierung:

```typescript
export async function POST(request: NextRequest) {
  ensureDb();
  const db = getDb();
  const body = await request.json();
  const { name, category, allergens, season } = body;

  // ✅ VALIDIERUNG
  if (!name || !category) {
    return NextResponse.json({ error: 'Name und Kategorie erforderlich' }, { status: 400 });
  }

  const VALID_CATEGORIES = ['suppe','fleisch','fisch','vegetarisch','dessert','beilage'];
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: `Ungültige Kategorie. Erlaubt: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 });
  }

  if (allergens && !/^[A-Z]*$/.test(allergens)) {
    return NextResponse.json({ error: 'Allergene müssen Großbuchstaben sein (z.B. ACG)' }, { status: 400 });
  }

  const VALID_SEASONS = ['all', 'summer', 'winter'];
  const finalSeason = season && VALID_SEASONS.includes(season) ? season : 'all';

  const result = db.prepare(
    'INSERT INTO dishes (name, category, allergens, season) VALUES (?, ?, ?, ?)'
  ).run(name, category, allergens || '', finalSeason);

  return NextResponse.json({ id: result.lastInsertRowid, name, category, allergens, season: finalSeason });
}
```

### B) OCR API

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\app\api\ocr\route.ts`

**Zeile 10-25** - POST mit Validierung:

```typescript
export async function POST(request: NextRequest) {
  ensureDb();
  const db = getDb();
  const body = await request.json();
  const { date, location, meal_type, count } = body;

  // ✅ VALIDIERUNG
  if (!date || !location || !meal_type || count === undefined) {
    return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Datum muss Format YYYY-MM-DD haben' }, { status: 400 });
  }

  const VALID_LOCATIONS = ['city', 'sued'];
  if (!VALID_LOCATIONS.includes(location)) {
    return NextResponse.json({ error: 'Location muss "city" oder "sued" sein' }, { status: 400 });
  }

  const VALID_MEAL_TYPES = ['mittag', 'abend'];
  if (!VALID_MEAL_TYPES.includes(meal_type)) {
    return NextResponse.json({ error: 'meal_type muss "mittag" oder "abend" sein' }, { status: 400 });
  }

  if (typeof count !== 'number' || count < 0 || count > 1000) {
    return NextResponse.json({ error: 'count muss Zahl zwischen 0 und 1000 sein' }, { status: 400 });
  }

  const result = db.prepare(
    'INSERT INTO guest_counts (date, location, meal_type, count, source) VALUES (?, ?, ?, ?, ?)'
  ).run(date, location, meal_type, count, 'ocr');

  return NextResponse.json({ id: result.lastInsertRowid });
}
```

---

## 4. PRINT-LAYOUT SCHRIFTGRÖSSE (30 Minuten)

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\app\druck\page.tsx`

**Zeile 56** - Schriftgröße erhöhen:

```tsx
{/* VORHER: */}
<div className="print:block" style={{ fontSize: '6.5pt' }}>

{/* NACHHER: */}
<div className="print:block" style={{ fontSize: '8.5pt', lineHeight: '1.25' }}>
```

**Zeile 140-156** - Zeilenhöhe für bessere Lesbarkeit:

```tsx
{/* In jeder td, ändere: */}
style={{ lineHeight: '1.1' }}

{/* ZU: */}
style={{ lineHeight: '1.3', padding: '2px 4px' }}
```

**Zeile 151-152** - Allergene fetter machen:

```tsx
{/* VORHER: */}
<td key={`a_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border text-center text-red-600" style={{ lineHeight: '1.1' }}>

{/* NACHHER: */}
<td key={`a_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border text-center text-red-600 font-bold" style={{ lineHeight: '1.3', fontSize: '9pt' }}>
```

---

## 5. WOCHENKALKULATION FIX (10 Minuten)

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\app\page.tsx`

**Zeile 20-25** - Ersetze mit ISO-Woche:

```typescript
useEffect(() => {
  const now = new Date();
  setCurrentYear(now.getFullYear());

  // ✅ ISO 8601 Wochenkalkulation
  const currentWeek = getISOWeek(now);
  setCurrentWeek(currentWeek);

  fetch('/api/init').then(() => {
    fetch('/api/events').then(r => r.json()).then(setEvents);
  });
}, []);

// ✅ ISO-Woche korrekt berechnen
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
```

---

## 6. ERROR HANDLING (30 Minuten)

**Beispiel:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\app\gerichte\page.tsx`

**Zeile 34-36** - Mit Error Handling:

```typescript
// VORHER:
function loadDishes() {
  fetch('/api/dishes').then(r => r.json()).then(setDishes);
}

// NACHHER:
const [error, setError] = useState<string | null>(null);

function loadDishes() {
  setError(null);
  fetch('/api/dishes')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    })
    .then(setDishes)
    .catch(err => {
      console.error('Fehler beim Laden der Gerichte:', err);
      setError('Gerichte konnten nicht geladen werden. Bitte neu laden.');
    });
}

// In JSX (nach Zeile 63):
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {error}
  </div>
)}
```

**Gleiche Änderung in:**
- `src/app/events/page.tsx`
- `src/app/wochenplan/page.tsx`
- `src/app/rotation/page.tsx`

---

## 7. CONSTANTS DEDUPLIZIERUNG (5 Minuten)

**Datei:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\src\lib\constants.ts`

**Füge hinzu:**

```typescript
// Client-safe constants (no server dependencies)
export const DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
export const DAY_NAMES_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

// ✅ NEU: Slot-Labels
export const SLOT_LABELS = ['Suppe', 'Haupt 1', 'Beilage', 'Beilage', 'Haupt 2', 'Beilage', 'Beilage', 'Dessert'];
export const SLOT_KEYS = ['soup', 'main1', 'side1a', 'side1b', 'main2', 'side2a', 'side2b', 'dessert'] as const;
```

**Dann in:**
- `src/app/druck/page.tsx` (Zeile 20)
- `src/app/api/export/route.ts` (Zeile 11)

**Ersetze:**
```typescript
const SLOT_LABELS = ['Suppe', ...];
```

**Mit:**
```typescript
import { SLOT_LABELS } from '@/lib/constants';
```

---

## TESTING NACH FIXES

Nach jedem Fix, teste:

```bash
# 1. Clean build
cd C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app
rm -rf data/menuplan.db
npm run dev

# 2. Test in Browser
# - http://localhost:3000 → Dashboard laden
# - http://localhost:3000/gerichte → Gerichte anzeigen
# - http://localhost:3000/wochenplan → Wochenplan generieren
# - http://localhost:3000/druck → Print-Layout prüfen
# - http://localhost:3000/felix → OCR testen (optional)

# 3. Test SQL-Injection Fix
# In Browser Console:
fetch('/api/plans', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    year: 2026, calendarWeek: 5, dayOfWeek: 1,
    meal: 'mittag', location: 'city',
    slot: 'INVALID_SLOT',  // ✅ Sollte Fehler werfen
    dishId: 1
  })
}).then(r => r.json()).then(console.log);
// Erwartete Antwort: {"error":"Ungültiger Slot"}
```

---

## CHECKLISTE

- [ ] SQL-Injection Fix (15min)
- [ ] Allergene korrigieren (1-2h)
- [ ] Input-Validierung Dishes API (15min)
- [ ] Input-Validierung OCR API (15min)
- [ ] Print-Layout Schriftgröße (30min)
- [ ] Wochenkalkulation ISO-Fix (10min)
- [ ] Error Handling (30min)
- [ ] Constants Deduplizierung (5min)
- [ ] Testing (30min)

**GESAMTZEIT: ~4 Stunden**

---

**Nach diesen Fixes ist die App produktionsreif für internen Einsatz!**

Nächste Schritte (nicht dringend):
- Felix OCR verbessern (1 Tag)
- AK-Integration (3-4 Tage)
- Temperature Logging (1 Tag)
- Tests schreiben (2-3 Tage)
