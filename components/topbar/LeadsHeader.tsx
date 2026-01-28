"use client";

import {
  FunnelIcon,
  ArchiveBoxIcon,
  ChevronDownIcon,
  ListBulletIcon,
  Squares2X2Icon
} from "@heroicons/react/24/solid";
import React from "react";

interface LeadsHeaderProps {
 onViewToggle: (view: "list" | "grid" | "kanban" | "archive") => void;
  onArchiveToggle: (show: boolean) => void;
  onAddLead?: () => void;
  onFilterClick: () => void; // Tombol filter lo ada di sini
  activeFilterCount?: number;
  isArchiveMode: boolean; // State ini harus dikirim dari Parent
  currentView: "list" | "grid" | "kanban" | "archive" | "detail";
}

const LeadsHeader: React.FC<LeadsHeaderProps> = ({ 
  onViewToggle, 
  onAddLead, 
  onArchiveToggle, 
  onFilterClick, 
  activeFilterCount = 0,
  isArchiveMode,
  currentView
}) => {
  return (
    <div className="bg-[#f0f2f5]">
      <div className="flex items-center justify-between py-0.5 mb-0">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">
            {isArchiveMode ? "Archived Leads" : "Leads"}
          </h1>
          <p className="text-[10px] text-gray-500 mb-1">Showing data for current month</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={onAddLead} className="bg-[#5A4FB5] hover:bg-[#4a3f95] text-white px-3 py-1 rounded-full text-xs font-medium">
            + Add Lead
          </button>
          <button className="bg-white border border-purple-500 text-gray-800 px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1">
            <img src="/assets/icons/sparkles.svg" alt="AI Chart" className="w-3 h-3" />
            AI Chart
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 mt-0.5">
        <div className="flex items-center gap-1.5">
          {/* View Toggle */}
          <div className="flex items-center border border-gray-400 rounded-full bg-white overflow-hidden h-7">
            <button
              onClick={() => onViewToggle("kanban")}
  className={`flex items-center justify-center w-8 h-7 rounded-full transition-all ${
    currentView === "kanban" ? "bg-[#6C20D0]" : "bg-transparent"
  }`}
>
          <img
  src="/assets/icons/view-kanban.svg"
  className={`w-3.5 h-3.5 transition-all ${
    currentView === "kanban"
      ? "brightness-0 invert" // jadi putih saat aktif (background ungu)
      : "brightness-0 saturate-0 opacity-60" // jadi abu saat tidak aktif
  }`}
/>
            </button>
            <button
              onClick={() => onViewToggle("list")}
              className={`flex items-center justify-center w-8 h-7 rounded-full transition-all ${currentView === "list" ? "bg-[#6C20D0]" : "bg-transparent"}`}
            >
              <ListBulletIcon className={`w-3.5 h-3.5 ${currentView === "list" ? "text-white" : "text-[#818083]"}`} />
            </button>
          </div>

          {/* Archive Toggle */}
          <button
            onClick={() => onArchiveToggle(!isArchiveMode)}
            className={`flex items-center gap-1 px-2 py-1 border rounded-full text-[10px] transition-all ${isArchiveMode ? "bg-[#BEBEBE] text-[#2E2F2F] border-[#2E2F2F]" : "bg-white text-[#818083] border-gray-400"}`}
          >
            <ArchiveBoxIcon className="w-3.5 h-3.5" />
            Archive
          </button>

          {/* Filter Button - INI HARUSNYA NYALA SEKARANG */}
          <button
            onClick={() => {
              console.log("Filter Button Clicked!"); // Cek di F12
              onFilterClick();
            }}
            className="flex items-center gap-1 px-2 py-1 border border-gray-400 text-[10px] text-[#818083] rounded-full bg-white hover:bg-gray-50 shadow-sm"
          >
            <FunnelIcon className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-purple-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDownIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadsHeader;