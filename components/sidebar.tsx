"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import LeadActive from "@/components/icons/LeadActive";
import { Globe20Regular } from "@fluentui/react-icons";

import {
  HomeIcon,
  UsersIcon,
  UserIcon,
  ExclamationCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

import { useSidebar } from "@/contexts/SidebarContext";

interface UserToken {
  id: number;
  role: "SUPERADMIN" | "ADMIN" | "SALES";
}

const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarOpen } = useSidebar();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<UserToken>(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const allMenus = [
    { label: "Dashboard", href: "/dashboard", defaultIcon: <HomeIcon className="w-5" />, activeIcon: null, roles: ["SUPERADMIN", "ADMIN", "SALES"] },
    { label: "Leads", href: "/leads", defaultIcon: <Globe20Regular className="w-5" />, activeIcon: <LeadActive className="w-5 text-[#3D2C83]" />, roles: ["SUPERADMIN", "ADMIN", "SALES"] },
    { label: "Team", href: "/team", defaultIcon: <UsersIcon className="w-5" />, activeIcon: null, roles: ["SUPERADMIN", "ADMIN"] },
    { label: "Profile", href: "/profile", defaultIcon: <UserIcon className="w-5" />, activeIcon: null, roles: ["SUPERADMIN", "ADMIN", "SALES"] },
  ];

  // Filter menu berdasarkan role
  const menu = allMenus.filter((item) => 
    userRole ? item.roles.includes(userRole) : true
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#26214C] text-white
      flex flex-col justify-between rounded-r-3xl shadow-md
      transition-all duration-300 z-50
      ${isSidebarOpen ? "w-50 px-4 py-5" : "w-0 px-0 py-0 overflow-hidden"}`}
    >
      {/* Logo */}
      <div className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2.5 mb-8">
          <Image src="/assets/cmlabs-logo.svg" alt="CMLABS Logo" width={28} height={28} />
          <div>
            <h1 className="text-base font-semibold leading-tight">CMLABS</h1>
            <p className="text-[8px] opacity-80 tracking-wide -mt-[2px]">Supervene Search Odyssey</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition ${
                pathname === item.href
                  ? "bg-white text-[#3D2C83]"
                  : "hover:bg-white/10 text-white/90"
              }`}
            >
              {pathname === item.href && item.activeIcon ? item.activeIcon : item.defaultIcon}
              <span className="text-[13px]">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Buttons */}
      <div className={`space-y-2 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
        <Link href="/help" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
          <ExclamationCircleIcon className="w-5" />
          <span className="text-[13px]">Get Help</span>
        </Link>

        <Link href="/settings" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition">
          <Cog6ToothIcon className="w-5" />
          <span className="text-[13px]">Setting</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;