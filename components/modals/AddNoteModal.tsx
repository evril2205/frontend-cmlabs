"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { XMarkIcon, CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import Editor secara dinamis agar tidak error SSR
const Editor = dynamic(() => import("@/components/Editor"), { 
  ssr: false,
  loading: () => <div className="h-[150px] bg-gray-50 animate-pulse rounded-2xl" /> 
});

export default function AddNoteModal({ isOpen, onClose, onSave }: any) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateNote = () => {
    if (!startDate || !title) {
      alert("Please fill date and title");
      return;
    }

    // Format tanggal untuk tampilan UI (dd/MM/yyyy)
    const formattedDate = startDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    onSave({
      date: formattedDate,
      title: title,
      description: description
    });

    // Reset & Close
    setStartDate(null);
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[650px] bg-white rounded-[32px] shadow-2xl p-8 max-h-[90vh] overflow-y-auto hide-scrollbar">
        
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-semibold font-bold text-gray-900">Add New Note</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-sm transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* DATE FIELD */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Date Created</label>
            <div className="relative group custom-datepicker rounded-sm">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A4FB0] z-20 pointer-events-none">
                <CalendarIcon className="w-5 h-5" />
              </div>

              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)} 
                placeholderText="Select Date"
                dateFormat="dd/MM/yyyy"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-[#5A4FB0]/20 focus:border-[#5A4FB0] focus:outline-none transition-all cursor-pointer"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          {/* NOTE TITLE */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Note Title"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-sm focus:ring-2 focus:ring-[#5A4FB0]/20 focus:border-[#5A4FB0] focus:outline-none transition-all"
            />
          </div>

          {/* DESCRIPTION (EDITOR LENGKAP) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">Description</label>
            <Editor 
              value={description} 
              onChange={setDescription} 
              placeholder="Enter note description..." 
            />
          </div>

          <button 
            onClick={handleCreateNote}
            className="w-full py-4 bg-[#5A4FB0] text-white rounded-full font-bold text-sm hover:bg-[#4A3F90] shadow-lg shadow-purple-100 mt-2 transition-all active:scale-[0.98]"
          >
            Create Note
          </button>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__header { background-color: white; border-bottom: none; }
        .react-datepicker__day--selected { background-color: #5A4FB0 !important; border-radius: 50%; }
        .react-datepicker { border-radius: 16px; border: 1px solid #f3f4f6; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
      `}</style>
    </>
  );
}