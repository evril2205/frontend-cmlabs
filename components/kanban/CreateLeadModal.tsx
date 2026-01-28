"use client";

import { useState, useEffect } from "react"; // Tambahkan useEffect
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLead } from "@/services/leadService"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BriefcaseIcon, ChevronDownIcon, CheckIcon, CalendarIcon } from "@heroicons/react/24/solid";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const CreateLeadModal = ({ isOpen, onClose, onSubmit }: CreateLeadModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "", 
    currency: "IDR",
    stage: "",
    label: "",
    contacts: "",
    teamMember: "", 
    description: "",
  });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  // MENGATASI ERROR userLogin: Ambil data user dari localStorage saat komponen dimuat
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user"); // Sesuaikan key 'user' dengan sistem loginmu
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData({
        title: "", value: "", currency: "IDR", stage: "",
        label: "", contacts: "", teamMember: "", description: "",
      });
      setDueDate(null);
      onClose();
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  // 1. VALIDASI (Cek input dulu sebelum jalanin yang lain)
  if (!formData.title.trim() || !formData.contacts.trim() || !formData.stage) {
    alert("Mohon isi Lead Title, Contacts, dan Stage!");
    return;
  }

  setLoading(true);

  try {
    // 2. MAPPING STATUS (Jembatan dari UI ke Database temanmu)
    const statusMap: Record<string, string> = {
      "Lead In": "NEW",
      "Contact Made": "CONTACTED",
      "Need Identified": "QUALIFIED",
      "Proposal Made": "PROPOSAL",
      "Negotiation": "NEGOTIATION",
      "Contract Send": "NEGOTIATION", 
      "Won": "WON",
      "Lost": "LOST",
    };

    // 3. PREPARE DATA (Pastikan semua field terisi agar tidak NULL)
    const leadData = {
      title: formData.title,
      contactPerson: formData.contacts,
      dealValue: Number(formData.value) || 0,
      currency: formData.currency || "IDR", // Default IDR jika kosong
      status: statusMap[formData.stage] || "NEW", // Mapping ke status backend
      label: formData.label,
      dueDate: dueDate ? dueDate.toISOString() : new Date().toISOString(),
      description: formData.description || "-",
      picId: currentUser?.id || 1, 
      companyName: "-", 
      sourceOrigin: "Web Form",
    } as any;

    console.log("Data yang akan dikirim ke DB:", leadData);

    // 4. KIRIM KE BACKEND
    const response = await createLead(leadData);
    
    // 5. HANDLING RESPONSE
    if (response && (response.success || response.data)) {
      alert("Lead Berhasil Dibuat!"); // Muncul notifikasi
      onSubmit(); // Refresh data di Kanban Board
      handleOpenChange(false); // Tutup modal otomatis
    } else {
      alert(`Gagal: ${response.message || "Backend menolak data"}`);
    }

  } catch (err: any) {
    console.error("Error Detail:", err);
    alert("Gagal menyimpan data. Cek koneksi atau kolom database.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-xl overflow-visible shadow-2xl border-none">
        <DialogHeader className="bg-white px-5 py-4 rounded-t-xl border-b flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#5A4FB5] rounded-full flex items-center justify-center shadow-inner">
              <BriefcaseIcon className="w-4 h-4 text-white" />
            </div>
            <DialogTitle className="text-gray-800 text-sm font-bold tracking-tight">
              Create New Lead
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Form Body - Tetap pakai BG original kamu */}
        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 ml-1">Lead Title </label>
            <input
              type="text"
              placeholder="Enter Lead Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200  text-xs focus:ring-2 focus:ring-[#5A4FB5]/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 ml-1">Value</label>
              <input
                type="number"
                placeholder="0"
                value={formData.value}
                onChange={(e) => handleChange("value", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200  text-xs outline-none"
              />
            </div>
            <CustomSelect
              label="Currency"
              value={formData.currency}
              options={["IDR", "USD", "EUR"]}
              onChange={(v) => handleChange("currency", v)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomSelect
              label="Stage *"
              value={formData.stage}
              placeholder="Select Stage"
              options={["Lead In", "Contact Made", "Need Identified", "Proposal Made", "Negotiation", "Contract Send", "Won", "Lost"]}
              onChange={(v) => handleChange("stage", v)}
            />
            <CustomSelect
              label="Label"
              value={formData.label}
              placeholder="Label"
              options={["Cold", "Hot", "Pitching", "Deal"]}
              onChange={(v) => handleChange("label", v)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 ml-1">Contacts </label>
            <input
              type="text"
              placeholder="Enter Contacts Name"
              value={formData.contacts}
              onChange={(e) => handleChange("contacts", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200  text-xs outline-none"
            />
          </div>

          <div className="space-y-1">
            <CustomSelect
              label="Team Member"
              value={formData.teamMember}
              placeholder="Enter Team Member"
              options={["William M", "Nur", "Responsible Team"]}
              onChange={(v) => handleChange("teamMember", v)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 ml-1">Due Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <DatePicker
                selected={dueDate}
                onChange={(date: Date | null) => setDueDate(date)}
                placeholderText="Select Date"
                dateFormat="dd/MM/yyyy"
                className="w-full pl-10 pr-3 py-2 border border-gray-200  text-xs bg-white outline-none"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500  ml-1">Description</label>
            <textarea
              placeholder="Enter Lead Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200  text-xs outline-none resize-none"
            />
          </div>
        </div>

        <div className="p-5 bg-white rounded-b-xl border-t flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full max-w-[280px] py-3 rounded-full text-white text-xs font-bold shadow-lg transition-all active:scale-95 ${
              loading ? "bg-gray-400" : "bg-[#5A4FB5] hover:bg-[#4a3f95]"
            }`}
          >
            {loading ? "PROCESSING..." : "Create Lead"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
/* ================= CUSTOM SELECT COMPONENT ================= */

function CustomSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col w-full">
      <label className="block mb-1 text-[11px] font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* TRIGGER HEADER: Normal (Abu-abu) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-[34px] px-3 border border-gray-300 rounded-md flex items-center justify-between text-[11px] bg-white transition-all focus:ring-1 focus:ring-[#5A4FB5]"
      >
        <span className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder || "Select"}
        </span>
        <ChevronDownIcon className={"w-3.5 h-3.5 text-gray-500 transition-transform " + (open ? "rotate-180" : "")} />
      </button>

      {/* DROPDOWN OPTIONS */}
      {open && (
        <>
          {/* Overlay klik luar */}
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />

          <div className="absolute z-[70] w-full mt-[54px] bg-white border border-gray-200 rounded-md shadow-lg py-1 overflow-hidden">
            {options.map((opt) => {
              const isSelected = opt.toLowerCase() === value.toLowerCase();

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`
                    group w-full px-3 py-2 text-left text-[11px] flex items-center justify-between transition-colors
                    hover:bg-[#CCC8E8]
                    ${isSelected ? "bg-[#CCC8E8]/40 font-semibold text-[#5A4FB5]" : "text-gray-700"}
                  `}
                >
                  <span className="truncate">{opt}</span>
                  
                  {/* ICON CHECK: Muncul saat HOVER atau sudah SELECTED */}
                  <CheckIcon 
                    className={`w-3.5 h-3.5 text-[#5A4FB5] transition-opacity
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

export default CreateLeadModal;