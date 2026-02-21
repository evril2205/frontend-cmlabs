"use client";

import { useEffect, useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Quill from "quill";
import {CalendarIcon} from "@heroicons/react/24/outline";

import "quill/dist/quill.snow.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export default function AddNoteModal({ isOpen, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);
 useEffect(() => {
  if (initialData) {
    setTitle(initialData.title || "");
    setDate(
      initialData.createdAt
        ? initialData.createdAt.split("T")[0]
        : ""
    );

    // Isi Quill setelah dia ready
    setTimeout(() => {
      if (quillRef.current) {
        quillRef.current.root.innerHTML =
          initialData.content || "";
      }
    }, 100);
  }
}, [initialData]);


  useEffect(() => {
  if (!editorRef.current || quillRef.current) return;

  const quill = new Quill(editorRef.current, {
    theme: "snow",
    placeholder: "Write your note here...",
    modules: {
      toolbar: {
        container: [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
      },
    },
  });

  quillRef.current = quill;

  // 🔥 Delay sedikit biar module pasti ready
  setTimeout(() => {
    const toolbar = quill.getModule("toolbar") as any;
if (!toolbar) return;

toolbar.addHandler("image", () => {

      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        const range = quill.getSelection();
        const position = range ? range.index : quill.getLength();

        quill.insertEmbed(
          position,
          "image",
          `http://localhost:5000${data.url}`
        );
      };
    });
  }, 0);

}, []);




  const handleSave = () => {
    if (!quillRef.current) return;

    let html = quillRef.current.root.innerHTML;

    // 🔥 CLEAN EMPTY <p>
    html = html.replace(/<p><br><\/p>/g, "");
    html = html.trim();

    onSave({
      title,
      content: html,
      createdAt: date || new Date().toISOString(),
    });

    quillRef.current.setContents([]);
    setTitle("");
    setDate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[650px] rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">Add New Note</h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
{/* DATE */}
<div>
  <label className="block text-sm font-semibold mb-2">
    Select Date
  </label>

  <div
    onClick={() => dateRef.current?.showPicker()}
    className="relative w-full border rounded-lg px-4 py-2 text-sm flex items-center gap-2 cursor-pointer hover:border-[#5A4FB0] focus-within:ring-2 focus-within:ring-[#5A4FB0]"
  >
    <CalendarIcon className="w-4 h-4 text-gray-400" />

    <span className={date ? "text-gray-800" : "text-gray-400"}>
      {date
        ? new Date(date).toLocaleDateString("en-GB")
        : "Select Date"}
    </span>

    <input
      ref={dateRef}
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="absolute opacity-0 pointer-events-none"
    />
  </div>
</div>


          {/* TITLE */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Note Title
            </label>
            <input
              type="text"
              placeholder="Enter Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>

            <div className="border rounded-lg">
              <div
                ref={editorRef}
                className="min-h-[200px]"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-center pt-4">
            <button
  onClick={handleSave}
  className="bg-[#5A4FB0] text-white px-8 py-2 rounded-full text-sm font-semibold hover:opacity-90"
>
  {initialData ? "Update Note" : "Create Note"}
</button>

          </div>

        </div>
      </div>
    </div>
  );
}
