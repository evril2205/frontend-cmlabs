"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* LOGO */}
      <div className="mb-5 flex items-center gap-2">
        <Image src="/assets/logo.svg" alt="logo" width={50} height={40} />
        <span className="text-xl font-semibold text-[#5A4FB5]">
          CRM CMLABS
        </span>
      </div>

      <h2 className="text-sm mb-1">Access Your Workspace</h2>
      <p className="text-2xl font-bold mb-4">Continue to your Account</p>

      {/* GOOGLE */}
      <button className="w-full border py-3 rounded-3xl flex items-center justify-center gap-2 mb-4">
        <Image src="/assets/google.svg" alt="google" width={20} height={20} />
        <span className="text-sm">Log in with Google</span>
      </button>

      {/* DIVIDER */}
      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-300" />
        <span className="px-3 text-sm text-gray-500">Or use Email</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="text-sm font-bold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border mt-1 px-4 h-12 rounded-lg"
            placeholder="Email"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-bold">Password</label>
          <div className="flex items-center border rounded-lg px-4 h-12">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 focus:outline-none"
              placeholder="Password"
            />
            <Image
              src={
                showPassword
                  ? "/assets/icons/eye-solid.svg"
                  : "/assets/icons/eye-slash-solid.svg"
              }
              alt="eye"
              width={20}
              height={20}
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer"
            />
          </div>
        </div>

        <Link
          href="/login/forget-password"
          className="block text-right text-sm underline mb-6"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#5A4FB5] text-white py-3 rounded-lg"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </>
  );
}
