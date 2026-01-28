"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import { Check } from "lucide-react";
import Avatar from "../../components/icons/Avatar";

/* ================= INPUT COMPONENT ================= */
interface InputProps {
  label: string;
  placeholder?: string;
  prefix?: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  
}

function Input({ label, prefix, icon, value, onChange, type = "text", placeholder }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#595959]">{icon}</div>}
        {prefix && (
          <span className={`absolute top-1/2 -translate-y-1/2 text-[#595959] text-sm ${icon ? "left-12" : "left-3"}`}>
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value ?? ""}
          placeholder={placeholder ?? ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full border border-[#ACADAD] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#8A38F5] focus:border-[#8A38F5] ${
            icon ? "pl-10" : ""
          } ${prefix ? "pl-24" : ""}`}
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

function CustomSelect({ label, value, onChange, options }: { label: string; value: number | null; onChange: (id: number) => void; options: OptionItem[] }) {
  const [open, setOpen] = useState(false);
  const selected = Array.isArray(options) ? options.find((o) => o.id === value) : undefined;

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="border rounded-md px-3 py-2 cursor-pointer" onClick={() => setOpen(!open)}>
        {selected?.name || `Select ${label}`}
      </div>
      {open && (
        <div className="absolute left-0 right-0 bg-white border rounded-md shadow z-50 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div key={opt.id} className="px-4 py-2 hover:bg-[#CCC8E8] cursor-pointer" onClick={() => { onChange(opt.id); setOpen(false); }}>
              {opt.name}
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
              className="px-4 py-2 hover:bg-[#CCC8E8] cursor-pointer"
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
      <label className="block text-sm font-medium mb-1">Skills & Expertise</label>

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

export default function EditTeam({ isOpen, onClose, memberId, onSubmit }: EditTeamProps) {
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

  const updateField = (key: keyof UserForm, value: string | number | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ===== LOAD USER ID ===== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
    const decoded: any = JSON.parse(atob(token.split(".")[1]));
    setUserId(decoded.id);
  }, []);

  const token = localStorage.getItem("token");

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (!userId) return;

    (async () => {
      const [u, d, s, sk, r, a] = await Promise.all([
        fetch(`http://localhost:5000/api/profile/${memberId}`, {
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
    const res = await fetch(
      `http://localhost:5000/api/profile/${memberId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) throw new Error(await res.text());

    alert("Team member updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update team member!");
  }
};


  if (loading) return <div className="p-10"></div>;

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white max-h-[90vh] w-[600px] rounded-2xl shadow-xl p-6 animate-scale-in overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-5 border-b pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5A4FB5] rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Edit Team Member</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-5">
          {/* Name, Email, Phone */}
          <div className="col-span-2">
            <Input label="Full Name" value={form.fullname} onChange={(v) => updateField("fullname", v)} />
          </div>
          <div>
            <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} />
          </div>
          <div>
            <Input label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} prefix="+62" />
          </div>

          {/* Role */}
          <div>
            <StringSelect label="Role" value={form.role} options={roles} onChange={(v) => setForm({ ...form, role: v })}  />
          </div>

          {/* Department */}
          <div>
           <CustomSelect label="Departemen" value={form.departmentId} onChange={(id) => updateField("departmentId", id)} options={departments} />
          </div>

          {/* Status */}
          <div>
            <CustomSelect label="Status" value={form.statusId} onChange={(id) => updateField("statusId", id)} options={statuses} />
          </div>
           <div>
                <label className="text-sm font-medium">Joined Date</label>
                <input type="date" value={form.joined_at} disabled className="w-full border rounded-md p-2 mt-1 bg-gray-100 cursor-not-allowed"/>
            </div>

          {/* Bio */}
          <div className="col-span-2">
            <label className="text-sm font-medium mb-1 block">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className="appearance-none text-[#595959] border rounded-lg px-3 py-2 h-24 w-full"
              placeholder="Input Bio"
            />
          </div>

          {/* Skills */}
          <div className="col-span-2">
            <MultiSkillSelect allSkills={allSkills} selected={skills} onChange={setSkills} />
          </div>

          {/* Reports To */}
              <div className="col-span-2">
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
             </div>

        {/* Save Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSave}
            className="bg-[#5A4FB5] hover:bg-[#4B43A3] text-white px-8 py-2 rounded-xl shadow"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}