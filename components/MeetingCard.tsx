"use client";
import React from "react";
import { 
  CalendarIcon, 
  PencilSquareIcon, 
  TrashIcon, 
  VideoCameraIcon,
  DocumentTextIcon 
} from "@heroicons/react/24/outline";

interface MeetingCardProps {
  meeting: {
    id: number;
    organizer: string;
    email: string;
    date: string;
    description: string;
    duration: string;
    attendees: string[];
  };
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mb-4">
      {/* --- HEADER SECTION --- */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#5A4FB0] rounded-lg flex items-center justify-center">
            <VideoCameraIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[15px] text-gray-900">By {meeting.organizer}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-[13px]">
            <CalendarIcon className="w-4 h-4" />
            <span>{meeting.date}</span>
          </div>
          <div className="flex gap-2 border-l pl-4 border-gray-200">
            <button className="p-1.5 hover:bg-gray-100 rounded text-green-600 transition-colors">
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded text-red-600 transition-colors">
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* --- BODY SECTION --- */}
      <div className="p-4 space-y-4">
        {/* Organizer Detail */}
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Organized by</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#84CC16] rounded-full flex items-center justify-center text-[10px] text-white font-bold">
              {meeting.organizer.charAt(0)}
            </div>
            <span className="text-[13px] text-gray-700 font-medium">{meeting.email}</span>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Attendee description</p>
          <div className="flex gap-3 p-3 bg-white border border-gray-200 rounded-md shadow-sm">
            <DocumentTextIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-600 leading-relaxed italic">
              {meeting.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* --- OUTCOME SECTION (Ungu Muda) --- */}
        <div className="bg-[#E5D4FF]/40 rounded-lg p-4 flex justify-between items-center border border-[#5A4FB0]/10">
          <div>
            <p className="text-[13px] font-bold text-gray-900">Outcome</p>
          </div>
          
          <div className="flex gap-12">
            {/* Attendees List */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1.5">Attendees</p>
              <div className="flex -space-x-2 justify-center">
                {meeting.attendees.map((initial, index) => (
                  <div 
                    key={index} 
                    className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold
                    ${index % 2 === 0 ? 'bg-orange-400' : 'bg-pink-300'}`}
                  >
                    {initial}
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Info */}
            <div className="text-center min-w-[60px]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mb-1.5">Duration</p>
              <p className="text-[12px] text-gray-700 font-medium">{meeting.duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}