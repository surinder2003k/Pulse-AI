"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface DropzoneProps {
  onUpload: (url: string) => void;
  currentImage?: string;
}

export default function Dropzone({ onUpload, currentImage }: DropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file.");
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setPreview(data.url);
        onUpload(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Upload failed.");
      }
    } catch {
      toast.error("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed transition-all duration-300 rounded-[2rem] aspect-video flex flex-col items-center justify-center overflow-hidden
          ${preview ? 'border-primary/20 bg-black/40' : 'border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        
        {preview ? (
          <>
            <img src={preview} alt="Upload Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
              <Upload className="h-8 w-8 text-white animate-bounce" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <ImageIcon className="h-8 w-8 text-primary" />}
            </div>
            <div>
              <p className="text-white font-black text-lg">Drop your image here</p>
              <p className="text-muted-foreground text-sm font-medium italic mt-1">or click to browse from device</p>
            </div>
          </div>
        )}
      </div>

      {preview && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setPreview("");
            onUpload("");
          }}
          className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-400 transition-colors"
        >
          <X className="h-3 w-3" /> Remove image
        </button>
      )}
    </div>
  );
}
