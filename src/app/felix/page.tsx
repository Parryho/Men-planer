'use client';

import { useState, useRef } from 'react';

interface DayCount {
  date: string;
  day: string;
  gesamtPax: number;
  fruehstueck: number;
  mittag: number;
  abendE: number;
  abendK: number;
  abendGesamt: number;
}

interface OcrResult {
  text: string;
  hotel: string;
  zeitraum: string;
  days: DayCount[];
}

// Parse the Pensionsliste table format from OCR text
// Columns: Gesamt PAX | Frühstück | KP Vorm | Mittag | KP Nach | Abend E | Abend K
// Rows with fewer numbers have empty columns from the RIGHT side:
//   2 numbers = Gesamt, Frühstück (no meals)
//   5 numbers = Gesamt, Frühstück, KPVorm, Mittag, KPNach (no Abend)
//   6 numbers = Gesamt, Frühstück, KPVorm, Mittag, KPNach, AbendE (could be AbendK=0 with 52 for AbendK)
//   7 numbers = all columns filled
function parsePensionsliste(text: string): OcrResult {
  const lines = text.split('\n').filter(l => l.trim());
  const days: DayCount[] = [];
  let hotel = '';
  let zeitraum = '';

  // Extract hotel name
  for (const line of lines) {
    if (line.includes('JUFA') || line.includes('Hotel')) {
      hotel = line.replace(/["|*]/g, '').trim();
      break;
    }
  }

  // Extract date range - look for "von DD.MM.YYYY bis DD.MM.YYYY"
  const fullText = lines.join(' ');
  const rangeMatch = fullText.match(/von\s+(\d{2}[.\s]\d{2}[.\s]\d{2,4})\s+bis\s+(\d{2}[.\s]\d{2}[.\s]\d{2,4})/i);
  if (rangeMatch) {
    zeitraum = `${rangeMatch[1]} - ${rangeMatch[2]}`;
  }

  const dayAbbrevs = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Helper: extract numbers with positions from a line after "Ges."
  function extractNumbers(line: string, date: string) {
    let numPart = line;
    const gesIdx = numPart.search(/Ges\.?\s/i);
    const startIdx = gesIdx >= 0 ? gesIdx + 4 : numPart.indexOf(date) + date.length;
    numPart = line.substring(startIdx);
    const matches: { value: number; pos: number }[] = [];
    const re = /\d+/g;
    let m;
    while ((m = re.exec(numPart)) !== null) {
      matches.push({ value: parseInt(m[0]), pos: startIdx + m.index });
    }
    return matches;
  }

  // PASS 1: Collect all day lines and find reference column positions from 7-number lines
  interface DayLine { line: string; date: string; day: string; nums: { value: number; pos: number }[] }
  const dayLines: DayLine[] = [];
  let refPositions: number[] | null = null; // positions of 7 columns from a reference line

  for (const line of lines) {
    const dateMatch = line.match(/(\d{2}\.\d{2}\.\d{2,4})/);
    if (!dateMatch) continue;
    const hasDay = dayAbbrevs.some(d => new RegExp(`\\b${d}\\b`).test(line));
    if (!hasDay) continue;

    const date = dateMatch[1];
    let day = '';
    for (const d of dayAbbrevs) {
      if (new RegExp(`\\b${d}\\b`).test(line)) { day = d; break; }
    }

    const nums = extractNumbers(line, date);
    dayLines.push({ line, date, day, nums });

    // Use the first 7-number line as column position reference
    if (nums.length >= 7 && !refPositions) {
      refPositions = nums.slice(0, 7).map(n => n.pos);
    }
  }

  // PASS 2: Map numbers to 7 columns using reference positions
  for (const dl of dayLines) {
    const values = dl.nums.map(n => n.value);
    const positions = dl.nums.map(n => n.pos);
    // Columns: [0]=Gesamt [1]=Frühst [2]=KPVorm [3]=Mittag [4]=KPNach [5]=AbendE [6]=AbendK
    const slots = [0, 0, 0, 0, 0, 0, 0];

    if (values.length >= 7) {
      for (let i = 0; i < 7; i++) slots[i] = values[i];
    } else if (values.length === 6 && refPositions) {
      // Match each number to the nearest reference column position
      const used = new Set<number>();
      for (let i = 0; i < positions.length; i++) {
        let bestCol = 0;
        let bestDist = Infinity;
        for (let c = 0; c < 7; c++) {
          if (used.has(c)) continue;
          const dist = Math.abs(positions[i] - refPositions[c]);
          if (dist < bestDist) { bestDist = dist; bestCol = c; }
        }
        slots[bestCol] = values[i];
        used.add(bestCol);
      }
    } else if (values.length === 6) {
      // No reference line available - map first 5 to slots 0-4, 6th to abendGesamt
      for (let i = 0; i < 5; i++) slots[i] = values[i];
      // Put 6th as combined Abend total in AbendE (user can correct via UI)
      slots[5] = values[5];
    } else if (values.length === 5) {
      for (let i = 0; i < 5; i++) slots[i] = values[i];
    } else {
      for (let i = 0; i < values.length; i++) slots[i] = values[i];
    }

    const gesamtPax = slots[0];
    const fruehstueck = slots[1];
    const mittag = slots[3];
    const abendE = slots[5];
    const abendK = slots[6];

    if (gesamtPax > 0 || fruehstueck > 0) {
      days.push({
        date: dl.date, day: dl.day, gesamtPax, fruehstueck, mittag,
        abendE, abendK, abendGesamt: abendE + abendK,
      });
    }
  }

  return { text, hotel, zeitraum, days };
}

export default function FelixPage() {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<OcrResult | null>(null);
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());
  const [location, setLocation] = useState('city');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function processOCR() {
    if (!image) return;
    setProcessing(true);
    setResult(null);
    setSavedRows(new Set());

    try {
      const Tesseract = await import('tesseract.js');
      const { data: { text } } = await Tesseract.recognize(image, 'deu');
      const parsed = parsePensionsliste(text);
      setResult(parsed);

      // Auto-detect location from hotel name
      if (parsed.hotel.toLowerCase().includes('süd') || parsed.hotel.toLowerCase().includes('sud')) {
        setLocation('sued');
      } else {
        setLocation('city');
      }
    } catch (err) {
      console.error('OCR failed:', err);
      setResult({ text: 'OCR-Fehler: ' + (err as Error).message, hotel: '', zeitraum: '', days: [] });
    }
    setProcessing(false);
  }

  async function saveDay(day: DayCount, meal: 'mittag' | 'abend', count: number) {
    // Convert date format DD.MM.YY to YYYY-MM-DD
    const parts = day.date.split('.');
    const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
    const isoDate = `${year}-${parts[1]}-${parts[0]}`;

    await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: isoDate, location, meal_type: meal, count }),
    });
    setSavedRows(prev => new Set(prev).add(`${day.date}-${meal}`));
  }

  async function saveAll() {
    if (!result) return;
    for (const day of result.days) {
      if (day.mittag > 0) await saveDay(day, 'mittag', day.mittag);
      if (day.abendGesamt > 0) await saveDay(day, 'abend', day.abendGesamt);
    }
  }

  function updateDay(idx: number, field: keyof DayCount, value: number) {
    if (!result) return;
    const updated = [...result.days];
    (updated[idx] as unknown as Record<string, unknown>)[field] = value;
    if (field === 'abendE' || field === 'abendK') {
      updated[idx].abendGesamt = updated[idx].abendE + updated[idx].abendK;
    }
    setResult({ ...result, days: updated });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Felix Pensionsliste - Gästezahlen</h1>
      <p className="text-gray-600 text-sm">
        Screenshot der Felix-Pensionsliste hochladen. Die Mittag- und Abend-Zahlen (E+K) werden automatisch erkannt.
      </p>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {/* Location selector */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">Standort:</span>
          <button onClick={() => setLocation('city')}
            className={`px-4 py-1.5 rounded font-semibold text-sm ${location === 'city' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            Graz City
          </button>
          <button onClick={() => setLocation('sued')}
            className={`px-4 py-1.5 rounded font-semibold text-sm ${location === 'sued' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            SÜD
          </button>
        </div>

        {/* Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} className="hidden" />
          <button onClick={() => fileRef.current?.click()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg">
            Pensionsliste-Screenshot hochladen
          </button>
          <p className="text-gray-400 text-sm mt-2">PNG, JPG</p>
        </div>

        {image && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Screenshot" className="max-h-64 rounded border" />
            <button onClick={processOCR} disabled={processing}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400">
              {processing ? 'Verarbeite OCR...' : 'Pensionsliste erkennen'}
            </button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Detected info */}
            {result.hotel && <div className="text-sm"><span className="font-semibold">Hotel:</span> {result.hotel}</div>}
            {result.zeitraum && <div className="text-sm"><span className="font-semibold">Zeitraum:</span> {result.zeitraum}</div>}

            {/* Extracted table */}
            {result.days.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">Erkannte Gästezahlen ({location === 'city' ? 'City' : 'SÜD'}):</h3>
                  <button onClick={saveAll}
                    className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 font-semibold">
                    Alle speichern
                  </button>
                </div>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">Datum</th>
                      <th className="border px-2 py-1 text-left">Tag</th>
                      <th className="border px-2 py-1 text-right">Gesamt</th>
                      <th className="border px-2 py-1 text-right">Frühstück</th>
                      <th className="border px-2 py-1 text-right bg-yellow-50 font-bold">Mittag</th>
                      <th className="border px-2 py-1 text-right">Abend E</th>
                      <th className="border px-2 py-1 text-right">Abend K</th>
                      <th className="border px-2 py-1 text-right bg-yellow-50 font-bold">Abend Ges.</th>
                      <th className="border px-2 py-1 text-center">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.days.map((day, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border px-2 py-1 font-medium">{day.date}</td>
                        <td className="border px-2 py-1">{day.day}</td>
                        <td className="border px-2 py-1 text-right text-gray-500">{day.gesamtPax}</td>
                        <td className="border px-2 py-1 text-right text-gray-500">{day.fruehstueck}</td>
                        <td className="border px-2 py-1 text-right bg-yellow-50">
                          <input type="number" value={day.mittag || ''} onChange={e => updateDay(i, 'mittag', parseInt(e.target.value) || 0)}
                            className="w-14 text-right border rounded px-1 py-0.5" />
                        </td>
                        <td className="border px-2 py-1 text-right">
                          <input type="number" value={day.abendE || ''} onChange={e => updateDay(i, 'abendE', parseInt(e.target.value) || 0)}
                            className="w-14 text-right border rounded px-1 py-0.5" />
                        </td>
                        <td className="border px-2 py-1 text-right">
                          <input type="number" value={day.abendK || ''} onChange={e => updateDay(i, 'abendK', parseInt(e.target.value) || 0)}
                            className="w-14 text-right border rounded px-1 py-0.5" />
                        </td>
                        <td className="border px-2 py-1 text-right bg-yellow-50 font-semibold">{day.abendGesamt}</td>
                        <td className="border px-2 py-1 text-center space-x-1">
                          {day.mittag > 0 && (
                            <button onClick={() => saveDay(day, 'mittag', day.mittag)}
                              className={`px-2 py-0.5 rounded text-xs ${savedRows.has(`${day.date}-mittag`) ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                              {savedRows.has(`${day.date}-mittag`) ? 'M ok' : 'M'}
                            </button>
                          )}
                          {day.abendGesamt > 0 && (
                            <button onClick={() => saveDay(day, 'abend', day.abendGesamt)}
                              className={`px-2 py-0.5 rounded text-xs ${savedRows.has(`${day.date}-abend`) ? 'bg-gray-300 text-gray-600' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
                              {savedRows.has(`${day.date}-abend`) ? 'A ok' : 'A'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-1">M = Mittag speichern, A = Abend speichern (E+K zusammen). Zahlen sind editierbar. <span className="text-yellow-600">?</span> = E/K konnte nicht automatisch getrennt werden, Gesamtzahl prüfen.</p>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Keine Tageszeilen erkannt. Rohtext:</div>
            )}

            {/* Raw OCR text for debugging */}
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">OCR-Rohtext anzeigen</summary>
              <pre className="bg-gray-50 p-3 rounded whitespace-pre-wrap max-h-48 overflow-auto mt-2">{result.text}</pre>
            </details>
          </div>
        )}
      </div>

      {/* Manual entry */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold mb-3">Manuelle Eingabe</h3>
        <ManualGuestCount />
      </div>
    </div>
  );
}

function ManualGuestCount() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('city');
  const [meal, setMeal] = useState('mittag');
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(false);

  async function save() {
    await fetch('/api/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, location, meal_type: meal, count }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded px-2 py-1 text-sm" />
      <select value={location} onChange={e => setLocation(e.target.value)} className="border rounded px-2 py-1 text-sm">
        <option value="city">City</option>
        <option value="sued">SÜD</option>
      </select>
      <select value={meal} onChange={e => setMeal(e.target.value)} className="border rounded px-2 py-1 text-sm">
        <option value="mittag">Mittag</option>
        <option value="abend">Abend</option>
      </select>
      <input type="number" placeholder="Gäste" value={count || ''} onChange={e => setCount(parseInt(e.target.value) || 0)} className="border rounded px-2 py-1 text-sm w-20" />
      <button onClick={save} className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">Speichern</button>
      {saved && <span className="text-green-600 text-sm">Gespeichert!</span>}
    </div>
  );
}
