"use client";

import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface TeamHeaderProps {
  onAddTeam: () => void;
}

export default function TeamHeader({ onAddTeam }: TeamHeaderProps) {
  const [search, setSearch] = useState("");
  const [statusCount, setStatusCount] = useState<
    { name: string; count: number }[]
  >([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // fetch jumlah status
  const fetchStatus = async (value = "") => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/options/statuse",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setStatusCount(data.statusCount ?? []);
    } catch (err) {
      console.error("Fetch error:", err);
      setStatusCount([]);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const getCount = (name: string) => {
    const found = statusCount.find(
      (s) => s.name?.toLowerCase() === name.toLowerCase()
    );
    return found ? Number(found.count) : 0;
  };

  return (
    <div className="bg-[#f0f2f5] p-4">
      <div className="flex items-center justify-between py-4 mb-1">
        {/* Left Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Team Management
          </h1>
          <div className="text-sm flex gap-4 text-[#444444] mt-1">
            <span>• Active {getCount("Active")}</span>
            <span>• Inactive {getCount("Inactive")}</span>
            <span>• Onboarding {getCount("On Boarding")}</span>
            <span>• On Leave {getCount("On Leave")}</span>
          </div>
        </div>

        {/* Right Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="search for team"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                fetchStatus(e.target.value);
              }}
              className="border pl-10 pr-4 py-2 rounded-xl w-72 bg-white shadow-sm focus:outline-none"
            />
          </div>

          <button
            onClick={onAddTeam}
            className="bg-[#5A4FB5] hover:bg-[#4B43A3] text-white px-5 py-2 rounded-2xl flex items-center gap-2 shadow"
          >
            <span className="text-lg"> +</span> Add Team
          </button>
        </div>
      </div>
    </div>
  );
}
