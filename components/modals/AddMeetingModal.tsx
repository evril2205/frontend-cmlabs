"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { XMarkIcon, CalendarIcon, ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Editor = dynamic(() => import("@/components/Editor"), { 
  ssr: false,
  loading: () => <div className="h-[120px] bg-gray-50 animate-pulse rounded-sm" /> 
});

export default function AddMeetingModal({ isOpen, onClose, onSave }: any) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const [meetingType, setMeetingType] = useState(""); 
  const [isMeetingDropdownOpen, setIsMeetingDropdownOpen] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    venueName: "",
    address: "",
    mapsLink: "",
    meetingLink: "",
    meetingCode: "", 
    meetingPassword: ""
  });

  const [reminder, setReminder] = useState("30 minute before");
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const reminderOptions = ["15 minute before", "30 minute before", "1 hour before"];
  const meetingOptions = ["Online", "Offline"];

  const handleSave = () => {
    if (!title || !meetingType) {
      alert("Please fill in the title and select a meeting type");
      return;
    }

    const finalMeetingData = {
      title,
      description,
      meetingType,
      date: startDate ? startDate.toLocaleDateString('en-GB') : "",
      reminder,
      details: meetingType === "Online" 
        ? { link: meetingDetails.meetingLink, code: meetingDetails.meetingCode, password: meetingDetails.meetingPassword }
        : { venue: meetingDetails.venueName, address: meetingDetails.address, maps: meetingDetails.mapsLink }
    };

    onSave(finalMeetingData);

    // 1. Munculkan Toast
    setShowToast(true);

    // 2. Tutup Modal tapi Toast tetep ada
    onClose();

    // 3. Hilangkan Toast otomatis setelah 6 detik
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
  };

  const DropdownItem = ({ label, selected, onClick }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full px-4 py-2 text-[11px] text-left flex items-center justify-between transition-all duration-200
        ${selected === label ? 'bg-[#E5D4FF] text-gray-900 font-medium' : 'text-gray-700 hover:bg-[#E5D4FF] hover:text-gray-900'}`}
    >
      <span>{label}</span>
      <CheckIcon className={`w-3.5 h-3.5 text-[#5A4FB0] ${selected === label ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
    </button>
  );

  // Supaya Toast tetap bisa render biarpun isOpen = false
  if (!isOpen && !showToast) return null;

  return (
    <>
      {/* ✅ NOTIFIKASI HORIZONTAL */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-[95%] max-w-[850px] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-[#E6F4EA] border border-[#34A853]/30 rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5 text-[#137333]" />
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-900">Meeting Created:</span>
                <p className="text-[11px] text-gray-700">
                  Your meeting has been successfully scheduled and invitations have been sent to all participants.
                </p>
              </div>
            </div>
            <button onClick={() => setShowToast(false)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* ✅ MODAL UTAMA */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[150]" onClick={onClose} />
          
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[160] w-[600px] max-h-[90vh] bg-white rounded-[15px] shadow-sm overflow-y-auto p-7 hide-scrollbar">
            
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-l font-semibold text-gray-900">Add New Meeting</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-sm">
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[13px] font-bold text-gray-800 ml-1">Meeting Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Meeting Title" className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] focus:border-[#5A4FB0] outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-bold text-gray-800 ml-1">Description</label>
                <Editor value={description} onChange={setDescription} placeholder="Enter meeting description..." />
              </div>

              <h4 className="font-bold text-sm text-gray-900 pt-2 border-t border-gray-100">Time and date</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className="text-[13px] font-bold text-gray-800 ml-1">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                    <DatePicker 
                      selected={startDate} 
                      onChange={(date: Date | null) => setStartDate(date)} 
                      placeholderText="Select Date" 
                      dateFormat="dd/MM/yyyy" 
                      className="w-full pl-10 pr-4 py-2.5 border bg-white border-gray-300 rounded-sm text-[11px] outline-none relative z-20" 
                    />
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[13px] font-bold text-gray-800 ml-1">Reminder</label>
                  <button type="button" onClick={() => setIsReminderOpen(!isReminderOpen)} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] flex items-center justify-between bg-white outline-none">
                    <span className="text-gray-900">{reminder}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isReminderOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isReminderOpen && (
                    <div className="absolute z-[170] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden py-1">
                      {reminderOptions.map(opt => (
                        <DropdownItem key={opt} label={opt} selected={reminder} onClick={() => { setReminder(opt); setIsReminderOpen(false); }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[13px] font-bold text-gray-800 ml-1">Meeting Type</label>
                <button 
                  type="button"
                  onClick={() => setIsMeetingDropdownOpen(!isMeetingDropdownOpen)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-sm text-[11px] text-gray-900 flex justify-between items-center outline-none focus:border-[#5A4FB0]"
                >
                  <span className={meetingType ? "text-gray-900" : "text-gray-400"}>{meetingType || "Choose Meeting Type"}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isMeetingDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMeetingDropdownOpen && (
                  <div className="absolute z-[170] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden py-1">
                    {meetingOptions.map(opt => (
                      <DropdownItem key={opt} label={opt} selected={meetingType} onClick={() => { setMeetingType(opt); setIsMeetingDropdownOpen(false); }} />
                    ))}
                  </div>
                )}
              </div>

              {meetingType && (
                <div className="h-[1px] w-full bg-gray-300 my-2" />
              )}

              {meetingType === "Online" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-1 text-left">
                    <label className="text-[13px] font-bold text-gray-800 ml-1">Meeting Link</label>
                    <input type="text" placeholder="Enter Meeting Link" value={meetingDetails.meetingLink} onChange={(e) => setMeetingDetails({...meetingDetails, meetingLink: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] outline-none focus:border-[#5A4FB0]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-gray-800 ml-1">Meeting Code</label>
                    <input type="text" placeholder="Enter Meeting Code" value={meetingDetails.meetingCode} onChange={(e) => setMeetingDetails({...meetingDetails, meetingCode: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] outline-none focus:border-[#5A4FB0]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-gray-800 ml-1">Meeting Password</label>
                    <input type="text" placeholder="Enter Meeting Password" value={meetingDetails.meetingPassword} onChange={(e) => setMeetingDetails({...meetingDetails, meetingPassword: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] outline-none focus:border-[#5A4FB0]" />
                  </div>
                </div>
              )}

              {meetingType === "Offline" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-gray-800 ml-1">Venue Name</label>
                    <input type="text" placeholder="Enter Venue Name" value={meetingDetails.venueName} onChange={(e) => setMeetingDetails({...meetingDetails, venueName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] outline-none focus:border-[#5A4FB0]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-gray-800 ml-1">Address</label>
                    <input type="text" placeholder="Enter Address" value={meetingDetails.address} onChange={(e) => setMeetingDetails({...meetingDetails, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] outline-none focus:border-[#5A4FB0]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[13px] font-bold text-gray-800 ml-1">Google Maps Link</label>
                    <input type="text" placeholder="Enter Location Link" value={meetingDetails.mapsLink} onChange={(e) => setMeetingDetails({...meetingDetails, mapsLink: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-sm text-[11px] outline-none focus:border-[#5A4FB0]" />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="button" 
                  onClick={handleSave} 
                  className="w-full py-3.5 bg-[#5A4FB0] text-white rounded-full font-bold text-sm hover:bg-[#4A3F90] transition-all"
                >
                  Create Meeting
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker {
          background-color: #fff !important;
          border: 1px solid #e2e8f0 !important;
          z-index: 9999 !important;
        }
        .react-datepicker__header {
          background-color: #fff !important;
        }
      `}</style>
    </>
  );
}