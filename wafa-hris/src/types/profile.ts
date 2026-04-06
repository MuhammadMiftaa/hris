// ── Profile Types ──

export interface Profile {
  id: string;
  user_id: string;
  fullname: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  fullname: string;
}

export interface UploadPhotoPayload {
  base64_image: string;
}

export interface UploadPhotoResponse {
  success: boolean;
  photo_url: string;
  message: string;
}
