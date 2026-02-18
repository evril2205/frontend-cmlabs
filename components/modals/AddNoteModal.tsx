"use client";

import React, { useState } from 'react';
import { MagnifyingGlassIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { 
  DocumentTextIcon as DocumentTextSolid, 
  CalendarIcon as CalendarIconSolid, 
  FunnelIcon as FunnelIconSolid,
  PhoneIcon,
  EnvelopeIcon,
  DocumentIcon
} from '@heroicons/react/24/solid';

// IMPORT SEMUA MODAL YANG BENER DI SINI
import AddNoteModal from '@/components/modals/AddNoteModal';
import AddCallModal from '@/components/modals/AddCallModal';
import AddMeetingModal from '@/components/modals/AddMeetingModal';
// Import modal lainnya jika sudah ada...

export default function ActivityFeed({ 
  activities = [], 
  leadData, // Pastikan ini dikirim dari LeadManagement
  onEditNote,
  onDeleteNote,
}: any) {
  const [activeTab, setActiveTab] = useState("All Activity");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // State untuk masing-masing Modal
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddCallOpen, setIsAddCallOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);

  const tabs = [
    { name: "All Activity", action: "Activity" },
    { name: "Notes", action: "Note" },
    { name: "Meeting", action: "Meeting" },
    { name: "Call", action: "Call" },
    { name: "E-mail", action: "Email" },
    { name: "Invoice", action: "Invoice" },
  ];

  const currentTabInfo = tabs.find(t => t.name === activeTab);

  // Fungsi untuk buka modal sesuai Tab yang aktif
  const handleAddClick = () => {
    if (activeTab === "Notes") setIsAddNoteOpen(true);
    if (activeTab === "Call") setIsAddCallOpen(true);
    if (activeTab === "Meeting") setIsAddMeetingOpen(true);
    // Tambahkan kondisi untuk Email/Invoice jika modalnya sudah siap
  };

  const filteredActivities = activities.filter((act: any) => {
    if (activeTab === "All Activity") return true;
    const tabType = activeTab.toLowerCase().replace(/s$/, "").replace("e-mail", "email"); 
    return act.type === tabType;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[85vh] overflow-hidden">
      
      {/* 1. SEARCH BAR */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search activity..."
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* 2. TABS */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex px-2 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative px-3 py-3 text-[12px] font-bold transition-all ${
                activeTab === tab.name ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {tab.name}
              {activeTab === tab.name && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5A4FB0]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ACTION AREA */}
      {activeTab !== "All Activity" && (
        <div className="p-3 flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-xl text-gray-600 text-xs font-bold hover:bg-gray-50">
            <FunnelIconSolid className="w-4 h-4 text-gray-500" />
            Filters <ChevronDownIcon className="w-3 h-3" />
          </button>

          <button 
            onClick={handleAddClick} // <--- SEKARANG MANGGIL FUNGSI DINAMIS
            className="flex items-center gap-1 bg-[#5A4FB0] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#483f94]"
          >
            <PlusIcon className="w-4 h-4 stroke-[3px]" />
            Add {currentTabInfo?.action}
          </button>
        </div>
      )}

      {/* 4. CONTENT LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F8F9FB]">
        {filteredActivities.map((activity: any) => (
          <div key={activity.id} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
             <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-[#5A4FB0] flex items-center justify-center text-white">
                      <DocumentTextSolid className="w-4 h-4" />
                   </div>
                   <span className="font-bold text-gray-900 text-[13px]">{activity.author}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                   <CalendarIconSolid className="w-3.5 h-3.5" />
                   <span className="text-[11px] font-bold">{activity.date}</span>
                </div>
             </div>
             <div className="h-[2px] w-full bg-[#5A4FB5]"></div>
             <div className="px-4 py-4 text-[13px] text-gray-600">{activity.content}</div>
          </div>
        ))}
      </div>

      {/* --- MODAL AREA (DIPANGGIL BERDASARKAN JENISNYA) --- */}

      {/* Modal khusus Note */}
      <AddNoteModal 
        isOpen={isAddNoteOpen} 
        onClose={() => setIsAddNoteOpen(false)} 
        onSave={(data: any) => { console.log(data); setIsAddNoteOpen(false); }}
      />

      {/* Modal khusus Call */}
      <AddCallModal 
        open={isAddCallOpen} 
        onClose={() => setIsAddCallOpen(false)} 
        onSave={(data: any) => { console.log(data); setIsAddCallOpen(false); }}
        contactName={leadData?.contactPerson || "Unknown"}
      />

      {/* Modal khusus Meeting */}
      <AddMeetingModal 
        open={isAddMeetingOpen} 
        onClose={() => setIsAddMeetingOpen(false)} 
        onSave={(data: any) => { console.log(data); setIsAddMeetingOpen(false); }}
      />

    </div>
  );
}