"use client";

import Avatar from "@/components/icons/Avatar";
import { MoreHorizontal } from "lucide-react";
import {
  EnvelopeIcon,
  BriefcaseIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { JSX } from "react";

interface Props {
  m: {
    id: number;
    fullname?: string;
    email?: string;
    role?: string;
    status?: { name: string };
     profilePicture?: string;
    department?: { name: string };
   joinedDate ?: string;
  };
  i: number;
  badgeColor: Record<string, string>;
  iconMap: Record<string, JSX.Element>;
  openMenuIndex: number | null;
  setOpenMenuIndex: (i: number | null) => void;
  setSelectedId: (id: number) => void;
  setIsEditOpen: (open: boolean) => void;
  setOpenDelete: (open: boolean) => void;
  handleViewDetails: (id: number) => void;
  formatDate: (date: string | undefined) => string;
}

export default function TeamCard({
  m,
  i,
  badgeColor,
  iconMap,
  openMenuIndex,
  setOpenMenuIndex,
  setSelectedId,
  setIsEditOpen,
  setOpenDelete,
  handleViewDetails,
  formatDate,
}: Props) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow border relative w-full h-[340px]">
      
      {/* STATUS BADGE */}
      <div className="absolute top-3 left-3">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-semibold ${
            badgeColor[m.status?.name || "Inactive"]
          }`}
        >
          {iconMap[m.status?.name || "Inactive"]}
          {m.status?.name || "Unknown"}
        </span>
      </div>

      {/* MENU */}
      <div className="absolute top-3 right-3">
        <MoreHorizontal
          onClick={() => setOpenMenuIndex(openMenuIndex === i ? null : i)}
          className="cursor-pointer"
        />
        {openMenuIndex === i && (
          <div className="absolute right-0 mt-2 bg-white shadow border rounded w-28 z-50">
            <button
              onClick={() => {
                setSelectedId(m.id);
                setIsEditOpen(true);
                setOpenMenuIndex(null);
              }}
              className="px-3 py-2 hover:bg-gray-100 flex gap-2"
            >
              <PencilSquareIcon className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => {
                setSelectedId(m.id);
                setOpenDelete(true);
                setOpenMenuIndex(null);
              }}
              className="px-3 py-2 hover:bg-gray-100 flex gap-2"
            >
              <TrashIcon className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* AVATAR */}
      <div className="flex flex-col items-center gap-2 mt-10">
        <Avatar name={m.fullname || "User"} size={64} />
        <p className="font-semibold">{m.fullname || "Unknown"}</p>
        <p className="text-sm font-medium">{m.role || "—"}</p>
      </div>

      {/* INFO */}
      <div className="bg-[#CCC8E8] p-3 mt-4 w-full rounded space-y-2 text-xs">
        <div className="flex gap-2 items-start">
          <EnvelopeIcon className="w-4 h-4 min-w-[15px] text-black mt-[2px]" />
          <p className="break-all">{m.email || "—"}</p>
        </div>
        <div className="flex gap-2 items-center">
          <BriefcaseIcon className="w-4 h-4 min-w-[15px] text-black" />
          <p>{m.department?.name || "—"} Team</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-[10px] flex justify-between mt-8 text-gray-600">
        <p className="font-semibold">
          <span className="text-[#898887]">Joined at </span>
          <span className="text-black">{formatDate(m.joinedDate )}</span>
        </p>

        <p
          onClick={() => handleViewDetails(m.id)}
          className="cursor-pointer font-semibold text-[#828382] hover:text-[#595A59]"
        >
          View Details →
        </p>
      </div>
    </div>
  );
}
