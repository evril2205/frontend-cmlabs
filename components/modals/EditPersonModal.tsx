"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface EditPersonModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    label: string;
  }) => void;
  initialData?: {
    name: string;
    email: string;
    phone: string;
    label: string;
  };
}

export default function EditPersonModal({
  open,
  onClose,
  onSave,
  initialData,
}: EditPersonModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    label: "",
  });

  // Sync data saat modal dibuka
  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSave = () => {
    console.log("Saving person data:", formData);
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md bg-white rounded-xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Edit Person Detail</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-gray-600">Contact Person</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A4FB0]"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email person"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A4FB0]"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+62 | 0000000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A4FB0]"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Label</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g., Decision Maker"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A4FB0]"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-[#5A4FB0] text-white py-2 rounded-full font-medium hover:opacity-90"
        >
          Save Change
        </button>
      </div>
    </div>
  );
}