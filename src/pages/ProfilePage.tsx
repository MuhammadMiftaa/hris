import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  Trash2,
  ArrowLeft,
  Save,
  Loader2,
  Mail,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: profile,
    loading,
    update,
    uploadPhoto,
    removePhoto,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [fullname, setFullname] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize fullname when profile loads
  useState(() => {
    if (profile?.fullname) {
      setFullname(profile.fullname);
    }
  });

  const handleSave = async () => {
    if (!fullname.trim()) {
      toast.error("Fullname cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await update(fullname);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      try {
        // Convert to base64
        const reader = new FileReader();
        reader.onload = async () => {
          const base64 = reader.result as string;
          try {
            await uploadPhoto(base64);
            toast.success("Profile photo uploaded successfully");
          } catch {
            toast.error("Failed to upload profile photo");
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          toast.error("Failed to read image file");
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch {
        toast.error("Failed to process image");
        setIsUploading(false);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadPhoto],
  );

  const handleRemovePhoto = async () => {
    if (!profile?.photo_url) return;

    setIsUploading(true);
    try {
      await removePhoto();
      toast.success("Profile photo removed");
    } catch {
      toast.error("Failed to remove profile photo");
    } finally {
      setIsUploading(false);
    }
  };

  const initials = profile?.fullname
    ? profile.fullname
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "AU";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border) bg-(--card) text-(--muted-foreground) transition hover:text-(--foreground)"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-(--foreground) md:text-2xl">
              Profile
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Manage your personal information
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Photo Card */}
            <div className="rounded-xl border border-(--border) bg-(--card) p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-(--muted-foreground)">
                Profile Photo
              </h2>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                {/* Photo */}
                <div className="relative">
                  <div
                    className={cn(
                      "flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-2xl font-bold",
                      profile?.photo_url ? "bg-(--muted)" : "text-black",
                    )}
                    style={
                      !profile?.photo_url
                        ? {
                            background:
                              "linear-gradient(135deg, #ffd700 0%, #daa520 60%, #c5961e 100%)",
                            boxShadow: "0 0 16px 3px rgba(218,165,32,0.5)",
                          }
                        : undefined
                    }
                  >
                    {profile?.photo_url ? (
                      <img
                        src={profile.photo_url}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
                  <p className="text-sm text-(--muted-foreground)">
                    Upload a photo to personalize your profile. Max size: 5MB.
                    Supported formats: JPG, PNG, WebP.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-gold-400 disabled:opacity-50"
                    >
                      <Camera size={16} />
                      {profile?.photo_url ? "Change Photo" : "Upload Photo"}
                    </button>
                    {profile?.photo_url && (
                      <button
                        onClick={handleRemovePhoto}
                        disabled={isUploading}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Info Card */}
            <div className="rounded-xl border border-(--border) bg-(--card) p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-(--muted-foreground)">
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setFullname(profile?.fullname || "");
                      setIsEditing(true);
                    }}
                    className="text-sm font-medium text-gold-400 transition hover:text-gold-300"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Fullname */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-medium text-(--muted-foreground)">
                    <User size={12} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-(--border) bg-(--background) px-4 py-2.5 text-sm text-(--foreground) placeholder:text-(--muted-foreground) focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  ) : (
                    <p className="text-sm text-(--foreground)">
                      {profile?.fullname || (
                        <span className="italic text-(--muted-foreground)">
                          Not set
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-medium text-(--muted-foreground)">
                    <Mail size={12} />
                    Email Address
                  </label>
                  <p className="text-sm text-(--foreground)">{user?.email}</p>
                </div>

                {/* Member Since (read-only) */}
                <div>
                  <label className="mb-1 flex items-center gap-2 text-xs font-medium text-(--muted-foreground)">
                    <Calendar size={12} />
                    Member Since
                  </label>
                  <p className="text-sm text-(--foreground)">
                    {formatDate(profile?.created_at || "")}
                  </p>
                </div>

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-gold-400 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="rounded-lg border border-(--border) px-4 py-2 text-sm font-medium text-(--muted-foreground) transition hover:text-(--foreground) disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
