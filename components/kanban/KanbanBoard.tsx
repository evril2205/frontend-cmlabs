"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import KanbanColumn from "./KanbanColumn";
import CreateLeadModal from "./CreateLeadModal";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { updateLeadStatus, deleteLead, updateLead } from "@/services/leadService";
import FilterLeadModal from "../modals/FilterLeadModal";

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
import { CheckCircleIcon, ArrowUturnLeftIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { FileCheck, FileX, Trash2 } from "lucide-react";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

// Interface untuk Lead UI
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

interface KanbanBoardProps {
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
  isArchiveMode?: boolean;
  onArchiveSuccess?: () => void;
  leads?: Lead[];
  onLeadsChange?: (leads: Lead[]) => void;
  onAddLead?: () => void;
  onEditLead: (leadId: string) => void;
  filters?: any;  
  setFilters?: (filters: any) => void;  
  onClearFilter?: () => void; 
}

const DIALOG_CONFIG = {
  delete: { icon: Trash2, bgColor: "#AA130A", title: "Delete this lead?", description: "Are you sure? This action cannot be undone.", buttonLabel: "Delete", buttonColor: "#DC2626", cancelBgColor: "#FFFFFF", cancelBorderColor: "#DC2626", cancelTextColor: "#DC2626" },
  won: { icon: FileCheck, bgColor: "#257047", title: "Mark as Won?", description: "Move this lead to the Won stage.", buttonLabel: "Won", buttonColor: "#3AAD6D", cancelBgColor: "#FFFFFF", cancelBorderColor: "#3AAD6D", cancelTextColor: "#3AAD6D" },
  lost: { icon: FileX, bgColor: "#D1FB20", title: "Mark as Lost?", description: "Move this lead to the Lost stage.", buttonLabel: "Lost", buttonColor: "#8AB500", cancelBgColor: "#FFFFFF", cancelBorderColor: "#8AB500", cancelTextColor: "#8AB500" },
  restore: { icon: ArrowUturnLeftIcon, bgColor: "#3AAD6D", title: "Restore Lead?", description: "Move lead back to active board.", buttonLabel: "Restore", buttonColor: "#3AAD6D", cancelBgColor: "#FFFFFF", cancelBorderColor: "#3AAD6D", cancelTextColor: "#3AAD6D" },
};

const KanbanBoard = React.forwardRef<any, KanbanBoardProps>((props, ref) => {
  const { 
    isCreateModalOpen = false, 
    onCloseCreateModal, 
    isArchiveMode = false, 
    onArchiveSuccess, 
    onAddLead, 
    onEditLead,
    filters,
    setFilters,
    onClearFilter,
    leads: leadsFromProps = [],
    onLeadsChange
  } = props;

  const topScrollRef = useRef<HTMLDivElement>(null);
  const realScrollRef = useRef<HTMLDivElement>(null);
  const { isSidebarOpen } = useSidebar();
  const [toastMessage, setToastMessage] = useState("");
  const [contentWidth, setContentWidth] = useState(0);
  const [leadToProcess, setLeadToProcess] = useState<string | null>(null);
  const [confirmationType, setConfirmationType] = useState<keyof typeof DIALOG_CONFIG>("delete");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  React.useImperativeHandle(ref, () => ({
    openFilter: () => setIsFilterOpen(true)
  }));

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

  useEffect(() => {
    if (realScrollRef.current) setContentWidth(realScrollRef.current.scrollWidth);
  }, [leadsFromProps, isSidebarOpen]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

 const handleDragEnd = async (result: DropResult) => {
  const { destination, source, draggableId } = result;
  if (!destination || destination.droppableId === source.droppableId) return;

  // 🛑 Kalau drop ke area special → buka modal, jangan update langsung
  if (["WON", "LOST", "delete"].includes(destination.droppableId)) {
    setLeadToProcess(draggableId);

    if (destination.droppableId === "delete") {
      setConfirmationType("delete");
    } else if (destination.droppableId === "WON") {
      setConfirmationType("won");
    } else if (destination.droppableId === "LOST") {
      setConfirmationType("lost");
    }

    setIsConfirmOpen(true);
    return;
  }

  // ==========================
  // NORMAL PIPELINE MOVE
  // ==========================
  if (onLeadsChange) {
    const originalLeads = [...leadsFromProps];

    const updatedLeads = leadsFromProps.map(l =>
      l.id === draggableId ? { ...l, stage: destination.droppableId } : l
    );

    onLeadsChange(updatedLeads);

    try {
      await updateLeadStatus(parseInt(draggableId), {
        status: destination.droppableId,
      });
      showToast("Lead moved successfully!");
    } catch (err) {
      onLeadsChange(originalLeads);
      alert("Gagal memindahkan kartu");
    }
  }
};


const confirmAction = async () => {
  if (!leadToProcess) return;

  // Cukup update UI via props, biarkan parent yang panggil API
  if (onLeadsChange) {
    if (confirmationType === "delete") {
      const updated = leadsFromProps.filter(l => l.id !== leadToProcess);
      onLeadsChange(updated); // Ini akan memicu handleDeleteLead di LeadsPage
    } 
    else if (confirmationType === "won" || confirmationType === "lost") {
      const targetStatus = confirmationType.toUpperCase();
      const updated = leadsFromProps.map(l => 
        l.id === leadToProcess ? { ...l, stage: targetStatus } : l
      );
      onLeadsChange(updated);
    }
    // ... restore tetap pakai API lokal karena logic-nya beda sendiri
  }

  setIsConfirmOpen(false);
  setLeadToProcess(null);
};

  const handleTopScroll = () => { if (topScrollRef.current && realScrollRef.current) realScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft; };
  const handleRealScroll = () => { if (realScrollRef.current && topScrollRef.current) topScrollRef.current.scrollLeft = realScrollRef.current.scrollLeft; };

  const displayLeads = leadsFromProps;
  const config = DIALOG_CONFIG[confirmationType];
  const IconComponent = config.icon;

  return (
    <>
      <FilterLeadModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters || {}}  
        setFilters={setFilters || (() => {})} 
        onApply={() => setIsFilterOpen(false)}
        onClear={() => onClearFilter?.()} 
      />

      <CreateLeadModal 
        isOpen={isCreateModalOpen} 
        onClose={onCloseCreateModal || (() => {})} 
        onSubmit={onArchiveSuccess || (() => {})} 
      />
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="w-[280px] rounded-xl p-5 text-center flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: config.bgColor }}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-sm font-bold text-center">{config.title}</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-600 mt-1 text-center">{config.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 mt-4">
            <AlertDialogAction onClick={confirmAction} className="text-white px-4 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: config.buttonColor }}>
              {config.buttonLabel}
            </AlertDialogAction>
            <AlertDialogCancel className="px-4 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: config.cancelBgColor, borderColor: config.cancelBorderColor, color: config.cancelTextColor, border: `1px solid ${config.cancelBorderColor}` }}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {toastMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 text-sm px-6 py-3 shadow-lg z-[9999] flex items-center gap-2 rounded-lg">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="bg-[#F0F2F5] h-[calc(100vh-120px)] flex flex-col overflow-hidden">
        {!isArchiveMode && (
          <div ref={topScrollRef} onScroll={handleTopScroll} className="overflow-x-auto overflow-y-hidden bg-[#F0F2F5]" style={{ height: 12 }}>
            <div style={{ width: `${contentWidth}px`, height: 1 }} />
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div ref={realScrollRef} onScroll={handleRealScroll} className="hide-scrollbar overflow-x-auto overflow-y-hidden flex-1 px-6 pt-4">
            <div className="flex gap-3 w-max h-full pb-24">
              {isArchiveMode ? (
                displayLeads.length > 0 ? (
                  displayLeads.map((lead) => (
  <div 
    key={lead.id} 
    // TAMBAHKAN ONCLICK DI SINI
    onClick={() => onEditLead(lead.id)} 
    // TAMBAHKAN cursor-pointer DI SINI
    className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all w-80 flex-shrink-0 cursor-pointer hover:border-purple-400"
  >
                      <div className="flex items-center justify-between">
                        <h3 className="font-small text-gray-900 text-[12px] leading-snug flex-1">{lead.title}</h3>
                        <div className="flex items-center gap-1">
                          <button onClick={() => onEditLead(lead.id)} className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                            <PencilSquareIcon className="w-2.5 h-2.5 text-[#8AB500]" />
                          </button>
                          <button onClick={() => { setLeadToProcess(lead.id); setConfirmationType("restore"); setIsConfirmOpen(true); }} className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300">
                            <Image src="/assets/icons/box.svg" alt="Restore" width={14} height={14} className="w-2.5 h-2.5" style={{ filter: "invert(45%)" }} />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-gray-500 mb-1">{lead.company}</p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BanknotesIcon className="w-4 h-4 text-gray-700" />
                          <span className="text-[11px] font-medium text-gray-800">{lead.value}</span>
                        </div>
                        <span className="text-[11px] text-gray-500">{lead.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {lead.tags.map((tag, i) => (<span key={i} className={`${tag.color} text-black text-[8px] px-3 py-[3px] rounded-full`}>{tag.label}</span>))}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] text-white ${lead.assignee.color}`}>{lead.assignee.initial}</div>
                        <span className="text-[10px] text-gray-800">{lead.assignee.name}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8 text-sm w-full">No archived leads yet</div>
                )
              ) : (
                stages.map((stage) => {
                  const columnLeads = displayLeads.filter(l => l.stage === stage.id);
                  const totalAmount = columnLeads.reduce((acc, curr) => {
                    const val = Number(curr.value.replace(/[^0-9.-]+/g, ""));
                    return acc + (isNaN(val) ? 0 : val);
                  }, 0);
                  const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalAmount);

                  return (
                    <KanbanColumn
                      key={stage.id}
                      stageId={stage.id}
                      title={stage.title}
                      totalValue={formattedTotal}
                      leadCount={columnLeads.length}
                      leads={columnLeads}
                      onAddLead={onAddLead}
                      onEditLead={onEditLead}
                      onArchiveLead={async (id) => {
                        await updateLead(parseInt(id), { isArchived: true });
                        showToast("Lead moved to Archive!");
                        onArchiveSuccess?.();
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>

          {!isArchiveMode && (
            <div className="fixed bottom-0 z-50 bg-transparent" style={{ left: isSidebarOpen ? "150px" : "0", right: "0", padding: "0 16px" }}>
              <div className="bg-white border border-gray-300 rounded-md shadow-md py-2 px-3 flex items-center justify-center gap-4 mx-auto" style={{ maxWidth: isSidebarOpen ? "calc(100% - 100px)" : "100%", width: "100%" }}>
                <Droppable droppableId="delete">
                  {(p, s) => (
                    <div ref={p.innerRef} {...p.droppableProps} className={`relative h-12 flex-1 transition-transform duration-200 ${s.isDraggingOver ? "scale-105" : ""}`}>
                      <div className={`absolute inset-0 border-4 border-dashed transition-colors duration-200 ${s.isDraggingOver ? "bg-[#AA130A]/20 border-[#AA130A]" : "bg-[#E8C8C8] border-[#AA130A]"}`} />
                      <span className="absolute inset-0 flex items-center justify-center text-black text-sm uppercase font-medium pointer-events-none">Delete</span>
                      {p.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="WON">
                  {(p, s) => (
                    <div ref={p.innerRef} {...p.droppableProps} className={`relative h-12 flex-1 transition-transform duration-200 ${s.isDraggingOver ? "scale-105" : ""}`}>
                      <div className={`absolute inset-0 border-4 border-dashed transition-colors duration-200 ${s.isDraggingOver ? "bg-[#6EB601]/20 border-[#6EB601]" : "bg-[#CDE8C8] border-[#257047]"}`} />
                      <span className="absolute inset-0 flex items-center justify-center text-black text-sm uppercase font-medium pointer-events-none">Won</span>
                      {p.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="LOST">
                  {(p, s) => (
                    <div ref={p.innerRef} {...p.droppableProps} className={`relative h-12 flex-1 transition-transform duration-200 ${s.isDraggingOver ? "scale-105" : ""}`}>
                      <div className={`absolute inset-0 border-4 border-dashed transition-colors duration-200 ${s.isDraggingOver ? "bg-[#D1FB20]/30 border-[#D1FB20]" : "bg-[#F9FFC5] border-[#8AB500]"}`} />
                      <span className="absolute inset-0 flex items-center justify-center text-black text-sm uppercase font-medium pointer-events-none">Lost</span>
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
});

KanbanBoard.displayName = "KanbanBoard";
export default KanbanBoard;