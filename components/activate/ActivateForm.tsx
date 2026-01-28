"use client";

import { useState } from "react";
import DisabledInput from "./DisabledInput";
import PasswordInput from "./PasswordInput";


function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="text-sm font-bold">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border px-4 h-[48px] rounded-lg text-sm"
      />
    </div>
  );
}


interface Props {
  user: {
    fullname: string;
    email: string;
    phone: string;
    location: string;
    role: string;
    department: string;
  };
  token: string;
}

export default function ActivateForm({ user, token }: Props) {
  const [fullname, setName] = useState(user.fullname || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [location, setLocation] = useState(user.location || "");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Password confirmation does not match");
      return;
    }

    setLoading(true);
    setError(""); 

    try {
     const res = await fetch(
  `http://localhost:5000/api/profile/activate/${token}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      password,
      fullname,
      email,
      phone,
      location,
    }),
  }
);


      if (!res.ok) throw new Error();

      setSuccess("Account activated successfully");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch {
      setError("Failed to activate account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[780px] p-8 rounded-xl shadow"
      >
        <h2 className="text-xl font-bold mb-6">
          Welcome to CRM cmlabs
        </h2>

        {/* Editable */}
        <Input label="Full Name" value={fullname} onChange={setName} />
        <Input label="Email" value={email} onChange={setEmail} />
       <div className="mb-4">
        <label className="text-sm font-bold">Phone</label>

        <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            +62 |
            </span>

            <input
            type="tel"
            value={phone}
            onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setPhone(val);
            }}
            className="pl-14 w-full border px-4 h-[48px] rounded-lg text-sm"
            placeholder="8123456789"
            />
        </div>
        </div>


        <Input label="Location" value={location} onChange={setLocation} />

        {/* Disabled */}
        <DisabledInput label="Role" value={user.role} />
        <DisabledInput label="Department" value={user.department} />

        {/* Password */}
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirm}
          onChange={setConfirm}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}

       <div className="flex justify-center mt-6">
        <button
            type="submit"
            disabled={loading}
            className="bg-[#5A4FB5] text-white py-3 px-8 rounded-lg"
        >
            {loading ? "Processing..." : "Create Account"}
        </button>
        </div>

      </form>
    </div>
  );
}
