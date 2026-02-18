"use client";

import {
  EnvelopeIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Icon } from "@iconify/react";
import Avatar from "@/components/icons/Avatar";
import { JSX } from "react";

// Tipe member sesuai backend
export interface Member {
  id: number;
  fullname?: string;
  role?: string;
  email?: string;
  joined_at?: string;
  profilePicture?: string;
  department?: { id: number; name: string } | null;
  status?: { id: number; name: string } | null;
}

interface Props {
  member: Member;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MemberProfileCard({ member, onEdit, onDelete }: Props) {
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

  const joinedDate = member.joined_at
    ? new Date(member.joined_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="w-[321px] bg-white rounded-2xl shadow-md p-6 self-start">
      <div className="flex flex-col items-center gap-2 mt-6">
        {/* Avatar */}
       <Avatar name={member.fullname || "User"} size={64} />
        {/* Name & Role */}
        <h2 className="font-semibold text-base mt-2">{member.fullname || "Unknown"}</h2>
        <p className="text-sm font-semibold">{member.role || "—"}</p>

        {/* Department & Status */}
        <div className="flex gap-2 mt-2">
          <span className="px-3 py-1 text-sm rounded-full bg-[#CCC8E8]">
            {member.department?.name || "—"}
          </span>

          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-semibold ${
              badgeColor[member.status?.name || ""] || "bg-gray-300 text-black"
            }`}
          >
            {iconMap[member.status?.name || ""] || null}
            {member.status?.name || "Unknown"}
          </span>
        </div>

        {/* Email */}
        <div className="flex gap-2 mt-3 text-[#595959] w-full">
          <EnvelopeIcon className="w-4 h-4" />
          <span className="text-sm font-semibold truncate">{member.email || "—"}</span>
        </div>

        {/* Joined Date */}
        <div className="flex gap-2 text-[#595959] mt-1 font-semibold w-full">
          <CalendarDaysIcon className="w-4 h-4" />
          <span className="text-xs">Joined {joinedDate}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 w-full">
          <button
            onClick={onEdit}
            className="flex-1 py-2 rounded-lg bg-white text-[#8AB500] border border-[#8AB500] hover:bg-green-200 flex items-center justify-center gap-2"
          >
            <PencilSquareIcon className="w-5 h-5 inline" /> Edit
          </button>

          <button
            onClick={onDelete}
            className="flex-1 py-2 rounded-lg bg-white text-[#F92916] border border-[#F92916] hover:bg-red-200 flex items-center justify-center gap-2"
          >
            <TrashIcon className="w-5 h-5 inline" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
