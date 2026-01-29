"use client";

import Image from "next/image";
import Link from "next/link";
const { jwtDecode } = await import("jwt-decode");
import { useState, useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!errorMsg && !successMsg) return;
    const t = setTimeout(() => {
      setErrorMsg(null);
      setSuccessMsg(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [errorMsg, successMsg]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    setEmailError("");
    setPasswordError("");
    setErrorMsg(null);
    setSuccessMsg(null);

    let valid = true;

    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Please enter your password.");
      valid = false;
    }

    if (!valid) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(
          "Login failed: Email or password doesn’t match. Please double-check and try again."
        );
        setLoading(false);
        return;
      }

      // SIMPAN TOKEN
      localStorage.setItem("token", data.token);

      if (data.role) {
        localStorage.setItem("role", String(data.role));
      }

      // 🔥 dynamic import → FIX ERROR jwt-decode
      const { jwtDecode } = await import("jwt-decode");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = jwtDecode(data.token);

      setSuccessMsg("Login success");

      setTimeout(() => {
  if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
    window.location.href = "/dashboard";
  } else if (decoded.role === "SALES") {
    window.location.href = "/profile";
  } else if (decoded.role === "PROJECT_MANAGER") {
    window.location.href = "/profile";
  } else {
    window.location.href = "/login";
  }
}, 1200);


    } catch (err) {
      setErrorMsg("Login failed: Unable to connect to the server.");
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white relative">

      {(errorMsg || successMsg) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[90%] md:w-auto">
          <div
            className={`px-6 py-3 rounded-lg shadow-md border flex items-start gap-3
            ${errorMsg ? "bg-[#FFE0DE] border-[#D40C00]" : "bg-[#E1F7EA] border-[#257047]"}`}
          >
            <Image
              src={errorMsg ? "/assets/icons/error.svg" : "/assets/icons/success.svg"}
              alt="alert icon"
              width={22}
              height={22}
              className="mt-0.5"
            />

            <div className="flex-1 text-left leading-tight">
              {errorMsg ? (
                <>
                  <p className="text-black font-bold">Login failed :</p>
                  <span className="text-[#595959] text-sm">
                    Email or password doesn’t match. Please double-check and try again.
                  </span>
                </>
              ) : (
                <>
                  <p className="text-black font-bold">Login Success:</p>
                  <p className="text-sm text-[#595959]">{successMsg}</p>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-gray-500 hover:text-gray-800 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="hidden md:flex md:w-1/2 bg-[#5A4FB5] relative justify-center items-center py-10 overflow-visible">
        <Image
          src="/assets/Group36.svg"
          alt="bg"
          width={650}
          height={648}
          className="absolute left-25 -translate-y-2"
        />
        <Image
          src="/assets/Group37.svg"
          alt="person"
          width={318}
          height={437}
          className="relative z-50 translate-y-28 translate-x-60"
        />
      </div>

      <div className="md:w-1/2 w-full flex flex-col justify-center px-6 md:px-50 py-10">

        <div className="mb-5 flex items-center gap-2">
          <Image src="/assets/logo.svg" alt="logo" width={50} height={40} />
          <span className="text-xl font-semibold text-[#5A4FB5] tracking-wide">
            CRM CMLABS
          </span>
        </div>

        <h2 className="text-sm mb-1">Access Your Workspace</h2>
        <p className="text-[24px] font-bold mb-4">Continue to your Account</p>

       <button
  onClick={() => {
     window.location.href = "http://localhost:5000/api/auth/google";
  }}
  className="w-full border py-3 rounded-3xl flex items-center justify-center gap-2"
>
  <img src="/assets/google.svg" width={20} />
  <span>Log in with Google</span>
</button>


        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
          <span className="px-3 text-sm text-[#595858]">Or use Email</span>
          <div className="flex-1 h-px bg-[#E0E0E0]"></div>
        </div>

        <form onSubmit={handleLogin}>

          <div className="mb-4">
            <label className="text-sm font-bold">Email</label>

            <div className="relative">
              <input
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border mt-1 px-4 h-[48px] rounded-lg text-sm focus:outline-none
                  ${emailError ? "border-red-500 pr-10" : "border-gray-300"}
                `}
              />

              {emailError && (
                <img
                  src="/assets/icons/error.svg"
                  className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2"
                />
              )}
            </div>

            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          <div className="mb-2">
            <label className="text-sm font-bold">Password</label>

            <div
              className={`mt-1 w-full h-[48px] rounded-lg border flex items-center px-4
                ${passwordError ? "border-red-500" : "border-gray-300"}
              `}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 text-sm focus:outline-none"
              />

              <Image
                src={showPassword ? "/assets/icons/eye-solid.svg" : "/assets/icons/eye-slash-solid.svg"}
                alt="toggle password"
                width={20}
                height={20}
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer opacity-80 mr-3"
              />

              {passwordError && (
                <img
                  src="/assets/icons/error.svg"
                  className="w-5 h-5 "
                />
              )}
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <Link
            href="/login/forget-password"
            className="text-right text-sm text-[#616161] mb-6 underline cursor-pointer block hover:text-[#5B33E5]"
          >
            Forgot password?
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5A4FB5] text-white py-3 rounded-lg text-base hover:bg-[#403881] disabled:opacity-60"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
