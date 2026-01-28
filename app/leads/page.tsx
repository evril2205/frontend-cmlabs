"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Topbar from "@/components/topbar/Topbar";
import LeadsHeader from "@/components/topbar/LeadsHeader";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import LeadsListView from "@/components/leads/LeadsListView";
import LeadsArchiveView from "@/components/leads/LeadsArchiveView";
import CreateLeadModal from "@/components/kanban/CreateLeadModal";
import { useSidebar } from "@/contexts/SidebarContext";
import LeadManagement from '@/components/leads/LeadManagement';
import { useRouter, useSearchParams } from "next/navigation";
import { getLeads, updateLeadStatus, deleteLead } from "@/services/leadService";



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

// Helper Functions
const getLabelColor = (label: string): string => {
  const colors: Record<string, string> = {
    'Hot': 'bg-[#F92916]',
    'Pitching': 'bg-[#2D8EFF]',
    'Cold': 'bg-gray-400',
    'Deal': 'bg-[#257047]',
    'High Priority': 'bg-[#D1FB20]',
    'Existing': 'bg-[#2D8EFF]',
  };
  return colors[label] || 'bg-blue-500';
};

const getInitial = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};


export default function LeadsPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isArchiveMode, setIsArchiveMode] = useState(false);
  const [currentView, setCurrentView] = useState<"list" | "grid" | "kanban" | "archive" | "detail">("kanban");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  // ✅ FILTER STATE
  const [filters, setFilters] = useState({
    stages: "",
    currencies: "",
    labels: "",
    clientTypes: "",
    dateRange: "",
    priorities: "",
    sortUpdate: "",
    ownership: "All Leads",
  });

  // ✅ FILTERED LEADS - Apply filters to leads data
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Archive filter
      const archiveMatch = isArchiveMode ? lead.isArchived : !lead.isArchived;
      if (!archiveMatch) return false;

      // 2. Stage filter
      if (filters.stages && filters.stages !== "") {
        if (lead.stage !== filters.stages) return false;
      }

      // 3. Label filter
      if (filters.labels && filters.labels !== "") {
        const leadLabels = lead.tags.map(t => t.label.toUpperCase());
        if (!leadLabels.includes(filters.labels.toUpperCase())) return false;
      }

      // 4. Currency filter
      if (filters.currencies && filters.currencies !== "") {
        const leadValueStr = lead.value.toUpperCase();
        const fc = filters.currencies.toUpperCase();
        
        let match = false;
        if (fc === 'IDR') match = leadValueStr.includes('RP') || leadValueStr.includes('IDR');
        else if (fc === 'USD') match = leadValueStr.includes('$') || leadValueStr.includes('USD');
        else if (fc === 'EUR') match = leadValueStr.includes('€') || leadValueStr.includes('EUR');
        else match = leadValueStr.includes(fc);
        
        if (!match) return false;
      }

      // 5. Date Range filter
      if (filters.dateRange && filters.dateRange !== "") {
        const leadDate = new Date(lead.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filters.dateRange === "Today") {
          if (leadDate.toDateString() !== today.toDateString()) return false;
        } else if (filters.dateRange === "This Week") {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          if (leadDate < weekAgo) return false;
        }
      }

      return true;
    });
  }, [leads, filters, isArchiveMode]);

  // ✅ COUNT ACTIVE FILTERS
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.stages) count++;
    if (filters.currencies) count++;
    if (filters.labels) count++;
    if (filters.clientTypes) count++;
    if (filters.dateRange) count++;
    if (filters.priorities) count++;
    if (filters.ownership && filters.ownership !== "All Leads") count++;
    return count;
  }, [filters]);

  // ✅ CLEAR FILTERS HANDLER
  const handleClearFilter = () => {
    setFilters({
      stages: "",
      currencies: "",
      labels: "",
      clientTypes: "",
      dateRange: "",
      priorities: "",
      sortUpdate: "",
      ownership: "All Leads",
    });
  };

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const boardRef = useRef<any>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get("modal");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync Modal State dengan URL
  useEffect(() => {
    if (modalParam === "add") {
      setIsCreateModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }
  }, [modalParam]);

  // ✅ FETCH LEADS FROM BACKEND
  const fetchLeadsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching leads from backend...');
      const response = await getLeads();
      
      console.log('📦 Raw response:', response);

      // ✅ FIX TYPESCRIPT ERROR: Explicitly type leadsData
      let leadsData: any[] = [];
      
      if (response.success && response.data) {
        leadsData = response.data;
      } else if (Array.isArray(response)) {
        leadsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        leadsData = response.data;
      }

      console.log('📋 Leads data to process:', leadsData);

      if (leadsData.length > 0) {
        const formatted: Lead[] = leadsData.map((item: any) => {
          const rawStatus = item.status ? item.status.toUpperCase() : "NEW";
          let finalStage = rawStatus;
          
          if (rawStatus === "CONTRACT_SENT" || rawStatus === "DEMO_SCHEDULED") {
            finalStage = "NEGOTIATION";
          }

          const formattedValue = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: item.currency || 'IDR',
            minimumFractionDigits: 0,
          }).format(Number(item.dealValue || 0));

          const formattedDate = item.dueDate 
            ? new Date(item.dueDate).toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })
            : "-";

          return {
            id: item.id.toString(),
            title: item.title || "Untitled Lead",
            company: item.companyName || item.personName || "No Company",
            value: formattedValue,
            date: formattedDate,
            stage: finalStage,
            isArchived: item.isArchived || false,
            tags: item.label 
              ? [{ label: item.label, color: getLabelColor(item.label) }] 
              : [],
            assignee: { 
              name: item.pic?.fullname || "Unassigned", 
              initial: getInitial(item.pic?.fullname || "U"), 
              color: "bg-purple-500" 
            }
          };
        });

        console.log('✅ Formatted leads:', formatted);
        setLeads(formatted);
        localStorage.setItem("kanban_leads_cache", JSON.stringify(formatted));
      } else {
        console.log('ℹ️ No leads found');
        setLeads([]);
      }

    } catch (error: any) {
      console.error("❌ Error fetching leads:", error);
      setError("Failed to load leads. Please try again.");
      
      const cachedLeads = localStorage.getItem("kanban_leads_cache");
      if (cachedLeads) {
        try {
          setLeads(JSON.parse(cachedLeads));
        } catch (e) {
          console.error("Error parsing cached leads:", e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ INITIAL LOAD: Restore view mode & fetch data
  useEffect(() => {
    fetchLeadsData();
    
    // Restore saved view mode
    const savedView = localStorage.getItem("kanban_view");
    if (savedView) {
      try { 
        const parsedView = JSON.parse(savedView);
        setCurrentView(parsedView);
        
        // If saved view is "archive", set archive mode
        if (parsedView === "archive") {
          setIsArchiveMode(true);
        }
      } catch (e) {
        console.error("Error parsing saved view:", e);
      }
    }
  }, []);

  // ✅ SAVE VIEW MODE on change
  useEffect(() => {
    localStorage.setItem("kanban_view", JSON.stringify(currentView));
  }, [currentView]);

  // ✅ CREATE LEAD - Refresh after success
  const handleCreateLeadSubmit = async () => {
    await fetchLeadsData();
    setIsCreateModalOpen(false);
    router.push("/leads", { scroll: false });
  };

  // ✅ UPDATE LEAD STATUS (Drag & Drop to Backend)
  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      console.log(`🔄 Updating lead ${leadId} to status ${newStatus}`);
      
      const response = await updateLeadStatus(parseInt(leadId), { status: newStatus });
      
      if (response.success) {
        console.log('✅ Lead status updated in backend');
        // Update local state immediately (optimistic update)
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId 
              ? { ...lead, stage: newStatus } 
              : lead
          )
        );
      }
    } catch (error) {
      console.error("❌ Error updating lead status:", error);
      // Revert optimistic update on error
      await fetchLeadsData();
    }
  };

  // ✅ ARCHIVE LEAD (Update Backend) - FIX: Actually call backend
  const handleArchiveLead = async (leadId: string) => {
    try {
      console.log(`📦 Archiving lead ${leadId}`);
      
      // Call backend API to update isArchived field
      const { updateLead } = await import("@/services/leadService");
      await updateLead(parseInt(leadId), { isArchived: true });
      
      // Update local state after backend success
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, isArchived: true } 
            : lead
        )
      );

      console.log('✅ Lead archived and saved to backend');
    } catch (error) {
      console.error("❌ Error archiving lead:", error);
      await fetchLeadsData(); // Revert on error
    }
  };

  // ✅ RESTORE LEAD (Update Backend) - FIX: Actually call backend
  const handleRestoreLead = async (leadId: string) => {
    try {
      console.log(`♻️ Restoring lead ${leadId}`);
      
      // Call backend API to update isArchived field
      const { updateLead } = await import("@/services/leadService");
      await updateLead(parseInt(leadId), { isArchived: false });
      
      // Update local state after backend success
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, isArchived: false } 
            : lead
        )
      );

      console.log('✅ Lead restored and saved to backend');
    } catch (error) {
      console.error("❌ Error restoring lead:", error);
      await fetchLeadsData(); // Revert on error
    }
  };

  // ✅ DELETE LEAD (Permanent)
  const handleDeleteLead = async (leadId: string) => {
    try {
      console.log(`🗑️ Deleting lead ${leadId}`);
      
      await deleteLead(parseInt(leadId));
      
      // Remove from local state
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
      
      console.log('✅ Lead deleted');
    } catch (error) {
      console.error("❌ Error deleting lead:", error);
    }
  };

  // ✅ VIEW TOGGLE with Archive handling
  const handleViewToggle = (view: "list" | "grid" | "kanban" | "archive") => {
    if (view === "archive") {
      // Toggle archive mode, keep current base view (kanban/list)
      setIsArchiveMode(true);
      // Keep currentView as is (kanban or list)
    } else {
      setCurrentView(view);
      setIsArchiveMode(false);
    }
  };

  const handleArchiveToggle = (show: boolean) => {
    setIsArchiveMode(show);
    // Don't change currentView, just toggle archive mode
  };

  const handleAddLead = () => router.push("/leads?modal=add", { scroll: false });
  
  const handleEditLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentView("detail");
  };
  
  const handleBackToLeads = () => {
    setSelectedLeadId(null);
    setCurrentView("kanban");
    fetchLeadsData();
  };

  // ✅ HANDLE LEADS CHANGE (from child components) - FIX: Actually save to backend
  const handleLeadsChange = async (updatedLeads: Lead[]) => {
    console.log('🔄 handleLeadsChange triggered');
    
    // Compare with current state to find changes
    const changes: Array<{leadId: string, change: 'stage' | 'archive' | 'restore' | 'won' | 'lost' | 'delete'}> = [];
    
    updatedLeads.forEach((updatedLead) => {
      const originalLead = leads.find(l => l.id === updatedLead.id);
      
      if (originalLead) {
        // Detect stage change (Drag & Drop)
        if (updatedLead.stage !== originalLead.stage) {
          // Check if it's a special stage (WON, LOST)
          if (updatedLead.stage === 'WON') {
            changes.push({ leadId: updatedLead.id, change: 'won' });
          } else if (updatedLead.stage === 'LOST') {
            changes.push({ leadId: updatedLead.id, change: 'lost' });
          } else {
            changes.push({ leadId: updatedLead.id, change: 'stage' });
          }
        }
        
        // Detect archive/restore
        if (updatedLead.isArchived !== originalLead.isArchived) {
          if (updatedLead.isArchived) {
            changes.push({ leadId: updatedLead.id, change: 'archive' });
          } else {
            changes.push({ leadId: updatedLead.id, change: 'restore' });
          }
        }
      }
    });

    // Check for deleted leads
    leads.forEach((originalLead) => {
      const stillExists = updatedLeads.find(l => l.id === originalLead.id);
      if (!stillExists) {
        changes.push({ leadId: originalLead.id, change: 'delete' });
      }
    });

    console.log('📋 Detected changes:', changes);

    // Update local state immediately (optimistic update)
    setLeads(updatedLeads);

    // Process each change and update backend
    for (const change of changes) {
      const updatedLead = updatedLeads.find(l => l.id === change.leadId);

      try {
        if (change.change === 'stage') {
          if (!updatedLead) continue;
          console.log(`🔄 Updating lead ${change.leadId} stage to ${updatedLead.stage}`);
          await handleUpdateLeadStatus(change.leadId, updatedLead.stage);
        } else if (change.change === 'won') {
          console.log(`🎉 Marking lead ${change.leadId} as WON`);
          await handleUpdateLeadStatus(change.leadId, 'WON');
        } else if (change.change === 'lost') {
          console.log(`😔 Marking lead ${change.leadId} as LOST`);
          await handleUpdateLeadStatus(change.leadId, 'LOST');
        } else if (change.change === 'archive') {
          console.log(`📦 Archiving lead ${change.leadId}`);
          await handleArchiveLead(change.leadId);
        } else if (change.change === 'restore') {
          console.log(`♻️ Restoring lead ${change.leadId}`);
          await handleRestoreLead(change.leadId);
        } else if (change.change === 'delete') {
          console.log(`🗑️ Deleting lead ${change.leadId}`);
          await handleDeleteLead(change.leadId);
        }
      } catch (error) {
        console.error(`❌ Error processing change for lead ${change.leadId}:`, error);
        // Revert on error
        await fetchLeadsData();
        return;
      }
    }

    console.log('✅ All changes saved to backend');
  };

  // Scroll Sync Logic
  useEffect(() => {
    if (currentView !== "kanban" || isArchiveMode) return;
    const topScroll = document.getElementById("top-scroll");
    const real = document.getElementById("real-scroll");
    if (!topScroll || !real) return;

    const onTopScroll = () => { real.scrollLeft = topScroll.scrollLeft; };
    const onRealScroll = () => { topScroll.scrollLeft = real.scrollLeft; };

    topScroll.addEventListener("scroll", onTopScroll, { passive: true });
    real.addEventListener("scroll", onRealScroll, { passive: true });
    return () => {
      topScroll.removeEventListener("scroll", onTopScroll);
      real.removeEventListener("scroll", onRealScroll);
    };
  }, [currentView, isArchiveMode]);

  // LEAD MANAGEMENT VIEW
  if (currentView === "detail" && selectedLeadId) {
    return <LeadManagement leadId={selectedLeadId} onBack={handleBackToLeads} />;
  }

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#5A4FB0]/20 border-t-[#5A4FB0] rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading Leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div ref={headerRef} className="sticky top-0 z-40 bg-[#F0F2F5]">
        <div className="border-b border-gray-200">
          <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
        <div className="px-5">
          <LeadsHeader
            onViewToggle={handleViewToggle}
            onArchiveToggle={handleArchiveToggle}
            onAddLead={handleAddLead}
            onFilterClick={() => boardRef.current?.openFilter()}
            activeFilterCount={activeFilterCount}
            isArchiveMode={isArchiveMode}
            currentView={currentView as any}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 overflow-hidden pt-1">
        <div className="flex-1 min-h-0 overflow-hidden">
          
          {/* KANBAN VIEW - Normal */}
          {currentView === "kanban" && !isArchiveMode && (
            <div className="h-full">
              <KanbanBoard 
                ref={boardRef}
                isArchiveMode={false}
                onArchiveSuccess={() => {}}
                leads={filteredLeads}
                onLeadsChange={handleLeadsChange}
                onAddLead={handleAddLead}
                onEditLead={handleEditLead}
                filters={filters} 
                setFilters={setFilters} 
                onClearFilter={handleClearFilter} 
              />
            </div>
          )}

          {/* KANBAN VIEW - Archive Mode */}
          {currentView === "kanban" && isArchiveMode && (
            <div className="h-full">
              <KanbanBoard 
                ref={boardRef}
                isArchiveMode={true}
                onArchiveSuccess={() => {}}
                leads={filteredLeads}  
                onLeadsChange={handleLeadsChange}
                onAddLead={handleAddLead}
                onEditLead={handleEditLead}
                filters={filters} 
                setFilters={setFilters}  
                onClearFilter={handleClearFilter}  
              />
            </div>
          )}

          {/* LIST VIEW - Normal */}
          {currentView === "list" && !isArchiveMode && (
            <div className="h-full px-4">
              <LeadsListView 
                leads={filteredLeads}  
                onLeadsChange={handleLeadsChange}
                isArchiveMode={false}
                viewMode="list"
                onEditLead={handleEditLead}
              />
            </div>
          )}

          {/* LIST VIEW - Archive Mode */}
          {currentView === "list" && isArchiveMode && (
            <div className="h-full px-4">
              <LeadsListView 
                leads={filteredLeads} 
                onLeadsChange={handleLeadsChange}
                isArchiveMode={true}
                viewMode="list"
                onEditLead={handleEditLead}
              />
            </div>
          )}
        </div>

        {/* CREATE LEAD MODAL */}
        <CreateLeadModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            router.push("/leads", { scroll: false });
          }}
          onSubmit={handleCreateLeadSubmit}
        />
        
          
      </div>
    </div>
  );
}