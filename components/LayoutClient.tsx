"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePathname } from "next/navigation";

interface LayoutClientProps {
  children: React.ReactNode;
}

const LayoutClient = ({ children }: LayoutClientProps) => {
  const { isSidebarOpen } = useSidebar();
  const path = usePathname();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const hideSidebar =
    path === "/login" ||
    path === "/login/forget-password" ||
    path.startsWith("/reset-password/") ||
    path.startsWith("/activate/");

  return (
  <div className="min-h-screen bg-gray-50">
    {!hideSidebar && <Sidebar />}

    <main
      className={`
        transition-all duration-300
        min-h-screen
        overflow-y-auto
        ${!hideSidebar && isSidebarOpen ? "ml-50" : "ml-0"}
      `}
    >
      {children}
    </main>
  </div>
);

};

export default LayoutClient;
