import React, { useRef, useState } from "react";
import { useDocumentUpload } from "@/hooks/useDocument";
import { Paperclip, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DocumentUploaderProps {
  value: string;
  onChange: (key: string) => void;
  documentType: "leave" | "business_trip";
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  error?: string;
}

export function DocumentUploader({
  value,
  onChange,
  documentType,
  label = "Dokumen Pendukung",
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 3,
  disabled = false,
  error,
}: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, loading } = useDocumentUpload();
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Ukuran file tidak boleh lebih dari ${maxSizeMB}MB`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFileName(file.name);
    const uploadedKey = await uploadFile(file, documentType);

    if (uploadedKey) {
      onChange(uploadedKey);
    } else {
      // Revert if failed
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const displayFileName = fileName || (value ? value.split("/").pop() || value : "");

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-(--foreground)">{label}</label>}

      <div className="flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled || loading}
        />

        {!value && !loading ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-2 rounded-lg border border-(--border) bg-(--card) px-4 py-2 text-sm font-medium text-(--foreground) hover:bg-(--muted) focus:outline-none focus:ring-2 focus:ring-(--ring) focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Paperclip className="h-4 w-4" />
            <span>Pilih File</span>
          </button>
        ) : null}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-(--muted-foreground)">
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
            <span>Mengunggah...</span>
          </div>
        ) : null}

        {value && !loading ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <Paperclip className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="truncate max-w-[200px]">{displayFileName}</span>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="ml-2 rounded-full p-1 text-emerald-600 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-(--muted-foreground)">Maksimal file {maxSizeMB}MB (PDF, DOC/X, JPG, PNG)</p>
      )}
    </div>
  );
}
