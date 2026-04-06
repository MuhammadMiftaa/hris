import type {
  Profile,
  UpdateProfilePayload,
  UploadPhotoPayload,
  UploadPhotoResponse,
} from "@/types/profile";
import type { ApiResponse, ApiError } from "./api";
import { BFF_BASE_URL } from "./const";

/** Fetch wrapper targeting the BFF */
async function bffCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BFF_BASE_URL}${endpoint}`, {
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
  return bffCall<Profile>("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** PUT /profile — Update user profile */
export async function updateProfile(
  token: string,
  payload: UpdateProfilePayload,
) {
  return bffCall<Profile>("/profile", {
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
  return bffCall<UploadPhotoResponse>("/profile/photo", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /profile/photo — Delete profile photo */
export async function deleteProfilePhoto(token: string) {
  return bffCall<{ message: string }>("/profile/photo", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
