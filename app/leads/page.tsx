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
import { getLeads, updateLeadStatus, deleteLead, addNote, getNotesByLead } from "@/services/leadService";
import AddNoteModal from "@/components/modals/AddNoteModal";
import ActivityFeed from "@/components/leads/activities/ActivityFeed";

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
  const [activities, setActivities] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [toastMessage, setToastMessage] = useState("");
  const boardRef = useRef<any>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const modalParam = searchParams.get("modal");

  const showToast = (message: string) => {
  setToastMessage(message);
  setTimeout(() => setToastMessage(""), 3000);
};
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

  // ✅ FUNGSI LOAD DATA (Gabungan dari kode baru)
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching leads from backend...');
      
      const response = await getLeads();
      console.log('📦 Raw response:', response);

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
            tags: item.label ? [{ label: item.label, color: getLabelColor(item.label) }] : [],
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

      // ✅ LOAD NOTES jika ada selectedLeadId
      if (selectedLeadId) {
        const numericLeadId = parseInt(selectedLeadId);
        const notes = await getNotesByLead(numericLeadId);
        setActivities(notes.data || []);
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

  // Sync Modal State dengan URL
  useEffect(() => {
    if (modalParam === "add") {
      setIsCreateModalOpen(true);
    } else {
      setIsCreateModalOpen(false);
    }
  }, [modalParam]);

  // ✅ INITIAL LOAD: Restore view mode & fetch data
  useEffect(() => {
    fetchAllData();

    const savedView = localStorage.getItem("kanban_view");
    if (savedView) {
      try {
        const parsedView = JSON.parse(savedView);
        setCurrentView(parsedView);
        if (parsedView === "archive") {
          setIsArchiveMode(true);
        }
      } catch (e) {
        console.error("Error parsing saved view:", e);
      }
    }
  }, []);

  // Re-fetch saat selectedLeadId berubah
  useEffect(() => {
    if (selectedLeadId) {
      fetchAllData();
    }
  }, [selectedLeadId]);

  // ✅ SAVE VIEW MODE on change
  useEffect(() => {
    localStorage.setItem("kanban_view", JSON.stringify(currentView));
  }, [currentView]);

  // ✅ HANDLE SAVE NOTE (dari kode baru)
  const handleSaveNote = async (data: any) => {
    if (!selectedLeadId) return;
    
    try {
      const numericLeadId = parseInt(selectedLeadId);
      await addNote(numericLeadId, { 
        title: data.title, 
        content: data.content 
      });
      
      fetchAllData(); // Refresh semua data
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note");
    }
  };

  // ✅ CREATE LEAD - Refresh after success
  const handleCreateLeadSubmit = async () => {
    await fetchAllData();
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
        setLeads(prevLeads =>
          prevLeads.map(lead =>
            lead.id === leadId ? { ...lead, stage: newStatus } : lead
          )
        );
      }
    } catch (error) {
      console.error("❌ Error updating lead status:", error);
      await fetchAllData();
    }
  };

  // ✅ ARCHIVE LEAD (Update Backend)
  const handleArchiveLead = async (leadId: string) => {
    try {
      console.log(`📦 Archiving lead ${leadId}`);
      const { updateLead } = await import("@/services/leadService");
      await updateLead(parseInt(leadId), { isArchived: true });

      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, isArchived: true } : lead
        )
      );
      console.log('✅ Lead archived and saved to backend');
    } catch (error) {
      console.error("❌ Error archiving lead:", error);
      await fetchAllData();
    }
  };

  // ✅ RESTORE LEAD (Update Backend)
  const handleRestoreLead = async (leadId: string) => {
    try {
      console.log(`♻️ Restoring lead ${leadId}`);
      const { updateLead } = await import("@/services/leadService");
      await updateLead(parseInt(leadId), { isArchived: false });

      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, isArchived: false } : lead
        )
      );
      console.log('✅ Lead restored and saved to backend');
    } catch (error) {
      console.error("❌ Error restoring lead:", error);
      await fetchAllData();
    }
  };

  const handleDeleteLead = async (leadId: string) => {
  try {
    const numericId = parseInt(leadId);
    if (isNaN(numericId)) return;

    console.log(`🗑️ API Call: Deleting lead ${numericId}`);
    const response = await deleteLead(numericId);

    if (response.success) {
      showToast("Lead deleted successfully");
    }
  } catch (error: any) {
    console.error("❌ Delete API Failed:", error);
    // Jika error 500 karena data sudah tidak ada, jangan buat UI crash
    if (error.response?.status !== 404) {
       await fetchAllData(); // Ambil ulang data asli dari server jika gagal parah
    }
  }
};

  // ✅ VIEW TOGGLE with Archive handling
  const handleViewToggle = (view: "list" | "grid" | "kanban" | "archive") => {
    if (view === "archive") {
      setIsArchiveMode(true);
    } else {
      setCurrentView(view);
      setIsArchiveMode(false);
    }
  };

  const handleArchiveToggle = (show: boolean) => {
    setIsArchiveMode(show);
  };

  const handleAddLead = () => router.push("/leads?modal=add", { scroll: false });

  const handleEditLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    setCurrentView("detail");
  };

  const handleBackToLeads = () => {
    setSelectedLeadId(null);
    setCurrentView("kanban");
    fetchAllData();
  };

  // ✅ HANDLE LEADS CHANGE (from child components)
  const handleLeadsChange = async (updatedLeads: Lead[]) => {
    console.log('🔄 handleLeadsChange triggered');

    const changes: Array<{leadId: string, change: 'stage' | 'archive' | 'restore' | 'won' | 'lost' | 'delete'}> = [];

    updatedLeads.forEach((updatedLead) => {
      const originalLead = leads.find(l => l.id === updatedLead.id);
      if (originalLead) {
        if (updatedLead.stage !== originalLead.stage) {
          if (updatedLead.stage === 'WON') {
            changes.push({ leadId: updatedLead.id, change: 'won' });
          } else if (updatedLead.stage === 'LOST') {
            changes.push({ leadId: updatedLead.id, change: 'lost' });
          } else {
            changes.push({ leadId: updatedLead.id, change: 'stage' });
          }
        }

        if (updatedLead.isArchived !== originalLead.isArchived) {
          if (updatedLead.isArchived) {
            changes.push({ leadId: updatedLead.id, change: 'archive' });
          } else {
            changes.push({ leadId: updatedLead.id, change: 'restore' });
          }
        }
      }
    });

    leads.forEach((originalLead) => {
      const stillExists = updatedLeads.find(l => l.id === originalLead.id);
      if (!stillExists) {
        changes.push({ leadId: originalLead.id, change: 'delete' });
      }
    });

    console.log('📋 Detected changes:', changes);
    setLeads(updatedLeads);

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
        await fetchAllData();
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

    const onTopScroll = () => {
      real.scrollLeft = topScroll.scrollLeft;
    };

    const onRealScroll = () => {
      topScroll.scrollLeft = real.scrollLeft;
    };

    topScroll.addEventListener("scroll", onTopScroll, { passive: true });
    real.addEventListener("scroll", onRealScroll, { passive: true });

    return () => {
      topScroll.removeEventListener("scroll", onTopScroll);
      real.removeEventListener("scroll", onRealScroll);
    };
  }, [currentView, isArchiveMode]);

  const renderMainContent = () => {
    // 1. DETAIL VIEW (Dahulukan ini)
    if (currentView === "detail" && selectedLeadId) {
      return <LeadManagement leadId={selectedLeadId} onBack={handleBackToLeads} />;
    }

    // 2. KANBAN VIEW (Normal & Archive)
    if (currentView === "kanban") {
      return (
        <div className="h-full flex flex-col">
          {/* Scroll Sync Container */}
          <div id="top-scroll" className="overflow-x-auto h-0 invisible">
             <div style={{ width: '2000px', height: '1px' }}></div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <KanbanBoard
              ref={boardRef}
              leads={filteredLeads}
              isArchiveMode={isArchiveMode} // Pastikan prop ini dikirim!
              onLeadsChange={handleLeadsChange}
              onAddLead={handleAddLead}
              onEditLead={handleEditLead}
              filters={filters}
              setFilters={setFilters}
              onClearFilter={handleClearFilter}
              onArchiveSuccess={fetchAllData}
            />
          </div>
        </div>
      );
    }

    // 3. LIST VIEW
    if (currentView === "list") {
      return (
        <div className="h-full overflow-auto px-6 py-4">
          {isArchiveMode ? (
            <LeadsArchiveView
              leads={filteredLeads}
              onLeadsChange={handleLeadsChange}
            />
          ) : (
            <LeadsListView
              leads={filteredLeads}
              onEditLead={handleEditLead}
              onLeadsChange={handleLeadsChange}
            />
          )}
        </div>
      );
    }

    return null;
  };

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F0F2F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A4FB0] mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading Leads Board...</p>
        </div>
      </div>
    );
  }

 return (
  <div className="flex flex-col h-screen bg-[#F0F2F5] overflow-hidden">
    
    {/* TOPBAR */}
    <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

    {/* AREA KONTEN YANG BISA DI-SCROLL */}
    <main className="flex-1 overflow-y-auto relative custom-scrollbar">
      
      {/* NOTIFIKASI: Sekarang kita pakai 'sticky' supaya dia nempel di atas Search Bar saat di-scroll */}
      {toastMessage && (
        <div className="sticky top-2 z-[90] w-full flex justify-center pointer-events-none">
          <div className="pointer-events-auto bg-[#257047] text-white px-6 py-2 rounded-full shadow-xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300 border border-white/20">
            <span className="font-bold text-xs">✓ {toastMessage}</span>
          </div>
        </div>
      )}

      {/* HEADER (Isinya Judul Leads & Filter) */}
      {currentView !== "detail" && (
        <div className="px-6 pt-2"> 
          <LeadsHeader
            currentView={currentView}
            onViewToggle={handleViewToggle}
            onArchiveToggle={handleArchiveToggle}
            onAddLead={handleAddLead}
            onFilterClick={() => boardRef.current?.openFilter()}
            activeFilterCount={activeFilterCount}
            isArchiveMode={isArchiveMode}
          />
        </div>
      )}

      {/* BOARD / LIST CONTENT */}
      <div className="px-6 pb-10">
        {renderMainContent()}
      </div>
    </main>

    {/* 4. MODALS (Di luar flow) */}
    {isCreateModalOpen && (
      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => router.push("/leads", { scroll: false })}
        onSubmit={handleCreateLeadSubmit}
      />
    )}
  </div>
);}