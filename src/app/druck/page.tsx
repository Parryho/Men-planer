'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';


interface Dish { id: number; name: string; allergens: string; }
interface MealSlot {
  soup: Dish | null; main1: Dish | null; side1a: Dish | null; side1b: Dish | null;
  main2: Dish | null; side2a: Dish | null; side2b: Dish | null; dessert: Dish | null;
}
interface DayPlan {
  dayOfWeek: number;
  mittag: { city: MealSlot; sued: MealSlot };
  abend: { city: MealSlot; sued: MealSlot };
}
interface WeekPlan { weekNr: number; days: DayPlan[]; }

const DAY_NAMES_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const SLOT_LABELS = ['Suppe', 'Haupt 1', 'Beilage', 'Beilage', 'Haupt 2', 'Beilage', 'Beilage', 'Dessert'];
const SLOT_KEYS: (keyof MealSlot)[] = ['soup', 'main1', 'side1a', 'side1b', 'main2', 'side2a', 'side2b', 'dessert'];

function getDish(slot: MealSlot, idx: number): Dish | null {
  const d = slot[SLOT_KEYS[idx]];
  return d && typeof d === 'object' && 'name' in d ? d as Dish : null;
}

export default function DruckPageWrapper() {
  return <Suspense fallback={<div className="text-center py-8">Lade...</div>}><DruckPage /></Suspense>;
}

function DruckPage() {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const week = parseInt(searchParams.get('week') || '1');

  useEffect(() => {
    fetch(`/api/plans?year=${year}&week=${week}`).then(r => r.json()).then(setPlan);
  }, [year, week]);

  if (!plan) return <div className="text-center py-8">Lade...</div>;

  return (
    <div className="print:m-0 print:p-0">
      {/* Print controls - hidden when printing */}
      <div className="print:hidden mb-4 flex items-center gap-4">
        <h1 className="text-2xl font-bold">Druckansicht</h1>
        <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Drucken
        </button>
        <span className="text-sm text-gray-500">KW {week} / {year}</span>
      </div>

      {/* Print layout - A4 portrait, 4 blocks side by side */}
      <div className="print:block" style={{ fontSize: '6.5pt' }}>
        <style jsx>{`
          @media print {
            @page { size: A4 portrait; margin: 5mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>

        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {/* City Mittag */}
            <col style={{ width: '4%' }} />
            <col style={{ width: '5.5%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '3.5%' }} />
            <col style={{ width: '3.5%' }} />
            {/* spacer */}
            <col style={{ width: '0.5%' }} />
            {/* City Abend */}
            <col style={{ width: '4%' }} />
            <col style={{ width: '5.5%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '3.5%' }} />
            <col style={{ width: '3.5%' }} />
            {/* spacer */}
            <col style={{ width: '0.5%' }} />
            {/* SÜD Mittag */}
            <col style={{ width: '4%' }} />
            <col style={{ width: '5.5%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '3.5%' }} />
            <col style={{ width: '3.5%' }} />
            {/* spacer */}
            <col style={{ width: '0.5%' }} />
            {/* SÜD Abend */}
            <col style={{ width: '4%' }} />
            <col style={{ width: '5.5%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '3.5%' }} />
            <col style={{ width: '3.5%' }} />
          </colgroup>

          {/* Header */}
          <thead>
            <tr>
              <th colSpan={5} className="bg-blue-700 text-white px-1 py-0.5 text-center border">KW {week} City Mittag</th>
              <th className="border-0"></th>
              <th colSpan={5} className="bg-blue-700 text-white px-1 py-0.5 text-center border">City Abend</th>
              <th className="border-0"></th>
              <th colSpan={5} className="bg-blue-700 text-white px-1 py-0.5 text-center border">KW {week} SÜD Mittag</th>
              <th className="border-0"></th>
              <th colSpan={5} className="bg-blue-700 text-white px-1 py-0.5 text-center border">SÜD Abend</th>
            </tr>
            <tr className="bg-green-50">
              {[0, 1, 2, 3].map((blockIdx) => (
                <>
                  {blockIdx > 0 && <td key={`s${blockIdx}`} className="border-0"></td>}
                  <th key={`h1_${blockIdx}`} className="px-1 py-0 border text-left"></th>
                  <th key={`h2_${blockIdx}`} className="px-1 py-0 border text-left"></th>
                  <th key={`h3_${blockIdx}`} className="px-1 py-0 border text-left"></th>
                  <th key={`h4_${blockIdx}`} className="px-1 py-0 border text-center">Allerg.</th>
                  <th key={`h5_${blockIdx}`} className="px-1 py-0 border text-center">Temp.</th>
                </>
              ))}
            </tr>
          </thead>

          <tbody>
            {plan.days.map((day) => {
              const blocks: { meal: 'mittag' | 'abend'; loc: 'city' | 'sued'; pax: string; mealLabel: string }[] = [
                { meal: 'mittag', loc: 'city', pax: '60 PAX', mealLabel: 'Mittag' },
                { meal: 'abend', loc: 'city', pax: '60 PAX', mealLabel: 'Abend' },
                { meal: 'mittag', loc: 'sued', pax: '45 PAX', mealLabel: 'Mittag' },
                { meal: 'abend', loc: 'sued', pax: '45 PAX', mealLabel: 'Abend' },
              ];

              return Array.from({ length: 8 }, (_, slotIdx) => (
                <tr key={`${day.dayOfWeek}-${slotIdx}`} className={slotIdx === 0 ? 'border-t-2 border-gray-400' : ''}>
                  {blocks.map((block, blockIdx) => {
                    const slot = day[block.meal][block.loc];
                    const dish = getDish(slot, slotIdx);
                    return (
                      <>
                        {blockIdx > 0 && <td key={`sp_${blockIdx}_${slotIdx}`} className="border-0"></td>}
                        <td key={`d_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border" style={{ lineHeight: '1.1' }}>
                          {slotIdx === 0 && <span className="font-bold">{DAY_NAMES_SHORT[day.dayOfWeek]}</span>}
                          {slotIdx === 1 && <span className="text-gray-600">{block.mealLabel}</span>}
                          {slotIdx === 2 && <span className="text-gray-400 italic">{block.pax}</span>}
                        </td>
                        <td key={`l_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border font-semibold text-gray-600" style={{ lineHeight: '1.1' }}>
                          {SLOT_LABELS[slotIdx]}
                        </td>
                        <td key={`n_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border" style={{ lineHeight: '1.1' }}>
                          {dish?.name || ''}
                        </td>
                        <td key={`a_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border text-center text-red-600" style={{ lineHeight: '1.1' }}>
                          {dish?.allergens || ''}
                        </td>
                        <td key={`t_${blockIdx}_${slotIdx}`} className="px-0.5 py-0 border text-center" style={{ lineHeight: '1.1' }}>
                          {'__/__'}
                        </td>
                      </>
                    );
                  })}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
