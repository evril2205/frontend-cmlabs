"use client";
import { Fragment, useState, useEffect } from "react"; // ✅ Tambah useEffect
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";



// --- DATA CONSTANTS ---
const SOURCE_ORIGINS = ["Website", "Social Media", "Referral", "Offline", "Ads / Campaign"];
const SOURCE_CHANNELS: Record<string, string[]> = {
  Website: [],
  "Social Media": ["Instagram", "Facebook", "LinkedIn", "Twitter / X", "Whatsapp", "YouTube", "Email"],
  Referral: ["Existing Client Recommendation", "Strategic Partner Network", "Vendor Referral", "Employee Referral", "Affiliate Program"],
  Offline: ["Inbound Call", "Walk-In Customer", "Printed Brochure", "Seminar", "Workshop", "Event Booth"],
  "Ads / Campaign": ["Google Search Ads", "Facebook Paid Ads", "Instagram Sponsored Ads", "LinkedIn Targeted Ads", "X (Twitter) Promoted Posts", "YouTube Pre-roll Ads", "Display Network Ads", "Sponsored Content"],
};

interface DropdownProps {
  label: string;
  value: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  options: string[];
  onSelect: (val: string) => void;
  disabled?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { sourceOrigin: string | null; sourceChannel: string | null; sourceId: string }) => void;
  initialData?: { // ✅ Tambah ini
    sourceOrigin: string | null;
    sourceChannel: string | null;
    sourceId: string;
  };
}

export default function EditSourceModal({ open, onClose, onSave, initialData }: Props) {
  const [originOpen, setOriginOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);

  const [sourceOrigin, setSourceOrigin] = useState<string | null>(null);
  const [sourceChannel, setSourceChannel] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState("");


  const handleSave = () => {
    // 2. KIRIM SEMUA DATA TERMASUK SOURCE ID
    onSave({
      sourceOrigin,
      sourceChannel,
      sourceId, 
    });
    onClose();
  };

   useEffect(() => {
    if (open && initialData) {
      setSourceOrigin(initialData.sourceOrigin);
      setSourceChannel(initialData.sourceChannel);
      setSourceId(initialData.sourceId);
    }
  }, [open, initialData]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Edit Source</h2>
              <button onClick={onClose}>
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* DROPDOWN ORIGIN */}
            <Dropdown
              label="Source Origin"
              value={sourceOrigin}
              open={originOpen}
              setOpen={setOriginOpen}
              options={SOURCE_ORIGINS}
              onSelect={(val: string) => {
                setSourceOrigin(val);
                setSourceChannel(null); 
                setOriginOpen(false);
              }}
            />

            {/* DROPDOWN CHANNEL */}
            <Dropdown
              label="Source Channel"
              value={sourceChannel}
              open={channelOpen}
              setOpen={setChannelOpen}
              options={sourceOrigin ? SOURCE_CHANNELS[sourceOrigin] : []}
              onSelect={(val: string) => {
                setSourceChannel(val);
                setChannelOpen(false);
              }}
              disabled={!sourceOrigin}
            />

            {/* 3. INPUT MANUAL UNTUK SOURCE ID */}
            <div className="mt-4 text-sm">
              <label className="block mb-1 font-medium text-gray-700">Source ID</label>
              <input
                type="text"
                value={sourceId} disabled
                onChange={(e) => setSourceId(e.target.value)} // Mengupdate state saat diketik
                placeholder="Ex: @username or campaign-123"
                className="w-full h-10 px-3 rounded-md border read-only border-gray-300 text-sm text-gray-900 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#5A4FB0] focus:border-[#5A4FB0] placeholder:text-gray-400"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleSave}
                className="px-10 py-2.5 rounded-full bg-[#5A4FB0] text-white text-sm font-medium hover:bg-[#4a3f95] transition-colors"
              >
                Save Change
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}

/* --- DROPDOWN COMPONENT DENGAN STATUS AKTIF --- */
function Dropdown({ label, value, open, setOpen, options, onSelect, disabled = false }: DropdownProps) {
  return (
    <div className="mb-4 relative">
      <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
      
      {/* Tombol utama dropdown - border berubah warna saat dropdown terbuka */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full h-10 px-3 border rounded-md flex items-center justify-between text-sm transition-all
          ${disabled ? "bg-gray-50 cursor-not-allowed text-gray-400 border-gray-200" : 
            open ? "bg-white border-[#5A4FB0] ring-1 ring-[#5A4FB0]" : "bg-white border-gray-300"}
        `}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || "-"}
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto">
            {options.length > 0 ? (
              options.map((opt) => {
                const isSelected = value === opt; // Cek apakah opsi ini yang sedang terpilih
                
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onSelect(opt)}
                    className={`group w-full px-3 py-2 text-sm flex justify-between items-center transition-colors text-left
                      ${isSelected ? "bg-[#F3F2FA] text-[#5A4FB0]" : "text-gray-700 hover:bg-[#F3F2FA]"}
                    `}
                  >
                    {/* Teks Opsi: Jika terpilih maka Font Bold */}
                    <span className={isSelected ? "font-semibold" : "font-normal"}>
                      {opt}
                    </span>

                    {/* Check Icon: Muncul jika terpilih (isSelected) ATAU saat di-hover (group-hover) */}
                    <CheckIcon 
                      className={`w-4 h-4 text-[#5A4FB0] transition-opacity
                        ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                      `} 
                    />
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400 italic">No options available</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}