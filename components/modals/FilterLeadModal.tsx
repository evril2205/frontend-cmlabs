"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  onApply: () => void;
  onClear: () => void;
}

const FilterLeadModal = ({ isOpen, onClose, filters, setFilters, onApply, onClear }: FilterLeadModalProps) => {
  if (!isOpen) return null;

  const handleChange = (category: string, value: string) => {
    // Diubah menjadi single select (radio behavior) sesuai permintaan
    setFilters({ ...filters, [category]: value });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Filter</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Baris 1: Stage & Currency */}
          <div className="grid grid-cols-12 gap-8 mb-10">
  <div className="col-span-12 md:col-span-8">
    <h3 className="font-semibold text-sm text-gray-900 mb-4">Stage</h3>
    <div className="grid grid-cols-2 gap-4">
      {/* Kolom Kiri */}
      <div className="space-y-2">
        {["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL"].map((opt) => (
          <RadioOption key={opt} label={opt} category="stages" selected={filters.stages} onChange={handleChange} />
        ))}
      </div>
      {/* Kolom Kanan */}
      <div className="space-y-2">
        {["NEGOTIATION", "CONTRACT_SENT", "WON", "LOST"].map((opt) => (
          <RadioOption key={opt} label={opt} category="stages" selected={filters.stages} onChange={handleChange} />
        ))}
      </div>
    </div>
  </div>
            
            <div className="col-span-12 md:col-span-4">
              <h3 className="font-semibold text-sm text-gray-900 mb-4">Currency</h3>
              <div className="space-y-2">
                {["IDR", "USD", "EUR"].map((opt) => (
                  <RadioOption key={opt} label={opt} category="currencies" selected={filters.currencies} onChange={handleChange} />
                ))}
              </div>
            </div>
          </div>

          <hr className="mb-8 border-gray-100" />

          {/* Baris 2: Label, Client Type, Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <FilterSection title="Label" category="labels" options={["Hot", "Cold", "Pitching", "Deal"]} selected={filters.labels} onChange={handleChange} />
            <FilterSection title="Client Type" category="clientTypes" options={["Existing", "New", "Prospect", "Former"]} selected={filters.clientTypes} onChange={handleChange} />
            <FilterSection title="Date" category="dateRange" options={["Today", "This Week", "This Month"]} selected={filters.dateRange} onChange={handleChange} />
          </div>

          <hr className="mb-8 border-gray-100" />

          {/* Baris 3: Priority, Update, Ownership */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FilterSection title="Priority" category="priorities" options={["High Priority", "Medium Priority", "Low Priority"]} selected={filters.priorities} onChange={handleChange} />
            <FilterSection title="Update" category="sortUpdate" options={["Recently Update", "Oldest First"]} selected={filters.sortUpdate} onChange={handleChange} />
            <FilterSection title="Ownership" category="ownership" options={["My Leads", "Other Leads", "All Leads"]} selected={filters.ownership} onChange={handleChange} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-end gap-3 bg-gray-50 border-t">
          <button 
            onClick={onClear} 
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-all text-sm"
          >
            Clear All
          </button>
          <button 
            onClick={onApply} 
            className="px-10 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all text-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const RadioOption = ({ label, category, selected, onChange }: any) => (
  <label className="flex items-center gap-3 text-sm text-gray-600 cursor-pointer group w-fit">
    <input 
      type="radio" 
      checked={selected === label}
      onChange={() => onChange(category, label)}
      className="w-4 h-4 border-gray-300 text-purple-600 focus:ring-purple-500 rounded-full"
    />
    <span className="group-hover:text-purple-600 transition-colors">
      {label === "NEW" ? "Lead In" : 
       label === "CONTACTED" ? "Contact Made" : 
       label === "QUALIFIED" ? "Need Identified" : 
       label === "PROPOSAL" ? "Proposal Made" : label}
    </span>
  </label>
);

const FilterSection = ({ title, options, category, selected, onChange }: any) => (
  <div className="flex flex-col gap-3">
    <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
    <div className="space-y-2">
      {options.map((opt: string) => (
        <RadioOption key={opt} label={opt} category={category} selected={selected} onChange={onChange} />
      ))}
    </div>
  </div>
);

export default FilterLeadModal;