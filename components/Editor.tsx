"use client";
import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function Editor({ value, onChange, placeholder }: any) {
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'underline', 'strike'],
        ['image', 'link'],
      ],
    },
  }), []);

  return (
    <div className="quill-wrapper relative">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder || "Enter meeting description..."}
        modules={modules}
      />
      

      <style jsx global>{`
        .quill-wrapper .ql-container {
          display: flex;
          flex-direction: column;
          border: 1px solid #d1d5db !important;
          border-radius: 12px;
          min-height: 150px;
          background: white;
        }

        .quill-wrapper .ql-editor {
          flex: 1;
          min-height: 110px;
          font-size: 14px;
          color: #374151;
          padding: 12px 15px 40px 15px;
        }

        .quill-wrapper .ql-toolbar.ql-snow {
          position: absolute;
          bottom: 5px;
          left: 5px;
          border: none !important;
          background: transparent;
          display: flex;
          align-items: center;
          padding: 0 !important;
          z-index: 5;
        }

        .quill-wrapper .ql-formats {
          display: flex;
          align-items: center;
          margin-right: 0 !important;
        }

        .quill-wrapper .ql-formats:not(:last-child)::after {
          content: "";
          height: 14px;
          width: 1px;
          background-color: #e5e7eb;
          margin: 0 6px;
        }

        .quill-wrapper .ql-snow .ql-toolbar button {
          width: 22px !important;
          height: 22px !important;
          padding: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quill-wrapper .ql-stroke { stroke: #6b7280 !important; stroke-width: 2px; }
        .quill-wrapper .ql-fill { fill: #6b7280 !important; }

        .quill-wrapper .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
          left: 15px;
        }
      `}</style>
    </div>
  );
}