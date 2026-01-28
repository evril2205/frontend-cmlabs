"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

/* ================= MAIN FORM ================= */
export default function NotificationForm() {
  // ⬇️ PASTI BOOLEAN DARI AWAL
  const [emailDeal, setEmailDeal] = useState<boolean>(false);
  const [emailActivity, setEmailActivity] = useState<boolean>(false);
  const [emailMarketing, setEmailMarketing] = useState<boolean>(false);

  const [pushDeal, setPushDeal] = useState<boolean>(false);
  const [pushReminder, setPushReminder] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  /* ============== LOAD DATA ============== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/profile/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEmailDeal(Boolean(data.notifDealUpdate));
        setEmailActivity(Boolean(data.notifReminder));
        setEmailMarketing(Boolean(data.notifMarketing));

        // sementara pakai mapping yang sama
        setPushDeal(Boolean(data.notifDealUpdate));
        setPushReminder(Boolean(data.notifReminder));
      })
      .finally(() => setLoading(false));
  }, []);

  /* ============== SAVE ============== */
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch("http://localhost:5000/api/profile/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        notifDealUpdate: emailDeal,
        notifReminder: emailActivity,
        notifMarketing: emailMarketing,
      }),
    });

    alert("Notification settings updated");
  };

  // ⛔ JANGAN render checkbox sebelum data siap
  if (loading) return null;

  return (
    <div className="bg-white border border-gray-200 p-6 space-y-10">
      {/* Section 1 */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell size={20} /> Notifications Settings
        </h2>
        <p className="text-[#ACADAD] text-sm mt-1">
          Manage how you receive notifications
        </p>

        <div className="mt-6 space-y-6">
          <NotificationItem
            title="Deal Update"
            subtitle="Receive email when deals are updated"
            value={emailDeal}
            onChange={setEmailDeal}
          />

          <NotificationItem
            title="Activity Reminder"
            subtitle="Receive reminders for upcoming activities"
            value={emailActivity}
            onChange={setEmailActivity}
          />

          <NotificationItem
            title="Marketing"
            subtitle="Receive marketing emails and newsletter"
            value={emailMarketing}
            onChange={setEmailMarketing}
          />
        </div>
      </div>

      <div className="border-t" />

      {/* Section 2 */}
      <div>
        <h2 className="text-xl font-semibold">Push Notifications</h2>

        <div className="mt-6 space-y-6">
          <NotificationItem
            title="Deal Update"
            subtitle="Receive push notifications when deals are updated"
            value={pushDeal}
            onChange={setPushDeal}
          />

          <NotificationItem
            title="Receive Reminder"
            subtitle="Receive reminders for upcoming activities"
            value={pushReminder}
            onChange={setPushReminder}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="
            bg-[#5A4FB5]
            hover:bg-[#403881]
            active:bg-[#322B64]
            focus:ring-2 focus:ring-[#5A4FB5]/40
            text-white px-6 py-3 rounded-lg font-semibold
          "
        >
          Save Change
        </button>
      </div>
    </div>
  );
}

/* ================= ITEM ================= */
function NotificationItem({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-[#ACADAD] text-sm">{subtitle}</p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />

        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#5A4FB5]" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
      </label>
    </div>
  );
}
