'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ExportPageWrapper() {
  return <Suspense fallback={<div className="text-center py-8">Lade...</div>}><ExportPage /></Suspense>;
}

function ExportPage() {
  const searchParams = useSearchParams();
  const [year, setYear] = useState(parseInt(searchParams.get('year') || new Date().getFullYear().toString()));
  const [week, setWeek] = useState(parseInt(searchParams.get('week') || '1'));
  const [paxCity, setPaxCity] = useState('60');
  const [paxSued, setPaxSued] = useState('45');

  function downloadXLSX() {
    window.open(`/api/export?year=${year}&week=${week}&format=xlsx&paxCity=${paxCity}&paxSued=${paxSued}`);
  }

  function downloadCSV() {
    window.open(`/api/export?year=${year}&week=${week}&format=csv&paxCity=${paxCity}&paxSued=${paxSued}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Export</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-lg">
        <h2 className="font-bold text-lg">Wochenplan exportieren</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Jahr</label>
            <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kalenderwoche</label>
            <input type="number" value={week} min={1} max={53} onChange={e => setWeek(parseInt(e.target.value))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PAX City</label>
            <input type="text" value={paxCity} onChange={e => setPaxCity(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">PAX SÜD</label>
            <input type="text" value={paxSued} onChange={e => setPaxSued(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button onClick={downloadXLSX} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold">
            Excel (.xlsx) herunterladen
          </button>
          <button onClick={downloadCSV} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
            CSV herunterladen
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-lg">
        <h2 className="font-bold text-lg mb-3">Google Sheets Import</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>CSV-Datei herunterladen (Button oben)</li>
          <li>Google Sheets öffnen</li>
          <li>Datei &rarr; Importieren &rarr; Hochladen</li>
          <li>CSV-Datei auswählen</li>
          <li>Trennzeichen: Komma, Encoding: UTF-8</li>
          <li>Formatierung nach Bedarf anpassen</li>
        </ol>
      </div>
    </div>
  );
}
