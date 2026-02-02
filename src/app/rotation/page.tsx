'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import WeekGrid from '@/components/WeekGrid';

interface WeekPlan {
  weekNr: number;
  days: DayPlan[];
}

interface DayPlan {
  dayOfWeek: number;
  mittag: { city: MealSlot; sued: MealSlot };
  abend: { city: MealSlot; sued: MealSlot };
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

interface Dish {
  id: number;
  name: string;
  allergens: string;
}

export default function RotationPageWrapper() {
  return <Suspense fallback={<div className="text-center py-8">Lade...</div>}><RotationPage /></Suspense>;
}

function RotationPage() {
  const searchParams = useSearchParams();
  const [selectedWeek, setSelectedWeek] = useState(parseInt(searchParams.get('week') || '1'));
  const [plan, setPlan] = useState<WeekPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/plans?rotation=${selectedWeek}`)
      .then(r => r.json())
      .then(data => {
        setPlan(data);
        setLoading(false);
      });
  }, [selectedWeek]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">6-Wochen-Rotation</h1>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((w) => (
          <button
            key={w}
            onClick={() => setSelectedWeek(w)}
            className={`px-4 py-2 rounded font-semibold transition-colors ${
              w === selectedWeek
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Woche {w}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Lade Rotationsvorlage...</div>
      ) : plan ? (
        <WeekGrid days={plan.days}  />
      ) : (
        <div className="text-center py-8 text-gray-500">Keine Vorlage gefunden</div>
      )}
    </div>
  );
}
