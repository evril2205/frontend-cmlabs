"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import LeadCard from "./LeadCard";
import { Droppable, Draggable } from "@hello-pangea/dnd";

interface Lead {
  id: string;
  title: string;
  company: string;
  value: string;
  date: string;
  tags: Array<{ label: string; color: string }>;
  assignee: { name: string; initial: string; color: string };
}

interface KanbanColumnProps {
  stageId: string;
  title: string;
  totalValue: string;
  leadCount: number;
  leads: Lead[];
  onAddLead?: () => void;
  onEditLead?: (id: string) => void;
  onArchiveLead?: (id: string) => void;
}

const KanbanColumn = ({
  stageId,
  title,
  totalValue,
  leadCount,
  leads = [],
  onAddLead,
  onEditLead,
  onArchiveLead,
}: KanbanColumnProps) => {
  return (
   <div className="bg-[#E8EAED] rounded-lg shadow-sm p-2 flex-1 min-w-[280px] h-full flex flex-col">
      {/* Header */}
      <div className="border border-gray-300 rounded-lg p-2 mb-1 bg-white flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-[15px] font-semibold tracking-wide">{title}</h2>
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
            <span className="font-medium text-xs">{totalValue}</span>
            <span>•</span>
            <span className="text-xs">{leadCount} Leads</span>
          </div>
        </div>
        <button
          onClick={onAddLead}
          className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 hover:bg-[#4a3f95] transition-colors"
          style={{ backgroundColor: "#5A4FB5" }}
          title="Add Lead"
          type="button"
        >
          <PlusIcon className="w-3 h-3 text-white" />
        </button>
      </div>

      {/* Droppable Area - FIXED: No overflow scroll, just height */}
      <Droppable droppableId={stageId}>
        {(provided, snapshot) => (
          <div
            className={`space-y-1 pb-4 flex-1 transition-colors ${
    snapshot.isDraggingOver ? "bg-gray-300/30" : ""
  }`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {leads && leads.length > 0 ? (
              leads.map((lead, index) => {
                // IMPORTANT: Ensure ID is string and unique
                const leadId = String(lead.id);
                
                console.log(`🎴 Rendering card: ${leadId} in ${stageId} at index ${index}`);
                
                return (
                  <Draggable 
                    draggableId={leadId} 
                    index={index} 
                    key={leadId}
                  >
                    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        // TAMBAHKAN ONCLICK DI SINI
        onClick={() => onEditLead?.(leadId)} 
        // TAMBAHKAN cursor-pointer
        className={`mb-1 cursor-pointer ${snapshot.isDragging ? 'opacity-50' : ''}`}
        style={provided.draggableProps.style}
      >
        <LeadCard
          {...lead}
          onEdit={() => onEditLead?.(leadId)}
          onArchive={() => onArchiveLead?.(leadId)}
        />
      </div>
    )}
                  </Draggable>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-10 text-[10px] italic">
                No leads in {title}
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;