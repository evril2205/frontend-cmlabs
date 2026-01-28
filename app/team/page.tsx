"use client";

import React, { useEffect, useState } from "react";
import Topbar from "@/components/topbar/Topbar";
import TeamHeader from "@/components/topbar/TeamHeader";
import { useSidebar } from "@/contexts/SidebarContext";
import CreatTeamModal from "@/components/Models/CreatTeamModal";
import EditTeam from "@/components/Models/EditTeam";
import DeleteTeam from "@/components/Models/DeleteTeam";
import TeamCard from "@/components/team/TeamMemberCard";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { JSX } from "react/jsx-runtime";
import { decodeToken } from "@/utils/decodeToken";

interface Member {
  id: number;
  name: string;
  email: string;
  roles: string;
  status: string;
  departemen: string;
  joined_at: string;
}

export default function TeamManagement() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const badgeColor: Record<string, string> = {
    Active: "bg-[#257047] text-white",
    Inactive: "bg-[#ACACAC] text-white",
    "On Boarding": "bg-[#ACACAC] text-white",
    "On Leave": "bg-[#FFAB00] text-white",
  };

  const iconMap: Record<string, JSX.Element> = {
    Active: <Icon icon="fa6-solid:circle-check" className="w-3 h-3" />,
    "On Leave": <Icon icon="fa6-solid:briefcase" className="w-3 h-3" />,
    "On Boarding": <Icon icon="fa6-solid:rocket" className="w-3 h-3" />,
    Inactive: <Icon icon="fa6-solid:pause" className="w-3 h-3" />,
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const fetchUsers = async () => {
  const url = search
    ? `http://localhost:5000/api/profile/all?search=${search}`
    : `http://localhost:5000/api/profile/all`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // pastikan token login dikirim
      },
    });
    const data = await res.json();

    // Pastikan data.users ada dan berupa array
    if (Array.isArray(data.users)) {
      setMembers(data.users);
    } else {
      setMembers([]); // fallback jika users tidak ada
    }
  } catch (err) {
    console.error("Fetch users failed:", err);
    setMembers([]);
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  const decoded = decodeToken(token);

  if (decoded?.role === "SALES") {
    router.push("/403"); // atau halaman lain
  }
}, []);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const deleteNow = async () => {
    if (!selectedId) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/profile/${selectedId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` },
    });
    setOpenDelete(false);
    fetchUsers();
  };

  const handleViewDetails = (id: number) => router.push(`/team/Detail?id=${id}`);

  return (
    <div className="bg-[#F0F2F5] min-h-screen flex flex-col">
      {/* TOPBAR */}
      <div
        className="fixed top-0 left-0 right-0 z-30 bg-[#F0F2F5]"
        style={{ marginLeft: isSidebarOpen ? "240px" : "0" }}
      >
        <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className="px-6">
          <TeamHeader onSearch={setSearch} onAddTeam={() => setIsCreateModalOpen(true)} />
        </div>
      </div>

      <div style={{ height: "200px" }} />

      {/* GRID MEMBERS */}
      <div className="px-6 pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {members.map((m, i) => (
          <TeamCard
            key={m.id}
            m={m}
            i={i}
            badgeColor={badgeColor}
            iconMap={iconMap}
            openMenuIndex={openMenuIndex}
            setOpenMenuIndex={setOpenMenuIndex}
            setSelectedId={setSelectedId}
            setIsEditOpen={setIsEditOpen}
            setOpenDelete={setOpenDelete}
            handleViewDetails={handleViewDetails}
            formatDate={formatDate}
          />
        ))}
      </div>

      {/* MODALS */}
      <CreatTeamModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {isEditOpen && selectedId && (
        <EditTeam isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} memberId={selectedId} onSubmit={fetchUsers} />
      )}

      <DeleteTeam isOpen={openDelete} onClose={() => setOpenDelete(false)} onConfirm={deleteNow} />
    </div>
  );
}
