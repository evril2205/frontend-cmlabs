// app/components/leads/LeadManagement.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Jika kamu butuh icon dari heroicons, import sekali saja
import {
  CheckIcon,
  TrashIcon,
  ClockIcon,
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
import MeetingCard from '@/components/MeetingCard';
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
}

const activityIconMap: Record<string, React.ReactNode> = {
  note: <DocumentTextIcon className="w-3.5 h-3.5 text-white" />,
  call: <PhoneIcon className="w-3.5 h-3.5 text-white" />,
  email: <EnvelopeIcon className="w-3.5 h-3.5 text-white" />,
  meeting: <VideoCameraIcon className="w-3.5 h-3.5 text-white" />,
};


const statuses = ["Qualified", "Demo Schedule", "Negotiation Started", "Contract Send", "Closing"];

// ✅ MAPPING FUNCTIONS: Backend Status <-> Frontend Display Name
const backendToFrontendStatus: Record<string, string> = {
  "QUALIFIED": "Qualified",
  "DEMO_SCHEDULED": "Demo Schedule",
  "NEGOTIATION": "Negotiation Started",
  "CONTRACT_SENT": "Contract Send",
  "WON": "Closing",
  "LOST": "Closing", // Closing bisa berarti WON
  // Default untuk status lain
  "NEW": "",
  "CONTACTED": "",
  "PROPOSAL": "",
};

const frontendToBackendStatus: Record<string, string> = {
  "Qualified": "QUALIFIED",
  "Demo Schedule": "DEMO_SCHEDULED",
  "Negotiation Started": "NEGOTIATION",
  "Contract Send": "CONTRACT_SENT",
  "Closing": "WON",
};

// Helper function: Convert backend status to frontend display name
const convertBackendToFrontendStatus = (backendStatus: string): string => {
  return backendToFrontendStatus[backendStatus] || "";
};

// Helper function: Convert frontend display name to backend status
const convertFrontendToBackendStatus = (frontendStatus: string): string => {
  return frontendToBackendStatus[frontendStatus] || "NEW";
};

export default function LeadManagement({ leadId, onBack }: LeadManagementProps) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
 const [leadData, setLeadData] = useState({
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
});
  
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openActivityId, setOpenActivityId] = useState<number | null>(null);
  const [openEditSummary, setOpenEditSummary] = useState(false);
  const [openEditPerson, setOpenEditPerson] = useState(false);
  const [openEditCompany, setOpenEditCompany] = useState(false);
  const [openSource, setOpenSource] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Tambahkan di dalam fungsi LeadManagement
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const numericId = parseInt(leadId);
      
      // ✅ PERBAIKAN: Destructure 4 hasil (tambah meetings)
      const [leadRes, timelineRes, followingRes, meetingsRes] = await Promise.all([
        getLeadById(numericId),
        getLeadTimeline(numericId),
        checkFollowing(numericId),
        getMeetingsByLead(numericId).catch(() => ({ success: false, data: [] })) // ✅ Load meetings
      ]);

      if (leadRes.success && leadRes.data) {
        const data = leadRes.data;
        
        setLeadData({
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
            label: data.personLabel || "Decision Maker"
          },
          companyDetail: {
            companyName: data.companyName || "-",
            email: data.companyEmail || "-",
            street: data.companyStreet || "-",
            city: data.companyCity || "-",
            state: data.companyState || "-",
            postalCode: data.companyPostalCode || "-",
            country: data.companyCountry || "-",
          },
          source: {
            sourceOrigin: data.sourceOrigin || "",
            sourceChannel: data.sourceChannel || "",
            sourceId: data.sourceChannelId || "",
          },
        });

        // ✅ Convert backend status to frontend display name
        const backendStatus = data.status || "NEW";
        const frontendStatus = convertBackendToFrontendStatus(backendStatus);
        setActiveStatus(frontendStatus); // Set dengan frontend display name
      }

      if (timelineRes.success && timelineRes.data) {
        setActivities(timelineRes.data);
      }
      
      // ✅ Load meetings from backend
      if (meetingsRes.success && meetingsRes.data && Array.isArray(meetingsRes.data)) {
        // Convert backend meeting format to frontend format
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
      
      // ✅ Set following status
      if (followingRes.success) {
        setIsFollowing(followingRes.data.isFollowing);
      }

    } catch (err) {
      console.error("❌ Gagal load data lead:", err);
    } finally {
      setLoading(false);
    }
  };

  if (leadId) fetchAllData();
}, [leadId]);

  const [activeStatus, setActiveStatus] = useState(""); // Default kosong (sebelum mulai)
  const [isStatusOpen, setIsStatusOpen] = useState(false);

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
      content: newNoteData.description,
    });

    if (response.success) {
      const newEntry = {
        id: response.data.id,
        type: "note",
        author: "By You",
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        title: newNoteData.title,
        content: newNoteData.description,
        thumbnails: [],
      };

      setActivities([newEntry, ...activities]);
      setShowUpdateToast(true);
      setTimeout(() => setShowUpdateToast(false), 3000);
    }
  } catch (err) {
    console.error("❌ Error save note:", err);
  }
};

  const [meetings, setMeetings] = useState<any[]>([]); // ✅ Initialize dengan empty array

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
      // ✅ Reload meetings dari backend setelah save
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
    }
  } catch (err) {
    console.error("❌ Error save meeting:", err);
  }
};

const handleSaveSummary = async (newData: any) => {
  try {
    const numericId = parseInt(leadId);
    
    const response = await updateLead(numericId, {
      dealValue: parseFloat(newData.dealValue),
      currency: newData.currency,
      companyName: newData.company,
      contactPerson: newData.contactPerson,
      label: newData.label,
      priority: newData.priority,
      clientType: newData.clientType,
    });
    
    if (response.success) {
      setLeadData((prev) => ({ ...prev, ...newData }));
      setShowUpdateToast(true);
      setTimeout(() => setShowUpdateToast(false), 3000);
    }
  } catch (err) {
    console.error("❌ Error update summary:", err);
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
      setTimeout(() => setShowUpdateToast(false), 3000);
    }
  } catch (err) {
    console.error("❌ Error update source:", err);
  }
};

  // Fungsi untuk menentukan apakah sebuah step di pipeline sudah "terlewati" atau "aktif"
  const getStatusIndex = (statusName: string): number => {
    if (!statusName) return -1; // Return -1 jika status kosong
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

const toggleActivity = (id: number) => {setOpenActivityId((prev) => (prev === id ? null : id));
};

  
  const tabs = [
    { name: "All Activity", count: 0 },
    { name: "Notes", count: 1 },
    { name: "Meeting", count: 1 },
    { name: "Call", count: 1 },
    { name: "E-mail", count: 1 },
    { name: "Invoice", count: 1 },
  ];

  // ✅ PAKAI YANG INI AJA (sudah ada di bawah)
const [activities, setActivities] = useState([
  {
    id: 1,
    type: "note",
    author: "By Mahendra dwi Purwanto",
    date: "July 25, 2025",
    time: "",
    title: "Follow Up Request for New Product Line",
    content: "Client expressed strong interest in our newly launched product line and requested our most competitive pricing options. Recommended to follow up on September 20 to confirm their decision.",
    thumbnails: [
      { src: "/thumbnails/soulspa.jpg", alt: "SOULSPA" },
      { src: "/thumbnails/website-template.jpg", alt: "WEBSITE TEMPLATE" },
      { src: "/thumbnails/spa.jpg", alt: "SPA" },
    ],
  },
  {
    id: 2,
    type: "call",
    author: "By Mahendra dwi Purwanto",
    date: "July 25, 2025",
    time: "12:00 AM",
  },
  {
    id: 3,
    type: "email",
    author: "Thankyou for Contacting",
    date: "July 25, 2025",
    time: "01:00 PM",
  },
  {
    id: 4,
    type: "meeting",
    author: "By Mahendra dwi Purwanto",
    date: "July 25, 2025",
    time: "01:00 PM",
  },
]);


  return (
    
    <div className="transition-all duration-300">
      {/* Topbar */}
      <div 
        className="bg-[#F0F2F5] h-full flex flex-col overflow-hidden relative px-5"
        style={{ 
          marginLeft: isSidebarOpen ? "0px" : "0px",
          width: "100%" 
        }}
      >
        <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>
      
{/* NOTIFIKASI SUKSES - HORIZONTAL & LEBIH RAMPING */}
{showToast && (
  <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4 transition-all animate-in fade-in slide-in-from-top-1">
    <div className="bg-[#e1f7ea] border border-[#257047]/20 rounded-sm py-2 px-5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {/* Icon Check Circle Solid */}
        <div className="bg-[#257047] rounded-full p-0.5 flex-shrink-0">
          <CheckIcon className="w-3.5 h-3.5 text-white" />
        </div>
        
        {/* Teks satu baris */}
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
{/* NOTIFIKASI LEAD UPDATED SUCCESSFUL */}
{showUpdateToast && (
  <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-4 transition-all animate-in fade-in slide-in-from-top-1">
    <div className="bg-[#e1f7ea] border border-[#257047]/20 rounded-sm py-2 px-5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {/* Icon Check Circle Solid warna #257047 */}
        <div className="bg-[#257047] rounded-sm p-0.5 flex-shrink-0 text-white">
          <CheckIcon className="w-3.5 h-3.5" />
        </div>
        
        {/* Teks satu baris dengan font Poppins */}
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

{/* ✅ NOTIFIKASI ERROR - Stage Skip Alert */}
{showErrorToast && (
  <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100] w-full max-w-3xl px-4 transition-all animate-in fade-in slide-in-from-top-1">
    <div className="bg-[#FFE0DE] border border-[#D40C00]/20 rounded-sm py-2 px-5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        {/* Icon Error */}
        <div className="bg-[#D40C00] rounded-sm p-0.5 flex-shrink-0 text-white">
          <XMarkIcon className="w-3.5 h-3.5" />
        </div>
        
        {/* Teks satu baris dengan font Poppins */}
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
        className="bg-[#F0F2F5] h-full flex flex-col overflow-hidden relative px-8"
        style={{ 
          marginLeft: isSidebarOpen ? "0px" : "0px",
          width: "100%" 
        }}
      >
        {/* Back button */}
        <div className="pt-3 pb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-[11px] transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to leads
          </button>
        </div>

        {/* Main Container */}
        <div className="pb-8">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Lead Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between gap-4">
                {/* Left: title + profile */}
                <div>
                  <h1 className="text-[18px] font-medium text-gray-900">[Sample] iTable</h1>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      M
                    </div>
                    <p className="text-[11px] font-small text-black-900">Mahendra dwi Purwanto</p>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2">
                
                {/* TOMBOL FOLLOW DI DALAM HEADER ACTIONS */}
                <button 
                  onClick={handleFollowClick}
                  className={`px-9 py-1 rounded-full transition-all duration-300 text-sm font-medium flex items-center gap-2 border
                    ${isFollowing 
                      ? "bg-white text-[#9753F9] border-[#9753F9]" // State Akhir: Putih
                      : isProcessing
                        ? "bg-[#6d39b8] text-white border-transparent" // State Klik: Ungu Tua
                        : "bg-[#9753F9] text-white border-transparent hover:opacity-90" // State Awal: Ungu
                    }
                  `}
                >
                  <span>{isFollowing ? "Following" : "Follow"}</span>
                  {(isFollowing || isProcessing) && <CheckIcon className="w-4 h-4" />}
                </button>
                  <div className="relative">
  {/* Tombol Utama */}
  <button 
    onClick={() => setIsStatusOpen(!isStatusOpen)}
    className={`px-6 py-1 rounded-full transition-all flex items-center gap-2 text-sm border
      ${activeStatus 
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
      
      // ✅ Convert frontend display name to backend status
      const backendStatus = convertFrontendToBackendStatus(status);
      
      // ✅ PAKAI updateLeadStatusSequential (dengan validasi sequential)
      const response = await updateLeadStatusSequential(numericId, { status: backendStatus });
      
      if (response.success) {
        setActiveStatus(status); // Set dengan frontend display name
        setIsStatusOpen(false);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 3000);
        
        // ✅ Reload data untuk sync dengan Kanban Board
        const leadRes = await getLeadById(numericId);
        if (leadRes.success && leadRes.data) {
          const data = leadRes.data;
          const updatedFrontendStatus = convertBackendToFrontendStatus(data.status || "NEW");
          setActiveStatus(updatedFrontendStatus);
        }
      }
    } catch (err: any) {
      console.error("❌ Error update status:", err);
      
      // ✅ Tampilkan error toast (bukan alert)
      const errorMsg = err.message || "Failed to update status. Please try again.";
      setErrorMessage(errorMsg);
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
        setErrorMessage("");
      }, 4000);
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

                  <button className="w-7 h-7 bg-[#3AAD6D] rounded-full flex items-center justify-center text-white hover:opacity-90 transition">
                    <CheckIcon className="w-4 h-4" />
                  </button>

                <button 
  onClick={() => setIsDeleteModalOpen(true)}  // ✅ Buka modal dulu
  className="w-7 h-7 bg-[#F51B0D] rounded-full flex items-center justify-center text-white hover:opacity-90 transition"
>
  <TrashIcon className="w-4 h-4" />
</button>
                </div>
              </div>

             <div className="mt-2">
  <div className="flex w-full bg-white rounded-full gap-[4px] p-[2px]">
    {statuses.map((status, index) => {
      // Logika: Menyala ungu jika index ini sudah terlewati atau sedang aktif
      const isCompletedOrActive = index <= activeIndex && activeStatus !== "";
      
      const isFirst = index === 0;
      const isLast = index === statuses.length - 1;

      return (
        <div
          key={status}
          className={`
            flex-1 h-8 flex items-center justify-center transition-all duration-300
            /* Pengaturan Font & Teks */
            font-poppins font-normal text-[11px] normal-case 
            
            /* Pengaturan Warna */
            ${isCompletedOrActive 
              ? "bg-[#caa9ff] text-black" 
              : "bg-[#EAEAEA] text-gray-500"}
            
            /* Pengaturan Border Radius */
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
        <Info label="Deal Value" value={`${leadData.currency} ${leadData.dealValue}`} />
        <Info label="Company" value={leadData.company || "-"} />
        <Info label="Contact Person" value={leadData.contactPerson || "-"} />
        <div className="flex flex-wrap gap-1 pt-0">
      <span className="px-3 py-1 rounded-full text-[8px] font-medium bg-red-500 text-black">
        {leadData.label}
      </span>
      <span className="px-3 py-1 rounded-full text-[8px] font-medium bg-lime-400 text-black">
        {leadData.priority}
      </span>
      <span className="px-3 py-1 rounded-full text-[8px] font-medium bg-green-500 text-black">
        {leadData.clientType}
      </span>
    </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span>7/7/2025</span>
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
      {/* Baris 1: Nama Perusahaan */}
      <p className="font-bold mb-1">{leadData.companyDetail.companyName}</p>
      
      {/* Baris 2: Alamat Lengkap */}
      <p>
        {leadData.companyDetail.street}, {leadData.companyDetail.city},
      </p>
      
      {/* Baris 3: Provinsi & Kode Pos */}
      <p>
        {leadData.companyDetail.state}, {leadData.companyDetail.country}, {leadData.companyDetail.postalCode}
      </p>
      
      {/* Baris 4: Email */}
      <p className="mt-1">{leadData.companyDetail.email}</p>
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
    <InfoRow label="Source origin" value={leadData.source.sourceOrigin || "-"} />
    <InfoRow label="Source channel" value={leadData.source.sourceChannel || "-"} />
    <InfoRow label="Source ID" value={leadData.source.sourceId || "-"} />
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
                  <div className=" space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="w-5 h-5 text-[#5A4FB5]" />
                      <span className="text-[12px] leading-relaxed text-gray-800 font-small">{leadData.person.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="w-5 h-5 text-[#5A4FB5]" />
                      <span className="text-[12px] leading-relaxed text-gray-800 font-small">{leadData.person.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="w-5 h-5 text-[#5A4FB5]" />
                        <span className="text-[12px] font-small xt-gray-800">{leadData.person.email}</span>
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
  onSave={handleSavePerson} // Hubungkan ke fungsi di atas
  initialData={leadData.person} // Kirim data person saat ini ke form
/>

<EditCompanyDetailModal
  open={openEditCompany}
  onClose={() => setOpenEditCompany(false)}
  initialData={leadData.companyDetail} // ✅ Pass data
  onSave={handleSaveCompany} // ✅ Handle save
/>

<EditSourceModal
  open={openSource}
  onClose={() => setOpenSource(false)}
  initialData={leadData.source} // ✅ Pass data
  onSave={handleSaveSource} // ✅ Handle save
/>

{/* MODAL KONFIRMASI HAPUS - VERSI LEBIH KECIL */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 font-poppins px-4">
    {/* Lebar dikurangi dari 340px ke 280px, padding dikurangi ke 6 */}
    <div className="bg-white rounded-[28px] p-3.5 w-full max-w-[250px] flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in duration-200">
      
      {/* Icon Trash - Ukuran dikecilkan */}
      <div className="w-16 h-16 bg-[#a6130a] rounded-full flex items-center justify-center mb-5">
        <TrashIcon className="w-8 h-8 text-white" />
      </div>

      {/* Teks Deskripsi - Font size disesuaikan */}
      <h3 className="text-[15px] font-bold leading-snug mb-2 px-1 text-black">
        All lead information will be permanently deleted and cannot be recovered.
      </h3>
      <p className="text-[12px] text-gray-500 mb-6">
        Press delete if you are sure
      </p>

      {/* Tombol Aksi - Tinggi tombol dikurangi agar lebih ramping */}
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
        onBack();  // Kembali ke kanban
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

             {/* RIGHT COLUMN - Sekarang Jadi Pendek & Rapi */}
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
              <AddNoteModal 
         isOpen={isAddNoteOpen} 
         onClose={() => setIsAddNoteOpen(false)} 
         onSave={handleSaveNote} 
       />
       <AddMeetingModal 
        isOpen={isAddMeetingOpen} 
        onClose={() => setIsAddMeetingOpen(false)} 
        onSave={handleSaveMeeting} 
      />
    

            </div>
            </div>
            
          
); }



/* ================== COMPONENT KECIL ================== */

// Fungsi Info untuk Summary
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[10px] text-gray-900 mb-2">
      <div className="leading-tight text-gray-500 uppercase font-semibold">{label}</div>
      <div className="font-medium text-[11px]">{value || "-"}</div>
    </div>
  );
}

// Fungsi InfoRow untuk Source
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-none">
      <span className="text-[10px] text-gray-500">{label}</span>
      <span className="text-[11px] font-medium text-gray-900">{value || "-"}</span>
    </div>
  );
}