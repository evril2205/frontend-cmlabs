"use client";
import React, { useEffect, useState } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { getLeads } from '@/services/leadService';

// Definisikan tipe data sederhana agar TS tidak bingung
interface Lead {
  id: number;
  value?: number;
  pipelineStatus: string;
  createdAt: string;
}

export default function DashboardPage() {
  // ✅ PERBAIKAN: Beritahu useState bahwa isinya adalah array dari Lead
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Beritahu TS bahwa 'res' adalah object 'any' supaya dia tidak komplain
        const res: any = await getLeads();
        
        // Logika untuk mengekstrak array leads dari response API
        let actualData = [];
        if (Array.isArray(res)) {
          actualData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          actualData = res.data;
        } else if (res?.data?.data && Array.isArray(res.data.data)) {
          actualData = res.data.data;
        }

        setLeads(actualData);
      } catch (err) {
        console.error("Gagal ambil data dashboard:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <main>
      <Dashboard realLeads={leads} />
    </main>
  );
}