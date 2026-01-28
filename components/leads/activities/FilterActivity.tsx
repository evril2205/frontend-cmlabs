import { useState } from "react";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function FilterActivity() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

  const filterOptions = ["All", "Newest", "Oldest", "Has Image"];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600"
      >
        <FunnelIcon className="w-4 h-4" />
        Filters
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] p-4">
          {/* SEARCH BOX */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search activity..." 
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none"
            />
          </div>

          {/* RADIO BUTTONS */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sort By</p>
            {filterOptions.map((opt) => (
              <label key={opt} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-gray-700">{opt}</span>
                <input 
                  type="radio" 
                  name="filter" 
                  checked={selectedType === opt}
                  onChange={() => setSelectedType(opt)}
                  className="w-4 h-4 accent-[#5A4FB0]" 
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}