// app/components/leads/LeadManagement.tsx
'use client';

import React, { useState, useEffect, JSX } from 'react';
import Image from 'next/image';
import { Clock as LucideClock } from 'lucide-react';
import { ClockIcon } from '@heroicons/react/24/outline';


// Jika kamu butuh icon dari heroicons, import sekali saja
import {
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  CalendarIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/solid';

const labelColorMap: Record<string, string> = {
  // Priority
  "High Priority": "#D1FB20",
  "Medium Priority": "#CAA9FF",
  "Low Priority": "#CCC8E8",
  // Temperature
  "Hot": "#F92916",
  "Cold": "#14D4FF",
  // Status/Type
  "Pitching": "#7B72C4",
  "Deal": "#00A43C",
  "Existing Client": "#2D8EFF",
  "New Client": "#24DC68",
  "Prospect": "#9F5025",
  "Former Client": "#ACACAC",
};
// Jika juga pakai lucide-react, pastikan nama tidak bentrok
import { User as LucideUser, ChevronDown as LucideChevronDown, Search as LucideSearch, Calendar as LucideCalendar } from 'lucide-react';

// modal / komponen internal
import ActivityFeed from './activities/ActivityFeed';
import Topbar from '@/components/topbar/Topbar';
import { useSidebar } from '@/contexts/SidebarContext';
import EditLeadSummaryModal from '@/components/modals/EditLeadSummaryModal';
import EditPersonModal from '@/components/modals/EditPersonModal';
import EditCompanyDetailModal from '@/components/modals/EditCompanyDetailModal';
import EditSourceModal from '@/components/modals/EditSourceModal';
import AddNoteModal from '@/components/modals/AddNoteModal';
import AddMeetingModal from '@/components/modals/AddMeetingModal';
import AddCallModal from '@/components/modals/AddCallModal';
import { 
  getLeadById, 
  getLeadTimeline, 
  updateLead, 
  updateLeadStatus,  
  deleteLead,
  addNote,            
  addMeeting,
  getMeetingsByLead,        
  followLead,      
  unfollowLead,  
  updateLeadStatusSequential,  
  checkFollowing 
} from '@/services/leadService';
import Avatar from '../icons/Avatar';

interface LeadManagementProps {
  leadId: string;
  onBack: () => void;
}

interface Activity {
  id: number;
  type: string;
  author: string;
  date: string;
  time: string;
  title?: string;
  content?: string;
  thumbnails?: { src: string; alt: string }[]; 
}

interface LeadData {
  title: string;
  pic: {
    id: string;
    fullname: string;
    profilePicture: string;
  };
  dealValue: string;
  currency: string;
  company: string;
  contactPerson: string;
  label: string;
  priority: string;
  clientType: string;
  person: {
    name: string;
    phone: string;
    email: string;
    label: string;
  };
  companyDetail: {
    companyName: string;
    email: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  source: {
    sourceOrigin: string;
    sourceChannel: string;
    sourceId: string;
  };
  createdAt?: string;
  teamMembers?: Array<{
    id: string;
    fullname: string;
    profilePicture: string;
  }>;
}

const getTagColor = (text: string) => {
  // Cari kecocokan tepat dulu
  if (labelColorMap[text]) return labelColorMap[text];
  return "#CCCCCC"; // default color
};

const activityIconMap: Record<string, React.ReactNode> = {
  note: <DocumentTextIcon className="w-3.5 h-3.5 text-white" />,
  call: <PhoneIcon className="w-3.5 h-3.5 text-white" />,
  email: <EnvelopeIcon className="w-3.5 h-3.5 text-white" />,
  meeting: <VideoCameraIcon className="w-3.5 h-3.5 text-white" />,
};

// ✅ KONSTANTA INI TETAP DI LUAR (Bukan Hook)
const statuses = ["Qualified", "Demo Schedule", "Negotiation Started", "Contract Send", "Closing"];

const backendToFrontendStatus: Record<string, string> = {
  "NEW": "Status",
  "QUALIFIED": "Qualified",
  "DEMO_SCHEDULED": "Demo Schedule",
  "NEGOTIATION": "Negotiation Started",
  "CONTRACT_SENT": "Contract Send",
  "WON": "Closing",
};

const frontendToBackendStatus: Record<string, string> = {
  "Qualified": "QUALIFIED",
  "Demo Schedule": "DEMO_SCHEDULED",
  "Negotiation Started": "NEGOTIATION",
  "Contract Send": "CONTRACT_SENT",
  "Closing": "WON",
};

// ✅ Helper function (bukan hook, boleh di luar)
const convertBackendToFrontendStatus = (backendStatus: string): string => {
  return backendToFrontendStatus[backendStatus] || "Status"; 
};

export default function LeadManagement({ leadId, onBack }: LeadManagementProps): JSX.Element {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  
  // ✅ SEMUA useState HARUS DI DALAM FUNCTION COMPONENT
  const [activeStatus, setActiveStatus] = useState(""); 
  const [isFilterNoteOpen, setIsFilterNoteOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  
  const [leadData, setLeadData] = useState({
    title: "",
    pic: {
      id: "",
      fullname: "",
      profilePicture: "",
    },
    dealValue: "30.000",
    currency: "IDR",
    company: "-",
    contactPerson: "-",
    label: "Hot",
    priority: "High Priority",
    clientType: "New Client",
    person: {
      name: "Mahendra Dwi",
      phone: "+62 812 3456 7890",
      email: "mahendra@example.com",
      label: "Decision Maker"
    },
    companyDetail: {
      companyName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    source: {
      sourceOrigin: "",
      sourceChannel: "",
      sourceId: "",
    },
    createdAt: "",
    teamMembers: [],
  });
  
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddCallOpen, setIsAddCallOpen] = useState(false);
  const handleSaveCall = (data: any) => {
    alert("Call Berhasil Disimpan!");
    setIsAddCallOpen(false);
  };
  const [isDirty, setIsDirty] = useState(false); 
const [showLeaveModal, setShowLeaveModal] = useState(false); 
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const handleBackClick = () => {
  if (isDirty) {
    setShowLeaveWarning(true); // Munculin toast merahnya
  } else {
    onBack();
  }
};
  const [search, setSearch] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [openActivityId, setOpenActivityId] = useState<number | null>(null);
  const [openEditSummary, setOpenEditSummary] = useState(false);
  const [openEditPerson, setOpenEditPerson] = useState(false);
  const [openEditCompany, setOpenEditCompany] = useState(false);
  const [openSource, setOpenSource] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("All Activity");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    date: "All",
    creator: "All",
    update: "Recently Updated",
    attachment: "All"
  });

  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    company: true,
    source: true,
    person: true,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      if (!leadId) return;
      const numericId = parseInt(leadId);
      if (isNaN(numericId)) {
        console.error("❌ leadId bukan angka:", leadId);
        setLoading(false);
        return;
      }

      try {
        const [leadRes, timelineRes, followingRes, meetingsRes] = await Promise.all([
          getLeadById(numericId).catch(err => ({ success: false, data: null })),
          getLeadTimeline(numericId).catch(err => ({ success: false, data: [] })),
          checkFollowing(numericId).catch(err => ({ success: false, data: { isFollowing: false } })),
          getMeetingsByLead(numericId).catch(err => ({ success: false, data: [] }))
        ]);

        // ✅ Lead Data
        if (leadRes.success && leadRes.data) {
          const data = leadRes.data;
          setLeadData({
            ...leadData,
            title: data.title || "-",
            pic: {
              id: data.pic?.id || "",
              fullname: data.pic?.fullname || data.pic?.name || "No Name", 
              profilePicture: data.pic?.profilePicture || "",
            },
            dealValue: data.dealValue?.toString() || "0",
            currency: data.currency || "IDR",
            company: data.companyName || "-", 
    contactPerson: data.contactPerson || "-",
            label: data.label || "Warm",
            priority: data.priority || "High Priority",
            clientType: data.clientType || "New Client",
            person: {
              name: data.personName || "-",
              phone: data.personPhone || "-",
              email: data.personEmail || "-",
              label: data.personLabel || "WORK"
            },
            companyDetail: {
              companyName: data.companyName || "-",
              email: data.companyEmail || "-",
              street: data.companyStreet || "-",
              city: data.companyCity || "",
              state: data.companyState || "",
              postalCode: data.companyPostalCode || "",
              country: data.companyCountry || "",
            },
            source: {
              sourceOrigin: data.sourceOrigin || "",
              sourceChannel: data.sourceChannel || "",
              sourceId: data.sourceChannelId || "",
            },
            createdAt: data.createdAt ? (typeof data.createdAt === "string" ? data.createdAt : data.createdAt.toISOString()) : "",
            teamMembers: data.teamMembers || [],
          });

          // ✅ Convert backend status to frontend
          const frontendStatus = convertBackendToFrontendStatus(data.pipelineStatus || "NEW");
          setActiveStatus(frontendStatus);
        }

        // ✅ Timeline
        if (timelineRes.success && Array.isArray(timelineRes.data)) {
          setActivities(timelineRes.data);
        }

        // ✅ Meetings
        if (meetingsRes.success && Array.isArray(meetingsRes.data)) {
          const formattedMeetings = meetingsRes.data.map((meeting: any) => ({
            id: meeting.id,
            organizer: meeting.organizer || meeting.createdBy || "Unknown",
            email: meeting.email || "",
            date: meeting.date
              ? new Date(meeting.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            description: meeting.description || meeting.title || "",
            duration: meeting.duration || "1 hour",
            attendees: meeting.attendees || ["M"],
          }));
          setMeetings(formattedMeetings);
        }

        // ✅ Following
        if (followingRes.success && followingRes.data) {
          setIsFollowing(!!followingRes.data.isFollowing);
        }
      } catch (err) {
        console.error("❌ Gagal load data lead:", err);
        setErrorMessage("Gagal load data lead");
        setShowErrorToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [leadId]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

const handleSaveNote = async (newNoteData: any) => {
  try {
    const numericId = parseInt(leadId);
    
    const response = await addNote(numericId, {
      title: newNoteData.title,
      content: newNoteData.content,
    });

    if (response.success) {
      const serverNote = response.data;
      
      const newEntry = {
        id: serverNote.id,
        type: "note",
        author: `By ${leadData.pic.fullname || 'Team Markucup'}`, 
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        // TAMBAHKAN INI UNTUK MENGHILANGKAN ERROR:
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        title: serverNote.title,
        content: serverNote.content,
        images: [], 
      };

      // Sekarang TypeScript nggak akan marah lagi karena 'time' sudah ada
      setActivities((prev: any[]) => [newEntry, ...prev]);
      
      setIsAddNoteOpen(false);
      setShowUpdateToast(true);
      setTimeout(() => setShowUpdateToast(false), 3000);
    }
  } catch (err) {
    console.error("❌ Error save note:", err);
  }
};

const handleUpdateAll = async () => {
  try {
    const numericId = parseInt(leadId);
    setIsDirty(false);
  setShowUpdateToast(true);
    // Menggabungkan semua data summary, person, company, dan source
    const response = await updateLead(numericId, {
      title: leadData.title,
      dealValue: parseFloat(leadData.dealValue.replace(/[^0-9.-]+/g, "")),
      currency: leadData.currency,
      companyName: leadData.company,
      contactPerson: leadData.contactPerson,
      label: leadData.label,
      priority: leadData.priority,
      clientType: leadData.clientType,
      pipelineStatus: frontendToBackendStatus[activeStatus] || "NEW",
      // Detail Person
      personName: leadData.person.name,
      personPhone: leadData.person.phone,
      personEmail: leadData.person.email,
      // Detail Company
      companyEmail: leadData.companyDetail.email,
      companyStreet: leadData.companyDetail.street,
      // ... dan field lainnya
    });

    if (response.success) {
      setShowUpdateToast(true);
      setTimeout(() => setShowUpdateToast(false), 3000);
    }
  } catch (err) {
    console.error("Gagal save all:", err);
  }
};

// Fungsi untuk Delete Lead
const handleDeleteLead = async () => {
  try {
    const numericId = parseInt(leadId);
    const response = await deleteLead(numericId);
    if (response.success) {
      onBack(); // Balik ke board setelah hapus
    }
  } catch (err) {
    console.error("Gagal hapus lead:", err);
  }
};

  const handleSaveMeeting = async (newMeetingData: any) => {
    try {
      const numericId = parseInt(leadId);
      
      const response = await addMeeting(numericId, {
        title: newMeetingData.title || "Untitled Meeting",
        description: newMeetingData.description,
        date: new Date(newMeetingData.date),
        startTime: newMeetingData.startTime || "09:00",
        endTime: newMeetingData.endTime || "10:00",
        location: newMeetingData.location || "",
        linkMeeting: newMeetingData.linkMeeting || "",
      });

      if (response.success) {
        const meetingsRes = await getMeetingsByLead(numericId);
        
        if (meetingsRes.success && meetingsRes.data && Array.isArray(meetingsRes.data)) {
          const formattedMeetings = meetingsRes.data.map((meeting: any) => ({
            id: meeting.id,
            organizer: meeting.organizer || meeting.createdBy || "Unknown",
            email: meeting.email || "",
            date: meeting.date ? new Date(meeting.date).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : "",
            description: meeting.description || meeting.title || "",
            duration: meeting.duration || "1 hour",
            attendees: meeting.attendees || ["M"]
          }));
          setMeetings(formattedMeetings);
        }
        
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
        setIsDirty(true);
      }
    } catch (err) {
      console.error("❌ Error save meeting:", err);
    }
  };

 const handleSaveSummary = async (newData: any) => {
  try {
    const numericId = parseInt(leadId);

    // Ambil stage langsung dari data modal
    const selectedStageFromModal = newData.stage; 

    // Konversi ke format Backend (supaya DB paham)
    const backendStatus = frontendToBackendStatus[selectedStageFromModal] || "NEW";

    const response = await updateLead(numericId, {
      ...leadData, // data lama
      ...newData,  // data baru dari modal
      pipelineStatus: backendStatus, // Kirim status hasil mapping ke DB
    });

    if (response.success) {
      // UPDATE STATE UI DISINI
      setLeadData((prev) => ({ ...prev, ...newData }));
      
      // INI YANG PENTING: Update barisan status di atas biar pindah posisi
      setActiveStatus(selectedStageFromModal); 

      setIsDirty(true); // Biar muncul warning kalau belum klik centang final
      setOpenEditSummary(false);
      setShowUpdateToast(true);
    }
  } catch (err) {
    console.error("Gagal update status via modal:", err);
  }
};

  const handleSavePerson = async (newPersonData: any) => {
    try {
      const numericId = parseInt(leadId);
      
      const response = await updateLead(numericId, {
        personName: newPersonData.name,
        personPhone: newPersonData.phone,
        personEmail: newPersonData.email,
        personLabel: newPersonData.label,
      });
      
      if (response.success) {
        setLeadData((prev) => ({
          ...prev,
          person: newPersonData
        }));
        
        setOpenEditPerson(false);
        setIsDirty(true);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
      }
    } catch (err) {
      console.error("❌ Error update person:", err);
    }
  };

  const handleSaveCompany = async (newData: any) => {
    try {
      const numericId = parseInt(leadId);
      
      const response = await updateLead(numericId, {
        companyName: newData.companyName,
        companyEmail: newData.email,
        companyStreet: newData.street,
        companyCity: newData.city,
        companyState: newData.state,
        companyPostalCode: newData.postalCode,
        companyCountry: newData.country,
      });
      
      if (response.success) {
        setLeadData((prev) => ({
          ...prev,
          companyDetail: newData,
        }));

        setShowUpdateToast(true);
        setIsDirty(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
      }
    } catch (err) {
      console.error("❌ Error update company:", err);
    }
  };

  const handleSaveSource = async (newData: any) => {
    try {
      const numericId = parseInt(leadId);
      
      const response = await updateLead(numericId, {
        sourceOrigin: newData.sourceOrigin,
        sourceChannel: newData.sourceChannel,
        sourceChannelId: newData.sourceId,
      });
      
      if (response.success) {
        setLeadData((prev) => ({
          ...prev,
          source: newData,
        }));

        setShowUpdateToast(true);
        setIsDirty(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
      }
    } catch (err) {
      console.error("❌ Error update source:", err);
    }
  };

  const getStatusIndex = (statusName: string): number => {
    if (!statusName) return -1;
    return statuses.indexOf(statusName);
  };
  
  const activeIndex = getStatusIndex(activeStatus);

  const handleFollowClick = async () => {
    try {
      const numericId = parseInt(leadId);
      
      if (!isFollowing) {
        setIsProcessing(true);
        
        const response = await followLead(numericId);
        
        if (response.success) {
          setIsProcessing(false);
          setIsFollowing(true);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } else {
        const response = await unfollowLead(numericId);
        
        if (response.success) {
          setIsFollowing(false);
        }
      }
    } catch (err) {
      console.error("❌ Error follow/unfollow:", err);
      setIsProcessing(false);
    }
  };

  const toggleActivity = (id: number) => {
    setOpenActivityId((prev) => (prev === id ? null : id));
  };

  const tabs = [
    { name: "All Activity", count: 0 },
    { name: "Notes", count: 1 },
    { name: "Meeting", count: 1 },
    { name: "Call", count: 1 },
    { name: "E-mail", count: 1 },
    { name: "Invoice", count: 1 },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-[#F0F2F5]">
      
        {/* NOTIFIKASI SUKSES */}
        {showToast && (
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 transition-all animate-in fade-in slide-in-from-top-1">
            <div className="bg-[#e1f7ea] border border-[#257047]/20 rounded-sm py-2 px-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-[#257047] rounded-full p-0.5 flex-shrink-0">
                  <CheckIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-[11px] whitespace-nowrap">
                  <span className="font-bold text-black">Following Lead Successful:</span>
                  <span className="text-gray-600 ml-1">You are now following this lead and will receive all activity updates.</span>
                </div>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="ml-6 hover:bg-[#257047]/10 rounded-sm p-0.5 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
        )}

        {/* NOTIFIKASI LEAD UPDATED */}
        {showUpdateToast && (
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-4 transition-all animate-in fade-in slide-in-from-top-1">
            <div className="bg-[#e1f7ea] border border-[#257047]/20 rounded-sm py-2 px-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-[#257047] rounded-sm p-0.5 flex-shrink-0 text-white">
                  <CheckIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-poppins whitespace-nowrap">
                  <span className="font-bold text-black">Lead Updated Successfully:</span>
                  <span className="text-gray-600 ml-1">
                    Your lead information has been updated, and the latest modifications are now reflected in the system.
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowUpdateToast(false)}
                className="ml-6 hover:bg-[#257047]/10 rounded-full p-0.5 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
        )}
{/* TOAST WARNING - UNSAVED CHANGES */}
{showLeaveWarning && (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
    <div className="pointer-events-auto bg-white border-l-4 border-red-500 rounded-r-xl shadow-2xl p-4 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-start gap-3">
        {/* Icon Peringatan Merah */}
        <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
          <XMarkIcon className="w-5 h-5 text-red-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900">Unsaved Progress!</h3>
          <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
            You have unsaved changes. If you leave now, your data won't be saved to the database. 
            Click the <span className="text-green-600 font-bold uppercase">Checkmark</span> to save.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-1">
        <button
          onClick={() => setShowLeaveWarning(false)}
          className="px-4 py-1.5 text-[10px] font-bold text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          STAY & EDIT
        </button>
        <button
          onClick={() => {
            setIsDirty(false); // Reset dirty biar gak nyangkut
            onBack();          // Beneran keluar
          }}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-full shadow-sm transition-all"
        >
          DISCARD & LEAVE
        </button>
      </div>
    </div>
  </div>
)}
        {/* NOTIFIKASI ERROR */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[999] w-full max-w-2xl px-4 pointer-events-none flex flex-col gap-2"></div>
        {showErrorToast && (
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-4 transition-all animate-in fade-in slide-in-from-top-1">
            <div className="bg-[#FFE0DE] border border-[#D40C00]/20 rounded-sm py-2 px-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-[#D40C00] rounded-sm p-0.5 flex-shrink-0 text-white">
                  <XMarkIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-[10px] font-poppins whitespace-nowrap">
                  <span className="font-bold text-black">Stage Skip Alert:</span>
                  <span className="text-gray-700 ml-1">
                    {errorMessage || "Please proceed sequentially. You cannot skip stages."}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowErrorToast(false);
                  setErrorMessage("");
                }}
                className="ml-6 hover:bg-[#D40C00]/10 rounded-full p-0.5 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
        )}
        
        {/* WRAPPER UTAMA */}
        <div 
          className="bg-[#F0F2F5] h-full flex flex-col overflow-hidden relative px-4"
          style={{ 
            marginLeft: isSidebarOpen ? "0px" : "0px",
            width: "100%" 
          }}
        >
          {/* Back button */}
          <button
  onClick={handleBackClick} // Panggil fungsi penjaga, jangan onBack langsung
  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-[11px] transition-colors font-medium"
>
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
  Back to leads
</button>

          {/* Main Container */}
          <div className="pb-8">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Lead Header */}
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-start justify-between w-full">
                  {/* GRUP KIRI */}
                  <div className="flex flex-col gap-1">
                    <h1 className="text-[24px] font-bold text-gray-900 leading-tight">
                      {leadData.title}
                    </h1>
                    
                    <div className="flex items-center gap-2">
                      <Avatar 
                        name={leadData.pic.fullname} 
                        src={leadData.pic.profilePicture?.startsWith('http') 
                          ? leadData.pic.profilePicture 
                          : leadData.pic.profilePicture 
                            ? `http://localhost:5000${leadData.pic.profilePicture}` 
                            : null
                        } 
                        size={28} 
                      />
                      <span className="text-[14px] text-gray-600 font-medium">
                        {leadData.pic.fullname || "Mahendra dwi Purwanto"}
                      </span>
                    </div>
                  </div>

                  {/* GRUP KANAN */}
                  <div className="flex flex-row items-center gap-2">
                    <button 
                      onClick={handleFollowClick}
                      className={`px-8 py-1.5 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2 border
                        ${isFollowing 
                          ? "bg-white text-[#9753F9] border-[#9753F9]" 
                          : "bg-[#9753F9] text-white border-transparent hover:opacity-90"
                        }
                      `}
                    >
                      <span>{isFollowing ? "Following" : "Follow"}</span>
                      {(isFollowing || isProcessing) && <CheckIcon className="w-4 h-4" />}
                    </button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setIsStatusOpen(!isStatusOpen)}
                        className={`px-6 py-1 rounded-full transition-all flex items-center gap-2 text-sm border
                          ${activeStatus && activeStatus !== "Status"
                            ? "bg-white text-[#9753F9] border-[#9753F9]" 
                            : "bg-white text-gray-700 border-gray-300"}
                        `}
                      >
                        <span className="font-medium">{activeStatus || "Status"}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isStatusOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Menu Dropdown */}
                      {isStatusOpen && (
                        <div className="absolute top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                          {statuses.map((status) => {
                            const isSelected = activeStatus === status;
                            const activeIdx = statuses.indexOf(activeStatus);
                            const currentIdx = statuses.indexOf(status);
                            
                            const isChecked = currentIdx <= activeIdx && activeStatus !== "";
                            const isPassedOrActive = currentIdx <= activeIdx && activeStatus !== "";

                            return (
                              <button
                                key={status}
                                onClick={async () => {
                                  try {
                                    const numericId = parseInt(leadId);
                                    const backendStatus = frontendToBackendStatus[status] || status;
                                    const response = await updateLeadStatusSequential(numericId, { status: backendStatus });

                                    if (response.success) {
                                      setActiveStatus(status); 
                                      setIsStatusOpen(false);
                                      setShowUpdateToast(true);
                                      
                                      const leadRes = await getLeadById(numericId);
                                      if (leadRes.success && leadRes.data) {
                                        const updatedStatus = convertBackendToFrontendStatus(leadRes.data.pipelineStatus || "NEW");
                                        setActiveStatus(updatedStatus);
                                      }

                                      setTimeout(() => setShowUpdateToast(false), 3000);
                                    }
                                  } catch (err: any) {
                                    console.error("❌ API Error Detail:", err.response?.data || err.message);
                                    const serverErrorMessage = err.response?.data?.message || "Failed to update status. Please proceed sequentially.";
                                    setErrorMessage(serverErrorMessage);
                                    setShowErrorToast(true);
                                    setIsStatusOpen(false);
                                    setTimeout(() => {
                                      setShowErrorToast(false);
                                      setErrorMessage("");
                                    }, 5000);
                                  }
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors text-left
                                  ${isPassedOrActive 
                                    ? "bg-[#F3E8FF] text-[#9753F9]" 
                                    : "bg-white text-gray-700 hover:bg-[#CCC8E8]"
                                  }
                                  ${isSelected ? "font-semibold" : "font-normal"}
                                `}
                              >
                                <div className="w-5 flex-shrink-0 flex justify-center">
                                  {isChecked && <CheckIcon className="w-4 h-4 text-[#9753F9]" />}
                                </div>
                                <span>{status}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Tombol Check (Save All) */}
<button 
  onClick={handleUpdateAll}
  className="w-7 h-7 bg-[#3AAD6D] rounded-full flex items-center justify-center text-white hover:opacity-90 shadow-sm transition-all active:scale-95"
  title="Save all changes"
>
  <CheckIcon className="w-4 h-4" />
</button>

{/* Tombol Trash (Delete) */}
<button 
  onClick={() => setIsDeleteModalOpen(true)}
  className="w-7 h-7 bg-[#F51B0D] rounded-full flex items-center justify-center text-white hover:opacity-90 shadow-sm transition-all active:scale-95"
  title="Delete lead"
>
  <TrashIcon className="w-4 h-4" />
</button>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex w-full bg-white rounded-full gap-[4px] p-[2px]">
                    {statuses.map((status, index) => {
                      const isCompletedOrActive = index <= activeIndex && activeStatus !== "";
                      const isFirst = index === 0;
                      const isLast = index === statuses.length - 1;

                      return (
                        <div
                          key={status}
                          className={`
                            flex-1 h-8 flex items-center justify-center transition-all duration-300
                            font-poppins font-normal text-[11px] 
                            ${isCompletedOrActive 
                              ? "bg-[#caa9ff] text-black" 
                              : "bg-[#EAEAEA] text-gray-500"}
                            ${isFirst ? "rounded-l-full" : ""}
                            ${isLast ? "rounded-r-full" : ""}
                          `}
                        >
                          {status}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div className="px-0 py-2 bg-[#F0F2F5] rounded-b-lg">
                <div className="grid grid-cols-3 gap-3">
                  {/* LEFT COLUMN */}
                  <div>
                    <div className="col-span-1 h-full overflow-y-auto pr-2 custom-scrollbar bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      {/* SUMMARY SECTION */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-semibold text-gray-900">Summary</h2>
                            <button onClick={() => setOpenEditSummary(true)} className="text-gray-400 hover:text-gray-600">
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => toggleSection('summary')}
                            className="w-5 h-5 bg-[#AEAEAE] hover:bg-[#C9C9C9] rounded-md flex items-center justify-center transition-all duration-300"
                            style={{ transform: expandedSections.summary ? 'rotate(0deg)' : 'rotate(180deg)' }}
                          >
                            <ChevronDownIcon className="w-4 h-4 text-black" />
                          </button>
                        </div>

                        {expandedSections.summary && (
                          <div className="space-y-2 pl-1.5 animate-in fade-in duration-300">
                            <Info label="Deal Value" value={`${leadData.currency || "$"} ${leadData.dealValue ?? 0}`} />
                            <Info label="Company" value={leadData.company || "-"} />
                            <Info label="Contact Person" value={leadData.contactPerson || "-"} />
                            <div className="flex flex-wrap gap-1 pt-0">
  {/* Label Utama (Hot, Cold, dll) */}
  <span 
    className="px-3 py-1 rounded-full text-[8px] font-medium text-sm transition-colors"
    style={{ backgroundColor: getTagColor(leadData.label) }}
  >
    {leadData.label}
  </span>

  {/* Priority (High, Medium, Low) */}
  <span 
    className="px-3 py-1 rounded-full text-[8px] font-medium text-sm transition-colors"
    style={{ backgroundColor: getTagColor(leadData.priority) }}
  >
    {leadData.priority}
  </span>

  {/* Client Type (New Client, Prospect, dll) */}
  <span 
    className="px-3 py-1 rounded-full text-[8px] font-medium text-sm transition-colors"
    style={{ backgroundColor: getTagColor(leadData.clientType) }}
  >
    {leadData.clientType}
  </span>
</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <ClockIcon className="w-4 h-4 text-gray-400" />
                              <span>
                                {leadData.createdAt 
                                  ? new Date(leadData.createdAt).toLocaleString('en-US', {
                                      month: 'numeric',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200" />

                      {/* DETAIL COMPANY SECTION */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-semibold text-gray-900">Detail Company</h2>
                            <button onClick={() => setOpenEditCompany(true)} className="text-gray-400 hover:text-gray-600">
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => toggleSection('company')}
                            className="w-5 h-5 bg-[#AEAEAE] hover:bg-[#C9C9C9] rounded-md flex items-center justify-center transition-all duration-300"
                            style={{ transform: expandedSections.company ? 'rotate(0deg)' : 'rotate(180deg)' }}
                          >
                            <ChevronDownIcon className="w-4 h-4 text-black" />
                          </button>
                        </div>
                        {expandedSections.company && (
                          <div className="text-[12px] font-medium text-gray-800">
                            <div className="text-[12px] leading-relaxed text-gray-800 font-medium">
                              <p className="font-bold mb-1">{leadData.companyDetail?.companyName || "-"}</p>
                              <p>{leadData.companyDetail?.street || "-"}, {leadData.companyDetail?.city || "-"}</p>
                              <p>{leadData.companyDetail?.state || "-"}, {leadData.companyDetail?.country || "-"}, {leadData.companyDetail?.postalCode || "-"}</p>
                              <p className="mt-1">{leadData.companyDetail?.email || "-"}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200" />

                      {/* SOURCE SECTION */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-semibold text-gray-900">Source</h2>
                            <button onClick={() => setOpenSource(true)} className="text-gray-400 hover:text-gray-600">
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => toggleSection('source')}
                            className="w-5 h-5 bg-[#AEAEAE] hover:bg-[#C9C9C9] rounded-md flex items-center justify-center transition-all duration-300"
                            style={{ transform: expandedSections.source ? 'rotate(0deg)' : 'rotate(180deg)' }}
                          >
                            <ChevronDownIcon className="w-4 h-4 text-black" />
                          </button>
                        </div>
                        {expandedSections.source && (
                          <div className="text-[12px] leading-relaxed text-gray-800 font-small">
                            <InfoRow label="Source origin" value={leadData.source?.sourceOrigin || "-"} />
                            <InfoRow label="Source channel" value={leadData.source?.sourceChannel || "-"} />
                            <InfoRow label="Source ID" value={leadData.source?.sourceId || "-"} disabled />
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200" />

                      {/* PERSON SECTION */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h2 className="text-[14px] font-bold text-gray-900">Person</h2>
                            <button onClick={() => setOpenEditPerson(true)} className="text-gray-400 hover:text-[#9753F9]">
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => toggleSection('person')}
                            className="w-5 h-5 bg-[#AEAEAE] hover:bg-[#C9C9C9] rounded-md flex items-center justify-center transition-all duration-300"
                            style={{ transform: expandedSections.person ? 'rotate(0deg)' : 'rotate(180deg)' }}
                          >
                            <ChevronDownIcon className="w-4 h-4 text-black" />
                          </button>
                        </div>
                        {expandedSections.person && (
                          <div className="space-y-3 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3">
                              <UserCircleIcon className="w-5 h-5 text-[#5A4FB5]" />
                              <span className="text-[12px] leading-relaxed text-gray-800 font-small">
    {leadData.person.name}
  </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <PhoneIcon className="w-5 h-5 text-[#5A4FB5]" />
                              <span className="text-[12px] leading-relaxed text-gray-800 font-small">{leadData.person.phone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-5 h-5 text-[#5A4FB5]" />
                                <span className="text-[12px] font-small text-gray-800">{leadData.person.email}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-[#CCC8E8] text-[#5A4FB5] text-[9px] font-bold">
                                {leadData.person.label}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <EditLeadSummaryModal 
                      open={openEditSummary} 
                      onClose={() => setOpenEditSummary(false)} 
                      onSave={handleSaveSummary}
                      initialData={leadData} 
                    />

                    <EditPersonModal 
                      open={openEditPerson} 
                      onClose={() => setOpenEditPerson(false)} 
                      onSave={handleSavePerson}
                      initialData={leadData.person}
                    />

                    <EditCompanyDetailModal
                      open={openEditCompany}
                      onClose={() => setOpenEditCompany(false)}
                      initialData={leadData.companyDetail}
                      onSave={handleSaveCompany}
                    />

                    <EditSourceModal
                      open={openSource}
                      onClose={() => setOpenSource(false)}
                      initialData={leadData.source}
                      onSave={handleSaveSource}
                    />
       

                    {/* MODAL KONFIRMASI HAPUS */}
                    {isDeleteModalOpen && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 font-poppins px-4">
                        <div className="bg-white rounded-[28px] p-3.5 w-full max-w-[250px] flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-200">
                          <div className="w-16 h-16 bg-[#a6130a] rounded-full flex items-center justify-center mb-5">
                            <TrashIcon className="w-8 h-8 text-white" />
                          </div>

                          <h3 className="text-[15px] font-bold leading-snug mb-2 px-1 text-black">
                            All lead information will be permanently deleted and cannot be recovered.
                          </h3>
                          <p className="text-[12px] text-gray-500 mb-6">
                            Press delete if you are sure
                          </p>

                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => setIsDeleteModalOpen(false)}
                              className="flex-1 py-2 border border-[#F51B0D] text-[#F51B0D] rounded-full font-bold text-[13px] hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const numericId = parseInt(leadId);
                                  const response = await deleteLead(numericId);
                                  
                                  if (response.success) {
                                    setIsDeleteModalOpen(false);
                                    onBack();
                                  } else {
                                    alert("❌ Gagal hapus lead");
                                  }
                                } catch (err) {
                                  console.error("❌ Error delete lead:", err);
                                  alert("❌ Error: " + err);
                                }
                              }}
                              className="flex-1 py-2 bg-[#F51B0D] text-white rounded-full font-bold text-[13px] hover:bg-[#d9180b] transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="col-span-2">
                    <ActivityFeed 
                      activities={activities}
                      meetings={meetings}
                      onAddNote={() => setIsAddNoteOpen(true)}
                      onAddMeeting={() => setIsAddMeetingOpen(true)}
                      openActivityId={openActivityId}
                      toggleActivity={toggleActivity}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        


        <AddNoteModal 
          isOpen={isAddNoteOpen} 
          onClose={() => setIsAddNoteOpen(false)} 
          onSave={handleSaveNote} 
        />
        <AddMeetingModal 
        open={isAddMeetingOpen}
        onClose={() => setIsAddMeetingOpen(false)}
        onSave={handleSaveMeeting} onApply={() => {}}          
        />
        <AddCallModal 
  open={isAddCallOpen} 
  onClose={() => setIsAddCallOpen(false)} 
  onSave={handleSaveCall} 
  contactName={leadData?.contactPerson || "Unknown Contact"} 
/>
      </div>
  );
}

/* ================== COMPONENT KECIL ================== */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[10px] text-gray-900 mb-2">
      <div className="leading-tight text-gray-500 uppercase font-semibold">{label}</div>
      <div className="font-medium text-[11px]">{value || "-"}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  disabled = false,
}: {
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center mb-1">
      <span className="w-32 text-[11px] text-gray-500 font-semibold">{label}</span>
      <span
        className={`text-[11px] font-medium ${
          disabled ? "text-gray-400 italic" : "text-gray-800"
        }`}
      >
        {value || "-"}
      </span>
    </div>
  );
}