import React, { useRef } from "react";
import { base44 } from "@/api/base44Client";
import { ImagePlus, X, Loader2 } from "lucide-react";

export default function MediaUpload({ mediaUrl, mediaType, onChange, uploading, setUploading }) {
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const type = file.type.startsWith("video") ? "video" : "image";
      onChange(file_url, type);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/webm"
        onChange={handleFile}
        className="hidden"
      />
      {mediaUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          {mediaType === "video" ? (
            <video src={mediaUrl} className="w-full h-48 object-cover" controls />
          ) : (
            <img src={mediaUrl} alt="Preview" className="w-full h-48 object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange("", "none")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/90 text-foreground hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-xl border-2 border-dashed border-input flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
        >
          {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImagePlus className="w-6 h-6" />}
          <span className="text-sm">{uploading ? "Uploading..." : "Upload image or video"}</span>
        </button>
      )}
    </div>
  );
}