"use client";

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "../icons/Avatar";


interface TopbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

interface User {
  fullname: string;
  profilePicture?: string | null;
}

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  /* ================= GET PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  /* ================= UTIL ================= */
  const toggleDarkMode = (mode: "light" | "dark") => {
    const dark = mode === "dark";
    setIsDarkMode(dark);
    document.documentElement.classList.toggle("dark", dark);
  };

  const getInitial = (name?: string) =>
    name ? name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-40">
      <div className="px-4 py-2 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 bg-[#322B64] rounded-lg hover:bg-[#2a1f52] transition-colors"
        >
          <ListBulletIcon className="w-4 h-4 text-white" />
        </button>

        <div className="flex items-center gap-2 bg-white border border-gray-400 px-2.5 py-1.5 rounded-full w-56">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
            <input
              type="text"
              placeholder="Search"
              className="text-xs w-full outline-none bg-transparent"
            />
          </div>
        </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-400 bg-white hover:bg-gray-50">
          <BellIcon className="w-4 h-4 text-gray-500" />
        </div>

        {/* MODE */}
         <div className="flex items-center border border-gray-400 rounded-full p-0.5 bg-white">
          <button
            onClick={() => toggleDarkMode("light")}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
              !isDarkMode ? "bg-[#5A4FB5] text-white" : "text-[#818083] hover:bg-gray-50"
            }`}
          >
            <SunIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleDarkMode("dark")}
            className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
              isDarkMode ? "bg-[#5A4FB5] text-white" : "text-[#818083] hover:bg-gray-50"
            }`}
          >
            <MoonIcon className="w-3.5 h-3.5" />
          </button>
        </div>


        {/* USER */}
        <div
          className="relative flex items-center gap-1.5 px-2 py-1 rounded-full border bg-white cursor-pointer"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          {/* AVATAR (TIDAK UBAH TAMPILAN) */}
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
            <Avatar
              name={user?.fullname}
              size={28}
            />
          </div>


          <span className="text-xs font-medium text-gray-700">
            {user?.fullname || "User"}
          </span>

          <ChevronDownIcon className="w-3 h-3 text-gray-500" />

          {/* DROPDOWN */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border py-1 z-50">
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </button>
              <hr />
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  </div>
  );
};

export default Topbar;