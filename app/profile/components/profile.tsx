"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { UserIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Check } from "lucide-react";
import Avatar from "../../../components/icons/Avatar";
import type { JSX } from "react";


/* ================= INPUT COMPONENT ================= */
interface InputProps {
  label: string;
  placeholder?: string;
  prefix?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}

function Input({ label, prefix, icon, value, onChange, type = "text", placeholder, disabled = false }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#595959]">{icon}</div>}
        {prefix && <span className={`absolute top-1/2 -translate-y-1/2 text-[#595959] text-sm ${icon ? "left-12" : "left-3"}`}>{prefix}</span>}
        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border border-[#ACADAD] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8A38F5] focus:border-[#8A38F5] ${icon ? "pl-10" : ""} ${prefix ? "pl-24" : ""} ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
        />
      </div>
    </div>
  );
}

/* ================= CUSTOM SELECT ================= */
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
const [isDirty, setIsDirty] = useState(false);
  const selected = options.find((o) => o.id === value);

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

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>

      {/* Selected */}
      <div
        className="border rounded-md px-3 py-2 cursor-pointer flex items-center gap-2"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-l font-medium ${
              colorMap[selected.name]
            }`}
          >
            {iconMap[selected.name]}
            {selected.name}
          </span>
        ) : (
          <span className="text-gray-400">Select {label}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 bg-white border rounded-md shadow z-50 max-h-60 overflow-auto mt-1">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="px-4 py-2 hover:bg-[#CCC8E8] cursor-pointer flex items-center gap-2"
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
            >
              <span>{opt.name}</span>
                {opt.id === value && (
                  <Check size={16} className="text-[#5A4FB5]" />
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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


/* ================= MULTI SKILL SELECT ================= */
interface Skill {
  id: number;
  name: string;
}

function MultiSkillSelect({
  allSkills,
  selected,
  onChange,
}: {
  allSkills: Skill[];
  selected: Skill[];
  onChange: (skills: Skill[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleSkill = (skill: Skill) => {
    if (selected.find((s) => s.id === skill.id)) {
      onChange(selected.filter((s) => s.id !== skill.id));
    } else {
      onChange([...selected, skill]);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">Skills</label>

      <div
        className="border rounded-md p-2 flex flex-wrap gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0 && (
          <span className="text-gray-400">Select skills</span>
        )}

        {selected.map((s) => (
          <span
            key={s.id}
            className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm"
          >
            {s.name}
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute left-0 right-0 bg-white border rounded-md shadow max-h-60 overflow-auto z-50 mt-1">
          {allSkills.map((skill) => {
            const isSelected = selected.some((s) => s.id === skill.id);

            return (
              <div
                key={skill.id}
                onClick={() => toggleSkill(skill)}
                className="px-4 py-2 hover:bg-gray-100 flex justify-between cursor-pointer"
              >
                {skill.name}
                {isSelected && <Check size={16} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


/* ================= PROFILE COMPONENT ================= */
interface Admin {
  id: number;
  fullname: string;
  email: string;
}

interface UserForm {
  fullname: string;
  email: string;
  phone: string;
  location: string;
  departemen: string;
  role: string;        // nama role untuk tampil 
  status: string;
  bio: string;
  joined_at: string;
  departmentId: number | null;
  statusId: number | null;
  reportsToId: number | null;
}

export default function Profil() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<UserForm>({
    fullname: "",
    email: "",
    phone: "",
    location: "",
    departemen: "",
    role: "",
    status: "",
    bio: "",
    joined_at: "",
    departmentId: null,
    statusId: null,
    reportsToId: null,
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [departments, setDepartments] = useState<OptionItem[]>([]);
  const [statuses, setStatuses] = useState<OptionItem[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false); 
  

  const updateField = (key: keyof UserForm, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  /* ===== LOAD USER ID ===== */
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  const decoded: any = JSON.parse(atob(token.split(".")[1]));
  setUserId(decoded.id);
}, []);

  const token = localStorage.getItem("token");

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (!userId) return;

    (async () => {
      const [u, d, s, sk, r, a] = await Promise.all([
        fetch(`http://localhost:5000/api/profile/me`, {
          headers: { "Content-Type": "application/json", 
                      "Authorization": `Bearer ${token}` },
        }).then((r) => r.json()),
        fetch("http://localhost:5000/api/options/departments").then((r) => r.json()),
        fetch("http://localhost:5000/api/options/statuses").then((r) => r.json()),
        fetch("http://localhost:5000/api/options/skills").then((r) => r.json()),
        fetch("http://localhost:5000/api/options/roles").then((r) => r.json()),
        fetch("http://localhost:5000/api/profile/admins").then((r) => r.json()),
      ]);

      setDepartments(d.data ?? d);
      setStatuses(s.data ?? s);
      setAllSkills(sk.data ?? sk);
      setRoles(r.data ?? r);
      setAdmins(a.data ?? a);

      setForm({
        fullname: u.fullname || "",
        email: u.email || "",
        phone: u.phone || "",
        location: u.location || "",
        departemen: u.department?.name || "",
        role: u.role,
        status: u.status?.name || "",
        bio: u.bio || "",
        joined_at: u.joinedDate?.split("T")[0] || "",
        departmentId: u.department?.id || null,
        statusId: u.status?.id || null,
        reportsToId: u.reportsTo?.id || null,
      });

      setSkills(u.skills || []);
      setSelectedAdmin(u.reportsTo || null);
      setLoading(false);
    })();
  }, [userId]);

  /* ===== SAVE ===== */
  const handleSave = async () => {
    const payload = {
      fullname: form.fullname,
      email: form.email,
      phone: form.phone,
      location: form.location,
      bio: form.bio,
      role: form.role,         
      departmentId: form.departmentId,
      statusId: form.statusId,
      reportsToId: selectedAdmin?.id ?? null,
      skillsIds: skills.map((s) => s.id),
    };

    try {
      const res = await fetch(`http://localhost:5000/api/profile/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile!");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="heroicons:user" width={24} height={24}/> Basic Info
          </h2>
          <div className="space-y-4">
            <Input label="Fullname" value={form.fullname} onChange={(v) => updateField("fullname", v)} />
            <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} icon={<UserIcon className="w-5 h-5"/>} />
            <Input label="Phone Number" value={form.phone} onChange={(v) => updateField("phone", v.replace(/\D/g,""))} icon={<PhoneIcon className="w-5 h-5"/>} prefix="+62 |"/>
            <Input label="Location" value={form.location} onChange={(v) => updateField("location", v)} icon={<MapPinIcon className="w-5 h-5"/>} />
            <div>
            <label className="text-sm font-medium">Bio</label>
            <textarea
              ref={(el) => {
                if (el) {
                  el.style.height = "auto"; // reset dulu
                  el.style.height = `${el.scrollHeight}px`; // set tinggi sesuai isi
                }
              }}
              className="w-full border rounded-md p-3 mt-1 focus:ring-2 focus:ring-[#8A38F5] overflow-hidden resize-none"
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
              }}
            />
          </div>

          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon icon="heroicons:building-office" width={24} height={24}/> Work Info
          </h2>
          <div className="space-y-4">
            <CustomSelect label="Departemen" value={form.departmentId} onChange={(id) => updateField("departmentId", id)} options={departments} />
            <StringSelect label="Role" value={form.role} options={roles} onChange={(v) => setForm({ ...form, role: v })}  />
            <CustomSelect label="Status" value={form.statusId} onChange={(id) => updateField("statusId", id)} options={statuses} />
              <div>
                <label className="text-sm font-medium">Joined Date</label>
                <input type="date" value={form.joined_at} disabled className="w-full border rounded-md p-2 mt-1 bg-gray-100 cursor-not-allowed"/>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Reports To</label>
                <div className="relative">
                  <div
                    onClick={() => setAdminOpen(!adminOpen)}
                    className="w-full border rounded-md px-3 py-2 cursor-pointer flex items-center gap-2"
                  >
                    {selectedAdmin ? (
                      <>
                        <Avatar name={selectedAdmin.fullname} size={25} />
                        <span>{selectedAdmin.fullname}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Select Admin</span>
                    )}
                  </div>

                  {adminOpen && admins?.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg max-h-64 overflow-auto z-20">
                      {admins.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => {
                            setSelectedAdmin(a);
                            updateField("reportsToId", a.id);
                            setAdminOpen(false);
                          }}
                          className="px-3 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                        >
                          <Avatar name={a.fullname} size={25} />
                          <div>
                            <p className="font-medium">{a.fullname}</p>
                            <p className="text-xs text-gray-500">{a.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {adminOpen && (!admins || admins.length === 0) && (
                    <div className="absolute left-0 right-0 mt-2 bg-white border rounded-md shadow-lg px-4 py-2 text-gray-400">
                      No admins found
                    </div>
                  )}
                </div>
              </div>

            <MultiSkillSelect allSkills={allSkills} selected={skills} onChange={setSkills} />
          </div>

          <div className="flex justify-end mt-8">
            <button onClick={handleSave} className="bg-[#5A4FB5] hover:bg-[#403881] text-white px-6 py-3 rounded-md font-semibold">Save Change</button>
          </div>
        </div>
      </div>
    </div>
  );
}
