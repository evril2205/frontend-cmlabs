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
  // --- 1. SEMUA HOOKS DI ATAS ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    label: "",
  });

  const [countryCode, setCountryCode] = useState("+62");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);

        // Logic pecah nomor telepon
        if (initialData.phone && initialData.phone.trim() !== "") {
          const parts = initialData.phone.split(" ");
          if (parts.length > 1) {
            setCountryCode(parts[0]);
            setPhoneNumber(parts[1]);
          } else {
            // Jika tidak ada spasi, asumsikan 3 karakter awal adalah kode negara
            if (initialData.phone.startsWith("+")) {
              setCountryCode(initialData.phone.substring(0, 3));
              setPhoneNumber(initialData.phone.substring(3));
            } else {
              setCountryCode("+62");
              setPhoneNumber(initialData.phone);
            }
          }
        } else {
          // Default jika phone kosong
          setCountryCode("+62");
          setPhoneNumber("");
        }
      }
    }
  }, [open, initialData]);

  // --- 2. LOGIKA SAVE ---
const [emailError, setEmailError] = useState("");

// Fungsi cek format email
const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleSave = () => {
  // Jika email diisi tapi formatnya ngaco
  if (formData.email && !isEmailValid(formData.email)) {
    setEmailError("Please enter a valid email address (e.g. name@company.com)");
    return; // Berhenti, jangan save dulu
  }

  setEmailError(""); // Reset error kalau udah bener
  const finalPhone = `${countryCode} ${phoneNumber}`.trim();
  onSave({ ...formData, phone: finalPhone });
  onClose();
};
  

  // --- 3. RETURN KONDISIONAL ---
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-xl p-6 relative shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">Edit Person Detail</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4 text-sm">
          {/* Contact Person - Locked */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Contact Person</label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full border bg-gray-50 border-gray-200 rounded-lg px-3 py-2 text-gray-500 cursor-not-allowed "
            />
          </div>

          <div>
      <label className="block mb-1 text-gray-600 font-medium">Email Address</label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
          if (emailError) setEmailError(""); // Hapus error pas user mulai ngetik lagi
        }}
        placeholder="example@mail.com"
        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5A4FB0] transition-all ${
          emailError ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
        }`}
      />
      {/* Pesan Error Muncul di Sini */}
      {emailError && (
        <p className="text-[10px] text-red-500 mt-1 font-medium animate-in fade-in slide-in-from-top-1">
          {emailError}
        </p>
      )}
    </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 text-gray-600 font-medium">Phone Number</label>
            <div className="flex items-center w-full border border-gray-300 rounded-lg px-2 py-2 focus-within:ring-2 focus-within:ring-[#5A4FB0] focus-within:border-transparent bg-white transition-all">
              
              {/* Kode Negara - Lebar pas & tanpa padding berlebih */}
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.replace(/[^\d+]/g, ""))}
                className="w-[45px] font-medium text-gray-700 focus:outline-none bg-transparent text-center"
                placeholder="+62"
              />

              {/* Pembatas - Jarak rapat (mx-1) */}
              <span className="text-gray-300 mx-1 font-light">|</span>

              {/* Nomor HP - Flex-1 ambil sisa space */}
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                className="flex-1 focus:outline-none bg-transparent text-gray-800 ml-1"
                placeholder="812345678"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="mt-8 w-full bg-[#5A4FB0] text-white py-2.5 rounded-full font-semibold shadow-lg shadow-[#5A4FB0]/30 hover:bg-[#483e8f] active:scale-[0.98] transition-all"
        >
          Save Change
        </button>
      </div>
    </div>
  );
}