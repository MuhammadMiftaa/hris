export interface UploadDocumentPayload {
  base64_document: string;
  filename: string;
  document_type: "leave" | "business_trip";
}

export interface UploadDocumentResponse {
  success: boolean;
  document_url: string;
  message: string;
}
