"use client";

import React, { useEffect, useState } from "react";
import Topbar from "@/components/topbar/Topbar";
import { useSidebar } from "@/contexts/SidebarContext";
import { UserIcon } from "@heroicons/react/24/solid";
import { Icon } from "@iconify/react";
import { decodeToken } from "@/utils/decodeToken";
import Avatar from "@/components/icons/Avatar";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import DeleteTeam from "@/components/Models/DeleteTeam";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LeadsContent from "./LeadsContent";
import EditTeam from "@/components/Models/EditTeam";

interface Member {
  status: "Active" | "Inactive" | "On Boarding" | "On Leave";
  initial: string;
  name: string;
  role: string;
  team: string;
  email: string;
  joinedDate: string;
  bio: string;
  skills: string[];
  reports_to: string;
}

const DetailPage: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [member, setMember] = useState<Member | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // ✅ FETCH DETAIL (SATU useEffect SAJA)
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  const decoded = decodeToken(token);
  if (decoded?.role === "SALES") {
    router.push("/403"); // atau /dashboard
  }
}, [router]);

useEffect(() => {
  if (!id) return;

  const fetchDetail = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const data = await res.json();

      setMember({
        status: data.status?.name || "Inactive",
        initial: data.fullname?.charAt(0) || "U",
        name: data.fullname,
        role: data.department?.name || "—",
        team: `${data.department?.name || "—"} Team`,
        email: data.email,
        joinedDate: new Date(data.joinedDate).toLocaleDateString("id-ID"),
        bio: data.bio || "-",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        skills: data.skills?.map((s: any) => s.name) || [],
        reports_to: data.reportsTo?.fullname || "-",
      });
    } catch (err) {
      console.error("Fetch detail gagal:", err);
    }
  };

  fetchDetail();
}, [id]);


    
  // ✅ DELETE
  const deleteNow = async () => {
    if (!id) return;
    await fetch(`http://localhost:5000/api/profile/${id}`, { method: "DELETE" });
    router.push("/team");
  };

  const iconMap: Record<string, JSX.Element> = {
    Active: <Icon icon="fa6-solid:circle-check" className="w-3 h-3" />,
    "On Leave": <Icon icon="fa6-solid:briefcase" className="w-3 h-3" />,
    "On Boarding": <Icon icon="fa6-solid:rocket" className="w-3 h-3" />,
    Inactive: <Icon icon="fa6-solid:pause" className="w-3 h-3" />,
  };

  const badgeColor: Record<string, string> = {
    Active: "bg-[#257047] text-white",
    Inactive: "bg-[#2D8EFF] text-white",
    "On Boarding": "bg-[#ACACAC] text-white",
    "On Leave": "bg-[#FFAB00] text-white",
  };
const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: (active: boolean) => (
        <UserIcon
          className={`w-6 h-6 ${
            active ? "text-[#322B64]" : "text-[#5A4FB5]"
          }`}
        />
      ),
    },
    {
      id: "leads",
      label: "Leads",
      icon: (active: boolean) => (
        <BriefcaseIcon
          className={`w-6 h-6 ${
            active ? "text-[#322B64]" : "text-[#5A4FB5]"
          }`}
        />
      ),
      badge: 4,
    },
    {
      id: "performance",
      label: "Performance",
      icon: (active: boolean) => (
        <Icon
          icon="heroicons:chart-bar-square-20-solid"
          className={`w-6 h-6 ${
            active ? "text-[#322B64]" : "text-[#5A4FB5]"
          }`}
        />
      ),
    },
  ];

  return (
    <div className="bg-[#F0F2F5] min-h-screen flex flex-col">
      {/* TOPBAR */}
      <div
        className="fixed top-0 left-0 right-0 z-30 bg-[#F0F2F5]"
        style={{ marginLeft: isSidebarOpen ? "240px" : "0" }}
      >
        <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div style={{ height: 80 }} />

      {/* BACK */}
      <div
        onClick={() => router.push("/team")}
        className="flex items-center gap-2 text-gray-600 cursor-pointer ml-4 mt-4"
      >
        <ArrowLeft size={20} />
        Back to Team Management
      </div>

      {/* CONTENT */}
     <div className="flex gap-6 p-6">
             {/* LEFT CARD */}
             <div className="w-[321px] bg-white rounded-2xl shadow-md p-6 self-start">
               {member && (
                 <div className="flex flex-col items-center gap-2 mt-6">
                  <Avatar name={member.name} size={64} />
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm">{member.role}</p>
     
                   <div className="flex gap-2 mt-2">
                     <span className="px-3 py-1 text-sm rounded-full bg-[#CCC8E8] text-black">
                       {member.team}
                     </span>
     
                     <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-semibold ${badgeColor[member.status]}`}
                        >
                       {iconMap[member.status] || null}
                       {member.status}
                     </span>
                   </div>
     
                   <div className="flex gap-2 mt-3 text-[#595959] w-full">
                     <EnvelopeIcon className="w-4 h-4" />
                     <span className="text-sm font-semibold">{member.email}</span>
                   </div>
     
                   <div className="flex gap-2 text-[#595959] mt-1 font-semibold w-full">
                     <CalendarDaysIcon className="w-4 h-4" />
                     <span className="text-xs">
                       Joined <span>{member.joinedDate}</span>
                     </span>
                   </div>
     
                   {/* BUTTONS */}
                   <div className="flex gap-3 pt-4 w-full">
                     <button
                       onClick={() => setIsEditOpen(true)}
                       className="flex-1 py-2 rounded-lg bg-white text-[#8AB500] border border-[#8AB500] hover:bg-green-200 flex items-center justify-center gap-2"
                     >
                       <PencilSquareIcon className="w-5 h-5" /> Edit
                     </button>
     
                     <button
                       onClick={() => setOpenDelete(true)}
                       className="flex-1 py-2 rounded-lg bg-white text-[#F92916] border border-[#F92916] hover:bg-red-200 flex items-center justify-center gap-2"
                     >
                       <TrashIcon className="w-5 h-5" /> Delete
                     </button>
                   </div>
                 </div>
               )}
             </div>

        {/* RIGHT */}
               {/* RIGHT CARD */}
               <div className="flex-1 bg-white rounded-2xl p-6 shadow-md border">
                 <div className="bg-[#CCC8E8] rounded-xl px-10 py-3 flex justify-around items-center w-full">
                   {tabs.map((t) => {
                     const isActive = activeTab === t.id;
                     return (
                       <div
                         key={t.id}
                         className={`flex items-center gap-2 px-3 py-1 cursor-pointer rounded-md relative ${
                           isActive
                             ? "text-[#322B64] font-semibold"
                             : "text-[#5A4FB5] font-semibold"
                         }`}
                         onClick={() => setActiveTab(t.id)}
                       >
                         {t.icon(isActive)}
                         {t.label}
       
                         {t.badge && (
                           <span className="bg-[#2D8EFF] text-white text-xs px-2 py-0.5 rounded-full ml-1">
                             {t.badge}
                           </span>
                         )}
       
                         {isActive && (
                           <div className="absolute left-0 right-0 bottom-[-2px] h-[3px] bg-[#322B64] rounded-full"></div>
                         )}
                       </div>
                     );
                   })}
                 </div>
       
                 {activeTab === "overview" && member && (
                     <div className="mt-6 space-y-6">
       
                       {/* BIO */}
                       <div>
                         <h3 className="text-xl text-[#000000] font-semibold mb-2">Bio</h3>
                         <p className="text-[#000000]">{member.bio}</p>
                       </div>
       
                       {/* SKILLS */}
                       <div>
                         <h3 className="text-xl text-[#000000] font-semibold mb-2">Skills</h3>
                         <div className="flex text-[#000000] font-reguler flex-wrap gap-2">
                           {member.skills.map((skill, index) => (
                             <span
                               key={index}
                               className="px-3 py-1 bg-[#E5D4FF] text-sm rounded-full"
                             >
                               {skill}
                             </span>
                           ))}
                         </div>
                       </div>
       
                       {/* REPORTS TO */}
                      <div>
                       <h3 className="text-xl text-[#000000] font-semibold mb-2">Reports To</h3>
                       <p className="text-[#000000]">{member.reports_to}</p>
                     </div>
       
       
                     </div>
                   )}
       
       
                 {activeTab === "leads" && <LeadsContent />}
                 {activeTab === "performance" && (
                   <p>Performance coming soon...</p>
                 )}
               </div>
             </div>


      {isEditOpen && member && (
        <EditTeam
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          memberId={id!} // id dari searchParams
          onSubmit={(updated) => {
            // update member state supaya detail page langsung update
            setMember((prev) => ({ ...prev!, ...updated }));
            setIsEditOpen(false);
          }}
        />
      )}
      <DeleteTeam
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={deleteNow}
      />
    </div>
  );
};

export default DetailPage;
