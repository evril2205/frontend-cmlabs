// app/components/dashboard/types.ts
export type KpiItem = {
  id: string;
  label: string;
  value: number | string;
  delta?: number; // persen, positif/negatif
  trend?: 'up' | 'down' | 'flat';
};

export type DashboardResponse = {
  kpis: KpiItem[];
  totals: {
    totalWon: number;
    totalLost: number;
    totalLeads: number;
    activeLeads: number;
  };
  rows: any[]; // data tabel / list yang bisa di-export; sesuaikan dengan backend
};
