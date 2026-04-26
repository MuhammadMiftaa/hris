import { apiCall } from "@/lib/api";
import type { UploadDocumentPayload, UploadDocumentResponse } from "@/types/document";

export async function uploadDocument(payload: UploadDocumentPayload) {
  return apiCall<UploadDocumentResponse>("/documents/upload", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDocumentDownloadURL(key: string, documentType: "leave" | "business_trip") {
  return apiCall<{ url: string }>(`/documents/download?key=${encodeURIComponent(key)}&document_type=${documentType}`);
}
