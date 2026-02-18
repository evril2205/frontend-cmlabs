"use client";

import React, { useState } from "react"; 
import { UserIcon, BriefcaseIcon } from "@heroicons/react/24/solid";
import { Icon } from "@iconify/react";
import LeadsContent from "@/components/team/MemberProfileCard"; 

// Tipe member sesuai backend
interface Member {
  id: number;
  fullname?: string;
  bio?: string;
  skills?: { id: number; name: string }[];
  reportsTo?: { id: number; fullname: string } | null;
  department?: { id: number; name: string } | null;
  role?: string;
  email?: string;
}

interface Props {
  member: Member;
}

export default function MemberTabs({ member }: Props) {
  const [activeTab, setActiveTab] = useState("overview"); 

  return (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-md border">
      {/* TAB HEADER */}
      <div className="bg-[#CCC8E8] rounded-xl px-10 py-3 flex justify-around">
        {["overview", "leads", "performance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-semibold ${
              activeTab === tab ? "text-[#322B64]" : "text-[#5A4FB5]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Bio</h3>
            <p>{member.bio || "No bio available"}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {member.skills && member.skills.length > 0 ? (
                member.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-[#E5D4FF] text-sm rounded-full"
                  >
                    {skill.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No skills listed</span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Reports To</h3>
            <p>{member.reportsTo?.fullname || "No supervisor assigned"}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Department</h3>
            <p>{member.department?.name || "No department assigned"}</p>
          </div>
        </div>
      )}

      {activeTab === "leads" && <LeadsContent member={member} onEdit={function (): void {
        throw new Error("Function not implemented.");
      } } onDelete={function (): void {
        throw new Error("Function not implemented.");
      } } />}
      {activeTab === "performance" && <p>Coming soon...</p>}
    </div>
  );
}
