'use client';

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ChevronDownIcon, 
  PlusIcon, 
  CalendarIcon, 
  PencilSquareIcon, 
  TrashIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import MeetingCard from '@/components/MeetingCard';

/* ==========================================================================
   1. MINI COMPONENT: FILTER MODAL (Supaya tidak error import)
   ========================================================================== */
function FilterDropdown({ onClose, filters, setFilters }: any) {
  return (
    <div className="absolute top-12 left-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in duration-150">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm text-gray-900">Filter Activities</h3>
        <button onClick={onClose}><XMarkIcon className="w-4 h-4 text-gray-400" /></button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase">Date Range</label>
          <select 
            className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
            value={filters.date}
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          >
            <option>All Time</option>
            <option>Today</option>
            <option>This Week</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase">Created By</label>
          <select 
            className="w-full mt-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
            value={filters.creator}
            onChange={(e) => setFilters({...filters, creator: e.target.value})}
          >
            <option>All Users</option>
            <option>Me</option>
          </select>
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className="w-full mt-4 bg-[#5A4FB0] text-white py-2 rounded-xl text-xs font-bold"
      >
        Apply Filters
      </button>
    </div>
  );
}

/* ==========================================================================
   2. MAIN COMPONENT: ACTIVITY FEED
   ========================================================================== */
const activityIconMap: Record<string, React.ReactNode> = {
  note: <DocumentTextIcon className="w-4 h-4 text-white" />,
  call: <PhoneIcon className="w-4 h-4 text-white" />,
  email: <EnvelopeIcon className="w-4 h-4 text-white" />,
  meeting: <VideoCameraIcon className="w-4 h-4 text-white" />,
  invoice: <ClipboardDocumentCheckIcon className="w-4 h-4 text-white" />,
};

export default function ActivityFeed({ 
  activities = [], 
  meetings = [], 
  onAddNote, 
  onAddMeeting,
  openActivityId,
  toggleActivity 
}: any) {
  const [activeTab, setActiveTab] = useState("All Activity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ date: "All Time", creator: "All Users" });

  const tabs = [
    { name: "All Activity", count: (activities?.length || 0) + (meetings?.length || 0) },
    { name: "Notes", count: activities?.filter((a: any) => a.type === 'note').length || 0 },
    { name: "Meeting", count: meetings?.length || 0 },
    { name: "Call", count: activities?.filter((a: any) => a.type === 'call').length || 0 },
    { name: "E-mail", count: activities?.filter((a: any) => a.type === 'email').length || 0 },
    { name: "Invoice", count: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[85vh]">
      
      {/* HEADER: SEARCH & TABS */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="p-4 pb-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activity, notes, email and more..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex px-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative py-3 px-4 text-[13px] font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.name ? "text-[#5A4FB0]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-[4px] min-w-[18px]">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#5A4FB0] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ACTION BAR: FILTER & ADD BUTTON */}
      <div className="p-4 flex items-center justify-between bg-white relative">
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-all"
          >
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            Filters
            <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
          </button>
          
          {isFilterOpen && (
            <FilterDropdown 
              filters={filters} 
              setFilters={setFilters} 
              onClose={() => setIsFilterOpen(false)} 
            />
          )}
        </div>

        <div className="flex gap-2">
          {(activeTab === "Notes" || activeTab === "All Activity") && (
            <button onClick={onAddNote} className="flex items-center gap-2 px-4 py-1.5 bg-[#5A4FB0] text-white rounded-xl text-[13px] font-bold hover:bg-[#4a4194] transition-colors shadow-sm">
              <PlusIcon className="w-4 h-4" /> Add Note
            </button>
          )}
          {(activeTab === "Meeting" || activeTab === "All Activity") && (
            <button onClick={onAddMeeting} className="flex items-center gap-2 px-4 py-1.5 bg-[#5A4FB0] text-white rounded-xl text-[13px] font-bold hover:bg-[#4a4194] transition-colors shadow-sm">
              <PlusIcon className="w-4 h-4" /> Add Meeting
            </button>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 custom-scrollbar bg-gray-50/20">
        
        {/* Render Meetings */}
        {(activeTab === "All Activity" || activeTab === "Meeting") && meetings.map((meeting: any) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}

        {/* Render Activities */}
        {activities
          .filter((act: any) => activeTab === "All Activity" || act.type.toLowerCase() === activeTab.toLowerCase().replace("s", ""))
          .map((activity: any) => {
            const isExpanded = openActivityId === activity.id;
            return (
              <div key={activity.id} className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all hover:border-gray-300">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <button 
                      onClick={() => toggleActivity(activity.id)} 
                      className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                    >
                      <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-[#5A4FB0] flex items-center justify-center flex-shrink-0 shadow-sm">
                      {activityIconMap[activity.type] || <DocumentTextIcon className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-[13px] font-bold text-gray-900">{activity.author}</span>
                    <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{activity.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 border-l border-gray-100 ml-4 pl-4">
                    <button className="text-[#8AB500] hover:bg-green-50 p-1.5 rounded-lg transition-colors"><PencilSquareIcon className="w-4 h-4"/></button>
                    <button className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><TrashIcon className="w-4 h-4"/></button>
                  </div>
                </div>

                {isExpanded && (
                  <>
                    <div className="h-[2px] w-full bg-[#5A4FB0]" />
                    <div className="p-4 bg-white animate-in slide-in-from-top-1 duration-200">
                      {activity.title && <h4 className="text-sm font-bold text-gray-900 mb-2">{activity.title}</h4>}
                      <p className="text-[13px] text-gray-600 leading-relaxed">{activity.content}</p>
                      
                      {activity.thumbnails && activity.thumbnails.length > 0 && (
                        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {activity.thumbnails.map((thumb: any, i: number) => (
                            <div key={i} className="min-w-[150px] h-[100px] bg-gray-50 rounded-xl flex items-center justify-center text-[10px] text-gray-400 border border-dashed border-gray-300">
                              {thumb.alt || "Preview Image"}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        
        {activities.length === 0 && meetings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="bg-gray-100 p-4 rounded-full mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
             </div>
             <p className="text-sm font-medium">No activity records found</p>
          </div>
        )}
      </div>
    </div>
  );
}