"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css"; // Custom overrides

const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false, 
  loading: () => <div className="h-64 w-full bg-white animate-pulse rounded-[2rem] border border-slate-200 shadow-sm" />
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Use useMemo to prevent toolbar from recreating on every render, which causes quill cursor jumping issues
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false, // Prevents weird pasting height issues
    }
  }), []);

  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list", "bullet",
    "link", "image"
  ];

  return (
    <div className="rich-text-container w-full">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Start writing your SEO-optimized masterpiece..."}
        className="text-gray-900 min-h-[400px] h-auto overflow-hidden bg-white border border-slate-200 shadow-premium rounded-[2.5rem]"
      />
    </div>
  );
}
