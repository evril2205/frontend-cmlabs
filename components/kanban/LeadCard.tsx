"use client";

import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

interface LeadCardProps {
  id: string;
  title: string;
  company: string;
  value: string;
  date: string;
  tags: Array<{ label: string; color: string }>;
  assignee: { name: string; initial: string; color: string };
  onEdit?: (id: string) => void;
  onArchive?: (id: string) => void;
}

const LeadCard = ({
  id,
  title,
  company,
  value,
  date,
  tags,
  assignee,
  onEdit,
  onArchive,
}: LeadCardProps) => {
  // Map warna tag custom
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

const getTagColor = (text: string | undefined) => {
  if (!text) return "#EAEAEA"; // Warna default kalau kosong
  return labelColorMap[text] || "#EAEAEA";
};

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-0">
        <h3 className="font-small text-gray-900 text-[12px] leading-snug">
          {title}
        </h3>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(id)}
            className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
            title="Edit"
          >
            <PencilSquareIcon className="w-2.5 h-2.5" style={{ color: "#8AB500" }} />
          </button>

          <button
            onClick={() => onArchive?.(id)}
            className="w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
            title="Archive"
          >
            <Image
              src="/assets/icons/box.svg"
              alt="Archive"
              width={14}
              height={14}
              className="w-2.5 h-2.5"
              style={{ filter: "invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(50%) contrast(70%)" }}
            />
          </button>
        </div>
      </div>

      {/* Company */}
      <p className="text-[10.5px] text-gray-500 mb-1">{company}</p>

      {/* Value & Date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BanknotesIcon className="w-4 h-4 text-gray-700" />
          <span className="text-[11px] font-medium text-gray-800">{value}</span>
        </div>

        <span className="text-[11px] text-gray-500">{date}</span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`
              text-black text-[8px] font-small 
              px-3 py-[3px] rounded-full whitespace-nowrap
            `}
            style={{ backgroundColor: getTagColor(tag.label) }}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-2">
        <div
          className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-semibold text-white ${assignee.color}`}
        >
          {assignee.initial}
        </div>
        <span className="text-[10px] text-gray-800">{assignee.name}</span>
      </div>
    </div>
  );
};

export default LeadCard;