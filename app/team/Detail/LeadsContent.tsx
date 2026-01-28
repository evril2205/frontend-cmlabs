"use client";

import { Edit2, Trash } from "lucide-react";

const dummyLeads = Array(8).fill(null);

export default function LeadsContent() {
  return (
    <div className="mt-6 px-2">
      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dummyLeads.map((_, idx) => (
          <div
            key={idx}
            className="border rounded-2xl shadow-sm p-5 bg-white flex flex-col gap-3 hover:shadow-md transition"
          >
            {/* TITLE */}
            <div>
              <p className="font-semibold text-[15px] text-[#322B64]">
                [Sample] iTable
              </p>
              <p className="text-sm text-gray-500 -mt-1">Company Name</p>
            </div>

            {/* PRICE + DATE */}
            <div className="flex justify-between items-center mt-1">
              <p className="font-bold text-[#322B64]">IDR 7.000</p>
              <span className="text-xs text-gray-500">7/7/2025</span>
            </div>

            {/* BADGES */}
            <div className="flex gap-2 flex-wrap mt-1">
              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-[10px] font-medium">
                Pitching
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-medium">
                Low Priority
              </span>
              <span className="px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded-full text-[10px] font-medium">
                Existing Client
              </span>
            </div>

            {/* USER */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                A
              </div>
              <p className="text-[13px] font-medium">Angela Audia</p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 flex justify-center items-center gap-1 bg-green-100 text-green-700 py-1.5 rounded-lg text-sm">
                <Edit2 size={16} /> Edit
              </button>

              <button className="flex-1 flex justify-center items-center gap-1 bg-red-100 text-red-600 py-1.5 rounded-lg text-sm">
                <Trash size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
