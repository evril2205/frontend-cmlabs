"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ActivateForm from "@/components/activate/ActivateForm";

export default function ActivatePage() {
  const params = useParams();
  const token = params.token as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid activation link");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/activate/${token}`
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
      } catch {
        setError("Activation link invalid or expired");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;

  return <ActivateForm user={user} token={token} />;
}
