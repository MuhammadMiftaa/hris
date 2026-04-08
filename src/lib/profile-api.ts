import type {
  Profile,
  UpdateProfilePayload,
  UploadPhotoPayload,
  UploadPhotoResponse,
} from "@/types/profile";
import type { ApiResponse, ApiError } from "./api";
import { API_URL } from "./const";

/** Fetch wrapper targeting the API */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    const error: ApiError = {
      statusCode: data.statusCode || response.status,
      message: data.message || "Something went wrong",
    };
    throw error;
  }

  return data as ApiResponse<T>;
}

// ════════════════════════════════════════════
// PROFILE API
// ════════════════════════════════════════════

/** GET /profile — Get user profile */
export async function fetchProfile(token: string) {
  return apiCall<Profile>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** PUT /profile — Update user profile */
export async function updateProfile(
  token: string,
  payload: UpdateProfilePayload,
) {
  return apiCall<Profile>("/profile", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** POST /profile/photo — Upload profile photo */
export async function uploadProfilePhoto(
  token: string,
  payload: UploadPhotoPayload,
) {
  return apiCall<UploadPhotoResponse>("/profile/photo", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /profile/photo — Delete profile photo */
export async function deleteProfilePhoto(token: string) {
  return apiCall<{ message: string }>("/profile/photo", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
