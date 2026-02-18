"use client";

import React, { useState } from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";

export interface FilterState {
  date: string;
  creator: string;
  update: string;
  attachment: string;
}

interface FilterNoteModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export default function FilterNoteModal({
  open,
  onClose,
  onApply,
}: FilterNoteModalProps) {
  // ✅ INTERNAL STATE (yang tadi hilang → bikin merah)
  const [filters, setFilters] = useState<FilterState>({
    date: "All",
    creator: "All",
    update: "Recently Updated",
    attachment: "All",
  });

  // ✅ jangan render kalau tidak open
  if (!open) return null;

  const sections: { title: string; key: keyof FilterState; options: string[] }[] = [
    { title: "Date", key: "date", options: ["Today", "This Week", "This Month", "Last 3 Months"] },
    { title: "Creator", key: "creator", options: ["Created by Me", "Created by Others", "All"] },
    { title: "Update", key: "update", options: ["Recently Updated", "Oldest First"] },
    { title: "Attachment", key: "attachment", options: ["Has Attachment", "No Attachment", "All"] },
  ];

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[150]"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[375px] bg-white rounded-3xl shadow-md p-6 border border-gray-100 animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-[#5A4FB0]" />
            <h3 className="text-lg font-bold text-gray-900">Filter</h3>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* SECTIONS */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-[12px] tracking-wider text-black mb-3">
                {section.title}
              </h4>

              <div className="space-y-2">
                {section.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name={section.key}
                        checked={filters[section.key] === opt}
                        onChange={() =>
                          setFilters({ ...filters, [section.key]: opt })
                        }
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#5A4FB0]"
                      />

                      <div className="absolute w-2.5 h-2.5 bg-[#5A4FB0] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                    </div>

                    <span className="text-[12px] text-gray-600 group-hover:text-gray-900">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() =>
              setFilters({
                date: "All",
                creator: "All",
                update: "Recently Updated",
                attachment: "All",
              })
            }
            className="flex-1 py-2.5 border border-[#5A4FB5] text-[#5A4FB5] rounded-full text-sm font-semibold hover:bg-gray-50"
          >
            Clear
          </button>

          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#5A4FB0] text-white rounded-full text-sm font-semibold hover:opacity-90 shadow-md"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
