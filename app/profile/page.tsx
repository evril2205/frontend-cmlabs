"use client";

import {
  LockClosedIcon,
  UserIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Icon } from "@iconify/react";
import React, { JSX, useEffect, useRef, useState } from "react";
import Topbar from "@/components/topbar/Topbar";
import { useSidebar } from "@/contexts/SidebarContext";
import { ImageIcon, Mail, Phone, MapPin } from "lucide-react";
import Profile from "./components/profile";
import Account from "./components/account";
import Notifications from "./components/notifications";
import { jwtDecode } from "jwt-decode";

/* ================= STATUS BADGE ================= */
interface SelectProps {
  value?: string;
  icon?: React.ReactNode;
}

function CustomSelect({ value, icon }: SelectProps) {
  const colorMap: Record<string, string> = {
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

  if (!value) return null;

  return (
    <div className="w-full relative mt-2">
      <div className="w-full flex items-center justify-center gap-2 px-1 py-1">
        {icon && <div className="text-[#595959]">{icon}</div>}
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colorMap[value]}`}
        >
          {iconMap[value]}
          {value}
        </span>
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function Page() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState<string>("");

  const [openEditMenu, setOpenEditMenu] = useState(false);

  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const tabs = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "account", label: "Account", icon: LockClosedIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
  ];

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (!decoded?.id) {
        window.location.href = "/login";
        return;
      }

      setUserId(decoded.id);

      const fetchUser = async () => {
        const res = await fetch(
          "http://localhost:5000/api/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("User not found");

        const data = await res.json();
        setUser(data);
        setStatus(data.status?.name ?? "");
      };

      fetchUser();
    } catch {
      window.location.href = "/login";
    }
  }, []);

  /* ================= UPLOAD PROFILE PHOTO ================= */
      const handleUploadProfile = async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("profilePicture", file);

        const res = await fetch(
          "http://localhost:5000/api/profile/upload-photo",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await res.json();

        setUser((prev: any) => ({
          ...prev,
          profilePicture: data.profilePicture,
        }));
      };

      const handleUploadCover = async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const formData = new FormData();
        formData.append("coverPicture", file);

        const res = await fetch(
          "http://localhost:5000/api/profile/upload-photo",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await res.json();

        setUser((prev: any) => ({
          ...prev,
          coverPicture: data.coverPicture,
        }));
      };




        if (!user || !userId) {
          return (
            <div className="w-full h-screen flex items-center justify-center text-xl">
              Loading...
            </div>
          );
        }

  return (
    <div className="flex flex-col">
      {/* TOPBAR */}
      <div className="bg-[#F0F2F5] px-5 border-b border-gray-200">
        <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      <div style={{ height: "80px" }} />

      {/* BODY */}
      <div className="px-4 pb-10 flex-1 overflow-y-auto flex justify-center">
        <div className="max-w-7xl w-full">
          {/* TITLE */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="text-gray-500">
              Manage your account settings and preferences
            </p>
          </div>

          {/* HEADER IMAGE */}
          <div className="w-full h-[220px] overflow-hidden -mt-2">
            <img
                src={
                  user.coverPicture
                    ? `http://localhost:5000${user.coverPicture}`
                    : "/default-cover.jpg"
                }
                className="w-full h-full object-cover"
              />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 -mt-20 relative z-20">
            {/* PROFILE CARD */}
            <div className="bg-white shadow-md border relative pb-8 w-[320px] min-h-[420px] mx-auto lg:mx-0 lg:ml-10 self-start">
              {/* IMAGE */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                <div className="relative z-30">
                  <img
                    src={
                      user.profilePicture
                        ? `http://localhost:5000${user.profilePicture}`
                        : "/default-avatar.png"
                    }
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />

                  <button
                    onClick={() => setOpenEditMenu((v) => !v)}
                    className="absolute bottom-2 right-2 bg-purple-600 p-1.5 rounded-full text-white"
                  >
                    <Icon icon="heroicons:pencil-solid" />
                  </button>

                  {openEditMenu && (
                    <div className="absolute top-[110%] right-0 bg-white shadow-lg rounded-xl p-4 w-48 z-[9999]">
                      <h3 className="text-[#595959] font-medium mb-3">Edit</h3>

                      <button
                        className="flex items-center gap-3 w-full py-2 hover:bg-[#CCC8E8]"
                        onClick={() => profileInputRef.current?.click()}
                      >
                        <UserCircleIcon className="w-6 h-6 text-gray-500" />
                        <span className="text-[#595959] text-sm">
                          Profile Photo
                        </span>
                      </button>

                      <button
                        className="flex items-center gap-3 w-full py-2 hover:bg-[#CCC8E8]"
                        onClick={() => coverInputRef.current?.click()}
                      >
                        <ImageIcon size={20} className="text-gray-500" />
                        <span className="text-[#595959] text-sm">
                          Cover Photo
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                 <input
                  type="file"
                  ref={profileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadProfile}
                />
                 <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadCover}
                />
              </div>

              <div className="mt-20 text-center">
                <h2 className="font-semibold text-xl">{user.fullname}</h2>

                {!openEditMenu && <CustomSelect value={status} />}
              </div>

              <div className="mt-4 border-b" />

              <div className="px-8 mt-6 space-y-4 text-sm">
                <p className="flex items-center gap-3 text-gray-700" >
                  <Phone size={20} />+62 {user.phone}
                </p>

                <p className="flex items-center gap-3 text-gray-700">
                  <MapPin size={20} /> {user.location}
                </p>

                <p className="flex items-center gap-3 text-gray-700">
                  <Mail size={20} /> {user.email}
                </p>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="bg-white shadow-md border p-8 w-full lg:w-[700px]">
              {/* TABS */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-3 mb-6 px-6">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComp = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 pb-2 cursor-pointer ${
                        isActive
                          ? "text-[#322B64] border-b-2 border-[#322B64] font-semibold"
                          : "text-[#5A4FB5] hover:text-[#403881]"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT */}
              <div className="mt-6">
                {activeTab === "profile" && <Profile userId={userId} />}
                {activeTab === "account" && <Account userId={userId} />}
                {activeTab === "notifications" && (
                  <Notifications userId={userId} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
