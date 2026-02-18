"use client";

import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CalendarIcon, 
  ClockIcon,
  ChevronDownIcon,
  ListBulletIcon,
  LinkIcon,
  AtSymbolIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface AddCallModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  contactName: string; // Nama contact person yang dipassing dari lead
}

export default function AddCallModal({ open, onClose, onSave, contactName }: AddCallModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    direction: '',
    date: '',
    time: '1:00 PM',
    duration: '15 minutes',
    reminder: '',
    purpose: '',
    status: '',
    result: '',
    notes: ''
  });

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, contactPerson: contactName });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Add New Call</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto max-h-[80vh] custom-scrollbar">
          
          {/* CALL TITLE */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Call Title</label>
            <input
              type="text"
              placeholder="Enter Call Title"
              required
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5A4FB0]/20 focus:border-[#5A4FB0] transition-all"
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* CONTACT PERSON (LOCKED) */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Contact Person</label>
              <input
                type="text"
                value={contactName}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-medium"
              />
            </div>
            {/* CALL DIRECTION */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Call Direction</label>
              <div className="relative">
                <select 
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm appearance-none focus:outline-none focus:border-[#5A4FB0]"
                  onChange={(e) => setFormData({...formData, direction: e.target.value})}
                >
                  <option value="">Choose call Direction</option>
                  <option value="Outbound">Outbound</option>
                  <option value="Inbound">Inbound</option>
                  <option value="Missed">Missed</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* CALL DATE */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Call Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            {/* CALL TIME */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Call Time</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={formData.time}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
                <ClockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            {/* DURATION */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Duration</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none"
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              >
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
                <option value="1 hour">1 hour</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* REMINDER */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Reminder</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none">
                <option value="">Choose Reminder</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="45">45 minutes before</option>
              </select>
            </div>
            {/* PURPOSE */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Call Purpose</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none">
                <option value="">Choose call purpose</option>
                <option value="initial qualification">Initial Qualification</option>
                <option value="follow up">Follow Up</option>
                <option value="negoitation">Negotiation</option>
                <option value="service check-in">Service Check-in</option>
                <option value="closing">Closing</option>
                <option value="retention">Retention</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* STATUS */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Call Status</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none">
                <option value="">Choose Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="reschedule">Reschedule</option>
              </select>
            </div>
            {/* RESULT */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Call Result</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none">
                <option value="">Choose Result</option>
                <option value="interested">Interested</option>
                <option value="not interested">Not Interested</option>
                <option value="no answer">No Answer</option>
                <option value="left voicemail">Left Voicemail</option>
                <option value="wrong number">Wrong Number</option>
                <option value="meeting scheduled">Meeting Scheduled</option>
              </select>
            </div>
          </div>

          {/* CALL NOTES (WITH WYSIWYG TOOLBAR STYLE) */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Call notes</label>
            <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#5A4FB0] transition-all">
              <textarea
                placeholder="Enter call Description"
                rows={4}
                className="w-full px-5 py-4 text-sm focus:outline-none resize-none"
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-4 text-gray-400">
                  <button type="button" className="hover:text-gray-600"><ListBulletIcon className="w-5 h-5" /></button>
                  <button type="button" className="hover:text-gray-600 font-serif font-bold">B</button>
                  <button type="button" className="hover:text-gray-600 italic">I</button>
                  <button type="button" className="hover:text-gray-600 underline decoration-2">U</button>
                  <button type="button" className="hover:text-gray-600 underline decoration-dashed text-xs">S</button>
                  <span className="text-gray-300">|</span>
                  <button type="button" className="hover:text-gray-600"><AtSymbolIcon className="w-4 h-4" /></button>
                  <button type="button" className="hover:text-gray-600"><LinkIcon className="w-4 h-4" /></button>
                  <button type="button" className="hover:text-gray-600"><PhotoIcon className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="px-16 py-4 bg-[#5A4FB0] text-white font-bold rounded-full shadow-lg shadow-purple-200 hover:bg-[#483f94] hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Add New Call
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}