"use client";

import React, { useState, useEffect } from "react"; // Gunakan satu import saja
import { XMarkIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";

interface EditLeadSummaryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData: any; 
}

export default function EditLeadSummaryModal({
  open,
  onClose,
  onSave,
  initialData,
}: EditLeadSummaryModalProps) {
  
  // Inisialisasi state dengan initialData
  const [formData, setFormData] = useState(initialData);

  // PENTING: Sync data ketika modal dibuka
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSave = () => {
    console.log("Saving data from modal:", formData); // Cek console apakah data berubah
    onSave(formData); 
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Edit Lead Summary</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <Input
      label="Deal Value"
      value={formData?.dealValue || ""}
      onChange={(v) => setFormData({ ...formData, dealValue: v })}
    />

          <CustomSelect
            label="Currency"
            value={formData.currency}
            options={["IDR", "USD", "EUR"]}
            onChange={(v) => setFormData({ ...formData, currency: v })}
          />

          <Input
            label="Company Name"
            placeholder="Enter company name"
            value={formData.company}
            onChange={(v) => setFormData({ ...formData, company: v })}
          />

          <Input
            label="Contact Person"
            placeholder="Enter contact person"
            value={formData.contactPerson}
            onChange={(v) => setFormData({ ...formData, contactPerson: v })}
          />

          <CustomSelect
            label="Label"
            value={formData.label}
            options={["Hot", "Cold", "Pitching", "Deal"]}
            onChange={(v) => setFormData({ ...formData, label: v })}
          />

          <CustomSelect
            label="Priority"
            value={formData.priority}
            placeholder="Select priority"
            options={["High Priority", "Medium Priority", "Low Priority"]}
            onChange={(v) => setFormData({ ...formData, priority: v })}
          />

          <CustomSelect
            label="Client Type"
            value={formData.clientType}
            options={["New Client", "Existing Client", "Prospect", "Former Client"]}
            onChange={(v) => setFormData({ ...formData, clientType: v })}
          />

          <CustomSelect
            label="Stage"
            value={formData.stage}
            options={["Lead in", "Contact Made", "Need Identified", "Proposal Made", "Negotiation Started", "Contract Send", "Won", "Lost"]}
            onChange={(v) => setFormData({ ...formData, stage: v })}
          />
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            className="px-12 py-2.5 rounded-full bg-[#5A4FB0] text-white text-sm font-medium hover:bg-[#483e8f] transition-all"
          >
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function Input({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#5A4FB0]"
      />
    </div>
  );
}

/* ================= CUSTOM SELECT COMPONENT ================= */

function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>

      {/* TRIGGER HEADER */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 border border-gray-300 rounded-md flex items-center justify-between text-sm bg-white transition-all"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder || "-"}
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* DROPDOWN OPTIONS */}
      {open && (
        <>
          {/* Overlay klik luar untuk menutup */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div className="absolute z-20 w-full mt-[68px] bg-white border border-gray-200 rounded-md shadow-lg py-1 overflow-hidden">
            {options.map((opt) => {
              const isSelected = opt === value;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`
                    group w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors
                    hover:bg-[#CCC8E8]
                    ${isSelected ? "bg-[#CCC8E8]/40 font-medium text-[#5A4FB0]" : "text-gray-700"}
                  `}
                >
                  <span className="truncate">{opt}</span>
                  
                  {/* ICON CHECK: Muncul saat HOVER (group-hover) atau jika sudah SELECTED */}
                  <CheckIcon 
                    className={`w-4 h-4 text-[#5A4FB0] transition-opacity
                      ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `} 
                  />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}