'use client';

import { useState, useCallback } from 'react';
import AllergenBadge from './AllergenBadge';

interface Dish {
  id: number;
  name: string;
  allergens: string;
}

interface MealSlot {
  soup: Dish | null;
  main1: Dish | null;
  side1a: Dish | null;
  side1b: Dish | null;
  main2: Dish | null;
  side2a: Dish | null;
  side2b: Dish | null;
  dessert: Dish | null;
}

interface TempData {
  [slot: string]: { core: string; serving: string };
}

interface MealCardProps {
  slot: MealSlot;
  title: string;
  pax?: string;
  compact?: boolean;
  year?: number;
  calendarWeek?: number;
  dayOfWeek?: number;
  meal?: string;
  location?: string;
  temperatures?: TempData;
  onTempChange?: (slot: string, core: string, serving: string) => void;
}

const ROWS: { key: keyof MealSlot; label: string; isMain: boolean }[] = [
  { key: 'soup', label: 'Suppe', isMain: false },
  { key: 'main1', label: 'Haupt 1', isMain: true },
  { key: 'side1a', label: 'Beilage', isMain: false },
  { key: 'side1b', label: 'Beilage', isMain: false },
  { key: 'main2', label: 'Haupt 2', isMain: true },
  { key: 'side2a', label: 'Beilage', isMain: false },
  { key: 'side2b', label: 'Beilage', isMain: false },
  { key: 'dessert', label: 'Dessert', isMain: false },
];

function InlineTempInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="text"
      className="w-10 text-[10px] border border-primary-200 rounded px-0.5 py-0 text-center bg-white focus:border-accent-500 focus:ring-1 focus:ring-accent-200 outline-none transition-colors"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default function MealCard({ slot, title, pax, compact, year, calendarWeek, dayOfWeek, meal, location, temperatures = {}, onTempChange }: MealCardProps) {
  const [temps, setTemps] = useState<TempData>(temperatures);
  const [saveTimer, setSaveTimer] = useState<Record<string, NodeJS.Timeout>>({});

  const handleTempChange = useCallback((slotKey: string, field: 'core' | 'serving', value: string) => {
    setTemps(prev => {
      const current = prev[slotKey] || { core: '', serving: '' };
      const updated = { ...current, [field]: value };
      const newTemps = { ...prev, [slotKey]: updated };

      // Debounced save
      if (year && calendarWeek && dayOfWeek !== undefined && meal && location) {
        if (saveTimer[slotKey]) clearTimeout(saveTimer[slotKey]);
        const timer = setTimeout(() => {
          fetch('/api/temperatures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              year,
              calendarWeek,
              dayOfWeek,
              meal,
              location,
              dishSlot: slotKey,
              tempCore: updated.core,
              tempServing: updated.serving,
            }),
          });
        }, 800);
        setSaveTimer(prev => ({ ...prev, [slotKey]: timer }));
      }

      onTempChange?.(slotKey, updated.core, updated.serving);
      return newTemps;
    });
  }, [year, calendarWeek, dayOfWeek, meal, location, saveTimer, onTempChange]);

  // Determine header color based on location
  const isCity = title.includes('City');
  const isMittag = title.includes('Mittag');

  return (
    <div className={`border border-primary-200 rounded-lg overflow-hidden ${compact ? 'text-[10px]' : 'text-xs'}`}>
      {/* Header */}
      <div className={`px-2 py-1.5 font-semibold text-center text-xs flex items-center justify-between ${
        isCity
          ? 'bg-primary-800 text-white'
          : 'bg-primary-600 text-white'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isMittag ? 'bg-accent-400' : 'bg-primary-300'}`} />
        <span>{title}</span>
        {pax && <span className="font-normal text-primary-300 text-[10px]">{pax}</span>}
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-primary-50 border-b border-primary-100">
            <th className="px-1.5 py-1 text-left font-semibold w-14 text-primary-600">Typ</th>
            <th className="px-1.5 py-1 text-left font-semibold text-primary-600">Gericht</th>
            <th className="px-1 py-1 text-center font-semibold w-10 text-primary-600">All.</th>
            <th className="px-1 py-1 text-center font-semibold w-[88px] text-primary-600">Temp.</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const dish = slot[row.key];
            const temp = temps[row.key] || { core: '', serving: '' };
            const isMainRow = row.isMain;

            return (
              <tr
                key={i}
                className={`border-b border-primary-50 transition-colors ${
                  isMainRow
                    ? 'bg-accent-50/40 hover:bg-accent-50'
                    : i % 2 === 0
                    ? 'bg-white hover:bg-primary-50/50'
                    : 'bg-primary-50/30 hover:bg-primary-50'
                }`}
              >
                <td className={`px-1.5 py-0.5 font-semibold ${isMainRow ? 'text-accent-700' : 'text-primary-500'}`}>
                  {row.label}
                </td>
                <td className={`px-1.5 py-0.5 ${isMainRow ? 'font-medium text-primary-900' : 'text-primary-700'}`}>
                  {dish?.name || <span className="text-primary-300">-</span>}
                </td>
                <td className="px-1 py-0.5 text-center">
                  {dish?.allergens && <AllergenBadge codes={dish.allergens} />}
                </td>
                <td className="px-1 py-0.5 text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <InlineTempInput
                      value={temp.core}
                      onChange={(v) => handleTempChange(row.key, 'core', v)}
                      placeholder="__"
                    />
                    <span className="text-primary-300">/</span>
                    <InlineTempInput
                      value={temp.serving}
                      onChange={(v) => handleTempChange(row.key, 'serving', v)}
                      placeholder="__"
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
