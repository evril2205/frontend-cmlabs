'use client';

import React, { useState } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/solid';

export interface FilterState {
  date: string;
  creator: string;
  update: string;
  attachment: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export default function FilterNoteModal({
  isOpen,
  onClose,
  onApply,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    date: '',
    creator: 'All',
    update: '',
    attachment: 'All',
  });

  const setValue = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({
      date: '',
      creator: 'All',
      update: '',
      attachment: 'All',
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <FunnelIcon className="w-5 h-5 text-[#5A4FB5]" />
            <h3 className="font-bold text-gray-900">Filter Notes</h3>
          </div>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-10">

            {/* LEFT COLUMN */}
            <div className="space-y-6">

              {/* Date */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Date</h4>
                <div className="space-y-2 text-sm">
                  {['Today', 'This Week', 'This Month', 'Last 3 Months'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="date"
                        checked={filters.date === opt}
                        onChange={() => setValue('date', opt)}
                        className="
  w-4 h-4 
  text-[#5A4FB5] 
  border-gray-300 
  focus:ring-0 
  focus:ring-offset-0
  accent-[#5A4FB5]
"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Update */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Update</h4>
                <div className="space-y-2 text-sm">
                  {['Recently Updated', 'Oldest First'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="update"
                        checked={filters.update === opt}
                        onChange={() => setValue('update', opt)}
                        className="
  w-4 h-4 
  text-[#5A4FB5] 
  border-gray-300 
  focus:ring-0 
  focus:ring-offset-0
  accent-[#5A4FB5]
"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-2">

              {/* Creator */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Creator</h4>
                <div className="space-y-2 text-sm">
                  {['Created by Me', 'Created by Others', 'All'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="creator"
                        checked={filters.creator === opt}
                        onChange={() => setValue('creator', opt)}
                        className="
  w-4 h-4 
  text-[#5A4FB5] 
  border-gray-300 
  focus:ring-0 
  focus:ring-offset-0
  accent-[#5A4FB5]
"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Attachment */}
              <div>
                <h4 className="font-semibold mb-3 text-sm">Attachment</h4>
                <div className="space-y-2 text-sm">
                  {['Has Attachment', 'No Attachment', 'All'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="attachment"
                        checked={filters.attachment === opt}
                        onChange={() => setValue('attachment', opt)}
                        className="
  w-4 h-4 
  text-[#5A4FB5] 
  border-gray-300 
  focus:ring-0 
  focus:ring-offset-0
  accent-[#5A4FB5]
"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={handleClear}
            className="px-6 py-2 rounded-full border border-[#5A4FB5] text-[#5A4FB5] font-medium text-sm"
          >
            Clear
          </button>

          <button
            onClick={() => {
              onApply(filters);
              onClose();
            }}
            className="px-6 py-2 rounded-full bg-[#5A4FB5] text-white font-medium text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}
