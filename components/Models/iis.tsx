"use client";
import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { UserIcon } from "@heroicons/react/24/solid";
import Avatar from "../../components/icons/Avatar";

/* ---------------------------------------------
   INPUT COMPONENT
---------------------------------------------- */
interface InputProps {
  label?: React.ReactNode;
  placeholder?: string;
  prefix?: string;
  icon?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}

function Input({
  label,
  prefix,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
}: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#595959]">
            {icon}
          </div>
        )}

        {prefix && (
          <span
            className={`absolute top-1/2 -translate-y-1/2 text-[#595959] text-sm ${
              icon ? "left-12" : "left-3"
            }`}
          >
            {prefix}
          </span>
        )}

        <input
          type={type}
          value={value ?? ""}
          placeholder={placeholder ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full border border-[#ACADAD] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8A38F5] focus:border-[#8A38F5] ${
            icon ? "pl-10" : ""
          } ${prefix ? "pl-24" : ""}`}
        />
      </div>
    </div>
  );
}
/* ---------------------------------------------
   CUSTOM SELECT (ID BASED)
---------------------------------------------- */
interface OptionItem {
  id: number;
  name: string;
}

function CustomSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number | null;
  onChange: (id: number) => void;
  options: OptionItem[];
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div
        className="border rounded-md px-3 py-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected?.name || `Select ${label}`}
      </div>

      {open && (
        <div className="absolute left-0 right-0 bg-white border rounded-md shadow z-50 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="px-4 py-2 hover:bg-[#CCC8E8] cursor-pointer"
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   STRING SELECT
---------------------------------------------- */
function StringSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-sm font-medium">{label}</label>

      <div
        onClick={() => setOpen(!open)}
        className="border rounded-md px-3 py-2 cursor-pointer mt-1"
      >
        {value || `Select ${label}`}
      </div>

      {open && (
        <div className="absolute z-50 bg-white border rounded-md w-full">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   TYPES
---------------------------------------------- */
interface OptionItem {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

interface Admin {
  id: number;
  fullname: string;
  email: string;
  role?: string;
}

/* ---------------------------------------------
   MAIN MODAL
---------------------------------------------- */
export default function ModalCreateTeam({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: unknown) => void;
}) {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    role: "",
    departmentId: null as number | null,
    statusId: null as number | null,
    joinedDate: "",
    location: "",
    bio: "",
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [departments, setDepartments] = useState<OptionItem[]>([]);
  const [statuses, setStatuses] = useState<OptionItem[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ USER LOGIN
  const [currentUser, setCurrentUser] = useState<Admin | null>(null);

  const update = (key: string, value: unknown) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* LOAD CURRENT USER */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((me) => {
        setCurrentUser(me);

        // ✅ ADMIN auto reports to himself
        if (me.role === "ADMIN") {
          setSelectedAdmin(me);
        }

        // ✅ PM no reportsTo
        if (me.role === "PROJECT_MANAGER") {
          setSelectedAdmin(null);
        }
      })
      .catch(console.error);
  }, []);

  /* LOAD OPTIONS */
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    Promise.all([
      fetch("http://localhost:5000/api/options/departments", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/options/statuses", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/options/skills", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/options/roles", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]).then(async ([d, s, sk, r]) => {
      setDepartments(await d.json());
      setStatuses(await s.json());
      setAllSkills(await sk.json());
      setRoles(await r.json());
    });
  }, [isOpen]);

  /* LOAD ADMINS */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/profile/admins", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setAdmins)
      .catch(console.error);
  }, []);

  /* SUBMIT */
  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token || !currentUser) return;

    const payload = {
      ...form,
      reportsToId:
        currentUser.role === "ADMIN"
          ? currentUser.id
          : currentUser.role === "PROJECT_MANAGER"
          ? null
          : selectedAdmin?.id ?? null,
      skillsIds: skills.map((s) => s.id),
    };

    await fetch("http://localhost:5000/api/profile/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;


  /* ================= JSX TIDAK DIUBAH ================= */
  return (
  <div
    className="fixed inset-0 bg-black/20 flex items-center justify-center z-[999]"
    onClick={onClose}
  >
    <div
      className="bg-white max-h-[90vh] max-w-[95vw] w-[580px] rounded-2xl shadow-xl p-6 overflow-y-auto relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5A4FB5] rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold">Add Team</h1>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <Input
            label={<>Full Name <span className="text-red-500">*</span></>}
            value={form.fullname}
            placeholder="Input Your Full Name Here"
            onChange={(v) => update("fullname", v)}
          />
        </div>

        <div>
          <Input
            label={<>Email <span className="text-red-500">*</span></>}
            value={form.email}
            placeholder="Input Your Email Here"
            onChange={(v) => update("email", v)}
          />
        </div>

        <div>
          <Input
            label={<>Phone <span className="text-red-500">*</span></>}
            prefix="+62|"
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />
        </div>

        <div>
          <StringSelect
            label="Role"
            value={form.role}
            options={roles}
            onChange={(v) => update("role", v)}
          />
        </div>

        <div>
          <CustomSelect
            label="Department"
            value={form.departmentId}
            onChange={(v) => update("departmentId", v)}
            options={departments}
          />
        </div>

        <div>
          <CustomSelect
            label="Status"
            value={form.statusId}
            onChange={(v) => update("statusId", v)}
            options={statuses}
          />
        </div>

        <div>
          <Input
            type="date"
            label={<>Joined At <span className="text-red-500">*</span></>}
            value={form.joinedDate}
            onChange={(v) => update("joinedDate", v)}
          />
        </div>

        <div>
          <Input
            label={<>Location <span className="text-red-500">*</span></>}
            placeholder="Input Location"
            value={form.location}
            onChange={(v) => update("location", v)}
          />
        </div>

        {/* BIO */}
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => update("bio", e.target.value)}
            className="appearance-none text-[#595959] border rounded-lg px-3 py-2 h-24 w-full"
            placeholder="Input Bio"
          />
        </div>

        {/* SKILLS */}
        <div className="col-span-2">
          <MultiSkillSelect
            allSkills={allSkills}
            selected={skills}
            onChange={setSkills}
          />
        </div>

        {/* REPORTS TO */}
        <div className="col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Reports To (Admin)
          </label>

          <div className="relative">
            <div
              onClick={() => setAdminOpen(!adminOpen)}
              className="w-full border border-[#ACADAD] rounded-md px-3 py-2 cursor-pointer flex items-center gap-2"
            >
              {selectedAdmin ? (
                <>
                  <Avatar name={selectedAdmin.fullname} size={25} />
                  <span>{selectedAdmin.fullname}</span>
                </>
              ) : (
                <span className="text-[#595959]">Select Admin</span>
              )}
            </div>

            {adminOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg max-h-64 overflow-auto z-20">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <div
                      key={admin.id}
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setAdminOpen(false);
                      }}
                      className="px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                    >
                      <Avatar name={admin.fullname} />
                      <div>
                        <p className="font-medium">{admin.fullname}</p>
                        <p className="text-xs text-gray-500">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">
                    No admins found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#5A4FB5] hover:bg-[#4B43A3] text-white px-8 py-2 rounded-xl shadow disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Team"}
        </button>
      </div>
    </div>
  </div>
);
}
