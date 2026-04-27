import { useState, useCallback } from "react";
import { useDemo } from "@/contexts/DemoContext";
import { uploadDocument, getDocumentDownloadURL } from "@/lib/document-api";
import toast from "react-hot-toast";

export function useDocumentUpload() {
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const uploadFile = useCallback(
    async (file: File, documentType: "leave" | "business_trip") => {
      if (isDemo) {
        toast("Demo mode — upload file pura-pura berhasil", { icon: "🔒" });
        return `demo-key-${Date.now()}`;
      }

      setLoading(true);
      try {
        const base64Str = await fileToBase64(file);
        const res = await uploadDocument({
          base64_document: base64Str,
          filename: file.name,
          document_type: documentType,
        });

        toast.success("Dokumen berhasil diunggah");
        return res.data.document_url;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengunggah dokumen";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isDemo],
  );

  return { uploadFile, loading };
}

export function useDocumentDownload() {
  const { isDemo } = useDemo();

  const downloadFile = useCallback(
    async (key: string, documentType: "leave" | "business_trip", filename?: string) => {
      if (isDemo || key.startsWith("demo-key-")) {
        toast("Demo mode — unduh dokumen dinonaktifkan", { icon: "🔒" });
        return;
      }

      // Jika key sudah berupa presigned URL (backend sudah resolve), langsung open
      if (key.startsWith("http://") || key.startsWith("https://")) {
        const link = document.createElement("a");
        link.href = key;
        if (filename) link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Jika masih object key, call API untuk generate presigned URL
      const toastId = toast.loading("Mengunduh dokumen...");
      try {
        const res = await getDocumentDownloadURL(key, documentType);
        toast.dismiss(toastId);

        if (res.data && res.data.url) {
          const link = document.createElement("a");
          link.href = res.data.url;
          if (filename) link.download = filename;
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err: unknown) {
        toast.dismiss(toastId);
        const message =
          err instanceof Error ? err.message : "Gagal mengunduh dokumen";
        toast.error(message);
      }
    },
    [isDemo],
  );

  return { downloadFile };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
