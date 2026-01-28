// app/components/dashboard/useDashboardData.ts
import { useEffect, useState } from 'react';
import type { DashboardResponse } from './types';

type Params = {
  from?: string;
  to?: string;
  status?: string;
  q?: string;
};

export function useDashboardData(params: Params) {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        if (params.from) query.set('from', params.from);
        if (params.to) query.set('to', params.to);
        if (params.status) query.set('status', params.status);
        if (params.q) query.set('q', params.q);

        const res = await fetch(`/api/dashboard?${query.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json as DashboardResponse);
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message || 'Fetch error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, [params.from, params.to, params.status, params.q]);

  return { data, loading, error };
}
