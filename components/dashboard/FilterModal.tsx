'use client';

import React, { useState } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/solid';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  stage: string[];
  currency: string[];
  priority: string[];
  label: string[];
  clientType: string[];
  ownership: string;
}

export default function FilterModal({ isOpen, onClose, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    stage: [],
    currency: [],
    priority: [],
    label: [],
    clientType: [],
    ownership: 'All Leads'
  });

  const handleRadioChange = (category: keyof FilterState, value: string) => {
    if (category === 'ownership') {
      setFilters({ ...filters, ownership: value });
      return;
    }

    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    setFilters({ ...filters, [category]: newValues });
  };

  const handleClear = () => {
    setFilters({
      stage: [],
      currency: [],
      priority: [],
      label: [],
      clientType: [],
      ownership: 'All Leads'
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-[#5A4FB0]" />
            <h3 className="text-lg font-bold text-gray-900">Filter</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {/* Stage & Currency */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* SECTION STAGE */}
  <div className="flex-1">
    <h4 className="text-sm font-semibold text-gray-900 mb-3">Stage</h4>
    
    {/* Grid untuk membagi 4 kiri dan 4 kanan */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      {['Lead in', 'Contact Made', 'Need Identified', 'Proposal Made', 'Negotiation', 'Contract Send', 'Won', 'Lost'].map((stage) => (
        <label key={stage} className="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            name="stage-filter" // Tambahkan name supaya radio button berfungsi benar
            checked={filters.stage.includes(stage)}
            onChange={() => handleRadioChange('stage', stage)}
            className="w-4 h-4 rounded-full border-gray-300 text-[#5A4FB0] focus:ring-[#5A4FB0] cursor-pointer"
          />
          <span className="text-xs text-gray-700 group-hover:text-gray-900 whitespace-nowrap">
            {stage}
          </span>
        </label>
      ))}
    </div>
    </div>

            {/* Currency */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Currency</h4>
              <div className="space-y-2">
                {['IDR', 'USD', 'UER'].map((currency) => (
                  <label key={currency} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={filters.currency.includes(currency)}
                      onChange={() => handleRadioChange('currency', currency)}
                      className="w-4 h-4 rounded border-gray-300 text-[#5A4FB0] focus:ring-[#5A4FB0] cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">{currency}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Priority, Label & Client Type */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Priority */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Priority</h4>
              <div className="space-y-2">
                {['High Priority', 'Medium Priority', 'Low Priority'].map((priority) => (
                  <label key={priority} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={filters.priority.includes(priority)}
                      onChange={() => handleRadioChange('priority', priority)}
                      className="w-4 h-4 rounded border-gray-300 text-[#5A4FB0] focus:ring-[#5A4FB0] cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Label */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Label</h4>
              <div className="space-y-2">
                {['Hot', 'Cold', 'Pitching', 'Deal'].map((label) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={filters.label.includes(label)}
                      onChange={() => handleRadioChange('label', label)}
                      className="w-4 h-4 rounded border-gray-300 text-[#5A4FB0] focus:ring-[#5A4FB0] cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Client Type */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Client Type</h4>
              <div className="space-y-2">
                {['Existing Client', 'New Client', 'Prospect', 'Former Client'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      checked={filters.clientType.includes(type)}
                      onChange={() => handleRadioChange('clientType', type)}
                      className="w-4 h-4 rounded border-gray-300 text-[#5A4FB0] focus:ring-[#5A4FB0] cursor-pointer"
                    />
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Ownership */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Ownership</h4>
            <div className="flex gap-4">
              {['All Leads', 'My Leads', 'Other leads'].map((ownership) => (
                <label key={ownership} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="ownership"
                    checked={filters.ownership === ownership}
                    onChange={() => handleRadioChange('ownership', ownership)}
                    className="w-4 h-4 border-gray-300 text-[#5A4FB0] focus:ring-[#5A4FB0] cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 group-hover:text-gray-900">{ownership}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleClear}
            className="px-6 py-2 border border-[#5A4FB0] text-[#5A4FB0] rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-[#5A4FB0] text-white rounded-full text-sm font-medium hover:bg-[#4A3F90] transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
}