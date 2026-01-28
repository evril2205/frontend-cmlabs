"use client";

import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CompanyForm {
  companyName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface EditCompanyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CompanyForm) => void;
  initialData?: CompanyForm; // ✅ Tambah ini
}

export default function EditCompanyModal({
  open,
  onClose,
  onSave,
  initialData, // ✅ Terima prop ini
}: EditCompanyModalProps) {
  const [form, setForm] = useState<CompanyForm>({
    companyName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // ✅ Sync data saat modal dibuka
  useEffect(() => {
    if (open && initialData) {
      setForm(initialData);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving company data:", form);
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-xl p-6 relative">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Company Detail
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
          />
          <Input
            label="Email Company"
            name="email"
            placeholder="Enter Email Company"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="Street Address"
            name="street"
            placeholder="Enter street address"
            value={form.street}
            onChange={handleChange}
          />
          <Input
            label="City"
            name="city"
            placeholder="Enter city"
            value={form.city}
            onChange={handleChange}
          />
          <Input
            label="State"
            name="state"
            placeholder="Enter state or province"
            value={form.state}
            onChange={handleChange}
          />
          <Input
            label="Postal Code"
            name="postalCode"
            placeholder="Enter postal code"
            value={form.postalCode}
            onChange={handleChange}
          />
          <Input
            label="Country"
            name="country"
            placeholder="Enter country"
            value={form.country}
            onChange={handleChange}
            className="col-span-2"
          />
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            className="px-10 py-2 rounded-full bg-[#5A4FB0] text-white font-medium hover:opacity-90"
          >
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm text-gray-700">{label}</label>
      <input
        {...props}
        className="h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4FB0]"
      />
    </div>
  );
}