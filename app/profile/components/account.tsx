"use client";

import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface AccountFormProps {
  userId: string; // bisa dari parent atau state token decode
}

export default function AccountForm({ userId }: AccountFormProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token"); // ambil token dari localStorage

  const handleSave = async () => {
    setLoading(true);
    setMsg("");

    // ===== Validasi =====
    if (!current || !newPass || !confirm) {
      setMsg("Semua field harus diisi");
      setLoading(false);
      return;
    }

    if (newPass.length < 6) {
      setMsg("Password baru minimal 6 karakter");
      setLoading(false);
      return;
    }

    if (newPass !== confirm) {
      setMsg("Password baru dan konfirmasi tidak cocok");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/profile/updatePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, current, newPass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Gagal mengupdate password");
      } else {
        setMsg("Password berhasil diupdate!");
        setCurrent("");
        setNewPass("");
        setConfirm("");
      }
    } catch (err) {
      console.error(err);
      setMsg("Terjadi kesalahan saat mengupdate password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Lock size={28} className="text-gray-600" /> Account
      </h2>
      <p className="text-[#ACADAD] mt-3 mb-8">Manage your account</p>

      <h3 className="text-xl font-semibold mb-3">Password</h3>

      <div className="space-y-6">
        <PasswordInput
          label="Current Password"
          isShown={showCurrent}
          toggle={() => setShowCurrent(!showCurrent)}
          value={current}
          setValue={setCurrent}
        />

        <PasswordInput
          label="New Password"
          isShown={showNew}
          toggle={() => setShowNew(!showNew)}
          value={newPass}
          setValue={setNewPass}
        />

        <PasswordInput
          label="Confirm Password"
          isShown={showConfirm}
          toggle={() => setShowConfirm(!showConfirm)}
          value={confirm}
          setValue={setConfirm}
        />
      </div>

      {msg && (
        <p className={`mt-4 ${msg.includes("success") ? "text-green-600" : "text-red-600"}`}>
          {msg}
        </p>
      )}

      <div className="flex justify-end mt-10">
        <button
          onClick={handleSave}
          disabled={loading}
          className="
            bg-[#5A4FB5]
            hover:bg-[#403881]
            active:bg-[#322B64]
            text-white px-6 py-3 rounded-lg font-semibold
          "
        >
          {loading ? "Saving..." : "Save Change"}
        </button>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  isShown,
  toggle,
  value,
  setValue,
}: {
  label: string;
  isShown: boolean;
  toggle: () => void;
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center mt-1 border rounded-lg px-4 py-3 bg-white">
        <input
          type={isShown ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={toggle}
          className="w-6 h-6 flex items-center justify-center"
        >
          {isShown ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
    </div>
  );
}
