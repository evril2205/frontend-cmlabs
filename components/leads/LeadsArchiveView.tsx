"use client";

import React, { useState } from "react";
import { TrashIcon, CheckCircleIcon, ArrowUturnLeftIcon, PencilIcon } from "@heroicons/react/24/solid";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Lead {
  id: string;
  title: string;
  company: string;
  value: string;
  date: string;
  tags: Array<{ label: string; color: string }>;
  assignee: { name: string; initial: string; color: string };
  stage: string;
  isArchived?: boolean;
}

interface LeadsArchiveViewProps {
  leads: Lead[];
  onLeadsChange: (leads: Lead[]) => void;
}

const formatDateToDDMMYYYY = (d: string) => {
  if (!d) return "";
  if (d.includes("/")) return d;
  const parts = d.split("-");
  if (parts.length === 3) {
    const [y, m, day] = parts;
    return `${day}/${m}/${y}`;
  }
  return d;
};

export default function LeadsArchiveView({ leads, onLeadsChange }: LeadsArchiveViewProps) {
  const [toastMessage, setToastMessage] = useState("");
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [hoveredLeadId, setHoveredLeadId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDelete = (id: string) => {
    setLeadToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (leadToDelete) {
      // ✅ Update will be handled by parent component (page.tsx)
      // which will call backend API
      const updatedLeads = leads.filter((l) => l.id !== leadToDelete);
      onLeadsChange(updatedLeads);
      showToast("Lead deleted permanently!");
      setLeadToDelete(null);
      setIsConfirmOpen(false);
    }
  };

  const handleRestore = (id: string) => {
    // ✅ Update will be handled by parent component (page.tsx)
    // which will call backend API to set isArchived: false
    const updatedLeads = leads.map((l) =>
      l.id === id ? { ...l, isArchived: false } : l
    );
    onLeadsChange(updatedLeads);
    showToast("Lead restored!");
  };

  const archivedLeads = leads.filter(l => l.isArchived);

  return (
    <>
      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="w-[280px] rounded-xl p-5 text-center flex flex-col items-center">
          <div
            className="w-16 h-16 flex items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: "#AA130A" }}
          >
            <TrashIcon className="w-8 h-8 text-white" />
          </div>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-sm font-bold">
              Permanently delete this lead?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-600 mt-1">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 mt-4">
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
            <AlertDialogCancel className="px-4 py-1.5 rounded-full text-xs border border-red-500 text-red-500 hover:bg-red-50">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 text-sm px-4 py-2 shadow-md z-[9999] flex items-center gap-2 rounded-md">
          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="text-green-800 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* ARCHIVE VIEW CONTENT */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg">Archived Leads</h2>
          <p className="text-sm text-gray-600 mt-1">{archivedLeads.length} leads archived</p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[600px]">
          {archivedLeads.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {archivedLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  className="px-4 py-3 hover:bg-gray-50 transition-colors relative"
                  onMouseEnter={() => setHoveredLeadId(lead.id)}
                  onMouseLeave={() => setHoveredLeadId(null)}
                >
                  <div className="grid grid-cols-[30px_200px_100px_150px_80px_1fr_70px] gap-3 items-center text-xs">
                    
                    {/* Edit Button */}
                    <div className="flex items-center gap-1">
                       <button 
                         className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 text-gray-500 transition-colors"
                         title="Edit lead"
                       >
                         <PencilIcon className="w-3 h-3" /> 
                       </button>
                    </div>

                    {/* Title & Company */}
                    <span className="font-medium text-gray-900 truncate">
                      {lead.title} | {lead.company}
                    </span>

                    {/* Value */}
                    <div className="flex items-center gap-0.5">
                      <BanknotesIcon className="w-3 h-3 text-gray-700" />
                      <span className="font-semibold text-gray-800">
                        {lead.value}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1 items-center flex-wrap">
                      {lead.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`${tag.color} text-black text-[8px] font-medium px-1.5 py-0.5 rounded-full`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Date */}
                    <span className="text-gray-500 text-[10px] truncate">
                      {formatDateToDDMMYYYY(lead.date)}
                    </span>

                    {/* Assignee */}
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white ${lead.assignee.color}`}
                      >
                        {lead.assignee.initial}
                      </div>
                      <span className="text-gray-800 text-[11px] truncate">
                        {lead.assignee.name}
                      </span>
                    </div>

                    {/* Actions (Show on hover) */}
                    <div className={`flex items-center gap-1.5 justify-end transition-opacity duration-200 ${
                       hoveredLeadId === lead.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      {/* Restore Button */}
                      <button
                        onClick={() => handleRestore(lead.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full border border-green-500 hover:bg-green-50 transition-colors"
                        title="Restore Lead"
                      >
                        <ArrowUturnLeftIcon className="w-3.5 h-3.5 text-green-600" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-full border border-red-500 hover:bg-red-50 transition-colors"
                        title="Delete permanently"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center text-gray-500">
              <TrashIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm">No archived leads yet.</p>
              <p className="text-xs mt-1">Archived leads will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}