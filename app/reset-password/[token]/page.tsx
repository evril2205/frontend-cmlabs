"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation"; // ✅ FIX
import { useState } from "react";

export default function ResetPasswordPage() {
  // ✅ FIX: ambil token dari URL path, bukan query
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [confirmError, setConfirmError] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      alert("Semua field wajib diisi");
      return;
    }

    if (password !== confirm) {
      setConfirmError(true);
      return;
    }

    setLoading(true);

    // ✅ FIX: backtick + token dari params
    const res = await fetch(
      `http://localhost:5000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }), // ✅ FIX: token tidak dikirim di body
      }
    );

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Password berhasil direset");
      router.push("/login");
    } else {
      alert(data.message);
    }
  };

  // ✅ FIX: guard kalau token null
  if (!token) {
    return <p className="p-10 text-center">Token tidak valid</p>;
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center">
      <div className="w-full max-w-[740px] h-screen flex items-center justify-center">

        {/* WRAPPER FORM */}
        <div className="w-full max-w-[420px] ml-[60px]">

          {/* LOGO */}
          <div className="flex items-center gap-2 mb-6">
            <Image src="/assets/logo.svg" alt="logo" width={40} height={40} />
            <span className="text-xl font-semibold text-[#5A4FB5]">
              CRM cmlabs
            </span>
          </div>

          <h2 className="text-xl font-bold mb-2">Reset Your Password</h2>
          <p className="text-sm mb-6 text-gray-700 max-w-[420px]">
            Make sure to choose a strong password that you haven’t used before.
          </p>

          <div className="w-full max-w-xl mx-auto px-4">

            {/* NEW PASSWORD */}
            <div className="mb-4">
              <label className="text-sm font-medium">New Password</label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full px-4 h-[45px] rounded-lg text-sm pr-12 border border-gray-300"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Image
                  src={
                    showPassword
                      ? "/assets/icons/eye-solid.svg"
                      : "/assets/icons/eye-slash-solid.svg"
                  }
                  alt="toggle password"
                  width={20}
                  height={20}
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer opacity-80 absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-4">
              <label className="text-sm font-medium">Confirm Password</label>

              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={`w-full px-4 h-[45px] rounded-lg text-sm pr-14 border
                    ${confirmError ? "border-red-500 bg-red-50" : "border-gray-300"}
                  `}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirm(value);
                    setConfirmError(value !== password);
                  }}
                />

                <Image
                  src={
                    showConfirm
                      ? "/assets/icons/eye-solid.svg"
                      : "/assets/icons/eye-slash-solid.svg"
                  }
                  alt="toggle password"
                  width={20}
                  height={20}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="cursor-pointer opacity-80 absolute right-8 top-1/2 -translate-y-1/2"
                />

                {confirmError && (
                  <Image
                    src="/assets/icons/error.svg"
                    alt="warning"
                    width={18}
                    height={18}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-90"
                  />
                )}
              </div>

              {confirmError && (
                <p className="text-red-600 text-sm mt-1">
                  The confirmation does not match the new password
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={handleReset}
              disabled={loading}
              className="mt-6 w-full bg-[#5A4FB5] hover:bg-[#403881] active:bg-[#322B64] 
              text-white py-2 rounded-lg"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
