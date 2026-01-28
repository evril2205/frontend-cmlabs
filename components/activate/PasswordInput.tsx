"use client";

import { useState } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export default function PasswordInput({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label className="text-sm font-semibold">{label}</label>
      <div className="mt-1 flex items-center border rounded px-4 h-[44px]">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-sm outline-none"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-xs text-gray-500"
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
