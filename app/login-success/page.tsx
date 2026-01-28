"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    // simpan JWT
    localStorage.setItem("token", token);

    // redirect ke dashboard
    router.push("/profile");
  }, [params, router]);
}
