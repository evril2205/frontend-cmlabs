"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ STATE NOTIFIKASI
  const [showNotif, setShowNotif] = useState(false);
  const [notifType, setNotifType] = useState<"success" | "error">("success");
  const [notifMessage, setNotifMessage] = useState("");

  const handleSend = async () => {
    if (!email) {
      setNotifType("error");
      setNotifMessage("Email wajib diisi.");
      setShowNotif(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setNotifType("success");
        setNotifMessage(
          "We’ve sent you an email with instructions to reset your password. Please check your inbox."
        );
      } else {
        setNotifType("error");
        setNotifMessage(data.message || "Gagal mengirim email.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setNotifType("error");
      setNotifMessage("Server tidak dapat diakses.");
    }

    setShowNotif(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA] px-4">

      {/* ✅ NOTIFIKASI */}
      {showNotif && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`flex items-start gap-3 px-5 py-4 rounded-lg shadow-md min-w-[420px] border
            ${
              notifType === "success"
                ? "bg-[#EAF7EF] border-[#7CC79A] text-[#2F7A4E]"
                : "bg-[#FDECEC] border-[#E57373] text-[#B71C1C]"
            }`}
          >
            {/* ✅ ICON SVG */}
            <Image
              src={
                notifType === "success"
                  ? "/assets/icons/success.svg"
                  : "/assets/icons/error.svg"
              }
              alt="alert icon"
              width={22}
              height={22}
              className="mt-0.5"
            />

            {/* ✅ TEXT */}
            <div className="flex-1 text-sm">
              <p className="font-semibold mb-1">
                {notifType === "success"
                  ? "Password Reset Link Sent"
                  : "Failed to Send Email"}
              </p>
              <p className="text-xs leading-relaxed">
                {notifMessage}
              </p>
            </div>

            {/* ✅ CLOSE */}
            <button
              onClick={() => setShowNotif(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ✅ FORM */}
      <div className="w-full max-w-[420px] flex flex-col items-start text-left">
        {/* LOGO */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <Image src="/assets/logo.svg" alt="logo" width={40} height={40} />
          <span className="text-xl font-semibold text-[#5A4FB5]">
            CRM cmlabs
          </span>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-sm font-regular mb-6">
          Enter your registered email address and we’ll send you a link to reset your password.
        </p>

        {/* INPUT */}
        <div className="w-full max-w-xl mx-auto px-4">
          <div className="mb-5 text-left">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border mt-1 px-4 h-[45px] rounded-lg text-sm font-medium focus:outline-none"
            />
          </div>

          {/* BUTTON */}
          <div className="flex gap-4 w-full">
            <Link
              href="/login"
              className="w-1/2 text-center border border-[#5A4FB5] text-[#5A4FB5] py-2 rounded-lg hover:bg-[#EEEAFE] transition"
            >
              Back
            </Link>

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-1/2 bg-[#5A4FB5] text-white py-2 rounded-lg hover:bg-[#403881] active:bg-[#322B64] transition"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
