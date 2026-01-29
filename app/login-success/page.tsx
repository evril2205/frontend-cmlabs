"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    console.log("🔵 LoginSuccess component mounted");
    
    const token = params.get("token");
    console.log("🔑 Token from URL:", token);

    if (!token) {
      console.log("❌ No token, redirecting to login");
      router.push("/login");
      return;
    }

    // Simpan JWT
    localStorage.setItem("token", token);
    console.log("✅ Token saved to localStorage");

    // Redirect ke dashboard
    console.log("🚀 Attempting redirect to /dashboard");
    router.push("/dashboard");
    
    // ⬇️ TAMBAHAN: Hard redirect kalau router.push tidak work
    setTimeout(() => {
      console.log("⏰ Timeout redirect");
      window.location.href = "/dashboard";
    }, 1000);
    
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A4FB5] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}