"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  PencilSquareIcon,
  PlusIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

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

interface LeadsListViewProps {
  leads: Lead[];
  onLeadsChange: (leads: Lead[]) => void;
  isArchiveMode?: boolean;
  viewMode?: "list" | "kanban";
  onEditLead: (leadId: string) => void;
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

const LeadsListView = ({ 
  leads, 
  onLeadsChange, 
  isArchiveMode = false, 
  viewMode = "list",
  onEditLead
}: LeadsListViewProps) => {
  const [toastMessage, setToastMessage] = useState("");
  const { isSidebarOpen } = useSidebar();
  const [leadToRestore, setLeadToRestore] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Local state biar UI langsung update pas drag & drop tanpa refresh
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const stages = [
    { id: "NEW", title: "Lead In" },
    { id: "CONTACTED", title: "Contact Made" },
    { id: "QUALIFIED", title: "Need Identified" },
    { id: "PROPOSAL", title: "Proposal Made" },
    { id: "NEGOTIATION", title: "Negotiation" },
    { id: "CONTRACT_SENT", title: "Contract Sent" }, 
    { id: "WON", title: "Won" },
    { id: "LOST", title: "Lost" },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const displayLeads = isArchiveMode
    ? localLeads.filter((l) => l.isArchived)
    : localLeads.filter((l) => !l.isArchived);

  const archiveLead = (id: string) => {
    const updated = localLeads.map((l) =>
      l.id === id ? { ...l, isArchived: true } : l
    );
    setLocalLeads(updated);
    onLeadsChange(updated);
    showToast("Lead moved to Archive!");
  };

  const restoreLead = (id: string) => {
    setLeadToRestore(id);
    setIsConfirmOpen(true);
  };

  const confirmRestore = () => {
    if (leadToRestore) {
      const updatedLeads = localLeads.map((l) =>
        l.id === leadToRestore ? { ...l, isArchived: false } : l
      );
      setLocalLeads(updatedLeads);
      onLeadsChange(updatedLeads);
      showToast("Lead restored successfully!");
      setLeadToRestore(null);
      setIsConfirmOpen(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || isArchiveMode) return;

    if (destination.droppableId === "delete") {
      showToast("Cannot delete, use Archive function.");
      return; 
    }

    const targetStage = destination.droppableId.toUpperCase();
    
    if (destination.droppableId !== source.droppableId) {
      const updatedLeads = localLeads.map((lead) =>
        lead.id === draggableId ? { ...lead, stage: targetStage } : lead
      );
      
      setLocalLeads(updatedLeads);
      onLeadsChange(updatedLeads);
      
      if (targetStage === "WON") showToast("Lead moved to WON 🎉");
      else if (targetStage === "LOST") showToast("Lead moved to LOST ❗");
    }
  };

  const ArchiveButton = ({ lead }: { lead: Lead }) => {
    const isArchived = lead.isArchived || false;
    const handleClick = () => isArchived ? restoreLead(lead.id) : archiveLead(lead.id);
    const buttonClass = `w-6 h-6 flex items-center justify-center rounded-full border transition-colors ${
      isArchived ? "bg-[#BEBEBE] border-[#2E2F2F] hover:bg-gray-300" : "bg-white border-gray-400 hover:bg-gray-100"
    }`;
    const iconStyle = {
      filter: isArchived
        ? "invert(18%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(10%) contrast(90%)"
        : "invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(70%)",
    };
    return (
      <button onClick={handleClick} className={buttonClass} title={isArchived ? "Restore Lead" : "Archive Lead"}>
        <Image src="/assets/icons/box.svg" alt="Archive" width={14} height={14} style={iconStyle} />
      </button>
    );
  }

  const KanbanCard = ({ lead, index }: { lead: Lead, index: number }) => (
    <Draggable key={lead.id} draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-3 rounded-lg shadow mb-2 border border-gray-200 hover:shadow-md transition-shadow ${
            snapshot.isDragging ? "ring-2 ring-blue-500" : ""
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="text-[11px] font-medium text-gray-900 mb-1 truncate">{lead.title}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 mb-2">
            <span className="truncate">{lead.company}</span>
            <span className="text-xs">•</span>
            <div className="flex items-center gap-0.5">
              <BanknotesIcon className="w-3 h-3 text-gray-700" />
              <span className="font-semibold">{lead.value}</span>
            </div>
          </div>
          <div className="flex gap-1 items-center mb-2 flex-wrap">
            {lead.tags.map((tag, idx) => (
              <span key={idx} className={`${tag.color} text-black text-[8px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap`}>
                {tag.label}
              </span>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <button onClick={() => onEditLead(lead.id)} className="w-6 h-6 flex items-center justify-center rounded-full border border-[#8AB500] hover:bg-gray-100">
                <PencilSquareIcon className="w-3.5 h-3.5" style={{ color: "#8AB500" }} />
              </button>
              <ArchiveButton lead={lead} /> 
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white ${lead.assignee.color}`}>
                {lead.assignee.initial}
              </div>
              <span className="text-[11px] text-gray-800 truncate max-w-[80px]">{lead.assignee.name}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="w-[280px] rounded-xl p-5 text-center flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: "#3AAD6D" }}>
            <ArrowUturnLeftIcon className="w-8 h-8 text-white" />
          </div>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-sm font-bold text-center">Restore this lead?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-600 mt-1 text-center">Lead will be restored to its original stage.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 mt-4">
            <AlertDialogAction onClick={confirmRestore} className="text-white px-4 py-1.5 rounded-full text-xs" style={{ backgroundColor: "#3AAD6D" }}>Restore</AlertDialogAction>
            <AlertDialogCancel className="px-4 py-1.5 rounded-full text-xs border" style={{ borderColor: "#3AAD6D", color: "#3AAD6D", backgroundColor: "#FFFFFF" }}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 text-sm px-4 py-2 shadow-md z-[9999] flex items-center gap-2 rounded-md max-w-xs">
          <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage("")} className="text-green-800 font-bold ml-2">×</button>
        </div>
      )}

      <div className="h-full flex flex-col bg-[#E8EAED]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className={`flex-1 ${isArchiveMode || viewMode === 'list' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
              
              {isArchiveMode ? (
                /* ARCHIVE VIEW */
                <div className="space-y-3 pb-28 pr-2 pl-4 py-4">
                  <div className="bg-white rounded-lg border border-gray-300 px-3 py-3 mb-2">
                    <h3 className="font-bold text-gray-900 text-sm">Archived Leads</h3>
                    <p className="text-[11px] text-gray-600 mt-0.5">{displayLeads.length} leads archived</p>
                  </div>
                  <div className="bg-white border border-gray-300">
                    {displayLeads.map((lead) => (
                      <div key={lead.id} className="px-3 py-2.5 border-b border-gray-100">
                         <div className="grid grid-cols-[80px_1fr_90px_100px_200px_100px_120px] gap-3 items-center">
                            <div className="flex items-center gap-1.5">
                                <button onClick={() => onEditLead(lead.id)} className="w-6 h-6 flex items-center justify-center rounded-full border border-[#8AB500]">
                                    <PencilSquareIcon className="w-3.5 h-3.5" style={{ color: "#8AB500" }} />
                                </button>
                                <ArchiveButton lead={lead} /> 
                            </div>
                            <span className="text-[11px] font-medium text-gray-900 truncate">{lead.title}</span>
                            <span className="text-[11px] text-gray-600 truncate">{lead.company}</span>
                            <div className="flex items-center gap-0.5">
                                <BanknotesIcon className="w-3 h-3 text-gray-700" />
                                <span className="text-[10px] font-semibold text-gray-800">{lead.value}</span>
                            </div>
                            <div className="flex gap-1">
                                {lead.tags.map((tag, idx) => (<span key={idx} className={`${tag.color} text-[8px] px-1.5 py-0.5 rounded-full`}>{tag.label}</span>))}
                            </div>
                            <span className="text-[10px] text-gray-500">{formatDateToDDMMYYYY(lead.date)}</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-white ${lead.assignee.color}`}>{lead.assignee.initial}</div>
                                <span className="text-[11px] text-gray-800 truncate">{lead.assignee.name}</span>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                /* LIST VIEW */
                <div className="space-y-3 pb-28 pr-2 pl-4 py-4">
                  {stages.map((stage) => {
                    const stageLeads = displayLeads.filter((l) => l.stage === stage.id);
                    const totalVal = stageLeads.reduce((acc, curr) => acc + Number(curr.value.replace(/[^0-9.-]+/g, "")), 0);
                    const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalVal);
                    return (
                      <section key={stage.id}>
                        <div className="bg-white rounded-lg border border-gray-300 px-3 py-3 mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm">{stage.title}</h3>
                            <p className="text-[11px] text-gray-600 mt-0.5">{formattedTotal} • {stageLeads.length} Leads</p>
                          </div>
                        </div>
                        <Droppable droppableId={stage.id} type="LEAD">
                          {(p, s) => (
                            <div ref={p.innerRef} {...p.droppableProps} className={`bg-white border border-gray-300 min-h-[40px] ${s.isDraggingOver ? "bg-blue-50" : ""}`}>
                              {stageLeads.map((lead, index) => (
                                <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                  {(prov, snap) => (
                                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className={`px-3 py-2.5 border-b border-gray-100 ${snap.isDragging ? "bg-white shadow-md" : ""}`}>
                                      <div className="grid grid-cols-[50px_1fr_90px_100px_200px_100px_120px] gap-3 items-center">
                                        <div className="flex items-center gap-1.5">
                                          <button onClick={() => onEditLead(lead.id)} className="w-6 h-6 flex items-center justify-center rounded-full border border-[#8AB500]"><PencilSquareIcon className="w-3 h-3 text-[#8AB500]"/></button>
                                          <ArchiveButton lead={lead} />
                                        </div>
                                        <span className="text-[11px] font-medium truncate">{lead.title}</span>
                                        <span className="text-[11px] text-gray-600 truncate">{lead.company}</span>
                                        <span className="text-[10px] font-semibold">{lead.value}</span>
                                        <div className="flex gap-1">{lead.tags.map((t, i) => (<span key={i} className={`${t.color} text-[8px] px-1.5 py-0.5 rounded-full`}>{t.label}</span>))}</div>
                                        <span className="text-[10px] text-gray-500">{formatDateToDDMMYYYY(lead.date)}</span>
                                        <div className="flex items-center gap-1.5 text-[11px]">
                                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${lead.assignee.color}`}>{lead.assignee.initial}</div>
                                          {lead.assignee.name}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {p.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </section>
                    );
                  })}
                </div>
              ) : (
                /* KANBAN VIEW */
                <div className="flex-1 overflow-x-auto p-4">
                  <div className="inline-flex h-full space-x-4 min-w-full">
                    {stages.map((stage) => {
                      const stageLeads = displayLeads.filter((l) => l.stage === stage.id);
                      return (
                        <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col">
                          <div className="bg-white rounded-lg border border-gray-300 px-3 py-3 mb-2 flex items-center justify-between">
                             <div>
                                <h3 className="font-bold text-gray-900 text-sm">{stage.title}</h3>
                                <p className="text-[11px] text-gray-600 mt-0.5">{stageLeads.length} Leads</p>
                            </div>
                          </div>
                          <Droppable droppableId={stage.id} type="LEAD">
                            {(p, s) => (
                              <div ref={p.innerRef} {...p.droppableProps} className={`flex-1 min-h-[50px] space-y-2 p-2 rounded-lg transition-colors ${s.isDraggingOver ? "bg-blue-100" : "bg-gray-100"}`}>
                                {stageLeads.map((lead, index) => (<KanbanCard key={lead.id} lead={lead} index={index} />))}
                                {p.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- FOOTER ASLI LO (RE-STYLING) --- */}
          {!isArchiveMode && (
            <div className="fixed bottom-0 z-50 bg-transparent" style={{ left: isSidebarOpen ? "150px" : "0", right: "0", padding: "0 16px" }}>
              <div className="bg-white border border-gray-300 rounded-md shadow-md py-2 px-3 flex items-center justify-center gap-4 mx-auto mb-4" style={{ maxWidth: isSidebarOpen ? "calc(100% - 100px)" : "100%", width: "100%" }}>
                <Droppable droppableId="DELETE">
                  {(p, s) => (
                    <div ref={p.innerRef} {...p.droppableProps} className={`h-12 bg-[#E8C8C8] border-4 border-dashed border-[#AA130A] flex items-center justify-center flex-1 transition-transform ${s.isDraggingOver ? "scale-105" : ""}`}>
                      <span className="text-black text-sm uppercase font-medium">Delete</span>
                      {p.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="WON">
                  {(p, s) => (
                    <div ref={p.innerRef} {...p.droppableProps} className={`h-12 bg-[#CDE8C8] border-4 border-dashed border-[#257047] flex items-center justify-center flex-1 transition-transform ${s.isDraggingOver ? "scale-105" : ""}`}>
                      <span className="text-black text-sm uppercase font-medium">Won</span>
                      {p.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="LOST">
                  {(p, s) => (
                    <div ref={p.innerRef} {...p.droppableProps} className={`h-12 bg-[#F9FFC5] border-4 border-dashed border-[#8AB500] flex items-center justify-center flex-1 transition-transform ${s.isDraggingOver ? "scale-105" : ""}`}>
                      <span className="text-black text-sm uppercase font-medium">Lost</span>
                      {p.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          )}
        </DragDropContext>
      </div>
    </>
  );
};

export default LeadsListView;