// app/components/dashboard/KpiCard.tsx
import React from 'react';

type Props = {
  title: string;
  value: string | number;
  delta?: number;
  className?: string;
};

export default function KpiCard({ title, value, delta, className = '' }: Props) {
  const deltaText = delta === undefined ? null : `${delta > 0 ? '↗' : '↘'} ${Math.abs(delta)}%`;
  return (
    <div className={`p-4 rounded-lg shadow-sm bg-gradient-to-br from-purple-600 to-purple-500 text-white ${className}`}>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {deltaText && <div className="text-xs mt-1 opacity-90">{deltaText}</div>}
    </div>
  );
}
