'use client';

import { useState } from 'react';

interface TempInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TempInput({ label = 'Temp', value = '', onChange }: TempInputProps) {
  const [val, setVal] = useState(value);

  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-gray-400">{label}:</span>
      <input
        type="text"
        className="w-12 text-xs border border-gray-300 rounded px-1 py-0.5 text-center"
        placeholder="__/__"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
}
