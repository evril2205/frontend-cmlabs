"use client";

import React, { useState } from 'react';
import AddNoteModal from '@/components/modals/AddNoteModal';
import AddMeetingModal from '@/components/modals/AddMeetingModal';

import FilterNoteModal from '../activities/FilterNoteModal';
import FilterMeetingModal from '@/components/modals/FilterMeetingModal';
import FilterEmailModal from '@/components/modals/FilterEmailModal';
import FilterCallModal from '@/components/modals/FilterCallModal';
import FilterInvoiceModal from '@/components/modals/FilterInvoiceModal';

import { 
  MagnifyingGlassIcon, 
  PlusIcon,
} from '@heroicons/react/24/outline';
import { 
  DocumentTextIcon as DocumentTextSolid,
  PencilSquareIcon as PencilSolid,
  TrashIcon as TrashSolid,
  CalendarIcon as CalendarSolid,
  FunnelIcon as FunnelSolid,
  ChevronDownIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentIcon
} from '@heroicons/react/24/solid';
import AddCallModal from '@/components/modals/AddCallModal';

interface ActivityFeedProps {
  activities?: any[];
  meetings?: any[];
  emails?: any[];
  calls?: any[];
  invoices?: any[];
  leadData?: any;
  onAddNote?: () => void;
  onAddMeeting?: () => void;
  openActivityId?: number | null;
  toggleActivity?: (id: number) => void;
  onEditNote?: (id: number) => void;
  onDeleteNote?: (id: number) => void;
}

export default function ActivityFeed({ 
  activities = [], 
  meetings = [],
  emails = [],
  calls = [],
  invoices = [],
  leadData,
  onAddNote,
  onAddMeeting,
  openActivityId,
  toggleActivity,
  onEditNote, 
  onDeleteNote, 
}: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState("All Activity");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isAddEmailOpen, setIsAddEmailOpen] = useState(false);
  const [isAddCallOpen, setIsAddCallOpen] = useState(false);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);

  const [isFilterNoteOpen, setIsFilterNoteOpen] = useState(false);
  const [isFilterMeetingOpen, setIsFilterMeetingOpen] = useState(false);
  const [isFilterEmailOpen, setIsFilterEmailOpen] = useState(false);
  const [isFilterCallOpen, setIsFilterCallOpen] = useState(false);
  const [isFilterInvoiceOpen, setIsFilterInvoiceOpen] = useState(false);

  const tabs = [
    { name: "All Activity", action: "Activity", count: 0 },
    { name: "Notes", action: "Note", count: activities.length || 0 },
    { name: "Meeting", action: "Meeting", count: meetings.length || 0 },
    { name: "Call", action: "Call", count: calls.length || 0 },
    { name: "E-mail", action: "Email", count: emails.length || 0 },
    { name: "Invoice", action: "Invoice", count: invoices.length || 0 },
  ];

  const currentTabInfo = tabs.find(t => t.name === activeTab);

  // Filter berdasarkan tab aktif
  const filteredActivities = activeTab === "All Activity" 
    ? [...activities, ...meetings, ...emails, ...calls, ...invoices]
    : activeTab === "Notes"
    ? activities
    : activeTab === "Meeting"
    ? meetings
    : activeTab === "E-mail"
    ? emails
    : activeTab === "Call"
    ? calls
    : activeTab === "Invoice"
    ? invoices
    : [];

  // Icon mapping
  const getIcon = (type: string) => {
    switch(type) {
      case 'note': return <DocumentTextSolid className="w-4 h-4 text-white" />;
      case 'meeting': return <CalendarSolid className="w-4 h-4 text-white" />;
      case 'email': return <EnvelopeIcon className="w-4 h-4 text-white" />;
      case 'call': return <PhoneIcon className="w-4 h-4 text-white" />;
      case 'invoice': return <DocumentIcon className="w-4 h-4 text-white" />;
      default: return <DocumentTextSolid className="w-4 h-4 text-white" />;
    }
  };

  // Handle Add Button
  const handleAddClick = () => {
    switch(activeTab) {
      case "Notes":
        if (onAddNote) onAddNote();
        else setIsAddNoteOpen(true);
        break;
      case "Meeting":
        if (onAddMeeting) onAddMeeting();
        else setIsAddMeetingOpen(true);
        break;
      case "E-mail":
        setIsAddEmailOpen(true);
        break;
      case "Call":
        setIsAddCallOpen(true);
        break;
      case "Invoice":
        setIsAddInvoiceOpen(true);
        break;
    }
  };

  // Handle Filter Button
  const handleFilterClick = () => {
    switch(activeTab) {
      case "Notes":
        setIsFilterNoteOpen(true);
        break;
      case "Meeting":
        setIsFilterMeetingOpen(true);
        break;
      case "E-mail":
        setIsFilterEmailOpen(true);
        break;
      case "Call":
        setIsFilterCallOpen(true);
        break;
      case "Invoice":
        setIsFilterInvoiceOpen(true);
        break;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[85vh] overflow-hidden">
      
      {/* 1. SEARCH BAR */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search activity, notes, email and more..."
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* 2. TAB MENU */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex px-2 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative flex items-center gap-1 px-3 py-3 text-[12px] font-bold transition-all ${
                activeTab === tab.name ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="bg-red-600 text-white text-[9px] px-1 rounded shadow-sm">{tab.count}</span>
              )}
              {activeTab === tab.name && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5A4FB0]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. ACTION AREA (Filter & Add) - HANYA MUNCUL JIKA BUKAN "All Activity" */}
      {activeTab !== "All Activity" && (
        <div className="p-3 flex items-center gap-2">
          <button 
            onClick={handleFilterClick}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-xl text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all"
          >
            <FunnelSolid className="w-4 h-4 text-gray-500" />
            Filters
            <ChevronDownIcon className="w-3 h-3" />
          </button>

          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1 bg-[#5A4FB0] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md hover:bg-[#483f94] transition-all"
          >
            <PlusIcon className="w-4 h-4 stroke-[3px]" />
            Add {currentTabInfo?.action}
          </button>
        </div>
      )}

      {/* 4. ACTIVITY LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#F8F9FB]">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <DocumentTextSolid className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {activeTab.toLowerCase()} yet</p>
          </div>
        ) : (
          filteredActivities.map((activity: any) => (
            <div key={activity.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
              {/* Header Card */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleActivity && toggleActivity(activity.id)}
                    className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                  >
                    <ChevronDownIcon 
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        openActivityId === activity.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <div className="w-8 h-8 rounded-lg bg-[#5A4FB0] flex items-center justify-center">
                    {getIcon(activity.type || 'note')}
                  </div>
                  <span className="font-bold text-gray-900 text-[13px]">
                    {activity.author || activity.organizer || 'User'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-gray-500 font-bold text-[11px]">
                    <CalendarSolid className="w-3.5 h-3.5 text-gray-400" />
                    {activity.date || new Date(activity.createdAt).toLocaleDateString()}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1">
                    {onEditNote && (
                      <button 
                        onClick={() => onEditNote(activity.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <PencilSolid className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    )}
                    {onDeleteNote && (
                      <button 
                        onClick={() => onDeleteNote(activity.id)}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <TrashSolid className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-[2px] w-full bg-[#5A4FB5]"></div>

              {/* Content */}
              {openActivityId === activity.id && (
                <div className="p-4 text-[13px] text-gray-600 leading-relaxed">
                  {activity.title && (
                    <h4 className="font-bold text-gray-900 mb-2">{activity.title}</h4>
                  )}
                  {activity.content || activity.description || 'No content available'}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ADD MODALS */}
<AddNoteModal 
  isOpen={isAddNoteOpen} 
  onClose={() => setIsAddNoteOpen(false)} 
  onSave={(data: any) => { // <--- Tambahkan : any di sini biar gak error 7006
    console.log('Save note:', data);
    setIsAddNoteOpen(false);
  }}
/>

<AddMeetingModal 
  isOpen={isAddMeetingOpen} 
  onClose={() => setIsAddMeetingOpen(false)} 
  onSave={(data: any) => {
    console.log('Save meeting:', data);
    setIsAddMeetingOpen(false);
  }}
/>

<AddCallModal 
  open={isAddCallOpen}  
  onClose={() => setIsAddCallOpen(false)} 
  onSave={(data: any) => {
    console.log('Save call:', data);
    setIsAddCallOpen(false);
  }}
  // leadData sekarang sudah dikenal karena sudah dimasukkan di props atas
  contactName={leadData?.contactPerson || "Unknown Contact"} 
/>

{/* Pastikan AddEmailModal & AddInvoiceModal juga sudah di-import di paling atas */}



      {/* FILTER MODALS */}
      <FilterNoteModal 
        open={isFilterNoteOpen} 
        onClose={() => setIsFilterNoteOpen(false)} 
        onApply={(filters) => {
          console.log('Apply note filters:', filters);
          setIsFilterNoteOpen(false);
        }}
      />

      <FilterMeetingModal 
        open={isFilterMeetingOpen} 
        onClose={() => setIsFilterMeetingOpen(false)} 
        onApply={(filters) => {
          console.log('Apply meeting filters:', filters);
          setIsFilterMeetingOpen(false);
        }}
      />

      <FilterEmailModal 
        open={isFilterEmailOpen} 
        onClose={() => setIsFilterEmailOpen(false)} 
        onApply={(filters) => {
          console.log('Apply email filters:', filters);
          setIsFilterEmailOpen(false);
        }}
      />

      <FilterCallModal 
        open={isFilterCallOpen} 
        onClose={() => setIsFilterCallOpen(false)} 
        onApply={(filters) => {
          console.log('Apply call filters:', filters);
          setIsFilterCallOpen(false);
        }}
      />

      <FilterInvoiceModal 
        open={isFilterInvoiceOpen} 
        onClose={() => setIsFilterInvoiceOpen(false)} 
        onApply={(filters) => {
          console.log('Apply invoice filters:', filters);
          setIsFilterInvoiceOpen(false);
        }}
      />
    </div>
  );
}