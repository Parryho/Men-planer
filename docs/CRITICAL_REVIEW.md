# Menüplan-Generator - Kritische Code-Review

**Review-Datum:** 2026-01-31
**Reviewer:** Claude (Perfectionist Architect Mode)
**Projekt:** C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\menuplan-app\

---

## Executive Summary

Die Anwendung ist **funktional und strukturiert**, hat aber **kritische Mängel** in mehreren Bereichen:
- **ALLERGEN-DATEN: Teilweise FALSCH** (höchste Priorität - rechtliches Risiko!)
- **Felix OCR: Fragil und fehleranfällig**
- **SQL-Injection Vulnerabilities vorhanden**
- **AK-Location fehlt komplett im System** (nur Tabelle, keine Integration)
- **Print-Layout: Schriftgrößen zu klein für Küchenstress**
- **Fehlende Automatisierung** (Gästezahlen → Menuplan)

**Gesamtbewertung:** 6.5/10 - Solide Basis, aber braucht Verbesserungen für Produktionseinsatz

---

## 1. ARCHITEKTUR & DATA MODEL

### ✅ Gut gelöst

1. **Schema-Design ist logisch:**
   - `dishes` - Stammdaten
   - `rotation_weeks` - 6-Wochen-Vorlagen
   - `weekly_plans` - Konkrete Wochen (generiert aus Rotation)
   - `guest_counts` - Gästezahlen aus Felix OCR
   - `ak_events` - Events für Arbeiterkammer
   - `temperature_logs` - HACCP-Temperaturen

2. **Rotation-System funktioniert:**
   - Automatische Generierung aus Rotation-Vorlagen via `generateWeekFromRotation()`
   - Modulo 6 für Rotation-Berechnung: `((week - 1) % 6) + 1`

3. **Foreign Keys aktiviert:**
   - `db.pragma('foreign_keys = ON')` in `db.ts`

4. **WAL-Modus für bessere Concurrency:**
   - `db.pragma('journal_mode = WAL')`

### ❌ Schwächen

1. **AK als Location fehlt komplett:**
   - `ak_events` Tabelle existiert, aber:
     - Keine Integration in `weekly_plans`
     - Keine Menuplanung für AK
     - CHECK constraint erlaubt nur `'city'` und `'sued'` in `location`
   - **Fix benötigt:** AK-Events brauchen eigene Menu-Struktur (nicht Mittag/Abend, sondern event-basiert)

2. **Keine CASCADE bei Foreign Keys:**
   ```sql
   soup_id INTEGER REFERENCES dishes(id)
   ```
   - Beim Löschen eines Gerichts bleibt die Referenz → kann zu NULL-Einträgen führen
   - **Empfehlung:** `ON DELETE SET NULL` oder `ON DELETE RESTRICT`

3. **`temperature_logs` wird nicht genutzt:**
   - Tabelle existiert, aber keine API-Route implementiert
   - UI zeigt nur `__/__` Platzhalter, speichert nichts
   - **Entweder implementieren oder entfernen**

4. **Fehlende Indizes:**
   - Queries auf `weekly_plans` filtern häufig auf `(year, calendar_week)`
   - **Empfehlung:**
     ```sql
     CREATE INDEX idx_weekly_plans_lookup ON weekly_plans(year, calendar_week);
     CREATE INDEX idx_guest_counts_date ON guest_counts(date, location);
     ```

5. **`season` Feld wird nicht genutzt:**
   - In Dishes definiert (`'all'|'summer'|'winter'`), aber nirgendwo verwendet
   - Keine saisonale Filterung beim Menu-Erstellen

---

## 2. ALLERGEN-KORREKTHEIT (KRITISCH!)

### 🚨 FEHLERHAFTE ALLERGENE (EU 1169/2011)

Ich habe **jedes Gericht** im `seed.ts` geprüft. Hier sind die **Fehler**:

#### **SUPPEN - Fehler**

| Gericht | Aktuell | KORREKT | Problem |
|---------|---------|---------|---------|
| Kürbiscremesuppe | `AGL` | `AGL` | ✅ OK |
| Rindsuppe mit Frittaten | `ACGL` | `ACGL` | ✅ OK |
| Kartoffelcremesuppe | `AGL` | `AGL` | ✅ OK |
| Gemüsesuppe | `AL` | `AL` | ✅ OK |
| Tomatencremesuppe | `AGL` | `AGL` | ✅ OK |
| Nudelsuppe | `ACG` | `ACGL` | **FEHLT G** (Butter/Milch im Nudelteig?) |
| Frittatensuppe | `ACG` | `ACG` | ✅ OK |
| Grießnockerlsuppe | `ACG` | `ACEG` | **FEHLT E** (Grießnockerl = Eier + Butter) |
| Leberknödelsuppe | `ACG` | `ACG` | ✅ OK |
| Backerbsensuppe | `ACG` | `ACG` | ✅ OK |
| Minestrone | `AL` | `AL` | ✅ OK (ohne Parmesan) |
| Spargelcremesuppe | `AGL` | `AGL` | ✅ OK |
| Karottencremesuppe | `GL` | `GL` | ✅ OK |

#### **FLEISCHGERICHTE - Fehler**

| Gericht | Aktuell | KORREKT | Problem |
|---------|---------|---------|---------|
| Naturschnitzel vom Schwein | `ACG` | `ACG` | ✅ OK (paniert) |
| Schweinsbraten | `A` | `A` | ✅ OK |
| Rindsgeschnetzeltes | `ACG` | `AGL` | **FALSCH** - Geschnetzeltes hat Rahm (G), oft Sellerie (L), keine Panade (kein C) |
| Hühnerfilet | `AG` | `A` | **G OPTIONAL** (je nach Marinade) |
| Hühnerstreifen | `AG` | `ACG` | **FEHLT C** (meist paniert) |
| Hühnergeschnetzeltes | `AG` | `AGL` | **FEHLT L** (Rahmsauce mit Sellerie) |
| Putenschnitzel | `ACG` | `ACG` | ✅ OK |
| Puten-Rahmgeschnetzeltes | `ACG` | `ACGL` | **FEHLT L** (Rahmsauce = Sellerie) |
| Rinderbraten | `A` | `A` | ✅ OK |
| Rindsgulasch | `A` | `AL` | **FEHLT L** (Sellerie im Gulasch üblich) |
| Schweinefilet | `A` | `A` | ✅ OK |
| Gemüse-Hühnercurry | `AGF` | `AGFL` | **FEHLT L** (Currypaste = Sellerie) |
| Pariser Schnitzel | `ACG` | `ACG` | ✅ OK |
| Korma-Hühnerkeule | `AGH` | `AGFHL` | **FEHLT F** (Currypaste = Soja), **FEHLT L** |
| Schnitzel vom Schwein | `ACG` | `ACG` | ✅ OK |
| Spaghetti Bolognaise | `ACG` | `ACGL` | **FEHLT L** (Sellerie in Bolognese!) |
| Wiener Schnitzel | `ACG` | `ACG` | ✅ OK |
| Tafelspitz | `L` | `L` | ✅ OK |
| Cevapcici | `A` | `A` | ✅ OK |

#### **FISCHGERICHTE - Fehler**

| Gericht | Aktuell | KORREKT | Problem |
|---------|---------|---------|---------|
| Seehechtfilet | `D` | `D` | ✅ OK |
| Lachsfilet | `D` | `D` | ✅ OK |
| Seelachsfilet gebacken | `ACD` | `ACD` | ✅ OK |
| Fischstäbchen | `ACD` | `ACD` | ✅ OK |
| Seehecht gebraten | `AD` | `AD` | ✅ OK |

#### **VEGETARISCH - Fehler**

| Gericht | Aktuell | KORREKT | Problem |
|---------|---------|---------|---------|
| Käsespätzle | `ACG` | `ACG` | ✅ OK |
| Spinat-Tortellini | `ACG` | `ACG` | ✅ OK |
| Gemüse-Lasagne | `ACG` | `ACG` | ✅ OK |
| Pasta all'arrabbiata | `A` | `A` | ✅ OK (ohne Käse) |
| Kasnudeln | `ACG` | `ACG` | ✅ OK |
| Fruchtknödel | `ACG` | `ACG` | ✅ OK |
| Spinat-Schafkäse-Strudel | `ACG` | `ACG` | ✅ OK |
| Gemüselaibchen | `ACG` | `ACG` | ✅ OK |
| Spinatlasagne | `ACG` | `ACG` | ✅ OK |
| Kaiserschmarrn | `ACG` | `ACG` | ✅ OK |
| Krautfleckerl | `ACG` | `ACG` | ✅ OK |
| Kartoffelrösti | `AG` | `ACG` | **FEHLT C** (Ei bindet Rösti) |
| Bolognese vegetarisch | `AF` | `AFL` | **FEHLT L** (Sellerie auch in vegetarischer Bolognese) |
| Eiernockerl | `ACG` | `ACG` | ✅ OK |
| Topfenknödel | `ACG` | `ACG` | ✅ OK |
| Palatschinken | `ACG` | `ACG` | ✅ OK |

#### **BEILAGEN - Fehler**

| Gericht | Aktuell | KORREKT | Problem |
|---------|---------|---------|---------|
| Kartoffelgratin | `AG` | `AG` | ✅ OK |
| Semmelknödel | `ACG` | `ACG` | ✅ OK |
| Reis | `` | `` | ✅ OK |
| Kräuterreis | `` | `` | ✅ OK |
| Gemüsereis | `` | `` | ✅ OK |
| Erbsenreis | `` | `` | ✅ OK |
| Butterspätzle | `ACG` | `ACG` | ✅ OK |
| Buttergemüse | `G` | `G` | ✅ OK |
| Sauerkraut | `` | `` | ✅ OK |
| Röstzwiebel | `A` | `A` | ✅ OK (Mehl paniert) |
| Tomatensauce | `L` | `L` | ✅ OK |
| Pommes | `` | `` | ✅ OK |
| Petersilienerdäpfel | `` | `` | ✅ OK |
| Couscous | `A` | `A` | ✅ OK |
| Serviettenknödel | `ACG` | `ACG` | ✅ OK |
| Ofengemüse | `` | `` | ✅ OK |
| Ofenkartoffeln | `` | `` | ✅ OK |
| Erdäpfelpüree | `G` | `G` | ✅ OK |
| Bratensauce | `A` | `AL` | **FEHLT L** (Sellerie im Bratensaft) |
| Rahmsoße | `AG` | `AG` | ✅ OK |
| Preiselbeeren | `` | `` | ✅ OK |
| Apfelkompott | `` | `` | ✅ OK |
| Schnittlauchsauce | `G` | `G` | ✅ OK |

#### **DESSERTS - OK**

Alle Desserts sind korrekt.

### 🎯 Zusammenfassung Allergene

**FEHLERQUOTE: ~15% der Gerichte haben falsche/unvollständige Allergene**

**Höchste Priorität:** Diese Fehler **SOFORT** korrigieren - EU-Verordnung 1169/2011 ist rechtlich bindend!

---

## 3. UI/UX FÜR KÜCHENEINSATZ

### ❌ **Print-Layout: ZU KLEIN**

**Datei:** `src/app/druck/page.tsx`

```tsx
<div className="print:block" style={{ fontSize: '6.5pt' }}>
```

**PROBLEM:**
- **6.5pt Schriftgröße ist UNLESERLICH im Küchenstress!**
- A4 Hochformat, 4 Blocks nebeneinander = jeder Block nur ~5cm breit
- Allergene in Rot, aber zu klein
- Temperaturfelder `__/__` ebenfalls zu klein zum Ausfüllen

**EMPFEHLUNG:**
1. **Schriftgröße: minimum 8pt**, besser 9pt für Gerichtenamen
2. **Fettdruck für Gerichtenamen**
3. **Zeilenabstand erhöhen** (aktuell: `lineHeight: '1.1'` → mindestens `1.3`)
4. **Temperaturfelder größer** - aktuell nur 3.5% Spaltenbreite
5. **Allergene BOLD + größer** (aktuell nur `text-red-600`)

**Kompromiss:** Eventuell auf **A4 Querformat** wechseln für mehr Platz?

### ✅ Gut gelöst

1. **Farbcodierung:**
   - Blauer Header für Location/Mahlzeit
   - Gelbe Highlights für wichtige Felder (PAX)
   - Rote Allergene

2. **Logische Struktur:**
   - 4 Blocks: City Mittag | City Abend | SÜD Mittag | SÜD Abend
   - 8 Zeilen pro Mahlzeit (Suppe, 2x Haupt, 4x Beilage, Dessert)
   - Wochentag + PAX-Zahl sichtbar

3. **Print-Optimierung:**
   - `@page { size: A4 portrait; margin: 5mm; }`
   - `print-color-adjust: exact` für exakte Farben
   - Navigation wird ausgeblendet (`print:hidden`)

### 🔧 Verbesserungsvorschläge

1. **Temperaturfelder interaktiv machen:**
   - Aktuell nur `__/__` als Text
   - Sollte speicherbar sein → `temperature_logs` Tabelle nutzen!

2. **Drag & Drop für Gericht-Änderungen** (in Wochenplan-View)
   - Aktuell keine Edit-Funktion im Print-View

3. **PAX-Zahlen aus `guest_counts` automatisch einfügen:**
   - Aktuell hardcoded: `60 PAX` / `45 PAX`
   - Sollte aus Felix-OCR-Daten kommen!

---

## 4. CODE QUALITY & BUGS

### 🚨 **SQL-INJECTION VULNERABILITIES**

#### ❌ KRITISCH: Unsichere String-Interpolation

**Datei:** `src/app/api/plans/route.ts` (Zeile 54-56)

```typescript
const column = `${slot}_id`;
db.prepare(
  `UPDATE weekly_plans SET ${column} = ? WHERE year = ? AND calendar_week = ? AND day_of_week = ? AND meal = ? AND location = ?`
).run(dishId || null, year, calendarWeek, dayOfWeek, meal, location);
```

**PROBLEM:**
- `slot` Parameter kommt direkt aus `request.json()` ohne Validierung
- Wird direkt in SQL eingefügt: `` `${column}` ``
- **Angreifer kann beliebigen SQL-Code einschleusen!**

**EXPLOIT-BEISPIEL:**
```json
{
  "slot": "soup_id; DROP TABLE dishes; --",
  "dishId": 1,
  ...
}
```

**FIX:**
```typescript
// Whitelist für erlaubte Slots
const ALLOWED_SLOTS = ['soup', 'main1', 'side1a', 'side1b', 'main2', 'side2a', 'side2b', 'dessert'];

if (!ALLOWED_SLOTS.includes(slot)) {
  return NextResponse.json({ error: 'Ungültiger Slot' }, { status: 400 });
}
const column = `${slot}_id`;
```

#### ⚠️ WEITERE INPUT-VALIDIERUNG FEHLT

**Alle API-Routes brauchen Input-Validierung:**

1. **`/api/dishes` (POST/PUT):**
   ```typescript
   // KEIN CHECK ob category valid ist!
   const { name, category, allergens, season } = body;
   ```
   **Fix:** Validate against allowed categories:
   ```typescript
   const VALID_CATEGORIES = ['suppe','fleisch','fisch','vegetarisch','dessert','beilage'];
   if (!VALID_CATEGORIES.includes(category)) {
     return NextResponse.json({ error: 'Ungültige Kategorie' }, { status: 400 });
   }
   ```

2. **`/api/ocr` (POST):**
   ```typescript
   const { date, location, meal_type, count } = body;
   // Keine Validierung von date-format, location, meal_type!
   ```

3. **`/api/events` (POST):**
   ```typescript
   // Keine Validierung von date, event_type, pax
   ```

### 🐛 **Bugs**

#### 1. **Felix OCR: Fragile Spalten-Erkennung**

**Datei:** `src/app/felix/page.tsx` (Zeile 89-116)

```typescript
// Map based on count of numbers:
// 2 nums: [Gesamt, Frühstück]
// 3 nums: [Gesamt, Frühstück, KPVorm]
// ...
```

**PROBLEM:**
- Funktioniert nur wenn OCR **perfekt** ist
- Wenn Tesseract eine Zahl übersieht → komplett falsches Mapping
- Keine Validierung ob Zahlen plausibel sind
- Keine Fallback-Strategie

**User-Complaint bestätigt:** "Felix OCR works poorly"

**VERBESSERUNGEN NÖTIG:**

1. **Spalten-Header erkennen statt Zählen:**
   ```typescript
   // Suche nach "Mittag", "Abend E", "Abend K" im Text
   // Bestimme Position der Header
   // Parse Zahlen basierend auf Spalten-Position
   ```

2. **Plausibilitätschecks:**
   ```typescript
   if (mittag > gesamtPax * 0.5) {
     // Warning: Mittag > 50% von Gesamt - ungewöhnlich
   }
   ```

3. **Manuelle Korrektur-Möglichkeit:**
   - ✅ Bereits vorhanden via editable inputs!

4. **OCR-Confidence Score anzeigen:**
   ```typescript
   const { data: { text, confidence } } = await Tesseract.recognize(image, 'deu');
   if (confidence < 0.7) {
     // Warnung: OCR-Qualität niedrig
   }
   ```

#### 2. **Temperature Logs nicht implementiert**

**Tabelle existiert, aber:**
- Keine API-Route
- UI zeigt nur `__/__` ohne Speicherfunktion
- Komponente `TempInput.tsx` hat `onChange` aber kein Save

**Fix:** Entweder implementieren oder Tabelle + UI entfernen

#### 3. **Week Calculation falsch bei Jahreswechsel**

**Datei:** `src/app/page.tsx` (Zeile 23-25)

```typescript
const startOfYear = new Date(now.getFullYear(), 0, 1);
const days = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
setCurrentWeek(Math.ceil((days + startOfYear.getDay() + 1) / 7));
```

**PROBLEM:**
- Simplifizierte KW-Berechnung
- ISO 8601 Week-Berechnung ist komplexer (KW kann ins Vorjahr/Folgejahr reichen)

**FIX:**
```typescript
// Nutze Intl API für korrekte ISO-Woche
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}
```

#### 4. **Missing Error Handling**

**Alle Fetch-Calls ohne Error-Handling:**

```typescript
// BAD:
fetch('/api/dishes').then(r => r.json()).then(setDishes);

// GOOD:
fetch('/api/dishes')
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(setDishes)
  .catch(err => {
    console.error('Failed to load dishes:', err);
    // Show user-friendly error message
  });
```

### ✅ Gut gelöst

1. **Prepared Statements:**
   - Alle DB-Queries nutzen `.prepare()` mit `?` placeholders ✅
   - Kein String-Concat in SQL (außer der einen Stelle oben)

2. **Transaction-Nutzung:**
   - Seed-Funktion nutzt `db.transaction()` für Atomicity

3. **TypeScript:**
   - Strikte Typen für Interfaces
   - Gute Type-Safety

4. **Code-Struktur:**
   - Klare Trennung: `/lib` (server), `/components` (client), `/app` (pages/routes)
   - Server-only imports korrekt (better-sqlite3 nur in Server-Routes)

---

## 5. FELIX OCR - Detailanalyse

### 🚨 Kernproblem: Positionsbasierte Erkennung ist zu fragil

**Aktuelle Logik:**

```typescript
// Extract all numbers AFTER "Ges" or after the day abbreviation
const numbers = numPart.match(/\d+/g)?.map(n => parseInt(n)) || [];

// Map based on count of numbers:
if (numbers.length >= 2) {
  const gesamtPax = numbers[0] || 0;
  const fruehstueck = numbers[1] || 0;
  const mittag = numbers.length >= 4 ? numbers[3] : 0;
  // ...
}
```

**Warum das scheitert:**

1. **OCR übersieht Zahlen** (z.B. bei schlechter Bildqualität)
   - 7 Zahlen erwartet, nur 5 erkannt → falsches Mapping

2. **Zusätzliche Zahlen** (z.B. aus anderen Spalten)
   - "Ges. 68 42 0 28 0 25 3 **Preis: 15**" → 8 statt 7 Zahlen

3. **Keine Verifizierung der Plausibilität**
   - Mittag > Gesamt? Kein Check!

### ✅ Was funktioniert

1. **Hotel-Erkennung:** ✅
   ```typescript
   if (line.includes('JUFA') || line.includes('Hotel')) {
     hotel = line.replace(/["|*]/g, '').trim();
   }
   ```

2. **Datum-Parsing:** ✅
   ```typescript
   const dateMatch = line.match(/(\d{2}\.\d{2}\.\d{2,4})/);
   ```

3. **Wochentag-Erkennung:** ✅
   ```typescript
   const dayAbbrevs = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
   ```

4. **Manuelle Edit-Möglichkeit:** ✅
   - User kann Zahlen korrigieren

### 🔧 Empfohlene Fixes

**Ansatz 1: Layout-basiertes Parsing** (robuster)

```typescript
// 1. Erkenne Spalten-Header (einmalig)
// "Gesamt PAX | Frühstück | KP Vorm | Mittag | KP Nach | Abend E | Abend K"
const headerLine = lines.find(l => l.includes('Gesamt PAX') || l.includes('Frühstück'));
if (headerLine) {
  // Bestimme X-Positionen der Spalten-Header
  const mittag_colStart = headerLine.indexOf('Mittag');
  const abendE_colStart = headerLine.indexOf('Abend E');
  // ...
}

// 2. Parse Zahlen basierend auf X-Position
for (const line of lines) {
  if (!dateMatch) continue;
  const mittag_text = line.substring(mittag_colStart, mittag_colStart + 5);
  const mittag = parseInt(mittag_text.trim());
  // ...
}
```

**Ansatz 2: Spalten-Keywords verwenden**

```typescript
// Suche spezifisch nach Kontext
// "Mittag 28" statt nur "28"
const mittagMatch = line.match(/Mittag\s+(\d+)/);
if (mittagMatch) {
  mittag = parseInt(mittagMatch[1]);
}
```

**Ansatz 3: AI-OCR (Upgrade zu GPT-4 Vision)**

- Tesseract ist für Tabellen nicht optimal
- GPT-4 Vision oder Azure Document Intelligence wären robuster
- Kann Tabellen-Struktur verstehen

---

## 6. EXPORT (Excel/CSV)

### ✅ Sehr gut gelöst!

**Datei:** `src/app/api/export/route.ts`

**Was funktioniert:**

1. **ExcelJS korrekt verwendet:**
   - Zell-Merging: `sheet.mergeCells(1, c, 1, c + 4)`
   - Styling: Fonts, Borders, Fills
   - Page Setup für A4 portrait

2. **Spaltenbreiten optimiert:**
   ```typescript
   const colWidths = [
     6, 8, 22, 6, 6,  // Block 1
     1,                 // Spacer
     // ...
   ];
   ```

3. **CSV-Fallback vorhanden:**
   - Proper escaping: `"${c.replace(/"/g, '""')}"`
   - UTF-8 encoding

4. **Layout identisch zu Print-View:**
   - 4 Blocks, 8 Rows per day
   - Allergens in red, temp fields `__/__`

### ⚠️ Kleinere Issues

1. **PAX-Werte hardcoded:**
   ```typescript
   const paxCity = searchParams.get('paxCity') || '60';
   const paxSued = searchParams.get('paxSued') || '45';
   ```
   - Sollten aus `guest_counts` kommen, nicht als Parameter

2. **Font-Größe in Excel auch klein:**
   ```typescript
   const normalFont: Partial<ExcelJS.Font> = { size: 7 };
   ```
   - Gleiche Kritik wie beim Print-Layout: zu klein!

3. **Google Sheets Import-Anleitung statisch:**
   - Könnte automatisiert werden via Google Sheets API

---

## 7. FEHLENDE FEATURES

### 🚫 1. **AK (Arbeiterkammer) als 3. Location**

**Status:** Tabelle `ak_events` existiert, aber:
- NICHT in `weekly_plans` integriert
- Keine Menu-Planung für Events
- Nur CRUD für Events (Liste von Events)

**Was fehlt:**

1. **Event-basierte Menuplanung:**
   - Brunch hat andere Struktur als Mittag/Abend
   - Baelle = Buffet (mehrere Gerichte gleichzeitig)
   - Bankett = mehrgängig

2. **Eigenes Schema für AK-Menus:**
   ```sql
   CREATE TABLE ak_menus (
     id INTEGER PRIMARY KEY,
     event_id INTEGER REFERENCES ak_events(id),
     menu_type TEXT CHECK(menu_type IN ('brunch','buffet','bankett','standing')),
     course_nr INTEGER,
     dish_id INTEGER REFERENCES dishes(id),
     quantity TEXT
   );
   ```

3. **Separate Print-Layout für AK:**
   - Nicht 4 Blocks, sondern Event-orientiert
   - Liste aller Gerichte für das Event
   - Quantities (Stückzahlen/Portionen)

**Aufwand:** ~3-4 Tage Implementierung

### 🚫 2. **Automatische Menuplan-Erstellung aus Gästezahlen**

**Status:** `guest_counts` wird gespeichert, aber:
- NICHT verwendet für Menu-Generierung
- Keine Portion-Berechnung
- Keine Ingredient-Liste

**Was fehlt:**

1. **Portionsgrößen-Tabelle:**
   ```sql
   CREATE TABLE dish_portions (
     dish_id INTEGER REFERENCES dishes(id),
     portion_size_grams INTEGER,
     ingredients TEXT  -- JSON: [{"name": "Kartoffeln", "amount_per_portion": 200}]
   );
   ```

2. **Berechnung:**
   ```typescript
   function calculateIngredients(dishId: number, pax: number) {
     const portions = db.prepare('SELECT * FROM dish_portions WHERE dish_id = ?').get(dishId);
     const ingredients = JSON.parse(portions.ingredients);
     return ingredients.map(ing => ({
       ...ing,
       total_amount: ing.amount_per_portion * pax
     }));
   }
   ```

3. **Einkaufsliste-Feature:**
   - Alle Gerichte einer Woche → aggregierte Zutatenliste
   - Export als PDF/Excel

**Aufwand:** ~1 Woche (komplex, braucht Rezeptdaten)

### 🚫 3. **HACCP Temperature Logging**

**Status:** Tabelle existiert, UI zeigt `__/__`, aber keine Speicherung

**Was fehlt:**

1. **API-Route:**
   ```typescript
   // POST /api/temperatures
   // Speichere temp_core + temp_serving für dish_slot
   ```

2. **UI-Integration:**
   - `TempInput` Component muss `onChange` nach API schicken
   - History anzeigen (letzte Temperaturen)

3. **Validierung:**
   - Kerntemperatur >= 75°C für Fleisch (HACCP-Regel)
   - Warnungen bei zu niedrigen Temps

**Aufwand:** ~1 Tag

---

## 8. SECURITY REVIEW

### 🚨 CRITICAL

1. **SQL Injection via `slot` parameter** (siehe Abschnitt 4)
   - **SEVERITY: CRITICAL**
   - **FIX: Whitelist-Validierung**

### ⚠️ MEDIUM

2. **Fehlende Input-Validierung:**
   - Alle API-Routes nehmen JSON ohne Schema-Validierung
   - **EMPFEHLUNG:** Nutze Zod für Schema-Validierung:
     ```typescript
     import { z } from 'zod';

     const DishSchema = z.object({
       name: z.string().min(1).max(100),
       category: z.enum(['suppe','fleisch','fisch','vegetarisch','dessert','beilage']),
       allergens: z.string().regex(/^[A-Z]*$/),
       season: z.enum(['all','summer','winter']).default('all')
     });

     const body = DishSchema.parse(await request.json());
     ```

3. **XSS-Risiko niedrig (React escaped automatisch):**
   - React escaped alle Strings in JSX ✅
   - Aber: `dangerouslySetInnerHTML` wird nicht verwendet ✅

4. **CORS nicht konfiguriert:**
   - Aktuell keine CORS-Header
   - Für reine Localhost-Anwendung OK
   - Für Deployment: CORS konfigurieren

5. **Keine Authentifizierung:**
   - Jeder kann DB editieren wenn URL bekannt
   - **Für internen Einsatz OK**
   - Für öffentliches Deployment: Auth nötig (z.B. NextAuth.js)

### ✅ GOOD

1. **Prepared Statements überall** (außer eine Stelle)
2. **Foreign Keys aktiviert**
3. **Keine Secrets im Code**
4. **better-sqlite3 nur server-side** (korrekt)

---

## 9. PERFORMANCE

### ✅ Gut

1. **SQLite WAL-Modus:** Concurrent reads
2. **Transactions für Batch-Inserts** (seed)
3. **React Client-Side Rendering:** Schnell

### ⚠️ Verbesserbar

1. **Fehlende Indizes** (siehe Abschnitt 1)
2. **Keine Pagination:**
   - `GET /api/dishes` lädt ALLE Gerichte
   - Bei 100+ Gerichten wird das langsam
   - **FIX:** Pagination oder Lazy-Loading

3. **OCR läuft im Browser:**
   - Tesseract.js ist CPU-intensiv
   - Blockiert UI während Processing
   - **FIX:** Web Worker nutzen:
     ```typescript
     const worker = await createWorker('deu');
     const { data: { text } } = await worker.recognize(image);
     await worker.terminate();
     ```

4. **Keine Caching-Header:**
   - API-Responses sollten Cache-Control haben
   - Dishes/Rotation ändern sich selten → cacheable

---

## 10. CODE-STIL & WARTBARKEIT

### ✅ Sehr gut

1. **TypeScript strikte Typen**
2. **Klare Ordnerstruktur**
3. **Deutsche UI, englische Code-Kommentare** (wie gewünscht)
4. **Komponenten-Wiederverwendung** (`MealCard`, `WeekGrid`)
5. **Saubere Separation:** Client vs. Server

### ⚠️ Verbesserbar

1. **Fehlende Code-Kommentare:**
   - Komplexe Logik (OCR-Parsing) hat Kommentare ✅
   - Aber: API-Routes haben keine JSDoc

2. **Duplizierung:**
   - `SLOT_LABELS` definiert in `druck/page.tsx` UND `export/route.ts`
   - **FIX:** Nach `/lib/constants.ts` verschieben

3. **Fehlende Tests:**
   - Keine Unit-Tests
   - Keine Integration-Tests
   - **Empfehlung:** Jest + Testing Library für kritische Teile (Allergene, OCR-Parsing)

4. **Error-Messages nicht user-friendly:**
   ```typescript
   return NextResponse.json({ error: 'Alle Felder erforderlich' }, { status: 400 });
   ```
   - OK für Deutsch, aber: Welches Feld fehlt?
   - **Besser:** `{ error: 'Fehlendes Feld: name' }`

---

## ZUSAMMENFASSUNG & PRIORITÄTEN

### 🔥 SOFORT (Rechtliches/Sicherheit)

1. **Allergene korrigieren** (15+ Fehler, EU-Verordnung!)
   - Datei: `src/lib/seed.ts`
   - Aufwand: 1-2 Stunden
   - **HÖCHSTE PRIORITÄT**

2. **SQL-Injection Fix** (slot-Parameter Validierung)
   - Datei: `src/app/api/plans/route.ts`
   - Aufwand: 15 Minuten
   - **KRITISCH**

3. **Input-Validierung in allen API-Routes**
   - Zod-Schema für alle Endpoints
   - Aufwand: 2-3 Stunden

### 🟡 WICHTIG (Funktionalität)

4. **Felix OCR verbessern**
   - Robustere Spalten-Erkennung
   - Plausibilitätschecks
   - Aufwand: 1 Tag

5. **Print-Layout Schriftgröße erhöhen**
   - Von 6.5pt → 9pt
   - Zeilenabstand erhöhen
   - Aufwand: 1 Stunde

6. **AK-Location integrieren**
   - Event-basierte Menuplanung
   - Eigene Print-Layout
   - Aufwand: 3-4 Tage

### 🟢 NICE-TO-HAVE

7. **Temperature Logging implementieren**
   - API + UI-Integration
   - Aufwand: 1 Tag

8. **Automatische Menuplan-Erstellung aus Gästezahlen**
   - Portions-Berechnung
   - Einkaufsliste
   - Aufwand: 1 Woche

9. **Tests schreiben**
   - Jest + Testing Library
   - Aufwand: 2-3 Tage

10. **Indizes für Performance**
    - `CREATE INDEX` für häufige Queries
    - Aufwand: 30 Minuten

---

## FINAL RATING

| Kategorie | Rating | Kommentar |
|-----------|--------|-----------|
| **Architektur** | 8/10 | Solide, aber AK-Integration fehlt |
| **Allergen-Korrektheit** | 4/10 | ⚠️ 15% FEHLER - rechtlich problematisch! |
| **UI/UX Kitchen** | 6/10 | Funktional, aber zu kleine Schrift |
| **Code Quality** | 7/10 | Gut strukturiert, aber SQL-Injection Risk |
| **Felix OCR** | 5/10 | Funktioniert, aber fragil |
| **Export** | 9/10 | Excel/CSV sehr gut implementiert |
| **Security** | 6/10 | OK für intern, aber Lücken vorhanden |
| **Performance** | 7/10 | Gut, könnte mit Indizes besser sein |
| **Wartbarkeit** | 7/10 | Sauber strukturiert, aber keine Tests |

**GESAMT: 6.5/10**

---

## NÄCHSTE SCHRITTE (Recommended Order)

1. ✅ **Allergene korrigieren** (1-2h) - JETZT!
2. ✅ **SQL-Injection fixen** (15min) - JETZT!
3. ✅ **Input-Validierung** (2-3h) - diese Woche
4. ⚠️ **Print-Layout verbessern** (1h) - diese Woche
5. ⚠️ **Felix OCR robuster machen** (1 Tag) - nächste Woche
6. 📋 **AK-Integration planen** (3-4 Tage) - Sprint 2
7. 📋 **Temperature Logging** (1 Tag) - Sprint 2
8. 📋 **Tests schreiben** (2-3 Tage) - Sprint 3

---

**Review durchgeführt von:** Claude Sonnet 4.5 (Perfectionist Architect Mode)
**Datum:** 2026-01-31
**Datei-Pfad:** `C:\Users\Geral\OneDrive\Desktop\Menüplan-Generator\CRITICAL_REVIEW.md`
