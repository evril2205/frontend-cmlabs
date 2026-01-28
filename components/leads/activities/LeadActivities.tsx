"use client";
import { useState } from "react";
import { FunnelIcon, PlusIcon } from "@heroicons/react/24/outline";
import FilterNoteModal from "./FilterNoteModal"; // Pastikan path import benar
import AddNoteModal from "@/components/modals/AddNoteModal";
import AddMeetingModal from "@/components/modals/AddMeetingModal";

export default function LeadActivities() {
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    date: "All",
    creator: "All",
    update: "Recently Updated",
    attachment: "All"
  });

  const handleSaveMeeting = (data: any) => {
    console.log("Data meeting yang akan disimpan:", data);
    // Di sini nanti kamu bisa panggil API backend untuk simpan data
    setIsAddMeetingOpen(false); // Tutup modal setelah simpan
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 1. TABS HEADER */}
      <div className="flex border-b border-gray-200 bg-white">
        {["all", "notes", "meeting", "call", "email"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold relative capitalize
              ${activeTab === tab ? "text-[#5A4FB0]" : "text-gray-500"}
            `}
          >
            {tab === "all" ? "All Activity" : tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5A4FB0]" />
            )}
          </button>
        ))}
      </div>

      {/* 2. ACTION BAR */}
      <div className="p-4 flex gap-3 items-center relative">
         {/* Tombol Filter */}
         <button 
           onClick={() => setIsFilterOpen(true)}
           className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
         >
           <FunnelIcon className="w-4 h-4" />
           Filters
         </button>

         {/* Tombol Add Note */}
         <button 
           onClick={() => setIsAddNoteOpen(true)}
           className="bg-[#5A4FB0] text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
         >
           <PlusIcon className="w-4 h-4" />
           Add Note
         </button>

         {/* Modal Filter */}
         {isFilterOpen && (
           <FilterNoteModal 
             filters={filters} 
             setFilters={setFilters} 
             onClose={() => setIsFilterOpen(false)} 
           />
         )}
      </div>

      {/* Modal Add Note */}
      {isAddNoteOpen && (
  <AddNoteModal 
    isOpen={isAddNoteOpen} 
    onClose={() => setIsAddNoteOpen(false)} 
    onSave={(data: any) => console.log(data)} 
  />
  
)}
<AddMeetingModal 
         isOpen={isAddMeetingOpen} 
         onClose={() => setIsAddMeetingOpen(false)} 
         onSave={handleSaveMeeting} 
       />
       
      <div className="p-4 space-y-4">
        {/* List Activity */}
      </div>
    </div>
  );
}