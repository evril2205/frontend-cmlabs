"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  DocumentTextIcon,
  CalendarIcon,
  FunnelIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import AddNoteModal from "@/components/modals/AddNoteModal";
import AddCallModal from "@/components/modals/AddCallModal";
import AddMeetingModal from "@/components/modals/AddMeetingModal";
import FilterModal, { FilterState } from "./FilterNoteModal";

import { addNote, getNotesByLead, deleteNote } from "@/services/leadService";

interface ActivityFeedProps {
  leadId: string;
}

export default function ActivityFeed({ leadId }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState("Notes");

  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<number[]>([]);
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddCallOpen, setIsAddCallOpen] = useState(false);
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState | null>(null);

  // =========================
  // FETCH NOTES
  // =========================
  useEffect(() => {
    if (!leadId) return;

    const fetchNotes = async () => {
      try {
        const data = await getNotesByLead(Number(leadId));
        setNotes(data);
      } catch (err) {
        console.error("Fetch notes error:", err);
      }
    };

    fetchNotes();
  }, [leadId]);

  const toggleNote = (id: number) => {
  setExpandedNotes((prev) =>
    prev.includes(id)
      ? prev.filter((n) => n !== id)
      : [...prev, id]
  );
};

  // =========================
  // ADD CLICK LOGIC
  // =========================
  const handleAddClick = () => {
    if (activeTab === "Notes") setIsAddNoteOpen(true);
    if (activeTab === "Call") setIsAddCallOpen(true);
    if (activeTab === "Meeting") setIsAddMeetingOpen(true);
  };

  // =========================
  // SAVE NOTE
  // =========================
  const handleSaveNote = async (data: any) => {
  try {
    if (editingNote) {
      await updateNote(editingNote.id, data);
    } else {
      await addNote(Number(leadId), data);
    }

    const updated = await getNotesByLead(Number(leadId));
    setNotes(updated);

    setEditingNote(null);
    setIsAddNoteOpen(false);
  } catch (err) {
    console.error("Save note failed:", err);
  }
};


  // =========================
  // FILTER + SEARCH
  // =========================
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (searchQuery) {
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [notes, searchQuery, filters]);

  const tabs = [
    "All Activity",
    "Notes",
    "Meeting",
    "Call",
    "E-mail",
    "Invoice",
  ];

  return (
    <div className="bg-white rounded-2xl border shadow-sm flex flex-col h-[85vh] overflow-hidden">

      {/* SEARCH */}
      <div className="p-3 border-b">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border rounded-full text-xs"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="border-b">
        <div className="flex px-2 justify-between">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-3 py-3 text-[12px] font-bold ${
                activeTab === tab ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5A4FB0]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ACTION */}
      {activeTab !== "All Activity" && (
        <div className="p-3 flex items-center gap-2">
          <button
  onClick={() => setIsFilterOpen(true)}
  className="flex items-center gap-1 px-3 py-1.5 border rounded-xl text-xs font-medium text-gray-500"
>
  <FunnelIcon className="w-4 h-4 text-gray-500" />
  Filters 
  <ChevronDownIcon className="w-3 h-3 text-gray-500" />
</button>


          <button
            type="button"
            onClick={handleAddClick}
            className="flex items-center gap-1 bg-[#5A4FB0] text-white px-3 py-1.5 rounded-xl text-xs font-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Note
          </button>
        </div>
      )}

      {/* LIST */}
<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
  {activeTab === "Notes" &&
    filteredNotes.map((note) => {
      const isOpen = expandedNotes.includes(note.id);

      return (
        <div
          key={note.id}
          className="border rounded-xl bg-white shadow-sm overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => toggleNote(note.id)}>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

              {/* ICON */}
              <div className="w-8 h-8 bg-[#5A4FB0] rounded-lg flex items-center justify-center text-white">
                <DocumentTextIcon className="w-4 h-4" />
              </div>

              {/* TITLE + CHEVRON */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[13px]">
                  {note.title || "Untitled"}
                </span>

                
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2 text-gray-400">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>

              <span className="mx-2 text-gray-300">|</span>

              {/* EDIT */}
              <PencilSquareIcon
  className="w-4 h-4 text-[#8AB500] cursor-pointer"
  onClick={() => {
    setEditingNote(note);
    setIsAddNoteOpen(true);
  }}
/>


              {/* DELETE */}
              <TrashIcon
                className="w-4 h-4 text-[#FF0E00] cursor-pointer hover:opacity-80"
                onClick={async () => {
                  if (!confirm("Delete this note?")) return;

                  try {
                    setLoadingDelete(note.id);
                    await deleteNote(note.id); // <-- connect backend
                    const updated = await getNotesByLead(Number(leadId));
                    setNotes(updated);
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setLoadingDelete(null);
                  }
                }}
              />
            </div>
          </div>

          <div className="h-[2px] bg-[#5A4FB5]" />

          {/* DESCRIPTION */}
          {isOpen && (
            <div
              className="px-4 py-4 text-[13px] text-gray-600 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: note.content }}
            />
          )}
        </div>
      );
    })}
</div>

      {/* MODALS */}

     {isAddNoteOpen && (
  <AddNoteModal
  isOpen={isAddNoteOpen}
  onClose={() => {
    setIsAddNoteOpen(false);
    setEditingNote(null);
  }}
  onSave={handleSaveNote}
  initialData={editingNote}
/>
     )}
      <AddCallModal
        open={isAddCallOpen}
        onClose={() => setIsAddCallOpen(false)}
        onSave={() => setIsAddCallOpen(false)}
        contactName="Contact"
      />

      <AddMeetingModal
        open={isAddMeetingOpen}
        onClose={() => setIsAddMeetingOpen(false)}
        onSave={() => setIsAddMeetingOpen(false)}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(f) => {
          setFilters(f);
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
}
