"use client";

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface FilterInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function FilterInvoiceModal({ open, onClose, onApply }: FilterInvoiceModalProps) {
  const [filters, setFilters] = useState({
    date: 'all',
    creator: 'all',
    dueDate: 'all',
    update: 'recently',
    status: 'all'
  });

  if (!open) return null;

  const handleClear = () => {
    setFilters({
      date: 'all',
      creator: 'all',
      dueDate: 'all',
      update: 'recently',
      status: 'all'
    });
  };

  const handleApply = () => {
    onApply(filters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 font-poppins">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#5A4FB0] rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Filter</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Options Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          
          {/* Date */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Date</h3>
            <div className="space-y-2">
              {['Today', 'This Week', 'This Month', 'Last 3 Months'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="date"
                    checked={filters.date === option.toLowerCase().replace(' ', '-')}
                    onChange={() => setFilters({ ...filters, date: option.toLowerCase().replace(' ', '-') })}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Creator */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Creator</h3>
            <div className="space-y-2">
              {['Created by Me', 'Created by Others', 'All'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="creator"
                    checked={filters.creator === option.toLowerCase().replace(' ', '-')}
                    onChange={() => setFilters({ ...filters, creator: option.toLowerCase().replace(' ', '-') })}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Due Date</h3>
            <div className="space-y-2">
              {['Due Today', 'Due this Week', 'Overdue', 'All'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dueDate"
                    checked={filters.dueDate === option.toLowerCase().replace(' ', '-')}
                    onChange={() => setFilters({ ...filters, dueDate: option.toLowerCase().replace(' ', '-') })}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Update & Status Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Update */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Update</h3>
            <div className="space-y-2">
              {['Recently Updated', 'Oldest First'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="update"
                    checked={filters.update === option.toLowerCase().replace(' ', '-')}
                    onChange={() => setFilters({ ...filters, update: option.toLowerCase().replace(' ', '-') })}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status</h3>
            <div className="space-y-2">
              {['Draft', 'Sent', 'Paid', 'Overdue', 'Canceled', 'All'].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={filters.status === option.toLowerCase().replace(' ', '-')}
                    onChange={() => setFilters({ ...filters, status: option.toLowerCase().replace(' ', '-') })}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-xs text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 border border-[#5A4FB0] text-[#5A4FB0] rounded-full text-sm font-semibold hover:bg-purple-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 bg-[#5A4FB0] text-white rounded-full text-sm font-semibold hover:bg-[#4A3F90] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}